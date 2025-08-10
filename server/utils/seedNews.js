const mongoose = require('mongoose');
const News = require('../models/News');
const User = require('../models/User');
require('dotenv').config();

const sampleNews = [
  {
    title: 'Welcome to the New Attendance Portal!',
    content: 'We are excited to announce the launch of our new attendance management system. This portal will streamline all attendance, leave, and holiday management processes. Features include real-time attendance tracking, automated leave management, and comprehensive holiday calendars.',
    summary: 'New attendance portal launched with enhanced features',
    category: 'announcement',
    priority: 'high',
    isPublished: true,
    tags: ['portal', 'launch', 'attendance']
  },
  {
    title: 'Holiday Schedule for Q4 2024',
    content: 'Please note the upcoming holidays for the fourth quarter. Plan your leaves accordingly and ensure proper coverage during these periods. Key holidays include Diwali, Christmas, and New Year celebrations.',
    summary: 'Q4 2024 holiday schedule announced',
    category: 'policy',
    priority: 'medium',
    isPublished: true,
    tags: ['holidays', 'schedule', 'Q4']
  },
  {
    title: 'New Leave Policy Updates',
    content: 'We have updated our leave policies to provide better work-life balance. New categories include mental health days, flexible work arrangements, and extended parental leave. All employees are encouraged to review the updated policy document.',
    summary: 'Updated leave policies for better work-life balance',
    category: 'policy',
    priority: 'high',
    isPublished: true,
    tags: ['leave', 'policy', 'work-life-balance']
  },
  {
    title: 'Team Building Event - Next Friday',
    content: 'Join us for our monthly team building event this Friday from 3:00 PM to 6:00 PM. Activities include team games, lunch, and networking opportunities. This is a great chance to connect with colleagues from different departments.',
    summary: 'Monthly team building event scheduled',
    category: 'event',
    priority: 'medium',
    isPublished: true,
    tags: ['team-building', 'event', 'networking']
  },
  {
    title: 'System Maintenance Notice',
    content: 'The attendance portal will undergo scheduled maintenance on Sunday from 2:00 AM to 4:00 AM. During this time, the system may be temporarily unavailable. Please plan your attendance marking accordingly.',
    summary: 'Scheduled maintenance this Sunday',
    category: 'announcement',
    priority: 'low',
    isPublished: true,
    tags: ['maintenance', 'system', 'downtime']
  },
  {
    title: 'Annual Performance Review Period',
    content: 'The annual performance review period begins next month. All employees should prepare their self-assessments and gather feedback from colleagues. Review meetings will be scheduled throughout the month.',
    summary: 'Annual performance reviews starting next month',
    category: 'announcement',
    priority: 'high',
    isPublished: true,
    tags: ['performance', 'review', 'annual']
  },
  {
    title: 'New Office Safety Guidelines',
    content: 'Updated office safety guidelines have been implemented. Please review the new protocols including emergency procedures, first aid locations, and safety equipment usage. Training sessions will be available next week.',
    summary: 'Updated office safety guidelines implemented',
    category: 'policy',
    priority: 'high',
    isPublished: true,
    tags: ['safety', 'guidelines', 'training']
  },
  {
    title: 'Employee Wellness Program Launch',
    content: 'We are launching a comprehensive employee wellness program starting next month. This includes fitness challenges, mental health support, nutrition workshops, and stress management sessions. Registration opens this week.',
    summary: 'New employee wellness program launching',
    category: 'announcement',
    priority: 'medium',
    isPublished: true,
    tags: ['wellness', 'health', 'fitness']
  },
  {
    title: 'Quarterly Town Hall Meeting',
    content: 'Join us for our quarterly town hall meeting on the last Friday of this month. We will discuss company updates, Q4 goals, and answer your questions. The meeting will be held in the main conference room.',
    summary: 'Quarterly town hall meeting this month',
    category: 'event',
    priority: 'medium',
    isPublished: true,
    tags: ['town-hall', 'meeting', 'quarterly']
  },
  {
    title: 'IT Support Hours Extended',
    content: 'IT support hours have been extended to provide better assistance. Support is now available from 7:00 AM to 8:00 PM on weekdays and 9:00 AM to 5:00 PM on weekends. Emergency support remains 24/7.',
    summary: 'IT support hours extended for better assistance',
    category: 'announcement',
    priority: 'low',
    isPublished: true,
    tags: ['IT', 'support', 'hours']
  },
  {
    title: 'New Employee Onboarding Process',
    content: 'We have streamlined our employee onboarding process to make it more efficient and welcoming. New features include digital document signing, interactive company culture sessions, and buddy system assignments.',
    summary: 'Streamlined employee onboarding process',
    category: 'policy',
    priority: 'medium',
    isPublished: true,
    tags: ['onboarding', 'process', 'new-employees']
  },
  {
    title: 'Company Social Responsibility Initiative',
    content: 'Join our new CSR initiative starting next month. We will be organizing community service activities, environmental conservation projects, and charitable donations. Sign up sheets are available in the HR department.',
    summary: 'New CSR initiative launching next month',
    category: 'announcement',
    priority: 'low',
    isPublished: true,
    tags: ['CSR', 'community', 'charity']
  }
];

const seedNews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal');
    console.log('Connected to MongoDB');

    // Clear existing news
    await News.deleteMany({});
    console.log('Cleared existing news');

    // Get a user to assign as creator (or create one if none exists)
    let user = await User.findOne({});
    if (!user) {
      console.log('No users found. Please create a user first.');
      process.exit(1);
    }

    // Add sample news with the user as creator
    const newsWithCreator = sampleNews.map(news => ({
      ...news,
      createdBy: user._id,
      publishedAt: new Date()
    }));

    await News.insertMany(newsWithCreator);
    console.log('Sample news added successfully');

    // Display added news
    const addedNews = await News.find({}).populate('createdBy', 'name');
    console.log('\nAdded News:');
    addedNews.forEach(news => {
      console.log(`- ${news.title} (${news.category})`);
    });

    console.log('\n✅ News seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedNews();