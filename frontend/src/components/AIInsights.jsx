import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axiosInstance from '../lib/axios';
import { Sparkles, Loader2, TrendingUp, Target, PiggyBank, Lightbulb } from 'lucide-react';
import SEO from './SEO';

const AIInsights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedType, setSelectedType] = useState('general');

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/ai/insights');
            setInsights(response.data);
        } catch (error) {
            console.error('Error fetching insights:', error);
            toast.error('Failed to load AI insights');
        } finally {
            setLoading(false);
        }
    };

    const generateInsight = async () => {
        setGenerating(true);
        try {
            const response = await axiosInstance.post('/ai/insights', {
                insight_type: selectedType
            });
            
            setInsights([response.data, ...insights]);
            toast.success('AI insight generated successfully!');
        } catch (error) {
            console.error('Error generating insight:', error);
            toast.error(error.response?.data?.detail || 'Failed to generate AI insight');
        } finally {
            setGenerating(false);
        }
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'spending':
                return <TrendingUp className="h-5 w-5" />;
            case 'budget':
                return <Target className="h-5 w-5" />;
            case 'savings':
                return <PiggyBank className="h-5 w-5" />;
            default:
                return <Lightbulb className="h-5 w-5" />;
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'spending':
                return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400';
            case 'budget':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
            case 'savings':
                return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
            default:
                return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <SEO 
                title="AI Financial Insights - SmartLedger"
                description="Get personalized AI-powered financial insights and recommendations to improve your spending, budgeting, and savings habits."
                keywords="AI financial insights, spending analysis, budget recommendations, savings tips, financial AI"
                canonical="/ai-insights"
            />

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">AI Financial Insights</h2>
                <p className="text-muted-foreground">
                    Get personalized recommendations powered by Gemini AI
                </p>
            </div>

            {/* Generate Insight Card */}
            <Card className="border-2 border-dashed border-emerald-300 dark:border-emerald-700">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-emerald-600" />
                        Generate New Insight
                    </CardTitle>
                    <CardDescription>
                        Select an insight type and let AI analyze your financial data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select insight type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Financial Health</SelectItem>
                                    <SelectItem value="spending">Spending Analysis</SelectItem>
                                    <SelectItem value="budget">Budget Optimization</SelectItem>
                                    <SelectItem value="savings">Savings Recommendations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button 
                            onClick={generateInsight} 
                            disabled={generating}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Insight
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Insights List */}
            <div className="space-y-4">
                {loading ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        </CardContent>
                    </Card>
                ) : insights.length > 0 ? (
                    insights.map((insight, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${getInsightColor(insight.insight_type)}`}>
                                            {getInsightIcon(insight.insight_type)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg capitalize">
                                                {insight.insight_type} Insight
                                            </CardTitle>
                                            <CardDescription>
                                                {formatDate(insight.created_at)}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Sparkles className="h-5 w-5 text-emerald-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {insight.insight_text}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles className="h-12 w-12 text-emerald-600 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No insights yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Generate your first AI-powered financial insight to get personalized recommendations
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                                About AI Insights
                            </h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                Our AI analyzes your transaction history, spending patterns, and budget data to provide 
                                personalized financial advice. Insights are generated using Google's Gemini AI and are 
                                tailored specifically to your financial situation.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIInsights;
