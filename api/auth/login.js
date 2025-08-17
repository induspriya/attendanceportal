const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Temporary User model embedded to avoid import issues on Vercel
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 1 },
  role: { type: String, enum: ['admin', 'hr', 'manager', 'employee'], default: 'employee' },
  department: { type: String, trim: true, default: 'General' },
  position: { type: String, trim: true, default: 'Employee' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

module.exports = async (req, res) => {
  // Set CORS headers for Vercel deployment
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // For now, return a simple test response since we don't have a database set up
    // TODO: Remove this when MongoDB is configured
    if (email === 'test@test.com' && password === 'test') {
      const testUser = {
        id: 'test_user_123',
        name: 'Test User',
        email: 'test@test.com',
        role: 'employee',
        department: 'Testing',
        position: 'Tester'
      };
      
      const token = generateToken(testUser.id);
      
      return res.status(200).json({
        message: 'Login successful (test mode)',
        token,
        user: testUser
      });
    }

    // Connect to MongoDB (commented out for now)
    // if (mongoose.connection.readyState !== 1) {
    //   await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-portal');
    // }

    // Find user by email
    // const user = await User.findOne({ email: email.toLowerCase() });
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid email or password' });
    // }

    // Check if user is active
    // if (!user.isActive) {
    //   return res.status(401).json({ message: 'Account is deactivated' });
    // }

    // Verify password
    // const isPasswordValid = await user.comparePassword(password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: 'Invalid email or password' });
    // }

    // Generate JWT token
    // const token = generateToken(user._id);

    // Update last login
    // user.lastLogin = new Date();
    // await user.save();

    // Return user data and token
    // res.status(200).json({
    //   message: 'Login successful',
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //     department: user.department,
    //     position: user.position,
    //     avatar: user.avatar
    //   }
    // });

    // For now, return error for non-test credentials
    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(500).json({ 
        message: 'Database connection failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
