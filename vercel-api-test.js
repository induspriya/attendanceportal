export default function handler(req, res) {
  res.json({ 
    status: 'SUCCESS',
    message: 'Root API route is working!',
    timestamp: new Date().toISOString(),
    method: req.method
  });
}
