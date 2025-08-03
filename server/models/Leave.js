const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: [
      'sick', 
      'casual', 
      'annual', 
      'maternity', 
      'paternity', 
      'bereavement',
      'compensatory',
      'sabbatical',
      'unpaid',
      'work-from-home',
      'half-day',
      'other'
    ],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  totalDays: {
    type: Number,
    default: 0
  },
  attachments: [{
    filename: String,
    path: String
  }]
}, {
  timestamps: true
});

// Calculate total days when dates are set
leaveSchema.pre('save', function(next) {
  if (this.from && this.to) {
    const fromDate = new Date(this.from);
    const toDate = new Date(this.to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.totalDays = diffDays;
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema); 