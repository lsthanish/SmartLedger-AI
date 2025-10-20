import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import axiosInstance from '../lib/axios';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    MoreHorizontal,
    CreditCard
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axiosInstance.get('/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error(error.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Prepare chart data
    const categoryData = dashboardData?.spending_by_category 
        ? Object.entries(dashboardData.spending_by_category).map(([name, value], index) => ({
            name,
            value: parseFloat(value),
            color: `hsl(${(index * 45) % 360}, 70%, 50%)`
        }))
        : [];

    // Sample monthly data for the bar chart
    const monthlyData = [
        { month: 'Jan', income: 3000, expenses: 2200 },
        { month: 'Feb', income: 3200, expenses: 2400 },
        { month: 'Mar', income: 2800, expenses: 2100 },
        { month: 'Apr', income: 3500, expenses: 2600 },
        { month: 'May', income: 3300, expenses: 2300 },
        { month: 'Jun', income: 3100, expenses: 2500 },
    ];

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                            <div className="h-6 bg-gray-300 rounded w-32 mt-2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">
                        Here's what's happening with your finances today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/transactions">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Total Balance
                        </CardTitle>
                        <DollarSign className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(dashboardData?.total_balance || 0)}
                        </div>
                        <p className="text-xs opacity-90 mt-1">
                            Your current net worth
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(dashboardData?.monthly_income || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(dashboardData?.monthly_expenses || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            -5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                        <Target className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency((dashboardData?.monthly_income || 0) - (dashboardData?.monthly_expenses || 0))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Monthly difference
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Spending by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                        <CardDescription>
                            Your expenses breakdown for this month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No spending data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>
                            Income vs expenses over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            Your latest financial activity
                        </CardDescription>
                    </div>
                    <Link to="/transactions">
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {dashboardData?.recent_transactions?.length > 0 ? (
                        <div className="space-y-4">
                            {dashboardData.recent_transactions.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-full ${
                                            transaction.type === 'income' 
                                                ? 'bg-green-100 dark:bg-green-900' 
                                                : 'bg-red-100 dark:bg-red-900'
                                        }`}>
                                            {transaction.type === 'income' ? (
                                                <TrendingUp className={`h-4 w-4 ${
                                                    transaction.type === 'income' 
                                                        ? 'text-green-600 dark:text-green-400' 
                                                        : 'text-red-600 dark:text-red-400'
                                                }`} />
                                            ) : (
                                                <TrendingDown className={`h-4 w-4 ${
                                                    transaction.type === 'income' 
                                                        ? 'text-green-600 dark:text-green-400' 
                                                        : 'text-red-600 dark:text-red-400'
                                                }`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {transaction.description || transaction.category}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {transaction.category} • {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-right font-medium ${
                                        transaction.type === 'income' 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(Math.abs(transaction.amount))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No transactions yet</p>
                            <Link to="/transactions">
                                <Button className="mt-4" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add your first transaction
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;