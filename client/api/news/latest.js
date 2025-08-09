export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 3 } = req.query;

    // For now, return mock latest news (we'll implement actual data later)
    const mockLatestNews = [
      {
        id: '1',
        title: 'Company Policy Update',
        content: 'New attendance policy effective from next month',
        date: '2025-01-15',
        author: 'HR Department',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Team Building Event',
        content: 'Annual team building event scheduled for next Friday',
        date: '2025-01-10',
        author: 'Admin Team',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'System Maintenance',
        content: 'Scheduled maintenance on Sunday from 2-4 AM',
        date: '2025-01-08',
        author: 'IT Department',
        priority: 'low'
      }
    ].slice(0, parseInt(limit));

    res.status(200).json(mockLatestNews);
  } catch (error) {
    console.error('Latest news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 