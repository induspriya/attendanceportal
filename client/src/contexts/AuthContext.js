import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [stableLoading, setStableLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const hasInitialized = useRef(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Debounce loading state to prevent flickering
  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setTimeout(() => {
      if (isMounted) {
        setStableLoading(loading);
      }
    }, 100); // 100ms delay to prevent rapid changes

    return () => clearTimeout(timer);
  }, [loading, isMounted]);

  // Mock user data for testing
  const mockUsers = useMemo(() => [
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
  ], []);

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
    
    // Prevent multiple initializations using ref
    if (hasInitialized.current) {
      console.log('AuthContext: Already initialized, skipping...');
      return;
    }
    
    hasInitialized.current = true;
    
    // Simple development bypass without async operations
    if (true || process.env.NODE_ENV === 'development') {
      console.log('AuthContext: Development mode - setting default user for testing');
      
      // Set all state in one synchronous operation
      const defaultUser = {
        id: 'dev_user',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'employee',
        department: 'Development',
        position: 'Developer'
      };
      
      if (isMounted) {
        try {
          // Batch state updates to prevent multiple re-renders
          setUser(defaultUser);
          setToken('dev_mock_token');
          setIsAuthenticated(true);
          setLoading(false);
          setIsInitialized(true);
        } catch (err) {
          console.error('AuthContext: Error setting state:', err);
        }
      }
      return;
    }

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
            if (isMounted) {
              setUser(response.data.user);
              setToken(storedToken);
              setIsAuthenticated(true);
              setLoading(false);
              setIsInitialized(true);
            }
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
                if (isMounted) {
                  setUser(userData);
                  setToken(storedToken);
                  setIsAuthenticated(true);
                  setLoading(false);
                  setIsInitialized(true);
                }
                console.log('AuthContext: Mock auth restored successfully');
                return;
              }
            }
            
            console.log('AuthContext: Invalid token, clearing...');
            if (isMounted) {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          }
        } else {
          console.log('AuthContext: No stored token found');
          if (isMounted) {
            setIsAuthenticated(false);
          }
        }
        
        console.log('AuthContext: Setting loading to false, no valid auth');
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('AuthContext: Error during auth check:', error);
        if (isMounted) {
          setLoading(false);
          setIsAuthenticated(false);
          setIsInitialized(true);
        }
      }
    };

    // Only run auth check once on mount and only if not initialized
    if (loading && !isInitialized) {
      checkAuthStatus();
    }

    // Cleanup function
    return () => {
      hasInitialized.current = false;
    };
  }, [isInitialized]); // Only depend on isInitialized

  const login = async (email, password) => {
    try {
      // Prevent multiple simultaneous login attempts
      if (loading) return { success: false, error: 'Login already in progress' };
      
      setLoading(true);
      setError(null);
      
      // TEMPORARY DEVELOPMENT BYPASS - Remove this in production
      if (true || process.env.NODE_ENV === 'development') { // Force development mode for now
        console.log('AuthContext: Development mode login bypass');
        const devUser = {
          id: 'dev_user',
          name: 'Development User',
          email: 'dev@test.com',
          role: 'employee',
          department: 'Development',
          position: 'Developer'
        };
        const mockToken = 'dev_mock_token_' + Date.now();
        
        localStorage.setItem('token', mockToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        if (isMounted) {
          setUser(devUser);
          setToken(mockToken);
          setIsAuthenticated(true);
          setLoading(false);
        }
        
        return { success: true, user: devUser };
      }

      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        if (isMounted) {
          setUser(response.data.user);
          setToken(token);
          setIsAuthenticated(true);
        }
        
        return { success: true, user: response.data.user };
      } else {
        if (isMounted) {
          setError('Login failed');
        }
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      if (isMounted) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const signup = async (userData) => {
    try {
      // Prevent multiple simultaneous signup attempts
      if (loading) return { success: false, error: 'Signup already in progress' };
      
      setLoading(true);
      setError(null);
      
      // TEMPORARY DEVELOPMENT BYPASS - Remove this in production
      if (true || process.env.NODE_ENV === 'development') { // Force development mode for now
        console.log('AuthContext: Development mode signup bypass');
        const devUser = {
          id: 'dev_user',
          name: 'Development User',
          email: 'dev@test.com',
          role: 'employee',
          department: 'Development',
          position: 'Developer'
        };
        const mockToken = 'dev_mock_token_' + Date.now();
        
        localStorage.setItem('token', mockToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        if (isMounted) {
          setUser(devUser);
          setToken(mockToken);
          setIsAuthenticated(true);
          setLoading(false);
        }
        
        return { success: true, user: devUser };
      }

      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      const response = await api.post('/auth/signup', userData);
      
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        if (isMounted) {
          setUser(response.data.user);
          setToken(token);
          setIsAuthenticated(true);
        }
        
        return { success: true, user: response.data.user };
      } else {
        if (isMounted) {
          setError('Signup failed');
        }
        return { success: false, error: 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed';
      if (isMounted) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const logout = () => {
    // Prevent logout during loading
    if (loading) return;
    
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
      // Prevent multiple simultaneous requests
      if (loading) return { success: false, error: 'Request already in progress' };
      
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      if (isMounted) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const resetPassword = async (token, password) => {
    try {
      // Prevent multiple simultaneous requests
      if (loading) return { success: false, error: 'Request already in progress' };
      
      setLoading(true);
      setError(null);
      
      // Set base URL for API calls
      if (process.env.NODE_ENV === 'production') {
        api.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
      } else {
        api.defaults.baseURL = 'http://localhost:5001/api';
      }

      await api.post('/auth/reset-password', { token, password });
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      if (isMounted) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const updateUser = (updatedUser) => {
    // Prevent updates during loading
    if (loading) return;
    
    setUser(updatedUser);
  };

  const value = {
    user,
    loading: stableLoading, // Use stable loading to prevent flickering
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    error,
    isInitialized,
    rawLoading: loading // Expose raw loading state for internal use
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 