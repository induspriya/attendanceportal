const mongoose = require('mongoose');
const User = require('../models/User');

// Empty users array - no mock data
const users = [];

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared');
    
    // No mock data to seed
    console.log('No mock users to seed');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

module.exports = seedUsers;
