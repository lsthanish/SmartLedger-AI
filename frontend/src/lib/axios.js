import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = (error.response && error.response.data && error.response.data.detail) || error.message || 'Something went wrong';
        // Network error
        if (!error.response) {
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        // Server error
        if (error.response.status >= 500) {
            console.error('Server error:', error);
            return Promise.reject(new Error('Server error. Please try again later.'));
        }
        // Auth error
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth';
            return Promise.reject(new Error('Session expired. Please login again.'));
        }
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;