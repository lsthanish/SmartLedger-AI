from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import io
import csv
import google.generativeai as genai

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']
supabase: Client = create_client(supabase_url, supabase_key)

# Gemini AI configuration
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
gemini_model = genai.GenerativeModel('gemini-pro')

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="SmartLedger API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600
)

api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TransactionCreate(BaseModel):
    amount: float
    type: Literal["income", "expense"]
    category: str
    description: Optional[str] = ""
    date: str  # YYYY-MM-DD format

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    amount: float
    type: Literal["income", "expense"]
    category: str
    description: Optional[str] = ""
    date: str
    created_at: datetime

class BudgetCreate(BaseModel):
    category: str
    limit: float
    month: int  # 1-12
    year: int

class Budget(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    category: str
    limit_amount: float
    month: int
    year: int
    created_at: datetime

class AIInsightRequest(BaseModel):
    insight_type: Literal["spending", "budget", "savings", "general"]

class AIInsight(BaseModel):
    insight_text: str
    insight_type: str
    created_at: datetime

# ============ AUTH HELPERS ============

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current user from Supabase Auth token.
    Verifies the JWT token with Supabase and returns user data.
    """
    try:
        token = credentials.credentials
        
        # Verify token with Supabase Auth
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        
        supabase_user = user_response.user
        
        # Get or create user profile in our users table
        result = supabase.table('users').select('*').eq('id', supabase_user.id).execute()
        
        if not result.data:
            # Create user profile if it doesn't exist
            user_dict = {
                'id': supabase_user.id,
                'email': supabase_user.email,
                'full_name': supabase_user.user_metadata.get('full_name', supabase_user.email.split('@')[0]),
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            result = supabase.table('users').insert(user_dict).execute()
            
        user_data = result.data[0]
        return User(**user_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    """
    Register a new user using Supabase Auth.
    Creates user in Supabase Auth and profile in users table.
    """
    try:
        # Sign up user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        supabase_user = auth_response.user
        access_token = auth_response.session.access_token if auth_response.session else None
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to generate access token")
        
        # Create user profile in users table
        user_dict = {
            'id': supabase_user.id,
            'email': supabase_user.email,
            'full_name': user_data.full_name,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('users').insert(user_dict).execute()
        
        if not result.data:
            logger.warning(f"Failed to create user profile for {supabase_user.id}")
        
        user = User(**user_dict)
        return Token(access_token=access_token, token_type="bearer", user=user)
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Registration failed: {error_msg}")
        
        # Handle common Supabase Auth errors
        if "User already registered" in error_msg or "already exists" in error_msg:
            raise HTTPException(status_code=400, detail="Email already registered")
        elif "Password should be at least" in error_msg:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        elif "Invalid email" in error_msg:
            raise HTTPException(status_code=400, detail="Invalid email format")
        else:
            raise HTTPException(status_code=500, detail=f"Registration failed: {error_msg}")

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """
    Login user using Supabase Auth.
    Verifies credentials and returns JWT token from Supabase.
    """
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if not auth_response.user or not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        supabase_user = auth_response.user
        access_token = auth_response.session.access_token
        
        # Get user profile from users table
        result = supabase.table('users').select('*').eq('id', supabase_user.id).execute()
        
        if not result.data:
            # Create profile if it doesn't exist (for existing Supabase Auth users)
            user_dict = {
                'id': supabase_user.id,
                'email': supabase_user.email,
                'full_name': supabase_user.user_metadata.get('full_name', supabase_user.email.split('@')[0]),
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            result = supabase.table('users').insert(user_dict).execute()
        
        user_dict = result.data[0]
        user = User(**user_dict)
        
        return Token(access_token=access_token, token_type="bearer", user=user)
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Login failed: {error_msg}")
        
        # Handle common Supabase Auth errors
        if "Invalid login credentials" in error_msg or "Email not confirmed" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        else:
            raise HTTPException(status_code=500, detail=f"Login failed: {error_msg}")

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============ TRANSACTION ROUTES ============

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction_data: TransactionCreate, current_user: User = Depends(get_current_user)):
    try:
        transaction_dict = {
            'id': str(uuid.uuid4()),
            'user_id': current_user.id,
            **transaction_data.model_dump(),
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('transactions').insert(transaction_dict).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create transaction")
        
        return Transaction(**result.data[0])
    except Exception as e:
        logger.error(f"Create transaction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create transaction: {str(e)}")

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    category: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    try:
        query = supabase.table('transactions').select('*').eq('user_id', current_user.id)
        
        if category:
            query = query.eq('category', category)
        if type:
            query = query.eq('type', type)
        if search:
            query = query.ilike('description', f'%{search}%')
        
        result = query.order('date', desc=True).execute()
        return [Transaction(**t) for t in result.data]
    except Exception as e:
        logger.error(f"Get transactions failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {str(e)}")

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        result = supabase.table('transactions').update(
            transaction_data.model_dump()
        ).eq('id', transaction_id).eq('user_id', current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return Transaction(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update transaction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update transaction: {str(e)}")

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: User = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').delete().eq('id', transaction_id).eq('user_id', current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {"message": "Transaction deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete transaction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete transaction: {str(e)}")

# ============ BUDGET ROUTES ============

@api_router.post("/budgets", response_model=Budget)
async def create_budget(budget_data: BudgetCreate, current_user: User = Depends(get_current_user)):
    try:
        # Check if budget exists
        existing = supabase.table('budgets').select('id').eq('user_id', current_user.id).eq('category', budget_data.category).eq('month', budget_data.month).eq('year', budget_data.year).execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Budget already exists for this category and period")
        
        budget_dict = {
            'id': str(uuid.uuid4()),
            'user_id': current_user.id,
            'category': budget_data.category,
            'limit_amount': budget_data.limit,
            'month': budget_data.month,
            'year': budget_data.year,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('budgets').insert(budget_dict).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create budget")
        
        return Budget(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create budget failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create budget: {str(e)}")

@api_router.get("/budgets", response_model=List[Budget])
async def get_budgets(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    try:
        query = supabase.table('budgets').select('*').eq('user_id', current_user.id)
        
        if month:
            query = query.eq('month', month)
        if year:
            query = query.eq('year', year)
        
        result = query.execute()
        return [Budget(**b) for b in result.data]
    except Exception as e:
        logger.error(f"Get budgets failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch budgets: {str(e)}")

@api_router.put("/budgets/{budget_id}", response_model=Budget)
async def update_budget(
    budget_id: str,
    budget_data: BudgetCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        update_dict = {
            'category': budget_data.category,
            'limit_amount': budget_data.limit,
            'month': budget_data.month,
            'year': budget_data.year
        }
        
        result = supabase.table('budgets').update(update_dict).eq('id', budget_id).eq('user_id', current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Budget not found")
        
        return Budget(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update budget failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update budget: {str(e)}")

@api_router.delete("/budgets/{budget_id}")
async def delete_budget(budget_id: str, current_user: User = Depends(get_current_user)):
    try:
        result = supabase.table('budgets').delete().eq('id', budget_id).eq('user_id', current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Budget not found")
        
        return {"message": "Budget deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete budget failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete budget: {str(e)}")

# ============ DASHBOARD ROUTE ============

@api_router.get("/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    try:
        # Get current month's data
        now = datetime.now()
        start_of_month = datetime(now.year, now.month, 1).strftime("%Y-%m-%d")
        end_of_month = (datetime(now.year, now.month + 1, 1) if now.month < 12 else datetime(now.year + 1, 1, 1) - timedelta(days=1)).strftime("%Y-%m-%d")
        
        # Get monthly transactions
        monthly_result = supabase.table('transactions').select('*').eq('user_id', current_user.id).gte('date', start_of_month).lte('date', end_of_month).execute()
        
        monthly_income = sum(t["amount"] for t in monthly_result.data if t["type"] == "income")
        monthly_expenses = sum(t["amount"] for t in monthly_result.data if t["type"] == "expense")
        
        # Get all transactions for total balance
        all_result = supabase.table('transactions').select('*').eq('user_id', current_user.id).execute()
        
        total_income = sum(t["amount"] for t in all_result.data if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in all_result.data if t["type"] == "expense")
        total_balance = total_income - total_expenses
        
        # Get spending by category
        expenses_by_category = {}
        for t in monthly_result.data:
            if t["type"] == "expense":
                if t["category"] not in expenses_by_category:
                    expenses_by_category[t["category"]] = 0
                expenses_by_category[t["category"]] += t["amount"]
        
        # Get recent transactions
        recent_result = supabase.table('transactions').select('*').eq('user_id', current_user.id).order('date', desc=True).limit(5).execute()
        
        return {
            "total_balance": total_balance,
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "spending_by_category": expenses_by_category,
            "recent_transactions": recent_result.data
        }
    except Exception as e:
        logger.error(f"Get dashboard failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard data: {str(e)}")

# ============ AI INSIGHTS ROUTES ============

@api_router.post("/ai/insights", response_model=AIInsight)
async def generate_ai_insight(request: AIInsightRequest, current_user: User = Depends(get_current_user)):
    try:
        # Get user's transaction data
        transactions_result = supabase.table('transactions').select('*').eq('user_id', current_user.id).order('date', desc=True).limit(100).execute()
        
        budgets_result = supabase.table('budgets').select('*').eq('user_id', current_user.id).execute()
        
        # Prepare context for Gemini
        total_income = sum(t["amount"] for t in transactions_result.data if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in transactions_result.data if t["type"] == "expense")
        
        categories_spending = {}
        for t in transactions_result.data:
            if t["type"] == "expense":
                categories_spending[t["category"]] = categories_spending.get(t["category"], 0) + t["amount"]
        
        prompt = f"""You are a financial advisor AI. Analyze the following user financial data and provide a personalized insight.

Insight Type: {request.insight_type}
Total Income: ${total_income:.2f}
Total Expenses: ${total_expenses:.2f}
Net Savings: ${total_income - total_expenses:.2f}

Spending by Category:
{chr(10).join([f"- {cat}: ${amount:.2f}" for cat, amount in categories_spending.items()])}

Number of Budgets Set: {len(budgets_result.data)}

Provide a concise, actionable insight (2-3 sentences) based on the data above. Focus on {request.insight_type} specifically."""

        # Generate insight using Gemini
        response = gemini_model.generate_content(prompt)
        insight_text = response.text
        
        # Store insight in database
        insight_dict = {
            'id': str(uuid.uuid4()),
            'user_id': current_user.id,
            'insight_type': request.insight_type,
            'insight_text': insight_text,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'expires_at': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        }
        
        supabase.table('ai_insights').insert(insight_dict).execute()
        
        return AIInsight(
            insight_text=insight_text,
            insight_type=request.insight_type,
            created_at=datetime.now(timezone.utc)
        )
    except Exception as e:
        logger.error(f"Generate AI insight failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insight: {str(e)}")

@api_router.get("/ai/insights", response_model=List[AIInsight])
async def get_ai_insights(current_user: User = Depends(get_current_user)):
    try:
        # Get unexpired insights
        now = datetime.now(timezone.utc).isoformat()
        result = supabase.table('ai_insights').select('*').eq('user_id', current_user.id).gt('expires_at', now).order('created_at', desc=True).limit(10).execute()
        
        return [AIInsight(insight_text=i['insight_text'], insight_type=i['insight_type'], created_at=i['created_at']) for i in result.data]
    except Exception as e:
        logger.error(f"Get AI insights failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch insights: {str(e)}")

# ============ CSV ROUTES ============

@api_router.get("/transactions/export/csv")
async def export_transactions_csv(current_user: User = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').select('*').eq('user_id', current_user.id).order('date', desc=True).execute()
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Date', 'Type', 'Category', 'Amount', 'Description'])
        
        for t in result.data:
            writer.writerow([t['date'], t['type'], t['category'], t['amount'], t.get('description', '')])
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=transactions.csv"}
        )
    except Exception as e:
        logger.error(f"Export CSV failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export transactions: {str(e)}")

@api_router.post("/transactions/import/csv")
async def import_transactions_csv(csv_data: str, current_user: User = Depends(get_current_user)):
    try:
        reader = csv.DictReader(io.StringIO(csv_data))
        imported_count = 0
        
        for row in reader:
            transaction_dict = {
                'id': str(uuid.uuid4()),
                'user_id': current_user.id,
                'date': row['Date'],
                'type': row['Type'].lower(),
                'category': row['Category'],
                'amount': float(row['Amount']),
                'description': row.get('Description', ''),
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            supabase.table('transactions').insert(transaction_dict).execute()
            imported_count += 1
        
        return {"message": f"Imported {imported_count} transactions"}
    except Exception as e:
        logger.error(f"Import CSV failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"CSV import failed: {str(e)}")

# ============ CATEGORIES ROUTE ============

@api_router.get("/categories")
async def get_categories(current_user: User = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').select('category').eq('user_id', current_user.id).execute()
        
        categories = list(set([t['category'] for t in result.data]))
        
        # Default categories if none exist
        default_categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Salary', 'Other']
        
        return {"categories": categories if categories else default_categories}
    except Exception as e:
        logger.error(f"Get categories failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")

# ============ ENHANCED GEMINI AI FEATURES ============

@api_router.post("/ai/categorize-transaction")
async def ai_categorize_transaction(
    description: str,
    amount: float,
    current_user: User = Depends(get_current_user)
):
    """Use Gemini AI to automatically categorize a transaction based on description"""
    try:
        prompt = f"""Categorize this transaction into ONE of these categories:
Food, Rent, Transport, Entertainment, Utilities, Healthcare, Shopping, Salary, Investment, Education, Travel, Other

Transaction: "{description}"
Amount: ${amount}

Return ONLY the category name, nothing else."""

        response = gemini_model.generate_content(prompt)
        category = response.text.strip()
        
        # Validate category
        valid_categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Utilities', 
                          'Healthcare', 'Shopping', 'Salary', 'Investment', 'Education', 
                          'Travel', 'Other']
        
        if category not in valid_categories:
            category = 'Other'
        
        return {"category": category, "confidence": "high"}
    except Exception as e:
        logger.error(f"AI categorization failed: {str(e)}")
        return {"category": "Other", "confidence": "low", "error": str(e)}

@api_router.post("/ai/predict-spending")
async def ai_predict_spending(current_user: User = Depends(get_current_user)):
    """Use Gemini AI to predict next month's spending based on historical data"""
    try:
        # Get last 3 months of transactions
        three_months_ago = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        result = supabase.table('transactions').select('*').eq('user_id', current_user.id).gte('date', three_months_ago).execute()
        
        # Analyze spending patterns
        monthly_expenses = {}
        category_trends = {}
        
        for t in result.data:
            if t["type"] == "expense":
                month_key = t["date"][:7]  # YYYY-MM
                category = t["category"]
                amount = t["amount"]
                
                monthly_expenses[month_key] = monthly_expenses.get(month_key, 0) + amount
                
                if category not in category_trends:
                    category_trends[category] = []
                category_trends[category].append(amount)
        
        prompt = f"""As a financial analyst AI, predict next month's spending based on this data:

Historical Monthly Spending:
{chr(10).join([f"{month}: ${amount:.2f}" for month, amount in sorted(monthly_expenses.items())])}

Category-wise spending patterns:
{chr(10).join([f"{cat}: ${sum(amounts):.2f} across {len(amounts)} transactions" for cat, amounts in category_trends.items()])}

Provide:
1. Predicted total spending for next month (just the number)
2. Top 3 categories to watch
3. One money-saving tip

Format: Just numbers and short phrases, be concise."""

        response = gemini_model.generate_content(prompt)
        prediction = response.text
        
        return {
            "prediction": prediction,
            "historical_average": sum(monthly_expenses.values()) / len(monthly_expenses) if monthly_expenses else 0,
            "trend": "increasing" if len(monthly_expenses) >= 2 and list(monthly_expenses.values())[-1] > list(monthly_expenses.values())[0] else "stable"
        }
    except Exception as e:
        logger.error(f"AI prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate prediction: {str(e)}")

@api_router.post("/ai/financial-goals")
async def ai_suggest_financial_goals(current_user: User = Depends(get_current_user)):
    """Use Gemini AI to suggest personalized financial goals"""
    try:
        # Get user's financial overview
        all_transactions = supabase.table('transactions').select('*').eq('user_id', current_user.id).execute()
        budgets = supabase.table('budgets').select('*').eq('user_id', current_user.id).execute()
        
        total_income = sum(t["amount"] for t in all_transactions.data if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in all_transactions.data if t["type"] == "expense")
        savings_rate = ((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0
        
        # Category analysis
        expense_categories = {}
        for t in all_transactions.data:
            if t["type"] == "expense":
                cat = t["category"]
                expense_categories[cat] = expense_categories.get(cat, 0) + t["amount"]
        
        largest_expense = max(expense_categories.items(), key=lambda x: x[1]) if expense_categories else ("None", 0)
        
        prompt = f"""As a certified financial planner, suggest 3 SMART financial goals for this user:

Financial Profile:
- Total Income: ${total_income:.2f}
- Total Expenses: ${total_expenses:.2f}
- Current Savings Rate: {savings_rate:.1f}%
- Largest Expense Category: {largest_expense[0]} (${largest_expense[1]:.2f})
- Active Budgets: {len(budgets.data)}

Provide 3 specific, measurable, achievable goals with timeframes. Format each as:
Goal: [goal name]
Target: [specific number/percentage]
Timeline: [timeframe]
Action: [one specific action step]

Keep it concise and actionable."""

        response = gemini_model.generate_content(prompt)
        goals = response.text
        
        return {
            "goals": goals,
            "current_savings_rate": round(savings_rate, 1),
            "recommended_savings_rate": 20.0,
            "potential_monthly_savings": round((total_income * 0.2 - (total_income - total_expenses)) / 12, 2) if total_income > 0 else 0
        }
    except Exception as e:
        logger.error(f"AI goals suggestion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate goals: {str(e)}")

@api_router.post("/ai/smart-budget-recommendation")
async def ai_recommend_budget(
    category: str,
    current_user: User = Depends(get_current_user)
):
    """Use Gemini AI to recommend optimal budget for a category"""
    try:
        # Get historical spending in this category
        three_months_ago = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        result = supabase.table('transactions').select('*').eq('user_id', current_user.id).eq('category', category).eq('type', 'expense').gte('date', three_months_ago).execute()
        
        if not result.data:
            return {"recommended_budget": 0, "message": f"No historical data for {category}. Start tracking to get recommendations."}
        
        monthly_spending = {}
        for t in result.data:
            month = t["date"][:7]
            monthly_spending[month] = monthly_spending.get(month, 0) + t["amount"]
        
        avg_spending = sum(monthly_spending.values()) / len(monthly_spending)
        max_spending = max(monthly_spending.values())
        min_spending = min(monthly_spending.values())
        
        # Get total income for context
        all_income = supabase.table('transactions').select('amount').eq('user_id', current_user.id).eq('type', 'income').execute()
        total_income = sum(t["amount"] for t in all_income.data) if all_income.data else 0
        monthly_income = total_income / 3 if total_income > 0 else 0  # Last 3 months
        
        prompt = f"""As a financial advisor, recommend an optimal monthly budget for the {category} category:

Historical Data (last 3 months):
- Average monthly spending: ${avg_spending:.2f}
- Highest month: ${max_spending:.2f}
- Lowest month: ${min_spending:.2f}
- User's monthly income: ${monthly_income:.2f}

Recommend a realistic budget amount and explain why. Be concise (2-3 sentences)."""

        response = gemini_model.generate_content(prompt)
        recommendation = response.text
        
        # Extract recommended amount (simple heuristic)
        recommended_amount = round(avg_spending * 1.1, 2)  # 10% buffer above average
        
        return {
            "recommended_budget": recommended_amount,
            "current_average": round(avg_spending, 2),
            "explanation": recommendation,
            "category": category
        }
    except Exception as e:
        logger.error(f"AI budget recommendation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendation: {str(e)}")

@api_router.post("/ai/expense-anomaly-detection")
async def ai_detect_expense_anomalies(current_user: User = Depends(get_current_user)):
    """Use Gemini AI to detect unusual spending patterns"""
    try:
        # Get last 60 days of transactions
        sixty_days_ago = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
        result = supabase.table('transactions').select('*').eq('user_id', current_user.id).eq('type', 'expense').gte('date', sixty_days_ago).order('date', desc=True).execute()
        
        if len(result.data) < 10:
            return {"anomalies": [], "message": "Not enough transaction history for anomaly detection."}
        
        # Calculate statistics
        amounts = [t["amount"] for t in result.data]
        avg_amount = sum(amounts) / len(amounts)
        max_amount = max(amounts)
        
        # Category frequency
        category_counts = {}
        for t in result.data:
            cat = t["category"]
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        # Find potential anomalies (amounts > 2x average)
        potential_anomalies = [t for t in result.data if t["amount"] > avg_amount * 2]
        
        if not potential_anomalies:
            return {"anomalies": [], "message": "No unusual spending detected. Your expenses are consistent!"}
        
        prompt = f"""As a fraud detection AI, analyze these potentially unusual transactions:

Average transaction: ${avg_amount:.2f}
Typical categories and frequencies: {', '.join([f"{cat} ({count}x)" for cat, count in category_counts.items()])}

Unusual transactions (>2x average):
{chr(10).join([f"- {t['date']}: ${t['amount']:.2f} in {t['category']}" + (f" ({t.get('description', 'no description')})" if t.get('description') else "") for t in potential_anomalies[:5]])}

Are these legitimate unusual expenses or potential concerns? Provide brief analysis."""

        response = gemini_model.generate_content(prompt)
        analysis = response.text
        
        return {
            "anomalies": [
                {
                    "date": t["date"],
                    "amount": t["amount"],
                    "category": t["category"],
                    "description": t.get("description", ""),
                    "deviation": round((t["amount"] / avg_amount - 1) * 100, 1)
                }
                for t in potential_anomalies[:5]
            ],
            "analysis": analysis,
            "average_expense": round(avg_amount, 2)
        }
    except Exception as e:
        logger.error(f"AI anomaly detection failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to detect anomalies: {str(e)}")

# ============ HEALTH CHECK ============

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SmartLedger API", "version": "2.0.0"}

# Include the router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
