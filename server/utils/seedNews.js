const mongoose = require('mongoose');
const News = require('../models/News');
const User = require('../models/User');
require('dotenv').config();

// Empty news array - no mock data
const sampleNews = [];

const seedNews = async () => {
  try {
    // Clear existing news
    await News.deleteMany({});
    console.log('Existing news cleared');
    
    // No mock data to seed
    console.log('No mock news to seed');
    
  } catch (error) {
    console.error('Error seeding news:', error);
  }
};

module.exports = seedNews;