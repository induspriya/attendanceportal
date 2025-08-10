import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [error, setError] = useState(null);

  // Mock user data for testing
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Developer'
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      role: 'manager',
      department: 'Engineering',
      position: 'Team Lead'
    },
    {
      id: '4',
      name: 'HR Manager',
      email: 'hr@example.com',
      password: 'hr123',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager'
    }
  ];

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check authentication status on app load
  useEffect(() => {
    console.log('=== AUTH CONTEXT INITIALIZATION ===');
    console.log('AuthContext: useEffect triggered');
    console.log('AuthContext: mockUsers available:', mockUsers.length);
    
    const checkAuthStatus = async () => {
      try {
        console.log('AuthContext: Starting auth check...');
        const storedToken = localStorage.getItem('token');
        console.log('AuthContext: Stored token:', storedToken);
        
        if (storedToken) {
          console.log('AuthContext: Token found, checking validity...');
          
          // Try real API first
          try {
            console.log('AuthContext: Attempting real API auth check...');
            const response = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            
            console.log('AuthContext: Real API auth check successful:', response.data);
            setUser(response.data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          } catch (apiError) {
            console.log('AuthContext: Real API auth check failed:', apiError.message);
            
            // Check if it's a mock token
            if (storedToken.startsWith('mock_')) {
              console.log('AuthContext: Mock token detected, finding user...');
              const userId = storedToken.replace('mock_', '');
              const mockUser = mockUsers.find(u => u.id === userId);
              
              if (mockUser) {
                console.log('AuthContext: Mock user found:', mockUser);
                const { password: _, ...userData } = mockUser;
                setUser(userData);
                setToken(storedToken);
                setIsAuthenticated(true);
                setLoading(false);
                console.log('AuthContext: Mock auth restored successfully');
                return;
              }
            }
            
            console.log('AuthContext: Invalid token, clearing...');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          console.log('AuthContext: No stored token found');
          setIsAuthenticated(false);
        }
        
        console.log('AuthContext: Setting loading to false, no valid auth');
        setLoading(false);
      } catch (error) {
        console.error('AuthContext: Error during auth check:', error);
        setLoading(false);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []); // Remove mockUsers dependency to fix warning

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = 'https://attendance-portal-5gh2wpldx-induspriyas-projects.vercel.app/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(response.data.user);
        setToken(token);
        setIsAuthenticated(true);
        
        return { success: true, user: response.data.user };
      } else {
        setError('Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = 'https://attendance-portal-5gh2wpldx-induspriyas-projects.vercel.app/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      const response = await api.post('/auth/signup', userData);
      
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(response.data.user);
        setToken(token);
        setIsAuthenticated(true);
        
        return { success: true, user: response.data.user };
      } else {
        setError('Signup failed');
        return { success: false, error: 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = 'https://attendance-portal-5gh2wpldx-induspriyas-projects.vercel.app/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = 'https://attendance-portal-5gh2wpldx-induspriyas-projects.vercel.app/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      await api.post('/auth/reset-password', { token, password });
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 