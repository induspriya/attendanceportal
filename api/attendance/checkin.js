const jwt = require('jsonwebtoken');

// In-memory storage for mock attendance data (in production, this would be a database)
let mockAttendanceData = new Map();

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

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Create a unique key for today's attendance
    const todayKey = `${userId}_${today.toISOString().split('T')[0]}`;

    // Check if already checked in today
    if (mockAttendanceData.has(todayKey)) {
      const existingAttendance = mockAttendanceData.get(todayKey);
      if (existingAttendance.checkInTime) {
        return res.status(400).json({ 
          message: 'Already checked in today',
          attendance: existingAttendance
        });
      }
    }

    // Create or update attendance record
    const attendance = {
      _id: todayKey,
      userId,
      date: today,
      checkInTime: now,
      checkOutTime: null,
      status: 'present',
      totalHours: null
    };

    // Store in mock data
    mockAttendanceData.set(todayKey, attendance);

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
  }
};
