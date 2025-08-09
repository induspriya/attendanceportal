export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return mock attendance data (we'll implement actual data later)
    const mockAttendanceData = {
      totalDays: 22,
      presentDays: 18,
      absentDays: 2,
      lateDays: 2,
      attendanceRate: 81.8,
      monthlyData: [
        { month: 'Jan', present: 18, absent: 2, late: 2 },
        { month: 'Dec', present: 20, absent: 1, late: 1 },
        { month: 'Nov', present: 19, absent: 2, late: 1 }
      ]
    };

    res.status(200).json(mockAttendanceData);
  } catch (error) {
    console.error('Attendance data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 