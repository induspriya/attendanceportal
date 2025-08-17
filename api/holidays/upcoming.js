const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Holiday = require('../models/Holiday');

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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get upcoming holidays
    const upcomingHolidays = await Holiday.find({
      date: { $gte: today },
      isActive: true
    })
    .sort({ date: 1 })
    .limit(10);

    res.status(200).json(upcomingHolidays);

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
