const mongoose = require('mongoose');
const News = require('../models/News');
const User = require('../models/User');

const sampleNews = [
  {
    title: 'Company Policy Update - New Attendance Guidelines',
    content: 'We are pleased to announce updated attendance policies that will be effective from next month. The new guidelines include flexible working hours, improved leave management, and enhanced tracking systems. All employees are required to review the updated policy document available in the employee portal.\n\nThe new system will provide:\n• Flexible working hours (8 AM - 6 PM window)\n• Improved leave management with auto-approval for certain types\n• Enhanced tracking with mobile app support\n• Better reporting and analytics',
    summary: 'New attendance policy effective from next month with flexible working hours and improved leave management.',
    category: 'policy',
    priority: 'high',
    tags: ['policy', 'attendance', 'guidelines', 'flexible-hours'],
    expiresAt: new Date('2025-12-31')
  },
  {
    title: 'Annual Team Building Event - Save the Date!',
    content: 'Mark your calendars! Our annual team building event is scheduled for next Friday. This year\'s theme is "Building Stronger Connections" and will include team activities, workshops, and networking opportunities.\n\nEvent Details:\n• Date: Next Friday\n• Time: 9:00 AM - 5:00 PM\n• Location: Central Park Conference Center\n• Activities: Team challenges, workshops, networking\n• Lunch and refreshments provided\n\nPlease RSVP by Wednesday to confirm your attendance.',
    summary: 'Annual team building event scheduled for next Friday with team activities and networking opportunities.',
    category: 'event',
    priority: 'medium',
    tags: ['event', 'team-building', 'networking', 'workshop'],
    expiresAt: new Date('2025-02-15')
  },
  {
    title: 'System Maintenance - Scheduled Downtime',
    content: 'We will be performing scheduled maintenance on our attendance portal system this Sunday from 2:00 AM to 4:00 AM. During this time, the system will be temporarily unavailable.\n\nMaintenance Details:\n• Date: This Sunday\n• Time: 2:00 AM - 4:00 AM\n• Duration: 2 hours\n• Impact: System unavailable\n\nWe apologize for any inconvenience and appreciate your understanding. All data will be preserved and the system will be fully operational after maintenance.',
    summary: 'Scheduled maintenance on Sunday from 2-4 AM. System will be temporarily unavailable.',
    category: 'announcement',
    priority: 'low',
    tags: ['maintenance', 'system', 'downtime', 'scheduled'],
    expiresAt: new Date('2025-01-20')
  },
  {
    title: 'New Employee Onboarding - Welcome to the Team!',
    content: 'Please join us in welcoming our newest team members who joined this week. We have 5 new employees joining various departments.\n\nNew Team Members:\n• Sarah Johnson - Marketing Department\n• Michael Chen - Engineering Team\n• Emily Rodriguez - Sales Division\n• David Kim - HR Department\n• Lisa Thompson - Finance Team\n\nA welcome lunch will be organized next week to help them integrate into our team culture. Please extend a warm welcome and support them in their journey with us.',
    summary: 'Welcome to 5 new team members! Welcome lunch scheduled for next week.',
    category: 'announcement',
    priority: 'medium',
    tags: ['onboarding', 'new-employees', 'welcome', 'team'],
    expiresAt: new Date('2025-02-28')
  },
  {
    title: 'Quarterly Performance Review - Important Reminder',
    content: 'The quarterly performance review cycle begins next week. All managers are required to complete performance assessments for their team members by the end of the month.\n\nKey Dates:\n• Review Period: Next week - Month end\n• Submission Deadline: Last day of month\n• Training Sessions: This week\n\nPlease ensure all documentation is submitted on time. Training sessions for the new review system will be conducted this week.',
    summary: 'Quarterly performance review cycle begins next week. All managers must complete assessments by month-end.',
    category: 'policy',
    priority: 'high',
    tags: ['performance', 'review', 'quarterly', 'deadline'],
    expiresAt: new Date('2025-01-31')
  },
  {
    title: 'Office Renovation Project - Phase 1 Complete',
    content: 'Great news! Phase 1 of our office renovation project has been completed successfully. The new collaborative spaces, meeting rooms, and break areas are now open for use.\n\nNew Facilities:\n• Collaborative workspaces\n• Modern meeting rooms\n• Enhanced break areas\n• Ergonomic furniture\n• Improved lighting\n• Sound-proof phone booths\n\nPlease provide feedback on the new facilities. Phase 2 will begin next month.',
    summary: 'Phase 1 of office renovation completed! New collaborative spaces and meeting rooms now open.',
    category: 'news',
    priority: 'medium',
    tags: ['renovation', 'office', 'facilities', 'collaboration'],
    expiresAt: new Date('2025-06-30')
  },
  {
    title: 'Emergency Contact Information Update',
    content: 'All employees are required to update their emergency contact information in the employee portal by the end of this week. This includes primary and secondary emergency contacts, their relationship to you, and current phone numbers.\n\nRequired Information:\n• Primary emergency contact\n• Secondary emergency contact\n• Relationship to employee\n• Current phone numbers\n• Alternative contact methods\n\nThis information is crucial for workplace safety and emergency response.',
    summary: 'Update emergency contact information in employee portal by end of week. Required for workplace safety.',
    category: 'announcement',
    priority: 'urgent',
    tags: ['emergency', 'safety', 'contacts', 'required'],
    expiresAt: new Date('2025-01-25')
  },
  {
    title: 'Professional Development Workshop Series',
    content: 'We\'re excited to announce a new series of professional development workshops starting next month. Topics include leadership skills, communication techniques, project management, and technical skills enhancement.\n\nWorkshop Topics:\n• Leadership & Management Skills\n• Effective Communication\n• Project Management Fundamentals\n• Technical Skills Enhancement\n• Team Collaboration\n• Time Management\n\nThese workshops are free for all employees and will be conducted by industry experts.',
    summary: 'New professional development workshop series starting next month. Free for all employees with expert trainers.',
    category: 'event',
    priority: 'medium',
    tags: ['workshops', 'development', 'training', 'free'],
    expiresAt: new Date('2025-06-30')
  },
  {
    title: 'Holiday Schedule - 2025 Calendar Released',
    content: 'The official 2025 holiday calendar has been released and is now available in the employee portal. This includes all national holidays, company holidays, and optional holidays.\n\nHoliday Types:\n• National Holidays (10 days)\n• Company Holidays (5 days)\n• Optional Holidays (3 days)\n• Floating Holidays (2 days)\n\nPlease review the calendar and plan your leave accordingly. Early leave applications are encouraged for popular holiday periods.',
    summary: '2025 holiday calendar released! Includes national, company, and optional holidays. Plan leave early.',
    category: 'policy',
    priority: 'medium',
    tags: ['holidays', 'calendar', 'leave-planning', '2025'],
    expiresAt: new Date('2025-12-31')
  },
  {
    title: 'Health and Wellness Program Launch',
    content: 'We\'re launching a comprehensive health and wellness program to support our employees\' physical and mental well-being. The program includes gym memberships, mental health support, nutrition counseling, and regular health check-ups.\n\nProgram Benefits:\n• Gym membership reimbursement\n• Mental health counseling\n• Nutrition consultation\n• Health check-ups\n• Wellness challenges\n• Stress management workshops\n\nMore details and registration information will be shared next week.',
    summary: 'New health and wellness program launching! Includes gym memberships, mental health support, and health check-ups.',
    category: 'announcement',
    priority: 'high',
    tags: ['health', 'wellness', 'program', 'benefits'],
    expiresAt: new Date('2025-12-31')
  },
  {
    title: 'Technology Upgrade - New Software Tools',
    content: 'We\'re upgrading our technology stack with new software tools to improve productivity and collaboration. New tools include advanced project management software, enhanced communication platforms, and improved data analytics tools.\n\nNew Tools:\n• Advanced project management\n• Enhanced communication platforms\n• Improved data analytics\n• Cloud storage solutions\n• Security enhancements\n\nTraining sessions will be scheduled for all employees.',
    summary: 'Technology upgrade with new software tools for improved productivity and collaboration. Training sessions scheduled.',
    category: 'news',
    priority: 'medium',
    tags: ['technology', 'software', 'upgrade', 'training'],
    expiresAt: new Date('2025-06-30')
  },
  {
    title: 'Customer Success Story - Major Project Completion',
    content: 'We\'re proud to announce the successful completion of our major client project that was delivered ahead of schedule and under budget. This achievement demonstrates our team\'s dedication and expertise.\n\nProject Highlights:\n• Delivered 2 weeks ahead of schedule\n• 15% under budget\n• Exceeded client expectations\n• High client satisfaction\n• Future projects committed\n\nThe client has expressed high satisfaction and has already committed to future projects.',
    summary: 'Major client project completed successfully ahead of schedule! Client satisfaction high with future projects committed.',
    category: 'news',
    priority: 'high',
    tags: ['success', 'project', 'client', 'achievement'],
    expiresAt: new Date('2025-12-31')
  },
  // NEW RECENT NEWS ITEMS
  {
    title: 'Attendance Portal News System - Now Live! 🎉',
    content: 'Exciting news! Our new News & Announcement system is now live in the Attendance Portal. This system provides real-time updates, company announcements, policy changes, and event information all in one place.\n\nNew Features:\n• Real-time news updates\n• Category-based organization\n• Priority-based filtering\n• Search functionality\n• Mobile-responsive design\n• Admin management panel\n\nAccess the news system at /news and stay updated with all company information!',
    summary: 'New News & Announcement system is now live! Access real-time updates and company information.',
    category: 'announcement',
    priority: 'urgent',
    tags: ['news-system', 'portal', 'announcements', 'live'],
    expiresAt: new Date('2025-12-31')
  },
  {
    title: 'Remote Work Policy Update - Hybrid Model Implementation',
    content: 'Starting next month, we will implement a new hybrid work model that combines office and remote work. This policy aims to provide flexibility while maintaining team collaboration and productivity.\n\nNew Policy Details:\n• 3 days office, 2 days remote per week\n• Flexible office hours (9 AM - 5 PM core)\n• Required office days: Tuesday, Wednesday, Thursday\n• Remote days: Monday and Friday\n• Team collaboration days: Wednesday (mandatory office)\n\nAll employees must update their work preferences in the portal by next week.',
    summary: 'New hybrid work model: 3 days office, 2 days remote. Update preferences in portal by next week.',
    category: 'policy',
    priority: 'high',
    tags: ['remote-work', 'hybrid', 'policy', 'flexibility'],
    expiresAt: new Date('2025-06-30')
  },
  {
    title: 'Monthly All-Hands Meeting - This Friday',
    content: 'Join us for our monthly All-Hands meeting this Friday at 2:00 PM. This session will cover company updates, Q1 achievements, upcoming projects, and open Q&A with leadership.\n\nMeeting Agenda:\n• Company performance review\n• Q1 achievements celebration\n• Upcoming Q2 projects\n• New initiatives announcement\n• Open Q&A session\n• Team recognition\n\nLocation: Main Conference Room + Virtual (Zoom link will be shared)\nPlease RSVP and submit any questions in advance.',
    summary: 'Monthly All-Hands meeting this Friday at 2 PM. Company updates, Q1 review, and open Q&A session.',
    category: 'event',
    priority: 'medium',
    tags: ['all-hands', 'meeting', 'company-update', 'Q1-review'],
    expiresAt: new Date('2025-02-15')
  },
  {
    title: 'Cybersecurity Awareness Training - Mandatory for All',
    content: 'Cybersecurity training is now mandatory for all employees. This training covers phishing awareness, password security, data protection, and safe internet practices.\n\nTraining Requirements:\n• Complete within 2 weeks\n• 30-minute online module\n• Quiz completion required\n• Certificate of completion\n• Annual renewal required\n\nAccess the training through the employee portal. This is critical for protecting company and client data.',
    summary: 'Mandatory cybersecurity training for all employees. Complete within 2 weeks to protect company data.',
    category: 'policy',
    priority: 'urgent',
    tags: ['cybersecurity', 'training', 'mandatory', 'data-protection'],
    expiresAt: new Date('2025-02-28')
  },
  {
    title: 'Employee Recognition Program - Nominate Your Colleagues',
    content: 'Our quarterly employee recognition program is now open for nominations. Recognize colleagues who have demonstrated exceptional performance, teamwork, innovation, or leadership.\n\nNomination Categories:\n• Outstanding Performance\n• Team Player of the Quarter\n• Innovation Award\n• Leadership Excellence\n• Customer Service Champion\n\nSubmit nominations through the portal by month-end. Winners will be announced at the next All-Hands meeting.',
    summary: 'Quarterly employee recognition program open for nominations. Submit by month-end for various categories.',
    category: 'announcement',
    priority: 'medium',
    tags: ['recognition', 'awards', 'nominations', 'quarterly'],
    expiresAt: new Date('2025-02-28')
  },
  {
    title: 'New Coffee Corner - Now Open in Building A',
    content: 'Great news for coffee lovers! Our new coffee corner is now open in Building A, featuring premium coffee, tea, and snacks. This space serves as both a refreshment area and informal meeting spot.\n\nCoffee Corner Features:\n• Premium coffee and tea selection\n• Healthy snack options\n• Informal meeting space\n• Comfortable seating\n• Open 8 AM - 6 PM\n\nCome by and enjoy the new space! Perfect for quick meetings and coffee breaks.',
    summary: 'New coffee corner now open in Building A! Premium coffee, tea, and informal meeting space available.',
    category: 'news',
    priority: 'low',
    tags: ['coffee-corner', 'facilities', 'refreshments', 'meeting-space'],
    expiresAt: new Date('2025-12-31')
  }
];

const seedNews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal');
    
    // Clear existing news
    await News.deleteMany({});
    console.log('Cleared existing news');
    
    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }
    
    // Add createdBy field to all news items
    const newsWithCreator = sampleNews.map(news => ({
      ...news,
      createdBy: adminUser._id
    }));
    
    // Insert sample news
    const result = await News.insertMany(newsWithCreator);
    console.log(`Successfully seeded ${result.length} news items`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedNews();
}

module.exports = seedNews; 