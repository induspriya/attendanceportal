const mongoose = require('mongoose');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      res.json({ 
        status: 'OK', 
        message: 'MongoDB is connected',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({ 
        status: 'WARNING', 
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
