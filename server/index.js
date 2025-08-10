const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');
const holidayRoutes = require('./routes/holidays');
const newsRoutes = require('./routes/news');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app',
        'https://attendance-portal.vercel.app',
        'https://attendance-portal-kmfkmwmma-induspriyas-projects.vercel.app',
        'https://attendance-portal-4g3lquqet-induspriyas-projects.vercel.app',
        'https://attendance-portal-fcjuie5ug-induspriyas-projects.vercel.app',
        'https://attendance-portal-gq0i990oc-induspriyas-projects.vercel.app',
        'https://attendance-portal-3dhx5gi4t-induspriyas-projects.vercel.app',
        'https://attendance-portal-cbbmvwciu-induspriyas-projects.vercel.app',
        'https://attendance-portal-nvl4hdl1s-induspriyas-projects.vercel.app',
        /^https:\/\/attendance-portal-.*-induspriyas-projects\.vercel\.app$/
      ]
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/news', newsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Attendance Portal API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'OK', message: 'API is accessible' });
});

// Environment check endpoint
app.get('/api/env', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Environment check',
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Environment check failed',
      error: error.message 
    });
  }
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection test',
      dbState: states[dbState],
      dbStateCode: dbState
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database test failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 