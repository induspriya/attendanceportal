// Mock data endpoint - no database connection needed

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
    const limit = parseInt(req.query.limit) || 5;

    // Mock latest news data
    const mockLatestNews = [
      {
        _id: 'news_1',
        title: 'Company Annual Meeting Announced',
        content: 'The annual company meeting will be held on December 15th. All employees are invited to attend.',
        author: 'HR Department',
        category: 'Company Updates',
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tags: ['meeting', 'annual', 'company']
      },
      {
        _id: 'news_2',
        title: 'New Employee Benefits Package',
        content: 'We are excited to announce enhanced employee benefits including improved health coverage and flexible working hours.',
        author: 'Benefits Team',
        category: 'Benefits',
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        tags: ['benefits', 'health', 'flexible']
      },
      {
        _id: 'news_3',
        title: 'Office Renovation Complete',
        content: 'The office renovation has been completed successfully. New facilities include a modern break room and improved workspace.',
        author: 'Facilities Team',
        category: 'Office Updates',
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        tags: ['renovation', 'facilities', 'workspace']
      },
      {
        _id: 'news_4',
        title: 'Team Building Event',
        content: 'Join us for our monthly team building event this Friday. Activities include team games and dinner.',
        author: 'Culture Team',
        category: 'Events',
        isPublished: true,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        tags: ['team building', 'events', 'culture']
      },
      {
        _id: 'news_5',
        title: 'Technology Upgrade',
        content: 'We are upgrading our technology infrastructure to improve productivity and security.',
        author: 'IT Department',
        category: 'Technology',
        isPublished: true,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        tags: ['technology', 'upgrade', 'security']
      }
    ];

    // Sort by published date (newest first) and limit results
    const latestNews = mockLatestNews
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, limit);

    res.status(200).json(latestNews);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
