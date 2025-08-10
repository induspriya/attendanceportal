const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Call the backend server
    const backendUrl = process.env.BACKEND_URL || 'https://your-backend-server.com';
    const response = await axios.get(`${backendUrl}/api/news/latest`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    
    // Fallback to mock data if backend is not available
    const mockLatestNews = [
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
    ];

    res.status(200).json(mockLatestNews);
  }
}
