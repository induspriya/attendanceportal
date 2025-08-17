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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mock upcoming holidays data
    const mockUpcomingHolidays = [
      {
        _id: 'hol_1',
        name: 'New Year\'s Day',
        date: new Date(today.getFullYear() + 1, 0, 1), // January 1st next year
        description: 'New Year\'s Day celebration',
        isActive: true
      },
      {
        _id: 'hol_2',
        name: 'Independence Day',
        date: new Date(today.getFullYear(), 7, 15), // August 15th this year
        description: 'National Independence Day',
        isActive: true
      },
      {
        _id: 'hol_3',
        name: 'Christmas',
        date: new Date(today.getFullYear(), 11, 25), // December 25th this year
        description: 'Christmas celebration',
        isActive: true
      },
      {
        _id: 'hol_4',
        name: 'Republic Day',
        date: new Date(today.getFullYear(), 0, 26), // January 26th this year
        description: 'Republic Day celebration',
        isActive: true
      }
    ];

    // Filter holidays that are today or in the future
    const upcomingHolidays = mockUpcomingHolidays.filter(holiday => 
      holiday.date >= today
    ).sort((a, b) => a.date - b.date);

    res.status(200).json(upcomingHolidays);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
