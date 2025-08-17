const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'national', 
      'company', 
      'optional', 
      'gazetted', 
      'restricted', 
      'sunday', 
      'saturday', 
      'religious',
      'cultural',
      'regional'
    ],
    default: 'national'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create index for date field for efficient queries
holidaySchema.index({ date: 1 });

module.exports = mongoose.model('Holiday', holidaySchema); 