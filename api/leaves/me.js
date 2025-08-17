const jwt = require('jsonwebtoken');

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = authenticateToken(req);
    const userId = decoded.userId;

    // Mock leave data for testing
    const mockLeaves = [
      {
        _id: 'leave_1',
        userId,
        type: 'Annual Leave',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        reason: 'Family vacation',
        status: 'approved',
        approvedBy: 'Manager',
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        days: 3
      },
      {
        _id: 'leave_2',
        userId,
        type: 'Sick Leave',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        reason: 'Not feeling well',
        status: 'approved',
        approvedBy: 'HR',
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        days: 1
      },
      {
        _id: 'leave_3',
        userId,
        type: 'Personal Leave',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        reason: 'Personal appointment',
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        days: 1
      }
    ];

    res.status(200).json(mockLeaves);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
