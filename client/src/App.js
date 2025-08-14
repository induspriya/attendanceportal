import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Holidays from './pages/Holidays';
import News from './pages/News';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLeaves from './pages/AdminLeaves';
import AdminHolidays from './pages/AdminHolidays';
import AdminNews from './pages/AdminNews';
import ManagerLeaves from './pages/ManagerLeaves';
import HRLeaves from './pages/HRLeaves';
import HR from './pages/HR';
import Administration from './pages/Administration';
import Policies from './pages/Policies';

// Components
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log additional error details
    if (error.message && error.message.includes('insertBefore')) {
      console.error('DOM manipulation error detected - this usually means a component was unmounted during rendering');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The app encountered an error and couldn't continue. This might be due to a component loading issue.
            </p>
            {this.state.error && (
              <details className="text-left mb-4 p-3 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reload App
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('=== PROTECTED ROUTE CHECK ===');
  console.log('ProtectedRoute: user =', user);
  console.log('ProtectedRoute: loading =', loading);
  console.log('ProtectedRoute: adminOnly =', adminOnly);
  console.log('ProtectedRoute: user?.role =', user?.role);

  // Show loading spinner only during initial load
  if (loading && !isAuthenticated) {
    console.log('ProtectedRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (!user && !loading) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    console.log('ProtectedRoute: User not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Access granted, rendering children');
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('=== PUBLIC ROUTE CHECK ===');
  console.log('PublicRoute: user =', user);
  console.log('PublicRoute: loading =', loading);

  // Show loading spinner only during initial load
  if (loading && !isAuthenticated) {
    console.log('PublicRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (user && !loading) {
    console.log('PublicRoute: User already logged in, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PublicRoute: No user, rendering login/signup');
  return children;
};

function AppRoutes() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password/:token" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute>
            <Layout>
              <Attendance />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/leaves" element={
          <ProtectedRoute>
            <Layout>
              <Leaves />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/holidays" element={
          <Layout>
            <Holidays />
          </Layout>
        } />
        
        <Route path="/news" element={
          <Layout>
            <News />
          </Layout>
        } />
        
        <Route path="/policies" element={
          <Layout>
            <Policies />
          </Layout>
        } />
        
        {/* Manager Routes */}
        <Route path="/manager/leaves" element={
          <ProtectedRoute>
            <Layout>
              <ManagerLeaves />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* HR Routes */}
        <Route path="/hr/leaves" element={
          <ProtectedRoute>
            <Layout>
              <HRLeaves />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/hr" element={
          <ProtectedRoute>
            <Layout>
              <HR />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Test HR Route */}
        <Route path="/test-hr" element={
          <Layout>
            <HR />
          </Layout>
        } />
        
        <Route path="/administration" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <Administration />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/leaves" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminLeaves />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/holidays" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminHolidays />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/news" element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminNews />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure everything is properly initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Attendance Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 