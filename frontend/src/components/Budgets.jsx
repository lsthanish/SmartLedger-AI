import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
    Plus, 
    Target, 
    TrendingUp, 
    AlertTriangle, 
    CheckCircle,
    Edit,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const [budgetForm, setBudgetForm] = useState({
        category: '',
        limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
        fetchTransactions();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('/api/budgets', {
                params: {
                    month: currentMonth,
                    year: currentYear
                }
            });
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleFormChange = (field, value) => {
        setBudgetForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!budgetForm.category || !budgetForm.limit) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const payload = {
                ...budgetForm,
                limit: parseFloat(budgetForm.limit)
            };

            if (editingBudget) {
                await axios.put(`/api/budgets/${editingBudget.id}`, payload);
                toast.success('Budget updated successfully');
            } else {
                await axios.post('/api/budgets', payload);
                toast.success('Budget created successfully');
            }

            setIsDialogOpen(false);
            setEditingBudget(null);
            setBudgetForm({
                category: '',
                limit: '',
                month: currentMonth,
                year: currentYear
            });
            fetchBudgets();
        } catch (error) {
            console.error('Error saving budget:', error);
            toast.error(error.response?.data?.detail || 'Failed to save budget');
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setBudgetForm({
            category: budget.category,
            limit: budget.limit.toString(),
            month: budget.month,
            year: budget.year
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (budgetId) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) {
            return;
        }

        try {
            await axios.delete(`/api/budgets/${budgetId}`);
            toast.success('Budget deleted successfully');
            fetchBudgets();
        } catch (error) {
            console.error('Error deleting budget:', error);
            toast.error('Failed to delete budget');
        }
    };

    const calculateSpent = (category) => {
        const currentMonthStart = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        const currentMonthEnd = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;

        return transactions
            .filter(t => 
                t.type === 'expense' && 
                t.category === category &&
                t.date >= currentMonthStart &&
                t.date < currentMonthEnd
            )
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-orange-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getBudgetStatus = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return { icon: AlertTriangle, color: 'text-red-500', status: 'Over Budget' };
        if (percentage >= 80) return { icon: AlertTriangle, color: 'text-orange-500', status: 'Near Limit' };
        return { icon: CheckCircle, color: 'text-green-500', status: 'On Track' };
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                    <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-300 rounded animate-pulse"></div>
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
                    <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
                    <p className="text-muted-foreground">
                        Track your spending limits for {monthNames[currentMonth - 1]} {currentYear}
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingBudget(null)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Budget
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingBudget ? 'Update the budget details.' : 'Set a spending limit for a category.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">
                                        Category
                                    </Label>
                                    <Select 
                                        value={budgetForm.category} 
                                        onValueChange={(value) => handleFormChange('category', value)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="limit" className="text-right">
                                        Limit
                                    </Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={budgetForm.limit}
                                        onChange={(e) => handleFormChange('limit', e.target.value)}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="month" className="text-right">
                                        Month
                                    </Label>
                                    <Select 
                                        value={budgetForm.month.toString()} 
                                        onValueChange={(value) => handleFormChange('month', parseInt(value))}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthNames.map((month, index) => (
                                                <SelectItem key={index} value={(index + 1).toString()}>
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="year" className="text-right">
                                        Year
                                    </Label>
                                    <Select 
                                        value={budgetForm.year.toString()} 
                                        onValueChange={(value) => handleFormChange('year', parseInt(value))}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingBudget ? 'Update' : 'Create'} Budget
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Budget Cards */}
            {budgets.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {budgets.map((budget) => {
                        const spent = calculateSpent(budget.category);
                        const percentage = Math.min((spent / budget.limit) * 100, 100);
                        const remaining = Math.max(budget.limit - spent, 0);
                        const status = getBudgetStatus(spent, budget.limit);
                        const StatusIcon = status.icon;

                        return (
                            <Card key={budget.id} className="relative">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center space-x-2">
                                        <Target className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-lg">{budget.category}</CardTitle>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(budget)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleDelete(budget.id)}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                            <span className={`text-sm font-medium ${status.color}`}>
                                                {status.status}
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {Math.round(percentage)}%
                                        </span>
                                    </div>
                                    
                                    <Progress 
                                        value={percentage} 
                                        className="w-full h-3"
                                    />
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Spent:</span>
                                            <span className="font-medium">{formatCurrency(spent)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Limit:</span>
                                            <span className="font-medium">{formatCurrency(budget.limit)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t pt-2">
                                            <span className="text-muted-foreground">Remaining:</span>
                                            <span className={`font-medium ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(remaining)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Target className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No budgets set</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Start tracking your spending by setting budget limits for different categories.
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Budget
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Summary Statistics */}
            {budgets.length > 0 && (
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(budgets.reduce((sum, budget) => sum + budget.limit, 0))}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(budgets.reduce((sum, budget) => sum + calculateSpent(budget.category), 0))}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Budgets On Track</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {budgets.filter(budget => calculateSpent(budget.category) < budget.limit * 0.8).length}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    of {budgets.length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Budgets;