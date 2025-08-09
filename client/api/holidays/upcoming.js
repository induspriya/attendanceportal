export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Comprehensive list of Indian holidays (we'll implement actual data later)
    const mockUpcomingHolidays = [
      {
        id: '1',
        name: 'New Year\'s Day',
        date: '2025-01-01',
        type: 'International Holiday',
        description: 'New Year\'s Day'
      },
      {
        id: '2',
        name: 'Makar Sankranti',
        date: '2025-01-15',
        type: 'Religious Holiday',
        description: 'Makar Sankranti / Pongal'
      },
      {
        id: '3',
        name: 'Republic Day',
        date: '2025-01-26',
        type: 'National Holiday',
        description: 'Republic Day of India'
      },
      {
        id: '4',
        name: 'Maha Shivratri',
        date: '2025-02-23',
        type: 'Religious Holiday',
        description: 'Maha Shivratri'
      },
      {
        id: '5',
        name: 'Holi',
        date: '2025-03-14',
        type: 'Religious Holiday',
        description: 'Holi - Festival of Colors'
      },
      {
        id: '6',
        name: 'Eid al-Fitr',
        date: '2025-03-31',
        type: 'Religious Holiday',
        description: 'Eid al-Fitr'
      },
      {
        id: '7',
        name: 'Ram Navami',
        date: '2025-04-06',
        type: 'Religious Holiday',
        description: 'Ram Navami'
      },
      {
        id: '8',
        name: 'Mahavir Jayanti',
        date: '2025-04-13',
        type: 'Religious Holiday',
        description: 'Mahavir Jayanti'
      },
      {
        id: '9',
        name: 'Good Friday',
        date: '2025-04-18',
        type: 'Religious Holiday',
        description: 'Good Friday'
      },
      {
        id: '10',
        name: 'Easter Sunday',
        date: '2025-04-20',
        type: 'Religious Holiday',
        description: 'Easter Sunday'
      },
      {
        id: '11',
        name: 'Buddha Purnima',
        date: '2025-05-13',
        type: 'Religious Holiday',
        description: 'Buddha Purnima'
      },
      {
        id: '12',
        name: 'Eid al-Adha',
        date: '2025-06-17',
        type: 'Religious Holiday',
        description: 'Eid al-Adha'
      },
      {
        id: '13',
        name: 'Raksha Bandhan',
        date: '2025-08-12',
        type: 'Religious Holiday',
        description: 'Raksha Bandhan'
      },
      {
        id: '14',
        name: 'Independence Day',
        date: '2025-08-15',
        type: 'National Holiday',
        description: 'Independence Day of India'
      },
      {
        id: '15',
        name: 'Janmashtami',
        date: '2025-08-26',
        type: 'Religious Holiday',
        description: 'Krishna Janmashtami'
      },
      {
        id: '16',
        name: 'Ganesh Chaturthi',
        date: '2025-09-02',
        type: 'Religious Holiday',
        description: 'Ganesh Chaturthi'
      },
      {
        id: '17',
        name: 'Dussehra',
        date: '2025-10-02',
        type: 'Religious Holiday',
        description: 'Dussehra / Vijayadashami'
      },
      {
        id: '18',
        name: 'Diwali',
        date: '2025-10-31',
        type: 'Religious Holiday',
        description: 'Diwali - Festival of Lights'
      },
      {
        id: '19',
        name: 'Guru Nanak Jayanti',
        date: '2025-11-15',
        type: 'Religious Holiday',
        description: 'Guru Nanak Jayanti'
      },
      {
        id: '20',
        name: 'Christmas',
        date: '2025-12-25',
        type: 'Religious Holiday',
        description: 'Christmas Day'
      }
    ];

    res.status(200).json(mockUpcomingHolidays);
  } catch (error) {
    console.error('Upcoming holidays error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 