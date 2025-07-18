const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/subscriptions/status
// @desc    Get subscription status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      subscription: user.subscription,
      isActive: user.isSubscriptionActive,
      trialDaysRemaining: user.trialDaysRemaining,
      botConfig: user.botConfig
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Server error fetching subscription status' });
  }
});

// @route   PUT /api/subscriptions/bot-config
// @desc    Update bot configuration
// @access  Private
router.put('/bot-config', auth, [
  body('customGreeting').optional().isLength({ max: 200 }),
  body('businessHours.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('businessHours.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('timezone').optional().isIn(['Asia/Karachi', 'Asia/Dubai', 'Asia/Tokyo', 'America/New_York', 'Europe/London'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customGreeting, businessHours, timezone } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update bot configuration
    if (customGreeting) user.botConfig.customGreeting = customGreeting;
    if (businessHours) {
      if (businessHours.start) user.botConfig.businessHours.start = businessHours.start;
      if (businessHours.end) user.botConfig.businessHours.end = businessHours.end;
    }
    if (timezone) user.botConfig.timezone = timezone;

    await user.save();

    res.json({
      message: 'Bot configuration updated successfully',
      botConfig: user.botConfig
    });

  } catch (error) {
    console.error('Update bot config error:', error);
    res.status(500).json({ error: 'Server error updating bot configuration' });
  }
});

// @route   POST /api/subscriptions/upgrade
// @desc    Request subscription upgrade
// @access  Private
router.post('/upgrade', auth, [
  body('plan').isIn(['business']),
  body('amount').isNumeric().isFloat({ min: 1000, max: 50000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, amount } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already on business plan
    if (user.subscription.plan === 'business' && user.subscription.status === 'active') {
      return res.status(400).json({ error: 'User is already on business plan' });
    }

    // Redirect to payment creation
    res.json({
      message: 'Redirecting to payment',
      redirectTo: '/api/payments/create-payment',
      paymentData: { plan, amount }
    });

  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Server error during upgrade request' });
  }
});

// @route   POST /api/subscriptions/downgrade
// @desc    Downgrade to free plan
// @access  Private
router.post('/downgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Downgrade to free plan
    user.subscription.plan = 'free';
    user.subscription.status = 'inactive';
    user.subscription.endDate = new Date();
    user.subscription.paymentMethod = 'none';
    
    await user.save();

    res.json({
      message: 'Successfully downgraded to free plan',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Downgrade subscription error:', error);
    res.status(500).json({ error: 'Server error during downgrade' });
  }
});

// @route   GET /api/subscriptions/features
// @desc    Get available features based on subscription
// @access  Private
router.get('/features', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isActive = user.isSubscriptionActive;
    const plan = user.subscription.plan;

    const features = {
      free: {
        basicChatbot: true,
        limitedFaq: true,
        basicAiResponses: true,
        calendarBooking: false,
        voiceMessages: false,
        prioritySupport: false,
        analytics: false,
        customIntegration: false
      },
      business: {
        basicChatbot: true,
        unlimitedFaq: true,
        unlimitedAiResponses: true,
        calendarBooking: isActive,
        voiceMessages: isActive,
        prioritySupport: isActive,
        analytics: isActive,
        customIntegration: isActive
      }
    };

    res.json({
      currentPlan: plan,
      isActive,
      features: features[plan] || features.free,
      trialDaysRemaining: user.trialDaysRemaining
    });

  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Server error fetching features' });
  }
});

module.exports = router; 