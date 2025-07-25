const express = require('express');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const router = express.Router();

// Store chat-to-business mapping (in production, use Redis or database)
const chatBusinessMapping = new Map();

// @route   GET /api/bot/get-business-by-chat/:chatId
// @desc    Get business ID for a chat ID
// @access  Public (bot access)
router.get('/get-business-by-chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Check in-memory mapping first
    if (chatBusinessMapping.has(chatId)) {
      return res.json({ business_id: chatBusinessMapping.get(chatId) });
    }
    
    // In production, you might look up in database
    // For now, return demo as default
    res.json({ business_id: 'demo' });
  } catch (error) {
    console.error('Error getting business by chat:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bot/map-chat-to-business
// @desc    Map a chat ID to a business ID
// @access  Public (bot access)
router.post('/map-chat-to-business', async (req, res) => {
  try {
    const { chatId, businessId } = req.body;
    
    if (!chatId || !businessId) {
      return res.status(400).json({ error: 'chatId and businessId are required' });
    }
    
    // Store mapping
    chatBusinessMapping.set(chatId, businessId);
    
    res.json({ 
      success: true, 
      message: 'Chat mapped to business successfully',
      chatId,
      businessId 
    });
  } catch (error) {
    console.error('Error mapping chat to business:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bot/analytics/interaction
// @desc    Record bot interaction for analytics
// @access  Public (bot access)
router.post('/analytics/interaction', async (req, res) => {
  try {
    const { 
      business_id, 
      chat_id, 
      user_message, 
      bot_response, 
      sentiment, 
      timestamp 
    } = req.body;

    // Create analytics record
    const analytics = new Analytics({
      businessId: business_id,
      userId: chat_id.toString(),
      type: 'message',
      data: {
        userMessage: user_message,
        botResponse: bot_response,
        sentiment: sentiment,
        platform: 'telegram',
        chatId: chat_id
      },
      timestamp: new Date(timestamp)
    });

    await analytics.save();

    res.json({ 
      success: true, 
      message: 'Interaction recorded successfully' 
    });
  } catch (error) {
    console.error('Error recording bot interaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/bot/business-config/:businessId
// @desc    Get business configuration for bot
// @access  Public (bot access)
router.get('/business-config/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // In production, fetch from database
    // For now, return basic config
    const config = {
      business_name: businessId === 'mimi' ? "Mimi's Beauty Studio" : "Demo Business",
      greeting: businessId === 'mimi' 
        ? "Hi! Welcome to Mimi's Beauty Studio! How can I help you today?"
        : "Hello! Welcome to our demo. How can I assist you?",
      business_hours: { start: "09:00", end: "18:00" },
      services: businessId === 'mimi' 
        ? ["Hair Styling", "Facial", "Manicure", "Bridal Makeup"]
        : ["General Consultation", "Demo Meeting"]
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error getting business config:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/bot/subscription-status/:businessId
// @desc    Check subscription status for a business
// @access  Public (bot access)
router.get('/subscription-status/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // For demo purposes, return free plan
    // In production, check actual subscription
    const status = {
      plan: businessId === 'demo' ? 'free' : 'business',
      active: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: {
        ai_responses: businessId !== 'demo',
        voice_processing: true,
        calendar_integration: true,
        analytics: true
      }
    };
    
    res.json(status);
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;