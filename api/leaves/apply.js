const jwt = require('jsonwebtoken');

// In-memory storage for mock leave data
let mockLeaveData = new Map();
let leaveCounter = 1;

// Auth middleware
const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('Access denied. No token provided.');
  }
  
  try {
    // For now, accept any token for testing
    return { userId: 'test_user_123' };
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
    const decoded = authenticateToken(req);
    const userId = decoded.userId;

    const { startDate, endDate, reason, type } = req.body;

    if (!startDate || !endDate || !reason || !type) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Create new leave application
    const leave = {
      _id: `leave_${leaveCounter++}`,
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      type,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in mock data
    mockLeaveData.set(leave._id, leave);

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
