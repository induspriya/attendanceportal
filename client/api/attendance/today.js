export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return mock today's status (we'll implement actual data later)
    const mockTodayStatus = {
      status: 'present',
      checkInTime: '09:00 AM',
      checkOutTime: null,
      totalHours: null,
      isLate: false,
      lateBy: 0
    };

    res.status(200).json(mockTodayStatus);
  } catch (error) {
    console.error('Today status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 