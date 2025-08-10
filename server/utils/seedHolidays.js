const mongoose = require('mongoose');
const Holiday = require('../models/Holiday');

// Empty holidays array - no mock data
const holidays = [];

const addSundays = () => {
  // Function to add Sundays as holidays (optional)
  // Currently disabled to remove mock data
};

const seedHolidays = async () => {
  try {
    // Clear existing holidays
    await Holiday.deleteMany({});
    console.log('Existing holidays cleared');
    
    // No mock data to seed
    console.log('No mock holidays to seed');
    
  } catch (error) {
    console.error('Error seeding holidays:', error);
  }
};

module.exports = seedHolidays; 