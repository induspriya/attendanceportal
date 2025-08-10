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

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  console.log('=== PROTECTED ROUTE CHECK ===');
  console.log('ProtectedRoute: user =', user);
  console.log('ProtectedRoute: loading =', loading);
  console.log('ProtectedRoute: adminOnly =', adminOnly);
  console.log('ProtectedRoute: user?.role =', user?.role);

  if (loading) {
    console.log('ProtectedRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('ProtectedRoute: User not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Access granted, rendering children');
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('=== PUBLIC ROUTE CHECK ===');
  console.log('PublicRoute: user =', user);
  console.log('PublicRoute: loading =', loading);

  if (loading) {
    console.log('PublicRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (user) {
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
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
  );
}

export default App; 