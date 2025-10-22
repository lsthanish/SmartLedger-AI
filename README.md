# SmartLedger - Smart Budget & Expense Tracker

**Track Smarter. Spend Better.**

SmartLedger is a modern, responsive web application for managing personal finances with intelligent budget tracking, AI-powered insights, and powerful analytics powered by Google Gemini AI.

![SmartLedger Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-19-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure authentication powered by Supabase Auth
- **Dashboard** - Real-time overview of total balance, monthly income, expenses, and net savings
- **Transaction Management** - Add, edit, delete, categorize transactions with search & filtering
- **Budget Tracking** - Set spending limits per category and track progress with visual indicators
- **Visual Analytics** - Interactive charts (Recharts) showing spending trends and category breakdowns
- **CSV Import/Export** - Seamlessly backup and migrate your financial data
- **Dark Mode** - Eye-friendly dark theme toggle
- **Responsive Design** - Optimized for desktop and mobile devices

### 🤖 AI-Powered Features (Google Gemini)
- **Smart Categorization** - Automatically categorize transactions using AI
- **Spending Predictions** - AI-powered predictions for next month's spending
- **Financial Goals** - Personalized SMART financial goals based on your spending patterns
- **Smart Budget Recommendations** - AI-suggested budget limits per category
- **Expense Anomaly Detection** - Detect unusual spending patterns automatically
- **Enhanced Insights** - Comprehensive financial insights and recommendations

### Tech Stack

**Frontend:**
- React 19 with React Router
- Tailwind CSS for styling
- Shadcn/UI components
- Recharts for data visualization
- Axios for API calls
- Sonner for toast notifications
- Supabase client for authentication

**Backend:**
- FastAPI (Python 3.11)
- Supabase PostgreSQL with Row Level Security
- Google Gemini AI (gemini-pro model)
- Supabase Auth for authentication
- Pydantic for data validation

**Database:**
- Supabase PostgreSQL
- Row Level Security (RLS) enabled
- Real-time capabilities
- Automatic backups

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (3.11+)
- Supabase Account (free tier available)
- Google Gemini API Key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/lsthanish/SmartLedger-AI.git
cd SmartLedger
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env with your credentials
```

**Backend `.env` file:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=http://localhost:3000,https://smartledger.app
HOST=0.0.0.0
PORT=8001
```

3. **Database Setup**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project or select existing
   - Go to SQL Editor
   - Copy and run the entire `backend/init_database.sql` script
   - This will create all tables, policies, triggers, and functions

4. **Frontend Setup**
```bash
cd frontend
npm install

# Configure environment variables
# Edit frontend/.env with your credentials
```

**Frontend `.env` file:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_SITE_URL=https://smartledger.app
REACT_APP_SITE_NAME=SmartLedger
WDS_SOCKET_PORT=3000
```

### Running the Application

#### Option 1: Using PowerShell Script (Windows - Recommended)

```powershell
# From the SmartLedger root directory
.\start.ps1
```

This will automatically start both backend and frontend servers.

#### Option 2: Manual Start (All Platforms)

**Terminal 1 - Start Backend:**
```bash
cd backend
python server_supabase.py
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`  
Backend API documentation: `http://localhost:8001/docs`

#### Option 3: Separate PowerShell Windows (Windows)

**Start Backend:**
```powershell
cd C:\path\to\SmartLedger\backend
python .\server_supabase.py
```

**Start Frontend:**
```powershell
cd C:\path\to\SmartLedger\frontend
npm start
```

## 📖 Usage

### Getting Started

1. **Create an Account**
   - Navigate to `http://localhost:3000/auth`
   - Click "Create Account"
   - Enter your full name, email, and password
   - Password must be at least 8 characters with uppercase, lowercase, and number
   - You'll be automatically logged in after registration

2. **Add Your First Transaction**
   - Go to "Transactions" page from the sidebar
   - Click "Add Transaction" button
   - Fill in:
     - Amount (e.g., 50.00)
     - Type (Income or Expense)
     - Category (e.g., Food, Transport, Salary)
     - Description (optional)
     - Date
   - Click "Add Transaction"
   - Transaction appears immediately in the list

3. **Set Budget Goals**
   - Navigate to "Budgets" page
   - Click "Create Budget"
   - Select a category
   - Set your monthly spending limit
   - Choose month and year
   - Track your progress with visual percentage indicators
   - Red = over budget, Yellow = near limit, Green = on track

4. **View Analytics**
   - Visit the "Analytics" page
   - See spending trends over time
   - View income vs expenses comparison
   - Analyze category breakdowns
   - Filter by time period (This Month, This Year, All Time)
   - Interactive charts with hover details

5. **Use AI Features**
   - **Auto-Categorize:** Let AI suggest the best category for a transaction
   - **Spending Predictions:** See predicted spending for next month
   - **Financial Goals:** Get personalized SMART financial goals
   - **Budget Recommendations:** Receive AI-suggested budget limits
   - **Anomaly Detection:** Identify unusual spending patterns
   - **Enhanced Insights:** Get comprehensive financial advice

6. **Import/Export Data**
   - Use the Export button on Transactions page to download CSV
   - Import existing data using the Import button
   - CSV format: Date, Type, Category, Amount, Description
   - Supports bulk operations for data migration

## 🎨 Design Features

- **Modern UI** - Clean, elegant interface with Inter font family
- **Color Scheme** - Emerald and teal gradients for a fresh, professional look
- **Glassmorphism** - Subtle glass effects for modern aesthetics
- **Smooth Animations** - Polished transitions and hover effects
- **Accessible** - Semantic HTML and proper ARIA labels
- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Fully functional on mobile, tablet, and desktop

## 🏗️ Project Structure

```
SmartLedger/
├── backend/
│   ├── server_supabase.py    # Main FastAPI application with Supabase & Gemini AI
│   ├── init_database.sql     # Database initialization script
│   ├── init_db.py            # Database setup helper
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (not in git)
│   └── .env.example          # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LandingPage.jsx     # Marketing landing page
│   │   │   ├── AuthPage.jsx        # Sign in/Sign up page
│   │   │   ├── Layout.jsx          # App layout with navigation
│   │   │   ├── Dashboard.jsx       # Financial overview
│   │   │   ├── Transactions.jsx    # Transaction management
│   │   │   ├── Budgets.jsx         # Budget tracking
│   │   │   ├── Analytics.jsx       # Charts and insights
│   │   │   ├── SEO.jsx            # SEO component
│   │   │   └── ui/                 # Shadcn UI components
│   │   ├── lib/
│   │   │   ├── axios.js           # API client configuration
│   │   │   ├── supabase.js        # Supabase client
│   │   │   └── utils.js           # Utility functions
│   │   ├── App.js           # Main app component with routing
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── package.json         # Node dependencies
│   └── .env                 # Environment variables (not in git)
├── tests/                   # Test files
├── start.ps1               # PowerShell startup script
├── CHECKLIST.md            # Setup checklist
├── DATABASE_VERIFICATION_REPORT.md  # Database status report
├── GEMINI_AI_FEATURES.md   # AI features documentation
└── README.md               # This file
```

## 🔐 Environment Variables

### Backend (backend/.env)
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# JWT Configuration (for legacy support)
JWT_SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://smartledger.app

# Server Configuration
HOST=0.0.0.0
PORT=8001
```

### Frontend (frontend/.env)
```env
# Backend API
REACT_APP_BACKEND_URL=http://localhost:8001

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
REACT_APP_SITE_URL=https://smartledger.app
REACT_APP_SITE_NAME=SmartLedger

# Development
WDS_SOCKET_PORT=3000
```

## 🧪 API Endpoints

### Authentication (Supabase Auth)
- `POST /api/auth/register` - Register new user (creates profile in both auth.users and public.users)
- `POST /api/auth/login` - Login user (returns Supabase JWT token)
- `GET /api/auth/me` - Get current user profile (requires Bearer token)

### Transactions
- `GET /api/transactions` - List all user transactions (with optional filters)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/{id}` - Update existing transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/export/csv` - Export transactions to CSV
- `POST /api/transactions/import/csv` - Import transactions from CSV

### Budgets
- `GET /api/budgets` - List all user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/{id}` - Update existing budget
- `DELETE /api/budgets/{id}` - Delete budget

### Dashboard
- `GET /api/dashboard` - Get dashboard summary (balance, income, expenses, net savings)

### Categories
- `GET /api/categories` - Get unique transaction categories

### AI Features (Google Gemini)
- `POST /api/ai/categorize-transaction` - Auto-categorize a transaction
- `POST /api/ai/predict-spending` - Predict next month's spending
- `POST /api/ai/financial-goals` - Generate personalized financial goals
- `POST /api/ai/smart-budget-recommendation` - Get AI budget recommendations
- `POST /api/ai/expense-anomaly-detection` - Detect spending anomalies
- `POST /api/ai/insights` - Get enhanced financial insights

### Health Check
- `GET /health` - Server health check endpoint

**Full API Documentation:** Visit `http://localhost:8001/docs` after starting the backend server.

## 📊 Data Models

### User (public.users)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2025-10-21T00:00:00Z",
  "updated_at": "2025-10-21T00:00:00Z"
}
```

### Transaction (public.transactions)
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "amount": 150.50,
  "type": "expense",
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2025-10-21",
  "created_at": "2025-10-21T00:00:00Z",
  "updated_at": "2025-10-21T00:00:00Z"
}
```

### Budget (public.budgets)
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "category": "Food",
  "limit_amount": 500.00,
  "month": 10,
  "year": 2025,
  "created_at": "2025-10-21T00:00:00Z",
  "updated_at": "2025-10-21T00:00:00Z"
}
```

## 🗄️ Database Schema

SmartLedger uses Supabase PostgreSQL with the following features:

- **Row Level Security (RLS)** - Users can only access their own data
- **Auto-generated UUIDs** - Unique identifiers for all records
- **Timestamps** - Automatic created_at and updated_at tracking
- **Foreign Keys** - Referential integrity enforced
- **Indexes** - Optimized queries for common operations
- **Triggers** - Automatic user profile creation on signup

See `backend/init_database.sql` for complete schema definition.

## 🔧 Troubleshooting

### Backend won't start
- Check if Python 3.11+ is installed: `python --version`
- Verify dependencies: `pip install -r requirements.txt`
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is accessible

### Frontend won't start
- Check if Node.js 16+ is installed: `node --version`
- Install dependencies: `npm install`
- Check `.env` file has correct backend URL
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Database connection errors
- Verify Supabase URL in `.env` is correct
- Check Supabase anon key is valid and not expired
- Run `backend/init_database.sql` in Supabase SQL Editor
- Verify tables exist in Supabase Table Editor

### Sign-in not working
- Ensure database tables are created (run init_database.sql)
- Check backend server is running on port 8001
- Verify frontend can reach backend (check CORS settings)
- Clear browser localStorage and try again
- Check browser console for error messages

### AI features not working
- Verify Gemini API key in backend/.env
- Check Gemini API quota hasn't been exceeded
- Ensure API key has correct permissions
- Check backend logs for AI-related errors

## 📚 Additional Documentation

- `CHECKLIST.md` - Setup and deployment checklist
- `DATABASE_VERIFICATION_REPORT.md` - Database status and verification
- `GEMINI_AI_FEATURES.md` - AI features documentation
- `FINAL_FIX_SUMMARY.md` - Complete fix and improvement summary
- `CLEANUP_SUMMARY.md` - Project cleanup and organization report

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in hosting platform
2. Update `CORS_ORIGINS` to include your frontend URL
3. Deploy `backend/server_supabase.py`
4. Ensure Python 3.11+ runtime
5. Install dependencies from `requirements.txt`

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `npm run build`
2. Set environment variables (REACT_APP_*)
3. Update backend URL to production URL
4. Deploy the `build` folder
5. Configure custom domain if needed

### Database (Supabase)

- Already hosted and managed by Supabase
- Automatic backups enabled
- Row Level Security enforced
- Production-ready out of the box

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation in the repository
- Review API documentation at `/docs` endpoint

---

**Made with ❤️ for better financial wellness**

**Version:** 2.0.0  
**Last Updated:** October 21, 2025  
**Repository:** https://github.com/lsthanish/SmartLedger-AI
