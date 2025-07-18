const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'business'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'trial'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    paymentMethod: {
      type: String,
      enum: ['payfast', 'easypaisa', 'none'],
      default: 'none'
    },
    lastPaymentDate: Date,
    nextBillingDate: Date
  },
  botConfig: {
    telegramBotToken: String,
    googleCalendarId: String,
    customGreeting: {
      type: String,
      default: 'Hello! How can I help you today?'
    },
    businessHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' }
    },
    timezone: {
      type: String,
      default: 'Asia/Karachi'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
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

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.status === 'trial') {
    // 14-day trial period
    const trialEnd = new Date(this.createdAt.getTime() + (14 * 24 * 60 * 60 * 1000));
    return new Date() < trialEnd;
  }
  return this.subscription.status === 'active';
});

// Virtual for days remaining in trial
userSchema.virtual('trialDaysRemaining').get(function() {
  if (this.subscription.status !== 'trial') return 0;
  
  const trialEnd = new Date(this.createdAt.getTime() + (14 * 24 * 60 * 60 * 1000));
  const now = new Date();
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

module.exports = mongoose.model('User', userSchema); 