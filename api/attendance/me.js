const jwt = require('jsonwebtoken');

// In-memory storage for mock attendance data
let mockAttendanceData = new Map();

// Initialize with some sample data
const initializeMockData = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  // Add sample data if none exists
  if (mockAttendanceData.size === 0) {
    mockAttendanceData.set('test_user_123_' + yesterday.toISOString().split('T')[0], {
      _id: 'att_1',
      userId: 'test_user_123',
      date: yesterday,
      checkInTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      checkOutTime: new Date(yesterday.getTime() + 17 * 60 * 60 * 1000), // 5 PM
      status: 'present',
      totalHours: 8
    });

    mockAttendanceData.set('test_user_123_' + twoDaysAgo.toISOString().split('T')[0], {
      _id: 'att_2',
      userId: 'test_user_123',
      date: twoDaysAgo,
      checkInTime: new Date(twoDaysAgo.getTime() + 8 * 60 * 60 * 1000), // 8 AM
      checkOutTime: new Date(twoDaysAgo.getTime() + 16 * 60 * 60 * 1000), // 4 PM
      status: 'present',
      totalHours: 8
    });

    mockAttendanceData.set('test_user_123_' + threeDaysAgo.toISOString().split('T')[0], {
      _id: 'att_3',
      userId: 'test_user_123',
      date: threeDaysAgo,
      checkInTime: new Date(threeDaysAgo.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      checkOutTime: new Date(threeDaysAgo.getTime() + 17 * 60 * 60 * 1000), // 5 PM
      status: 'present',
      totalHours: 8
    });
  }
};

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

// Handle check-in functionality
const handleCheckIn = (userId, today) => {
  const todayKey = `${userId}_${today.toISOString().split('T')[0]}`;
  
  // Check if already checked in today
  if (mockAttendanceData.has(todayKey)) {
    const existingAttendance = mockAttendanceData.get(todayKey);
    if (existingAttendance.checkInTime) {
      return existingAttendance; // Already checked in
    }
  }

  // Create new attendance record
  const now = new Date();
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
  return attendance;
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
    // Initialize mock data
    initializeMockData();
    
    const decoded = authenticateToken(req);
    const userId = decoded.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Handle check-in if requested via query parameter
    if (req.query.action === 'checkin') {
      const todayAttendance = handleCheckIn(userId, today);
      if (todayAttendance.checkInTime) {
        return res.status(200).json({
          message: 'Check-in successful',
          attendance: todayAttendance
        });
      }
    }
    
    // Get all attendance records for the user
    const attendance = Array.from(mockAttendanceData.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.date - a.date)
      .slice(0, 30);

    // Get today's attendance
    const todayKey = `${userId}_${today.toISOString().split('T')[0]}`;
    const todayAttendance = mockAttendanceData.get(todayKey) || {
      _id: 'att_today',
      userId,
      date: today,
      checkInTime: null,
      checkOutTime: null,
      status: 'absent',
      totalHours: null
    };

    res.status(200).json({
      attendance,
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
