const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/news
// @desc    Get all published news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, priority, limit = 20, page = 1 } = req.query;
    let query = { isPublished: true };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }

    // Check for expired news
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const news = await News.find(query)
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      news,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/latest
// @desc    Get latest news
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const news = await News.find({
      isPublished: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json(news);
  } catch (error) {
    console.error('Get latest news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/news/add (Admin only)
// @desc    Add new news/announcement
// @access  Private (Admin)
router.post('/add', [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('summary').optional().trim(),
  body('category').optional().isIn(['announcement', 'news', 'event', 'policy']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('expiresAt').optional().isISO8601().withMessage('Expires date must be a valid date'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], adminAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      summary,
      category = 'announcement',
      priority = 'medium',
      expiresAt,
      tags = []
    } = req.body;

    const news = new News({
      title,
      content,
      summary,
      category,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      tags,
      createdBy: req.user._id
    });

    await news.save();

    res.status(201).json({
      message: 'News added successfully',
      news: {
        id: news._id,
        title: news.title,
        summary: news.summary,
        category: news.category,
        priority: news.priority,
        publishedAt: news.publishedAt,
        createdBy: req.user.name
      }
    });
  } catch (error) {
    console.error('Add news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/news/:id (Admin only)
// @desc    Update news
// @access  Private (Admin)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('summary').optional().trim(),
  body('category').optional().isIn(['announcement', 'news', 'event', 'policy']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('expiresAt').optional().isISO8601().withMessage('Expires date must be a valid date'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], adminAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      summary,
      category,
      priority,
      isPublished,
      expiresAt,
      tags
    } = req.body;

    const newsId = req.params.id;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Update fields
    if (title) news.title = title;
    if (content) news.content = content;
    if (summary !== undefined) news.summary = summary;
    if (category) news.category = category;
    if (priority) news.priority = priority;
    if (isPublished !== undefined) news.isPublished = isPublished;
    if (expiresAt !== undefined) news.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
    if (tags) news.tags = tags;

    await news.save();

    res.json({
      message: 'News updated successfully',
      news: {
        id: news._id,
        title: news.title,
        summary: news.summary,
        category: news.category,
        priority: news.priority,
        isPublished: news.isPublished,
        publishedAt: news.publishedAt
      }
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/news/:id (Admin only)
// @desc    Delete news
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/:id
// @desc    Get specific news
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check if news is published and not expired
    if (!news.isPublished) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (news.expiresAt && news.expiresAt < new Date()) {
      return res.status(404).json({ message: 'News has expired' });
    }

    res.json(news);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/categories
// @desc    Get news categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await News.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 