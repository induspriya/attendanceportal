module.exports = async (req, res) => {
  res.json({ 
    message: 'Environment Variables Test',
    mongodb_uri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    node_env: process.env.NODE_ENV || 'NOT SET',
    timestamp: new Date().toISOString()
  });
};
