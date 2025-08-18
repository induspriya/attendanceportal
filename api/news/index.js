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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('News API called successfully');
    
    // Mock news data
    const mockNews = {
      news: [
        {
          id: '1',
          title: 'Company Policy Update',
          content: 'New attendance policy effective from next month',
          summary: 'Updated attendance policies for better work-life balance',
          category: 'policy',
          priority: 'high',
          publishedAt: new Date().toISOString(),
          createdBy: { name: 'HR Department' }
        },
        {
          id: '2',
          title: 'Team Building Event',
          content: 'Annual team building event scheduled for next Friday',
          summary: 'Monthly team building event scheduled',
          category: 'event',
          priority: 'medium',
          publishedAt: new Date().toISOString(),
          createdBy: { name: 'Admin Team' }
        },
        {
          id: '3',
          title: 'System Maintenance',
          content: 'Scheduled maintenance on Sunday from 2-4 AM',
          summary: 'Scheduled maintenance this Sunday',
          category: 'announcement',
          priority: 'low',
          publishedAt: new Date().toISOString(),
          createdBy: { name: 'IT Department' }
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 20
      }
    };

    res.status(200).json(mockNews);
  } catch (error) {
    console.error('Error in news API:', error);
    res.status(500).json({ 
      error: {
        code: '500',
        message: 'A server error has occurred'
      }
    });
  }
};
