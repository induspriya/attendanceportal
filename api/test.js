module.exports = async (req, res) => {
  // Set CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

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
      status: 'OK', 
      message: 'Test API endpoint is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      hasMongoUri: !!process.env.MONGODB_URI
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Test failed',
      error: error.message 
    });
  }
};
