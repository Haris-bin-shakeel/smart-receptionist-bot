const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// PayFast configuration
const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE,
  testMode: process.env.NODE_ENV === 'development' ? '1' : '0',
  baseUrl: process.env.NODE_ENV === 'development' 
    ? 'https://sandbox.payfast.co.za/eng/process' 
    : 'https://www.payfast.co.za/eng/process'
};

// @route   POST /api/payments/create-payment
// @desc    Create PayFast payment for subscription
// @access  Private
router.post('/create-payment', auth, [
  body('plan').isIn(['business']),
  body('amount').isNumeric().isFloat({ min: 1000, max: 50000 }) // PKR 1000-50000
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

    // Generate unique payment reference
    const paymentReference = `AI_RECEPTIONIST_${user._id}_${Date.now()}`;
    
    // Create payment data for PayFast
    const paymentData = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: `${process.env.FRONTEND_URL}/payment/success?ref=${paymentReference}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled?ref=${paymentReference}`,
      notify_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      
      // Customer details
      name_first: user.contactPerson.split(' ')[0],
      name_last: user.contactPerson.split(' ').slice(1).join(' ') || '',
      email_address: user.email,
      
      // Payment details
      m_payment_id: paymentReference,
      amount: amount.toFixed(2),
      item_name: `AI Receptionist Bot - ${plan} Plan`,
      item_description: `Monthly subscription for ${user.businessName}`,
      
      // Custom data
      custom_str1: user._id.toString(),
      custom_str2: plan,
      custom_str3: user.email,
      
      // Test mode
      test_mode: PAYFAST_CONFIG.testMode
    };

    // Generate signature
    const signature = generatePayFastSignature(paymentData, PAYFAST_CONFIG.passphrase);
    paymentData.signature = signature;

    // Store payment intent in user document
    user.subscription.paymentMethod = 'payfast';
    user.subscription.lastPaymentDate = new Date();
    await user.save();

    res.json({
      paymentUrl: PAYFAST_CONFIG.baseUrl,
      paymentData,
      paymentReference
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Server error during payment creation' });
  }
});

// @route   POST /api/payments/webhook
// @desc    PayFast webhook handler
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Verify PayFast signature
    const receivedSignature = paymentData.signature;
    delete paymentData.signature;
    
    const calculatedSignature = generatePayFastSignature(paymentData, PAYFAST_CONFIG.passphrase);
    
    if (receivedSignature !== calculatedSignature) {
      console.error('PayFast signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const paymentStatus = paymentData.payment_status;
    const paymentReference = paymentData.m_payment_id;
    const userId = paymentData.custom_str1;
    const plan = paymentData.custom_str2;

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for payment:', paymentReference);
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

      // Send confirmation email
      await sendSubscriptionConfirmationEmail(user.email, plan, paymentData.amount);

      console.log(`Payment successful for user ${userId}, plan: ${plan}`);
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
      // Payment failed - keep user on current plan
      user.subscription.status = 'inactive';
      await user.save();

      console.log(`Payment failed for user ${userId}, status: ${paymentStatus}`);
    }

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('PayFast webhook error:', error);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// @route   GET /api/payments/status/:reference
// @desc    Check payment status
// @access  Private
router.get('/status/:reference', auth, async (req, res) => {
  try {
    const { reference } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real implementation, you'd query PayFast API for payment status
    // For now, we'll check the user's subscription status
    res.json({
      paymentReference: reference,
      subscriptionStatus: user.subscription.status,
      plan: user.subscription.plan,
      lastPaymentDate: user.subscription.lastPaymentDate,
      nextBillingDate: user.subscription.nextBillingDate
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Server error during status check' });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel subscription
// @access  Private
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cancel subscription
    user.subscription.status = 'cancelled';
    user.subscription.endDate = new Date();
    await user.save();

    // Send cancellation email
    await sendSubscriptionCancellationEmail(user.email);

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Server error during cancellation' });
  }
});

// Helper function to generate PayFast signature
function generatePayFastSignature(data, passphrase) {
  // Sort the data alphabetically by key
  const sortedKeys = Object.keys(data).sort();
  let signatureString = '';
  
  // Build the signature string
  sortedKeys.forEach(key => {
    if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      signatureString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
    }
  });
  
  // Remove the last '&' and add the passphrase
  signatureString = signatureString.slice(0, -1);
  if (passphrase) {
    signatureString += '&passphrase=' + encodeURIComponent(passphrase).replace(/%20/g, '+');
  }
  
  // Generate MD5 hash
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

// Helper function to send subscription confirmation email
async function sendSubscriptionConfirmationEmail(email, plan, amount) {
  // Implementation would use your email service
  console.log(`Subscription confirmation email sent to ${email} for ${plan} plan - ${amount}`);
}

// Helper function to send subscription cancellation email
async function sendSubscriptionCancellationEmail(email) {
  // Implementation would use your email service
  console.log(`Subscription cancellation email sent to ${email}`);
}

module.exports = router; 