import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const holidaysCollection = db.collection('holidays');

    // Get all holidays
    const holidays = await holidaysCollection
      .find({})
      .sort({ date: 1 })
      .toArray();

    await client.close();

    res.status(200).json({
      message: 'Holidays fetched successfully',
      holidays: holidays
    });

  } catch (error) {
    console.error('Holidays fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
