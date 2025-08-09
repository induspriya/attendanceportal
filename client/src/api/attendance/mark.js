export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.body;

    if (!type || !['check-in', 'check-out'].includes(type)) {
      return res.status(400).json({ error: 'Invalid attendance type. Must be "check-in" or "check-out"' });
    }

    // For now, return success (we'll implement actual attendance marking later)
    const mockResponse = {
      success: true,
      message: `${type === 'check-in' ? 'Checked in' : 'Checked out'} successfully!`,
      timestamp: new Date().toISOString(),
      type: type
    };

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 