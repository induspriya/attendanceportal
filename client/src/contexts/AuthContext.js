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
    // Set base URL for API calls - use relative URLs for production
    // This will automatically use the same domain as the frontend
    if (process.env.NODE_ENV === 'production') {
      // In production, use relative URLs so it works with any deployment URL
      api.defaults.baseURL = '';
    } else {
      // In development, use localhost
      api.defaults.baseURL = 'http://localhost:5001';
    }
    
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
      console.log('AuthContext: Starting auth check...');
      const storedToken = localStorage.getItem('token');
      console.log('AuthContext: Stored token:', storedToken);
      
      if (storedToken) {
        console.log('AuthContext: Token found, checking validity...');
        
        // Try real API first
        try {
          console.log('AuthContext: Attempting real API auth check...');
          const response = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          console.log('AuthContext: Real API auth check successful:', response.data);
          setUser(response.data.user);
          setToken(storedToken);
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
              setLoading(false);
              console.log('AuthContext: Mock auth restored successfully');
              return;
            }
          }
          
          console.log('AuthContext: Invalid token, clearing...');
          localStorage.removeItem('token');
        }
      } else {
        console.log('AuthContext: No stored token found');
      }
      
      console.log('AuthContext: Setting loading to false, no valid auth');
      setLoading(false);
    };

    checkAuthStatus();
  }, []); // Remove mockUsers dependency to fix warning

  const login = async (email, password) => {
    try {
      console.log('=== AUTH CONTEXT LOGIN START ===');
      console.log('AuthContext: Making login request...');
      console.log('AuthContext: Login credentials - email:', email, 'password:', password);
      
      // Try real API first
      try {
        const response = await api.post('/api/auth/login', { email, password });
        console.log('AuthContext: Login response:', response.data);
        
        const { token: newToken, user: userData } = response.data;
        
        console.log('AuthContext: Setting token and user...');
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        
        console.log('AuthContext: Login successful, user state updated');
        console.log('AuthContext: New token:', newToken);
        console.log('AuthContext: New user:', userData);
        toast.success('Login successful!');
        return { success: true };
      } catch (apiError) {
        console.log('API login failed, using mock authentication:', apiError.message);
        
        // Fallback to mock authentication
        console.log('AuthContext: Searching for mock user...');
        console.log('AuthContext: Available mock users:', mockUsers.map(u => ({ email: u.email, role: u.role })));
        
        const mockUser = mockUsers.find(u => u.email === email && u.password === password);
        console.log('AuthContext: Mock user search result:', mockUser);
        
        if (mockUser) {
          const { password: _, ...userData } = mockUser;
          const mockToken = `mock_${mockUser.id}`;
          
          console.log('AuthContext: Mock user found:', userData);
          console.log('AuthContext: Setting mock token:', mockToken);
          console.log('AuthContext: User role:', userData.role);
          console.log('AuthContext: User role type:', typeof userData.role);
          console.log('AuthContext: User role === "employee":', userData.role === 'employee');
          console.log('AuthContext: User role === "manager":', userData.role === 'manager');
          console.log('AuthContext: User role === "admin":', userData.role === 'admin');
          
          localStorage.setItem('token', mockToken);
          setToken(mockToken);
          setUser(userData);
          
          console.log('AuthContext: Mock login successful, user state updated');
          console.log('AuthContext: Mock token set:', mockToken);
          console.log('AuthContext: Mock user set:', userData);
          console.log('AuthContext: Current user state after setUser:', userData);
          toast.success('Login successful! (Mock Mode)');
          return { success: true };
        } else {
          console.log('AuthContext: No mock user found for credentials');
          console.log('AuthContext: Email provided:', email);
          console.log('AuthContext: Password provided:', password);
          toast.error('Invalid email or password');
          return { success: false, error: 'Invalid email or password' };
        }
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      console.log('=== AUTH CONTEXT LOGIN END ===');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.post('/api/auth/reset-password', { token, password });
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
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
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 