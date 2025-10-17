# SmartLedger - Smart Budget & Expense Tracker

**Track Smarter. Spend Better.**

SmartLedger is a modern, responsive web application for managing personal finances with intelligent budget tracking, expense insights, and powerful analytics.

![SmartLedger Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure JWT-based email/password authentication
- **Dashboard** - Real-time overview of total balance, monthly income, expenses, and net savings
- **Transaction Management** - Add, edit, delete, categorize transactions with search & filtering
- **Budget Tracking** - Set spending limits per category and track progress with visual indicators
- **Visual Analytics** - Interactive charts (Recharts) showing spending trends and category breakdowns
- **CSV Import/Export** - Seamlessly backup and migrate your financial data
- **Dark Mode** - Eye-friendly dark theme toggle
- **Responsive Design** - Optimized for desktop and mobile devices

### Tech Stack

**Frontend:**
- React 19 with React Router
- Tailwind CSS for styling
- Shadcn/UI components
- Recharts for data visualization
- Axios for API calls
- Sonner for toast notifications

**Backend:**
- FastAPI (Python)
- MongoDB with Motor (async driver)
- JWT authentication with passlib
- Pydantic for data validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (3.11+)
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smartledger
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret
```

3. **Frontend Setup**
```bash
cd frontend
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend URL
```

### Running Locally

1. **Start MongoDB**
```bash
mongod --dbpath /path/to/data
```

2. **Start Backend Server**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

3. **Start Frontend**
```bash
cd frontend
yarn start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Getting Started

1. **Create an Account**
   - Navigate to the authentication page
   - Click "Sign up" and enter your email and password
   - You'll be automatically logged in after registration

2. **Add Your First Transaction**
   - Go to "Transactions" page
   - Click "Add Transaction"
   - Fill in amount, category, description, and date
   - Choose type (Income or Expense)
   - Click "Add Transaction"

3. **Set Budget Goals**
   - Navigate to "Budgets" page
   - Click "Add Budget"
   - Select a category and set your monthly spending limit
   - Track your progress with visual percentage indicators

4. **View Analytics**
   - Visit the "Analytics" page
   - See 6-month trends, income vs expenses, and category breakdowns
   - Filter by time period (This Month, This Year, All Time)

5. **Import/Export Data**
   - Use the Export button on Transactions page to download CSV
   - Import existing data using the Import button
   - CSV format: Date, Type, Category, Amount, Description

## 🎨 Design Features

- **Modern UI** - Clean, elegant interface with Inter font family
- **Color Scheme** - Emerald and teal gradients for a fresh, professional look
- **Glassmorphism** - Subtle glass effects for modern aesthetics
- **Smooth Animations** - Polished transitions and hover effects
- **Accessible** - Semantic HTML and proper ARIA labels

## 🏗️ Project Structure

```
smartledger/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   └── Analytics.jsx
│   │   ├── App.js        # Main app component
│   │   ├── App.css       # Global styles
│   │   └── index.js      # Entry point
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
└── README.md            # This file
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartledger_db
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key-here
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/export/csv` - Export to CSV
- `POST /api/transactions/import/csv` - Import from CSV

### Budgets
- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Dashboard
- `GET /api/dashboard` - Get dashboard summary

### Categories
- `GET /api/categories` - Get unique categories

## 📊 Data Models

### User
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Transaction
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "amount": 150.50,
  "type": "expense",
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2025-01-01",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Budget
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "category": "Food",
  "limit": 500.00,
  "month": 1,
  "year": 2025,
  "created_at": "2025-01-01T00:00:00Z"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for better financial wellness**
