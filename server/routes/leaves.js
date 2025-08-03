const express = require('express');
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/leaves/apply
// @desc    Apply for leave
// @access  Private
router.post('/apply', [
  body('from').isISO8601().withMessage('From date must be a valid date'),
  body('to').isISO8601().withMessage('To date must be a valid date'),
  body('type').isIn(['sick', 'casual', 'annual', 'maternity', 'paternity', 'other']).withMessage('Invalid leave type'),
  body('reason').trim().isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { from, to, type, reason } = req.body;

    // Validate dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      return res.status(400).json({ message: 'From date cannot be in the past' });
    }

    if (toDate < fromDate) {
      return res.status(400).json({ message: 'To date cannot be before from date' });
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          from: { $lte: toDate },
          to: { $gte: fromDate }
        }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ message: 'You have an overlapping leave request' });
    }

    // Create leave request
    const leave = new Leave({
      user: req.user._id,
      from: fromDate,
      to: toDate,
      type,
      reason
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave: {
        id: leave._id,
        from: leave.from,
        to: leave.to,
        type: leave.type,
        reason: leave.reason,
        status: leave.status,
        totalDays: leave.totalDays
      }
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/me
// @desc    Get current user's leave history
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const { status, year } = req.query;
    let query = { user: req.user._id };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by year if provided
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.from = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const leaves = await Leave.find(query)
      .sort({ from: -1 })
      .populate('approvedBy', 'name');

    // Calculate summary
    const totalLeaves = leaves.length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;
    const totalDays = leaves.reduce((sum, l) => sum + (l.totalDays || 0), 0);

    res.json({
      leaves,
      summary: {
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        totalDays
      }
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/requests (Admin only)
// @desc    Get all leave requests for admin approval
// @access  Private (Admin)
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const { status, department } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name email department position')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    // Filter by department if provided
    let filteredLeaves = leaves;
    if (department) {
      filteredLeaves = leaves.filter(leave => leave.user.department === department);
    }

    res.json(filteredLeaves);
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leaves/approve/:id (Admin only)
// @desc    Approve or reject leave request
// @access  Private (Admin)
router.post('/approve/:id', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().trim()
], adminAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, rejectionReason } = req.body;
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId).populate('user', 'name email');
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }

    // Update leave status
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();

    if (status === 'rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    res.json({
      message: `Leave request ${status} successfully`,
      leave: {
        id: leave._id,
        user: leave.user,
        from: leave.from,
        to: leave.to,
        type: leave.type,
        status: leave.status,
        approvedBy: req.user.name,
        approvedAt: leave.approvedAt,
        rejectionReason: leave.rejectionReason
      }
    });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/:id
// @desc    Get specific leave request
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'name email department position')
      .populate('approvedBy', 'name');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can view this leave request
    if (req.user.role !== 'admin' && leave.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(leave);
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/leaves/:id
// @desc    Cancel leave request (only if pending)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can cancel this leave request
    if (leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel non-pending leave request' });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 