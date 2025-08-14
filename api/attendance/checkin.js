const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const Attendance = require('../../server/models/Attendance');
const User = require('../../server/models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Auth middleware
const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('Access denied. No token provided.');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token.');
  }
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const decoded = authenticateToken(req);
    const userId = decoded.userId;

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ 
        message: 'Already checked in today' 
      });
    }

    if (!attendance) {
      // Create new attendance record
      attendance = new Attendance({
        userId,
        date: today,
        checkInTime: now,
        status: 'present'
      });
    } else {
      // Update existing record
      attendance.checkInTime = now;
      attendance.status = 'present';
    }

    await attendance.save();

    res.status(200).json({
      message: 'Check-in successful',
      attendance
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  } finally {
    await mongoose.disconnect();
  }
};
