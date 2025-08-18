export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    res.json({ 
      status: 'SUCCESS',
      message: 'Vercel API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      test: true
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'API test failed',
      error: error.message 
    });
  }
}
