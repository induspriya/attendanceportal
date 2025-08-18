import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const attendanceCollection = db.collection('attendance');

    // Get today's attendance record
    const todayRecord = await attendanceCollection.findOne({
      user: new ObjectId(userId),
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    await client.close();

    if (!todayRecord) {
      return res.status(200).json({
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null,
        status: 'not_checked'
      });
    }

    const checkedIn = !!todayRecord.checkIn;
    const checkedOut = !!todayRecord.checkOut;

    res.status(200).json({
      checkedIn,
      checkedOut,
      checkInTime: todayRecord.checkIn?.time || null,
      checkOutTime: todayRecord.checkOut?.time || null,
      status: todayRecord.status || 'not_checked'
    });

  } catch (error) {
    console.error('Today status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
