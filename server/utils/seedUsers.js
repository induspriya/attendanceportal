const mongoose = require('mongoose');
const User = require('../models/User');

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123456',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator'
  },
  {
    name: 'HR Manager',
    email: 'hr@example.com',
    password: 'hr123456',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    isHR: true
  },
  {
    name: 'Team Manager',
    email: 'manager@example.com',
    password: 'manager123456',
    role: 'manager',
    department: 'Engineering',
    position: 'Team Lead'
  },
  {
    name: 'John Employee',
    email: 'employee@example.com',
    password: 'employee123456',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer'
  },
  {
    name: 'Jane Developer',
    email: 'jane@example.com',
    password: 'jane123456',
    role: 'employee',
    department: 'Engineering',
    position: 'Frontend Developer'
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Add new users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    console.log(`\n✅ User seeding completed successfully!`);
    console.log(`Created ${createdUsers.length} users`);
    
    // Display created users
    console.log('\nCreated Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - ${user.department}`);
    });

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding
seedUsers();
