// News API endpoint - Mock data only for Vercel deployment
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
    console.log('Latest news API called successfully');
    
    const limit = parseInt(req.query.limit) || 5;

    // Mock latest news data
    const mockLatestNews = [
      {
        _id: 'news_1',
        title: 'Company Annual Meeting Announced',
        content: 'The annual company meeting will be held on December 15th. All employees are invited to attend.',
        createdBy: { name: 'HR Department' },
        category: 'announcement',
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tags: ['meeting', 'annual', 'company']
      },
      {
        _id: 'news_2',
        title: 'New Employee Benefits Package',
        content: 'We are excited to announce enhanced employee benefits including improved health coverage and flexible working hours.',
        createdBy: { name: 'Benefits Team' },
        category: 'policy',
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        tags: ['benefits', 'health', 'flexible']
      },
      {
        _id: 'news_3',
        title: 'Office Renovation Complete',
        content: 'The office renovation has been completed successfully. New facilities include a modern break room and improved workspace.',
        createdBy: { name: 'Facilities Team' },
        category: 'announcement',
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        tags: ['renovation', 'facilities', 'workspace']
      }
    ];

    // Limit the results
    const limitedNews = mockLatestNews.slice(0, limit);

    res.json(limitedNews);
  } catch (error) {
    console.error('Error in latest news API:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
