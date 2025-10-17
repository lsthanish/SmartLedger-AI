import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Calendar,
    Target,
    Activity
} from 'lucide-react';

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('thisMonth');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load analytics data');
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

    const getFilteredTransactions = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            
            switch (timeFilter) {
                case 'thisMonth':
                    return (
                        transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear
                    );
                case 'thisYear':
                    return transactionDate.getFullYear() === currentYear;
                case 'lastSixMonths':
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    return transactionDate >= sixMonthsAgo;
                case 'all':
                default:
                    return true;
            }
        });
    };

    const getIncomeVsExpenses = () => {
        const filteredTransactions = getFilteredTransactions();
        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return { totalIncome, totalExpenses, netIncome: totalIncome - totalExpenses };
    };

    const getCategoryData = () => {
        const filteredTransactions = getFilteredTransactions();
        const categoryTotals = {};
        
        filteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                categoryTotals[transaction.category] = 
                    (categoryTotals[transaction.category] || 0) + transaction.amount;
            });

        return Object.entries(categoryTotals)
            .map(([name, value], index) => ({
                name,
                value: parseFloat(value.toFixed(2)),
                color: `hsl(${(index * 45) % 360}, 70%, 50%)`
            }))
            .sort((a, b) => b.value - a.value);
    };

    const getMonthlyTrends = () => {
        const monthlyData = {};
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Initialize months
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyData[monthKey] = { income: 0, expenses: 0, month: date.toLocaleDateString('en-US', { month: 'short' }) };
        }

        transactions
            .filter(t => new Date(t.date) >= sixMonthsAgo)
            .forEach(transaction => {
                const date = new Date(transaction.date);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                
                if (monthlyData[monthKey]) {
                    if (transaction.type === 'income') {
                        monthlyData[monthKey].income += transaction.amount;
                    } else {
                        monthlyData[monthKey].expenses += transaction.amount;
                    }
                }
            });

        return Object.values(monthlyData)
            .reverse()
            .map(data => ({
                ...data,
                income: parseFloat(data.income.toFixed(2)),
                expenses: parseFloat(data.expenses.toFixed(2)),
                net: parseFloat((data.income - data.expenses).toFixed(2))
            }));
    };

    const getDailySpending = () => {
        const filteredTransactions = getFilteredTransactions();
        const dailyData = {};

        filteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                const date = transaction.date;
                dailyData[date] = (dailyData[date] || 0) + transaction.amount;
            });

        return Object.entries(dailyData)
            .map(([date, amount]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: parseFloat(amount.toFixed(2))
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-30); // Last 30 days
    };

    const { totalIncome, totalExpenses, netIncome } = getIncomeVsExpenses();
    const categoryData = getCategoryData();
    const monthlyTrends = getMonthlyTrends();
    const dailySpending = getDailySpending();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                    <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-300 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        Insights into your financial behavior and spending patterns
                    </p>
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="lastSixMonths">Last 6 Months</SelectItem>
                        <SelectItem value="thisYear">This Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalIncome)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalExpenses)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                        <DollarSign className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(netIncome)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Daily Spending</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(dailySpending.length > 0 ? dailySpending.reduce((sum, day) => sum + day.amount, 0) / dailySpending.length : 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Income vs Expenses Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expenses Trends</CardTitle>
                        <CardDescription>
                            Monthly comparison over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrends}>
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

                {/* Spending by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                        <CardDescription>
                            Breakdown of expenses by category
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
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                                No expense data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Net Income Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Net Income Trend</CardTitle>
                        <CardDescription>
                            Monthly net income (income minus expenses)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="net" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        name="Net Income"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Spending Pattern */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Spending Pattern</CardTitle>
                        <CardDescription>
                            Daily expenses over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dailySpending.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailySpending}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#f59e0b" 
                                            fill="#f59e0b" 
                                            fillOpacity={0.3}
                                            name="Daily Spending"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No daily spending data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>
                        Detailed spending analysis by category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {categoryData.length > 0 ? (
                        <div className="space-y-4">
                            {categoryData.map((category, index) => {
                                const percentage = ((category.value / totalExpenses) * 100);
                                return (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="flex items-center space-x-4">
                                            <div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {percentage.toFixed(1)}% of total expenses
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(category.value)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {Math.round((category.value / (totalExpenses > 0 ? totalExpenses : 1)) * 100)}%
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No expense data to analyze</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;