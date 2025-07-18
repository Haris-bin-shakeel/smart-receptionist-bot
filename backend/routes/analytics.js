const express = require('express');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for current month
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Get current month analytics
    const monthlyData = await Analytics.getMonthlyAnalytics(user._id, currentYear, currentMonth);
    
    // Get daily data for current month
    const dailyData = await Analytics.getDailyAnalytics(user._id, currentYear, currentMonth);

    // Calculate trial days remaining
    const trialDaysRemaining = user.trialDaysRemaining;

    // Calculate growth percentage (compare with previous month)
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    const previousMonthData = await Analytics.getMonthlyAnalytics(user._id, previousYear, previousMonth);
    
    const currentTotal = monthlyData[0] ? monthlyData[0].totalInteractions : 0;
    const previousTotal = previousMonthData[0] ? previousMonthData[0].totalInteractions : 0;
    const growthPercentage = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    res.json({
      overview: {
        currentMonth: {
          totalAppointments: monthlyData[0]?.totalAppointments || 0,
          totalVoiceMessages: monthlyData[0]?.totalVoiceMessages || 0,
          totalTextMessages: monthlyData[0]?.totalTextMessages || 0,
          totalFaqQueries: monthlyData[0]?.totalFaqQueries || 0,
          totalInteractions: currentTotal,
          sentimentBreakdown: {
            positive: monthlyData[0]?.totalPositiveSentiment || 0,
            neutral: monthlyData[0]?.totalNeutralSentiment || 0,
            negative: monthlyData[0]?.totalNegativeSentiment || 0
          },
          aiFallbackUsage: monthlyData[0]?.totalAiFallback || 0
        },
        growth: {
          percentage: Math.round(growthPercentage * 100) / 100,
          trend: growthPercentage >= 0 ? 'up' : 'down'
        },
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status,
          trialDaysRemaining,
          isActive: user.isSubscriptionActive
        }
      },
      dailyData: dailyData.map(day => ({
        date: day._id,
        appointments: day.appointmentsBooked,
        voiceMessages: day.voiceMessagesHandled,
        textMessages: day.textMessagesHandled,
        faqQueries: day.faqQueries,
        totalInteractions: day.totalInteractions
      }))
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Server error fetching analytics' });
  }
});

// @route   GET /api/analytics/monthly/:year/:month
// @desc    Get detailed analytics for specific month
// @access  Private
router.get('/monthly/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const monthlyData = await Analytics.getMonthlyAnalytics(user._id, parseInt(year), parseInt(month));
    const dailyData = await Analytics.getDailyAnalytics(user._id, parseInt(year), parseInt(month));

    // Get top interactions for the month
    const topInteractions = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0, 23, 59, 59)
          }
        }
      },
      { $unwind: '$interactions' },
      {
        $group: {
          _id: '$interactions.type',
          count: { $sum: 1 },
          avgSentiment: {
            $avg: {
              $cond: [
                { $eq: ['$interactions.sentiment', 'positive'] },
                1,
                { $cond: [{ $eq: ['$interactions.sentiment', 'negative'] }, -1, 0] }
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      monthly: monthlyData[0] || {
        totalAppointments: 0,
        totalVoiceMessages: 0,
        totalTextMessages: 0,
        totalFaqQueries: 0,
        totalPositiveSentiment: 0,
        totalNeutralSentiment: 0,
        totalNegativeSentiment: 0,
        totalAiFallback: 0,
        totalInteractions: 0
      },
      daily: dailyData,
      topInteractions: topInteractions.map(item => ({
        type: item._id,
        count: item.count,
        avgSentiment: Math.round(item.avgSentiment * 100) / 100
      }))
    });

  } catch (error) {
    console.error('Monthly analytics error:', error);
    res.status(500).json({ error: 'Server error fetching monthly analytics' });
  }
});

// @route   POST /api/analytics/record-interaction
// @desc    Record a new interaction (called by bot)
// @access  Private
router.post('/record-interaction', auth, async (req, res) => {
  try {
    const { type, sentiment, duration, userMessage, botResponse } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics record
    let analytics = await Analytics.findOne({
      userId: user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!analytics) {
      analytics = new Analytics({
        userId: user._id,
        date: today,
        businessHours: user.botConfig.businessHours,
        timezone: user.botConfig.timezone
      });
    }

    // Update metrics based on interaction type
    switch (type) {
      case 'appointment':
        analytics.metrics.appointmentsBooked++;
        break;
      case 'voice':
        analytics.metrics.voiceMessagesHandled++;
        break;
      case 'text':
        analytics.metrics.textMessagesHandled++;
        break;
      case 'faq':
        analytics.metrics.faqQueries++;
        break;
      case 'ai_fallback':
        analytics.metrics.aiFallbackUsed++;
        break;
    }

    // Update sentiment metrics
    if (sentiment) {
      switch (sentiment) {
        case 'positive':
          analytics.metrics.sentimentPositive++;
          break;
        case 'neutral':
          analytics.metrics.sentimentNeutral++;
          break;
        case 'negative':
          analytics.metrics.sentimentNegative++;
          break;
      }
    }

    analytics.metrics.totalInteractions++;

    // Add interaction details
    analytics.interactions.push({
      type,
      timestamp: new Date(),
      sentiment,
      duration,
      userMessage,
      botResponse
    });

    await analytics.save();

    res.json({ message: 'Interaction recorded successfully' });

  } catch (error) {
    console.error('Record interaction error:', error);
    res.status(500).json({ error: 'Server error recording interaction' });
  }
});

// @route   GET /api/analytics/export/:year/:month
// @desc    Export analytics data as CSV
// @access  Private
router.get('/export/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dailyData = await Analytics.getDailyAnalytics(user._id, parseInt(year), parseInt(month));

    // Generate CSV content
    const csvHeader = 'Date,Appointments,Voice Messages,Text Messages,FAQ Queries,Total Interactions\n';
    const csvRows = dailyData.map(day => 
      `${day._id},${day.appointmentsBooked},${day.voiceMessagesHandled},${day.textMessagesHandled},${day.faqQueries},${day.totalInteractions}`
    ).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${year}-${month}.csv`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ error: 'Server error exporting analytics' });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get AI-powered insights from analytics
// @access  Private
router.get('/insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Get current and previous month data
    const currentMonthData = await Analytics.getMonthlyAnalytics(user._id, currentYear, currentMonth);
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonthData = await Analytics.getMonthlyAnalytics(user._id, previousYear, previousMonth);

    const current = currentMonthData[0] || {};
    const previous = previousMonthData[0] || {};

    // Generate insights
    const insights = [];

    // Growth insights
    const totalGrowth = previous.totalInteractions > 0 
      ? ((current.totalInteractions - previous.totalInteractions) / previous.totalInteractions) * 100 
      : 0;

    if (totalGrowth > 20) {
      insights.push({
        type: 'positive',
        title: 'Strong Growth',
        message: `Your bot interactions increased by ${Math.round(totalGrowth)}% this month!`
      });
    } else if (totalGrowth < -10) {
      insights.push({
        type: 'warning',
        title: 'Declining Usage',
        message: `Bot interactions decreased by ${Math.abs(Math.round(totalGrowth))}%. Consider reviewing your bot configuration.`
      });
    }

    // Appointment booking insights
    if (current.totalAppointments > 0) {
      const appointmentRatio = (current.totalAppointments / current.totalInteractions) * 100;
      if (appointmentRatio > 30) {
        insights.push({
          type: 'positive',
          title: 'High Conversion Rate',
          message: `${Math.round(appointmentRatio)}% of interactions resulted in appointments. Great job!`
        });
      }
    }

    // Sentiment insights
    const totalSentiment = (current.totalPositiveSentiment || 0) + (current.totalNeutralSentiment || 0) + (current.totalNegativeSentiment || 0);
    if (totalSentiment > 0) {
      const positiveRatio = ((current.totalPositiveSentiment || 0) / totalSentiment) * 100;
      if (positiveRatio > 70) {
        insights.push({
          type: 'positive',
          title: 'Excellent Customer Satisfaction',
          message: `${Math.round(positiveRatio)}% of interactions had positive sentiment.`
        });
      } else if (positiveRatio < 40) {
        insights.push({
          type: 'warning',
          title: 'Customer Satisfaction Needs Attention',
          message: `Only ${Math.round(positiveRatio)}% of interactions had positive sentiment. Consider improving bot responses.`
        });
      }
    }

    // AI fallback insights
    if (current.totalAiFallback > 0) {
      const fallbackRatio = (current.totalAiFallback / current.totalInteractions) * 100;
      if (fallbackRatio > 50) {
        insights.push({
          type: 'info',
          title: 'High AI Fallback Usage',
          message: `${Math.round(fallbackRatio)}% of interactions used AI fallback. Consider adding more FAQ entries.`
        });
      }
    }

    // Trial insights
    if (user.subscription.status === 'trial') {
      const trialDaysRemaining = user.trialDaysRemaining;
      if (trialDaysRemaining <= 3) {
        insights.push({
          type: 'warning',
          title: 'Trial Ending Soon',
          message: `Your trial ends in ${trialDaysRemaining} days. Upgrade to continue using all features.`
        });
      }
    }

    res.json({ insights });

  } catch (error) {
    console.error('Analytics insights error:', error);
    res.status(500).json({ error: 'Server error generating insights' });
  }
});

module.exports = router; 