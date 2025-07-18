const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  metrics: {
    appointmentsBooked: {
      type: Number,
      default: 0
    },
    voiceMessagesHandled: {
      type: Number,
      default: 0
    },
    textMessagesHandled: {
      type: Number,
      default: 0
    },
    faqQueries: {
      type: Number,
      default: 0
    },
    sentimentPositive: {
      type: Number,
      default: 0
    },
    sentimentNeutral: {
      type: Number,
      default: 0
    },
    sentimentNegative: {
      type: Number,
      default: 0
    },
    aiFallbackUsed: {
      type: Number,
      default: 0
    },
    totalInteractions: {
      type: Number,
      default: 0
    }
  },
  interactions: [{
    type: {
      type: String,
      enum: ['appointment', 'voice', 'text', 'faq', 'ai_fallback']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    duration: Number, // for voice messages
    userMessage: String,
    botResponse: String
  }],
  businessHours: {
    start: String,
    end: String
  },
  timezone: String
});

// Index for efficient queries
analyticsSchema.index({ userId: 1, date: 1 });
analyticsSchema.index({ date: 1 });

// Virtual for total interactions
analyticsSchema.virtual('totalInteractionsCount').get(function() {
  return this.metrics.appointmentsBooked + 
         this.metrics.voiceMessagesHandled + 
         this.metrics.textMessagesHandled + 
         this.metrics.faqQueries;
});

// Static method to get monthly analytics
analyticsSchema.statics.getMonthlyAnalytics = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: '$metrics.appointmentsBooked' },
        totalVoiceMessages: { $sum: '$metrics.voiceMessagesHandled' },
        totalTextMessages: { $sum: '$metrics.textMessagesHandled' },
        totalFaqQueries: { $sum: '$metrics.faqQueries' },
        totalPositiveSentiment: { $sum: '$metrics.sentimentPositive' },
        totalNeutralSentiment: { $sum: '$metrics.sentimentNeutral' },
        totalNegativeSentiment: { $sum: '$metrics.sentimentNegative' },
        totalAiFallback: { $sum: '$metrics.aiFallbackUsed' },
        totalInteractions: { $sum: '$metrics.totalInteractions' }
      }
    }
  ]);
};

// Static method to get daily analytics for a month
analyticsSchema.statics.getDailyAnalytics = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        appointmentsBooked: { $sum: '$metrics.appointmentsBooked' },
        voiceMessagesHandled: { $sum: '$metrics.voiceMessagesHandled' },
        textMessagesHandled: { $sum: '$metrics.textMessagesHandled' },
        faqQueries: { $sum: '$metrics.faqQueries' },
        totalInteractions: { $sum: '$metrics.totalInteractions' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Analytics', analyticsSchema); 