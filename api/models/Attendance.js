const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    time: {
      type: Date
    },
    location: {
      type: String,
      default: 'Office'
    }
  },
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: String,
      default: 'Office'
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index for user and date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Calculate total hours when checkOut is set
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const checkInTime = new Date(this.checkIn.time);
    const checkOutTime = new Date(this.checkOut.time);
    const diffInHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    this.totalHours = Math.round(diffInHours * 100) / 100;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema); 