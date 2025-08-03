const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/attendance/mark
// @desc    Mark attendance (check-in/check-out)
// @access  Private
router.post('/mark', [
  body('type').isIn(['check-in', 'check-out']).withMessage('Type must be check-in or check-out'),
  body('location').optional().trim()
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, location = 'Office' } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find existing attendance record for today
    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      // Create new attendance record
      attendance = new Attendance({
        user: req.user._id,
        date: today,
        checkIn: type === 'check-in' ? {
          time: new Date(),
          location
        } : undefined,
        checkOut: type === 'check-out' ? {
          time: new Date(),
          location
        } : undefined
      });
    } else {
      // Update existing record
      if (type === 'check-in') {
        if (attendance.checkIn.time) {
          return res.status(400).json({ message: 'Already checked in today' });
        }
        attendance.checkIn = {
          time: new Date(),
          location
        };
      } else if (type === 'check-out') {
        if (!attendance.checkIn.time) {
          return res.status(400).json({ message: 'Please check in first' });
        }
        if (attendance.checkOut.time) {
          return res.status(400).json({ message: 'Already checked out today' });
        }
        attendance.checkOut = {
          time: new Date(),
          location
        };
      }
    }

    await attendance.save();

    res.json({
      message: `${type} marked successfully`,
      attendance: {
        id: attendance._id,
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        totalHours: attendance.totalHours,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/me
// @desc    Get current user's attendance records
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user._id };

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    } else {
      // Default to current month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('user', 'name email');

    // Calculate summary statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    res.json({
      attendance,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        totalHours: Math.round(totalHours * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
// @access  Private
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        canCheckIn: true,
        canCheckOut: false,
        today: today
      });
    }

    res.json({
      checkedIn: !!attendance.checkIn.time,
      checkedOut: !!attendance.checkOut.time,
      canCheckIn: !attendance.checkIn.time,
      canCheckOut: attendance.checkIn.time && !attendance.checkOut.time,
      checkInTime: attendance.checkIn.time,
      checkOutTime: attendance.checkOut.time,
      totalHours: attendance.totalHours,
      status: attendance.status,
      today: today
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/all (Admin only)
// @desc    Get all users' attendance records
// @access  Private (Admin)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { date, department } = req.query;
    let query = {};

    // Filter by date if provided
    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      query.date = {
        $gte: filterDate,
        $lt: new Date(filterDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    // Filter by department if provided
    if (department) {
      query['user.department'] = department;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'name email department position')
      .sort({ date: -1, 'user.name': 1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 