const express = require('express');
const { body, validationResult } = require('express-validator');
const Holiday = require('../models/Holiday');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/holidays
// @desc    Get all holidays
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { year, month, type } = req.query;
    let query = { isActive: true };

    // Filter by year if provided
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Filter by month if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    const holidays = await Holiday.find(query)
      .populate('createdBy', 'name')
      .sort({ date: 1 });

    res.json(holidays);
  } catch (error) {
    console.error('Get holidays error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/holidays/upcoming
// @desc    Get upcoming holidays
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holidays = await Holiday.find({
      date: { $gte: today },
      isActive: true
    })
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .limit(10);

    res.json(holidays);
  } catch (error) {
    console.error('Get upcoming holidays error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/holidays/add (Admin only)
// @desc    Add new holiday
// @access  Private (Admin)
router.post('/add', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('date').isISO8601().withMessage('Date must be a valid date'),
  body('description').optional().trim(),
  body('type').optional().isIn(['national', 'company', 'optional']).withMessage('Invalid holiday type')
], adminAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, date, description, type = 'national' } = req.body;

    // Check if holiday already exists on this date
    const existingHoliday = await Holiday.findOne({
      date: new Date(date),
      isActive: true
    });

    if (existingHoliday) {
      return res.status(400).json({ message: 'A holiday already exists on this date' });
    }

    const holiday = new Holiday({
      name,
      date: new Date(date),
      description,
      type,
      createdBy: req.user._id
    });

    await holiday.save();

    res.status(201).json({
      message: 'Holiday added successfully',
      holiday: {
        id: holiday._id,
        name: holiday.name,
        date: holiday.date,
        description: holiday.description,
        type: holiday.type,
        createdBy: req.user.name
      }
    });
  } catch (error) {
    console.error('Add holiday error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/holidays/:id (Admin only)
// @desc    Update holiday
// @access  Private (Admin)
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('description').optional().trim(),
  body('type').optional().isIn(['national', 'company', 'optional']).withMessage('Invalid holiday type'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], adminAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, date, description, type, isActive } = req.body;
    const holidayId = req.params.id;

    const holiday = await Holiday.findById(holidayId);
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    // Check for date conflict if date is being updated
    if (date && new Date(date).getTime() !== holiday.date.getTime()) {
      const existingHoliday = await Holiday.findOne({
        date: new Date(date),
        isActive: true,
        _id: { $ne: holidayId }
      });

      if (existingHoliday) {
        return res.status(400).json({ message: 'A holiday already exists on this date' });
      }
    }

    // Update fields
    if (name) holiday.name = name;
    if (date) holiday.date = new Date(date);
    if (description !== undefined) holiday.description = description;
    if (type) holiday.type = type;
    if (isActive !== undefined) holiday.isActive = isActive;

    await holiday.save();

    res.json({
      message: 'Holiday updated successfully',
      holiday: {
        id: holiday._id,
        name: holiday.name,
        date: holiday.date,
        description: holiday.description,
        type: holiday.type,
        isActive: holiday.isActive
      }
    });
  } catch (error) {
    console.error('Update holiday error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/holidays/:id (Admin only)
// @desc    Delete holiday
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    await Holiday.findByIdAndDelete(req.params.id);

    res.json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    console.error('Delete holiday error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/holidays/:id
// @desc    Get specific holiday
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    res.json(holiday);
  } catch (error) {
    console.error('Get holiday error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 