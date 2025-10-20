import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { signUp, signIn } from '../lib/supabase';
import axiosInstance from '../lib/axios';
import { AuthContext } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import SEO from './SEO';

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!isLogin) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      let authData;
      let userProfile;

      if (isLogin) {
        // Sign in with Supabase Auth
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          throw new Error(error.message || 'Invalid email or password');
        }

        authData = data;
        
        // Get the access token
        const accessToken = data.session?.access_token;
        
        if (!accessToken) {
          throw new Error('Failed to get access token');
        }

        // Fetch user profile from backend
        const response = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        userProfile = response.data;
        
        // Store token and login
        login(accessToken, userProfile);
        toast.success('Welcome back!');
        
      } else {
        // Sign up with Supabase Auth
        const { data, error } = await signUp(
          formData.email, 
          formData.password, 
          formData.full_name
        );
        
        if (error) {
          // Handle common Supabase Auth errors
          if (error.message.includes('already registered') || error.message.includes('already exists')) {
            throw new Error('Email already registered');
          } else if (error.message.includes('Password should be at least')) {
            throw new Error('Password must be at least 6 characters');
          } else {
            throw new Error(error.message || 'Failed to create account');
          }
        }

        authData = data;
        
        // Get the access token
        const accessToken = data.session?.access_token;
        
        if (!accessToken) {
          throw new Error('Account created but failed to get access token. Please try signing in.');
        }

        // Create user profile via backend
        try {
          const response = await axiosInstance.post('/auth/register', {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name
          });
          
          userProfile = response.data.user;
        } catch (backendError) {
          // If backend fails, fetch the profile instead
          console.warn('Backend registration failed, fetching profile:', backendError);
          const response = await axiosInstance.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          userProfile = response.data;
        }
        
        // Store token and login
        login(accessToken, userProfile);
        toast.success('Account created successfully! Welcome to SmartLedger!');
      }
      
    } catch (error) {
      const message = error.message || 'Something went wrong. Please try again.';
      toast.error(message);
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ 
      full_name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex">
      <SEO 
        title={isLogin ? "Sign In - SmartLedger" : "Create Account - SmartLedger"}
        description={isLogin 
          ? "Sign in to your SmartLedger account to manage your finances, track expenses, and monitor budgets." 
          : "Create your SmartLedger account and start taking control of your personal finances today. Track expenses, set budgets, and achieve financial goals."
        }
        canonical="/auth"
      />
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-emerald p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">SmartLedger</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Track Smarter.<br />
            Spend Better.
          </h2>
          
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Take control of your finances with intelligent budget tracking, 
            expense insights, and powerful analytics.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time expense tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Smart budget management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Beautiful analytics & insights</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">SmartLedger</h1>
            </div>
            <p className="text-muted-foreground">Track Smarter. Spend Better.</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to your SmartLedger account' 
                  : 'Start your financial journey today'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`pl-10 ${errors.full_name ? 'border-red-500 focus:border-red-500' : ''}`}
                        required={!isLogin}
                      />
                    </div>
                    {errors.full_name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                    {!isLogin && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (8+ chars, uppercase, lowercase, number)
                      </span>
                    )}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center">
                <button
                  onClick={toggleMode}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin 
                    ? "Don't have an account? " 
                    : "Already have an account? "
                  }
                  <span className="text-primary font-medium">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;