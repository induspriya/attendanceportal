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

    // Mock attendance data for testing
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mockAttendance = [
      {
        _id: 'att_1',
        userId,
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        checkInTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9 AM
        checkOutTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 PM
        status: 'present',
        totalHours: 8
      },
      {
        _id: 'att_2',
        userId,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        checkInTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 AM
        checkOutTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 4 PM
        status: 'present',
        totalHours: 8
      },
      {
        _id: 'att_3',
        userId,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        checkInTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9 AM
        checkOutTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 PM
        status: 'present',
        totalHours: 8
      }
    ];

    const todayAttendance = {
      _id: 'att_today',
      userId,
      date: today,
      checkInTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
      checkOutTime: null,
      status: 'present',
      totalHours: null
    };

    res.status(200).json({
      attendance: mockAttendance,
      todayAttendance
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
