const mongoose = require('mongoose');
const Holiday = require('../models/Holiday');

// Sample holidays data for 2024-2025
const holidays = [
  // Gazetted Holidays (National)
  {
    name: 'Republic Day',
    date: new Date('2024-01-26'),
    description: 'National holiday celebrating the adoption of the Constitution of India',
    type: 'gazetted'
  },
  {
    name: 'Independence Day',
    date: new Date('2024-08-15'),
    description: 'National holiday celebrating India\'s independence from British rule',
    type: 'gazetted'
  },
  {
    name: 'Gandhi Jayanti',
    date: new Date('2024-10-02'),
    description: 'Birth anniversary of Mahatma Gandhi',
    type: 'gazetted'
  },
  {
    name: 'Republic Day',
    date: new Date('2025-01-26'),
    description: 'National holiday celebrating the adoption of the Constitution of India',
    type: 'gazetted'
  },
  {
    name: 'Independence Day',
    date: new Date('2025-08-15'),
    description: 'National holiday celebrating India\'s independence from British rule',
    type: 'gazetted'
  },
  {
    name: 'Gandhi Jayanti',
    date: new Date('2025-10-02'),
    description: 'Birth anniversary of Mahatma Gandhi',
    type: 'gazetted'
  },

  // Restricted Holidays
  {
    name: 'Makar Sankranti',
    date: new Date('2024-01-15'),
    description: 'Hindu festival marking the sun\'s transit into Capricorn',
    type: 'restricted'
  },
  {
    name: 'Vasant Panchami',
    date: new Date('2024-02-14'),
    description: 'Hindu festival dedicated to Saraswati, goddess of knowledge',
    type: 'restricted'
  },
  {
    name: 'Ram Navami',
    date: new Date('2024-04-17'),
    description: 'Birth anniversary of Lord Rama',
    type: 'restricted'
  },
  {
    name: 'Maha Shivratri',
    date: new Date('2024-03-08'),
    description: 'Hindu festival dedicated to Lord Shiva',
    type: 'restricted'
  },
  {
    name: 'Holi',
    date: new Date('2024-03-25'),
    description: 'Festival of colors',
    type: 'restricted'
  },
  {
    name: 'Raksha Bandhan',
    date: new Date('2024-08-19'),
    description: 'Festival celebrating the bond between brothers and sisters',
    type: 'restricted'
  },
  {
    name: 'Janmashtami',
    date: new Date('2024-08-26'),
    description: 'Birth anniversary of Lord Krishna',
    type: 'restricted'
  },
  {
    name: 'Ganesh Chaturthi',
    date: new Date('2024-09-07'),
    description: 'Birth anniversary of Lord Ganesha',
    type: 'restricted'
  },
  {
    name: 'Dussehra',
    date: new Date('2024-10-12'),
    description: 'Victory of good over evil',
    type: 'restricted'
  },
  {
    name: 'Diwali',
    date: new Date('2024-11-01'),
    description: 'Festival of lights',
    type: 'restricted'
  },
  {
    name: 'Guru Nanak Jayanti',
    date: new Date('2024-11-15'),
    description: 'Birth anniversary of Guru Nanak Dev Ji',
    type: 'restricted'
  },
  {
    name: 'Christmas',
    date: new Date('2024-12-25'),
    description: 'Birth of Jesus Christ',
    type: 'restricted'
  },

  // Company Holidays
  {
    name: 'New Year\'s Day',
    date: new Date('2024-01-01'),
    description: 'First day of the new year',
    type: 'company'
  },
  {
    name: 'Good Friday',
    date: new Date('2024-03-29'),
    description: 'Christian holiday commemorating the crucifixion of Jesus',
    type: 'company'
  },
  {
    name: 'Easter Monday',
    date: new Date('2024-04-01'),
    description: 'Day after Easter Sunday',
    type: 'company'
  },
  {
    name: 'New Year\'s Day',
    date: new Date('2025-01-01'),
    description: 'First day of the new year',
    type: 'company'
  },

  // Optional Holidays
  {
    name: 'Muharram',
    date: new Date('2024-07-17'),
    description: 'Islamic New Year',
    type: 'optional'
  },
  {
    name: 'Eid al-Fitr',
    date: new Date('2024-04-10'),
    description: 'End of Ramadan',
    type: 'optional'
  },
  {
    name: 'Eid al-Adha',
    date: new Date('2024-06-17'),
    description: 'Feast of Sacrifice',
    type: 'optional'
  },
  {
    name: 'Muharram',
    date: new Date('2025-07-07'),
    description: 'Islamic New Year',
    type: 'optional'
  }
];

// Add Sundays for 2024-2025 (first few months as examples)
const addSundays = () => {
  const sundays = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-12-31');
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    if (date.getDay() === 0) { // Sunday
      sundays.push({
        name: 'Sunday',
        date: new Date(date),
        description: 'Weekly holiday - Sunday',
        type: 'sunday'
      });
    }
  }
  
  return sundays;
};

const seedHolidays = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal');
    console.log('Connected to MongoDB');

    // Clear existing holidays
    await Holiday.deleteMany({});
    console.log('Cleared existing holidays');

    // Add regular holidays
    await Holiday.insertMany(holidays);
    console.log(`Added ${holidays.length} regular holidays`);

    // Add Sundays
    const sundays = addSundays();
    await Holiday.insertMany(sundays);
    console.log(`Added ${sundays.length} Sundays`);

    console.log('Holiday seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding holidays:', error);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedHolidays();
}

module.exports = { seedHolidays }; 