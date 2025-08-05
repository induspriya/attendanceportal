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
      .populate('user', 'name email department position manager')
      .populate('managerApproval.approvedBy', 'name')
      .populate('hrApproval.approvedBy', 'name')
      .populate('finalApprovedBy', 'name')
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

// @route   GET /api/leaves/pending-manager (Manager only)
// @desc    Get pending leave requests for manager approval
// @access  Private (Manager)
router.get('/pending-manager', auth, async (req, res) => {
  try {
    // Find users who have this user as their manager
    const managedUsers = await User.find({ manager: req.user._id }).select('_id');
    const managedUserIds = managedUsers.map(user => user._id);

    const leaves = await Leave.find({
      user: { $in: managedUserIds },
      'managerApproval.status': 'pending'
    })
      .populate('user', 'name email department position')
      .populate('managerApproval.approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Get pending manager approvals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/pending-hr (HR only)
// @desc    Get pending leave requests for HR approval
// @access  Private (HR)
router.get('/pending-hr', auth, async (req, res) => {
  try {
    // Check if user is HR or admin
    if (req.user.role !== 'hr' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only HR can view pending HR approvals.' });
    }

    const leaves = await Leave.find({
      'hrApproval.status': 'pending',
      'managerApproval.status': 'approved'
    })
      .populate('user', 'name email department position')
      .populate('managerApproval.approvedBy', 'name')
      .populate('hrApproval.approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Get pending HR approvals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leaves/manager-approve/:id (Manager only)
// @desc    Manager approval for leave request
// @access  Private (Manager)
router.post('/manager-approve/:id', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().trim(),
  body('comments').optional().trim()
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, rejectionReason, comments } = req.body;
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId)
      .populate('user', 'name email department manager')
      .populate('managerApproval.approvedBy', 'name');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user is the manager of the leave requester
    if (leave.user.manager?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only the assigned manager can approve this request.' });
    }

    if (leave.managerApproval.status !== 'pending') {
      return res.status(400).json({ message: 'Manager approval has already been processed' });
    }

    // Update manager approval
    leave.managerApproval.status = status;
    leave.managerApproval.approvedBy = req.user._id;
    leave.managerApproval.approvedAt = new Date();
    leave.managerApproval.comments = comments;

    if (status === 'rejected' && rejectionReason) {
      leave.managerApproval.rejectionReason = rejectionReason;
      leave.status = 'manager_rejected';
    } else if (status === 'approved') {
      leave.status = 'manager_approved';
    }

    await leave.save();

    res.json({
      message: `Manager ${status} the leave request`,
      leave: {
        id: leave._id,
        user: leave.user,
        from: leave.from,
        to: leave.to,
        type: leave.type,
        status: leave.status,
        managerApproval: leave.managerApproval
      }
    });
  } catch (error) {
    console.error('Manager approve leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leaves/hr-approve/:id (HR only)
// @desc    HR approval for leave request
// @access  Private (HR)
router.post('/hr-approve/:id', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().trim(),
  body('comments').optional().trim()
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, rejectionReason, comments } = req.body;
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId)
      .populate('user', 'name email department')
      .populate('hrApproval.approvedBy', 'name');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user is HR or admin
    if (req.user.role !== 'hr' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only HR can approve this request.' });
    }

    if (leave.hrApproval.status !== 'pending') {
      return res.status(400).json({ message: 'HR approval has already been processed' });
    }

    // Check if manager has approved first
    if (leave.managerApproval.status !== 'approved') {
      return res.status(400).json({ message: 'Manager approval is required before HR approval' });
    }

    // Update HR approval
    leave.hrApproval.status = status;
    leave.hrApproval.approvedBy = req.user._id;
    leave.hrApproval.approvedAt = new Date();
    leave.hrApproval.comments = comments;

    if (status === 'rejected' && rejectionReason) {
      leave.hrApproval.rejectionReason = rejectionReason;
      leave.status = 'hr_rejected';
    } else if (status === 'approved') {
      leave.status = 'approved';
      leave.finalApprovedBy = req.user._id;
      leave.finalApprovedAt = new Date();
    }

    await leave.save();

    res.json({
      message: `HR ${status} the leave request`,
      leave: {
        id: leave._id,
        user: leave.user,
        from: leave.from,
        to: leave.to,
        type: leave.type,
        status: leave.status,
        hrApproval: leave.hrApproval,
        finalApprovedBy: leave.finalApprovedBy,
        finalApprovedAt: leave.finalApprovedAt
      }
    });
  } catch (error) {
    console.error('HR approve leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leaves/approve/:id (Admin only - Legacy support)
// @desc    Admin can approve/reject any leave request directly
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

    // Admin can approve/reject regardless of current status
    leave.status = status;
    leave.finalApprovedBy = req.user._id;
    leave.finalApprovedAt = new Date();

    if (status === 'approved') {
      leave.managerApproval.status = 'approved';
      leave.managerApproval.approvedBy = req.user._id;
      leave.managerApproval.approvedAt = new Date();
      leave.hrApproval.status = 'approved';
      leave.hrApproval.approvedBy = req.user._id;
      leave.hrApproval.approvedAt = new Date();
    } else if (status === 'rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    res.json({
      message: `Leave request ${status} successfully by admin`,
      leave: {
        id: leave._id,
        user: leave.user,
        from: leave.from,
        to: leave.to,
        type: leave.type,
        status: leave.status,
        finalApprovedBy: req.user.name,
        finalApprovedAt: leave.finalApprovedAt,
        rejectionReason: leave.rejectionReason
      }
    });
  } catch (error) {
    console.error('Admin approve leave error:', error);
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