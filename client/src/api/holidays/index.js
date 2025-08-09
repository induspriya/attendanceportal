export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { year, month, type } = req.query;

    // Comprehensive list of all holidays (we'll implement actual data later)
    const allHolidays = [
      {
        _id: '1',
        name: 'New Year\'s Day',
        date: '2025-01-01',
        type: 'gazetted',
        description: 'New Year\'s Day - International Holiday'
      },
      {
        _id: '2',
        name: 'Makar Sankranti',
        date: '2025-01-15',
        type: 'restricted',
        description: 'Makar Sankranti / Pongal - Hindu Festival'
      },
      {
        _id: '3',
        name: 'Republic Day',
        date: '2025-01-26',
        type: 'gazetted',
        description: 'Republic Day of India - National Holiday'
      },
      {
        _id: '4',
        name: 'Maha Shivratri',
        date: '2025-02-23',
        type: 'restricted',
        description: 'Maha Shivratri - Hindu Festival'
      },
      {
        _id: '5',
        name: 'Holi',
        date: '2025-03-14',
        type: 'restricted',
        description: 'Holi - Festival of Colors'
      },
      {
        _id: '6',
        name: 'Eid al-Fitr',
        date: '2025-03-31',
        type: 'restricted',
        description: 'Eid al-Fitr - Islamic Festival'
      },
      {
        _id: '7',
        name: 'Ram Navami',
        date: '2025-04-06',
        type: 'restricted',
        description: 'Ram Navami - Hindu Festival'
      },
      {
        _id: '8',
        name: 'Mahavir Jayanti',
        date: '2025-04-13',
        type: 'restricted',
        description: 'Mahavir Jayanti - Jain Festival'
      },
      {
        _id: '9',
        name: 'Good Friday',
        date: '2025-04-18',
        type: 'restricted',
        description: 'Good Friday - Christian Holiday'
      },
      {
        _id: '10',
        name: 'Easter Sunday',
        date: '2025-04-20',
        type: 'restricted',
        description: 'Easter Sunday - Christian Holiday'
      },
      {
        _id: '11',
        name: 'Buddha Purnima',
        date: '2025-05-13',
        type: 'restricted',
        description: 'Buddha Purnima - Buddhist Festival'
      },
      {
        _id: '12',
        name: 'Eid al-Adha',
        date: '2025-06-17',
        type: 'restricted',
        description: 'Eid al-Adha - Islamic Festival'
      },
      {
        _id: '13',
        name: 'Raksha Bandhan',
        date: '2025-08-12',
        type: 'restricted',
        description: 'Raksha Bandhan - Hindu Festival'
      },
      {
        _id: '14',
        name: 'Independence Day',
        date: '2025-08-15',
        type: 'gazetted',
        description: 'Independence Day of India - National Holiday'
      },
      {
        _id: '15',
        name: 'Janmashtami',
        date: '2025-08-26',
        type: 'restricted',
        description: 'Krishna Janmashtami - Hindu Festival'
      },
      {
        _id: '16',
        name: 'Ganesh Chaturthi',
        date: '2025-09-02',
        type: 'restricted',
        description: 'Ganesh Chaturthi - Hindu Festival'
      },
      {
        _id: '17',
        name: 'Dussehra',
        date: '2025-10-02',
        type: 'restricted',
        description: 'Dussehra / Vijayadashami - Hindu Festival'
      },
      {
        _id: '18',
        name: 'Gandhi Jayanti',
        date: '2025-10-02',
        type: 'gazetted',
        description: 'Birth anniversary of Mahatma Gandhi - National Holiday'
      },
      {
        _id: '19',
        name: 'Diwali',
        date: '2025-10-31',
        type: 'restricted',
        description: 'Diwali - Festival of Lights'
      },
      {
        _id: '20',
        name: 'Guru Nanak Jayanti',
        date: '2025-11-15',
        type: 'restricted',
        description: 'Guru Nanak Jayanti - Sikh Festival'
      },
      {
        _id: '21',
        name: 'Christmas',
        date: '2025-12-25',
        type: 'restricted',
        description: 'Christmas Day - Christian Holiday'
      }
    ];

    // Apply filters if provided
    let filteredHolidays = allHolidays;

    if (year) {
      filteredHolidays = filteredHolidays.filter(holiday => 
        new Date(holiday.date).getFullYear() === parseInt(year)
      );
    }

    if (month && year) {
      filteredHolidays = filteredHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getFullYear() === parseInt(year) && 
               holidayDate.getMonth() === parseInt(month) - 1;
      });
    }

    if (type && type !== 'all') {
      filteredHolidays = filteredHolidays.filter(holiday => holiday.type === type);
    }

    // Sort by date
    filteredHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json(filteredHolidays);
  } catch (error) {
    console.error('All holidays error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 