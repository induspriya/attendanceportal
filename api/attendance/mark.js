import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type } = req.body;
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

    if (!type || !['check-in', 'check-out'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Must be check-in or check-out' });
    }

    const userId = decoded.userId;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const attendanceCollection = db.collection('attendance');

    // Check if attendance record exists for today
    let attendanceRecord = await attendanceCollection.findOne({
      user: new ObjectId(userId),
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendanceRecord) {
      // Create new attendance record
      attendanceRecord = {
        user: new ObjectId(userId),
        date: today,
        checkIn: null,
        checkOut: null,
        status: 'present',
        createdAt: now,
        updatedAt: now
      };
    }

    if (type === 'check-in') {
      if (attendanceRecord.checkIn) {
        await client.close();
        return res.status(400).json({ message: 'Already checked in today' });
      }
      
      attendanceRecord.checkIn = {
        time: now,
        location: 'Office' // You can add location tracking later
      };
      attendanceRecord.status = 'checked_in';
    } else if (type === 'check-out') {
      if (!attendanceRecord.checkIn) {
        await client.close();
        return res.status(400).json({ message: 'Must check in before checking out' });
      }
      
      if (attendanceRecord.checkOut) {
        await client.close();
        return res.status(400).json({ message: 'Already checked out today' });
      }
      
      attendanceRecord.checkOut = {
        time: now,
        location: 'Office'
      };
      attendanceRecord.status = 'checked_out';
    }

    attendanceRecord.updatedAt = now;

    // Save or update attendance record
    if (attendanceRecord._id) {
      await attendanceCollection.updateOne(
        { _id: attendanceRecord._id },
        { $set: attendanceRecord }
      );
    } else {
      await attendanceCollection.insertOne(attendanceRecord);
    }

    await client.close();

    res.status(200).json({
      message: `${type} successful`,
      attendance: attendanceRecord
    });

  } catch (error) {
    console.error('Attendance mark error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
