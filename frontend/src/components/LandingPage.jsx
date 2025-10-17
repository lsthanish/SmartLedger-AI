import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import SEO from './SEO';
import { 
    DollarSign, 
    BarChart3, 
    Target, 
    Shield, 
    Smartphone, 
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Star,
    Users,
    Download
} from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
            icon: DollarSign,
            title: 'Transaction Management',
            description: 'Track all your income and expenses with detailed categorization and search functionality.',
            color: 'text-green-500'
        },
        {
            icon: Target,
            title: 'Budget Tracking',
            description: 'Set spending limits per category and monitor your progress with visual indicators.',
            color: 'text-blue-500'
        },
        {
            icon: BarChart3,
            title: 'Visual Analytics',
            description: 'Interactive charts and graphs to understand your spending patterns and trends.',
            color: 'text-purple-500'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your financial data is protected with industry-standard encryption and security.',
            color: 'text-red-500'
        },
        {
            icon: Smartphone,
            title: 'Responsive Design',
            description: 'Access your finances on any device with our fully responsive web application.',
            color: 'text-orange-500'
        },
        {
            icon: Download,
            title: 'Import/Export',
            description: 'Easily import existing data or export your records for backup and migration.',
            color: 'text-teal-500'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Small Business Owner',
            content: 'SmartLedger has completely transformed how I manage my business finances. The analytics are incredibly insightful!',
            rating: 5
        },
        {
            name: 'Mike Chen',
            role: 'Software Engineer',
            content: 'Finally, a finance app that\'s both powerful and easy to use. The budget tracking feature is a game-changer.',
            rating: 5
        },
        {
            name: 'Emily Rodriguez',
            role: 'Freelancer',
            content: 'I love how I can categorize all my expenses and see exactly where my money is going. Highly recommend!',
            rating: 5
        }
    ];

    const benefits = [
        'Real-time financial overview',
        'Automated expense categorization',
        'Monthly budget progress tracking',
        'Interactive spending analytics',
        'Secure data encryption',
        'CSV import/export functionality',
        'Mobile-responsive design',
        'Dark mode support'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO 
                title="SmartLedger - Personal Finance Tracker & Budget Management"
                description="Take control of your finances with SmartLedger. Track expenses, manage budgets, analyze spending patterns, and achieve your financial goals with our intelligent personal finance platform."
                keywords="personal finance, expense tracker, budget management, financial analytics, money management, spending tracker, financial goals, budget app, expense management"
                canonical="/"
            />
            {/* Navigation */}
            <nav className="border-b border-emerald-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                                SmartLedger
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/auth">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/auth">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Track Smarter.{' '}
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            Spend Better.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        SmartLedger is the modern financial management tool that helps you understand your money better with intelligent budgeting, expense tracking, and powerful analytics.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auth">
                            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                                Start Tracking for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                        <div className="text-gray-600 dark:text-gray-300">Active Users</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">$2M+</div>
                        <div className="text-gray-600 dark:text-gray-300">Transactions Tracked</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                        <div className="text-gray-600 dark:text-gray-300">Uptime</div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything you need to manage your finances
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            From expense tracking to budget management, SmartLedger provides all the tools you need to take control of your financial future.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`}>
                                            <Icon className={`h-6 w-6 ${feature.color}`} />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Why choose SmartLedger?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Built for modern users who want a comprehensive yet simple solution for personal finance management.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white">
                                <TrendingUp className="h-16 w-16 mb-6 opacity-20" />
                                <h3 className="text-2xl font-bold mb-4">Start Your Financial Journey</h3>
                                <p className="mb-6 opacity-90">
                                    Join thousands of users who have taken control of their finances with SmartLedger.
                                </p>
                                <Link to="/auth">
                                    <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                                        Get Started Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            What our users say
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Don't just take our word for it. Here's what real users think about SmartLedger.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                    <CardDescription className="text-base italic">
                                        "{testimonial.content}"
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gradient-to-r from-emerald-500 to-teal-500">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to take control of your finances?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Join SmartLedger today and start your journey to better financial health.
                    </p>
                    <Link to="/auth">
                        <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                            Start Free Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <span className="ml-3 text-xl font-bold text-white">
                                    SmartLedger
                                </span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                The modern way to track your finances and achieve your financial goals.
                            </p>
                            <p className="text-sm text-gray-500">
                                © 2025 SmartLedger. All rights reserved.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-white mb-4">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;