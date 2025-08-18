const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Added missing import for mongoose

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if this is a mock token (for development/testing)
    if (token.includes('mock_signature_')) {
      console.log('Mock token detected, processing...');
      
      // Extract user info from mock token
      const mockUserId = token.split('mock_signature_')[1];
      console.log('Mock user ID:', mockUserId);
      
      // Create a mock user object for development with proper structure
      const mockUser = {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Use a valid ObjectId
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'employee',
        isActive: true,
        department: 'Development',
        position: 'Developer',
        // Add methods that might be expected
        save: () => Promise.resolve(mockUser),
        toObject: () => mockUser
      };
      
      req.user = mockUser;
      console.log('Mock user set in request:', mockUser);
      return next();
    }

    // Handle real JWT tokens
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid JWT token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, adminAuth }; 