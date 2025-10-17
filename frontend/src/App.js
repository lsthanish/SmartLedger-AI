import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import axios from 'axios';

// Components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Analytics from './components/Analytics';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Auth context
export const AuthContext = React.createContext();

function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' || false;
    });

    // Apply dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    // Set axios authorization header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check authentication on app load
    useEffect(() => {
        const checkAuth = async() => {
            if (token) {
                try {
                    const response = await axios.get('/api/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (loading) {
        return ( <
            div className = "flex items-center justify-center min-h-screen" >
            <
            div className = "animate-spin rounded-full h-32 w-32 border-b-2 border-primary" > < /div> <
            /div>
        );
    }

    const authContextValue = {
        user,
        token,
        login,
        logout,
        darkMode,
        toggleDarkMode,
    };

    return ( <
            HelmetProvider >
            <
            AuthContext.Provider value = { authContextValue } >
            <
            Router >
            <
            div className = "App" >
            <
            Routes > { /* Public routes */ } <
            Route path = "/"
            element = { user ? < Navigate to = "/dashboard" / > : < LandingPage / > }
            /> <
            Route path = "/auth"
            element = { user ? < Navigate to = "/dashboard" / > : < AuthPage / > }
            />

            { /* Protected routes */ } <
            Route path = "/dashboard"
            element = {
                user ? < Layout > < Dashboard / > < /Layout> : <Navigate to="/auth
                " />}  /
                >
                <
                Route
                path = "/transactions"
                element = {
                    user ? < Layout > < Transactions / > < /Layout> : <Navigate to="/auth
                    " />}  /
                    >
                    <
                    Route
                    path = "/budgets"
                    element = {
                        user ? < Layout > < Budgets / > < /Layout> : <Navigate to="/auth
                        " />}  /
                        >
                        <
                        Route
                        path = "/analytics"
                        element = {
                            user ? < Layout > < Analytics / > < /Layout> : <Navigate to="/auth
                            " />}  /
                            >

                            { /* Catch all route */ } <
                            Route path = "*"
                            element = { < Navigate to = "/" / > }
                            /> <
                            /Routes>

                            { /* Toast notifications */ } <
                            Toaster
                            position = "top-right"
                            richColors
                            closeButton
                            theme = { darkMode ? 'dark' : 'light' }
                            /> <
                            /div> <
                            /Router> <
                            /AuthContext.Provider> <
                            /HelmetProvider>
                        );
                    }

                    export default App;