const express = require('express');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/webhooks/payfast
// @desc    PayFast webhook handler (alternative endpoint)
// @access  Public
router.post('/payfast', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Log webhook data for debugging
    console.log('PayFast webhook received:', paymentData);
    
    // Process payment data (same logic as in payments.js)
    const paymentStatus = paymentData.payment_status;
    const paymentReference = paymentData.m_payment_id;
    const userId = paymentData.custom_str1;
    const plan = paymentData.custom_str2;

    if (!userId) {
      console.error('No user ID in webhook data');
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for webhook:', paymentReference);
      return res.status(404).json({ error: 'User not found' });
    }

    if (paymentStatus === 'COMPLETE') {
      // Payment successful - upgrade user
      user.subscription.plan = plan;
      user.subscription.status = 'active';
      user.subscription.startDate = new Date();
      user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      user.subscription.lastPaymentDate = new Date();
      user.subscription.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      user.subscription.paymentMethod = 'payfast';
      
      await user.save();

      console.log(`Webhook: Payment successful for user ${userId}, plan: ${plan}`);
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
      // Payment failed - keep user on current plan
      user.subscription.status = 'inactive';
      await user.save();

      console.log(`Webhook: Payment failed for user ${userId}, status: ${paymentStatus}`);
    }

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('PayFast webhook error:', error);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// @route   POST /api/webhooks/telegram
// @desc    Telegram bot webhook for interaction tracking
// @access  Public
router.post('/telegram', async (req, res) => {
  try {
    const { userId, interactionType, sentiment, message, response } = req.body;
    
    if (!userId || !interactionType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user and record interaction
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // This would typically call the analytics service
    // For now, we'll just log the interaction
    console.log(`Telegram interaction recorded: User ${userId}, Type: ${interactionType}, Sentiment: ${sentiment}`);

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// @route   POST /api/webhooks/health-check
// @desc    Health check endpoint for webhook monitoring
// @access  Public
router.post('/health-check', async (req, res) => {
  try {
    // Simple health check
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'Webhook endpoint is healthy'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

module.exports = router; 