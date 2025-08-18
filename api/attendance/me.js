import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { month, year } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const attendanceCollection = db.collection('attendance');

    // Get attendance records for the specified month and year
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const attendanceRecords = await attendanceCollection
      .find({
        user: new ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ date: 1 })
      .toArray();

    await client.close();

    // Calculate summary statistics
    const presentDays = attendanceRecords.filter(record => 
      record.status === 'present' || record.status === 'checked_in' || record.status === 'checked_out'
    ).length;
    
    const absentDays = new Date(currentYear, currentMonth, 0).getDate() - presentDays;
    
    const totalWorkingHours = attendanceRecords.reduce((total, record) => {
      if (record.checkIn && record.checkOut) {
        const hours = (new Date(record.checkOut.time) - new Date(record.checkIn.time)) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0);
    
    const averageWorkingHours = presentDays > 0 ? totalWorkingHours / presentDays : 0;

    res.status(200).json({
      message: 'Attendance data fetched successfully',
      attendance: attendanceRecords,
      summary: {
        presentDays,
        absentDays,
        totalWorkingHours,
        averageWorkingHours,
        totalDays: new Date(currentYear, currentMonth, 0).getDate()
      }
    });

  } catch (error) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
