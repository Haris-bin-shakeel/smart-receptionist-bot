# 💳 Stripe Integration Guide for AI Receptionist

## Overview

This guide will help you integrate Stripe payments to automatically upgrade users from free trial to business plan.

## Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Complete business verification
4. Get your API keys from Dashboard → Developers → API keys

## Step 2: Install Stripe Dependencies

```bash
npm install @stripe/stripe-js
```

## Step 3: Create Stripe Configuration

Create `src/utils/stripe.js`:

```javascript
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

export default stripePromise;
```

## Step 4: Create Payment Component

Create `src/components/StripeCheckout.jsx`:

```javascript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { upgradeToBusiness } from '../utils/userPlan';
import stripePromise from '../utils/stripe';

const StripeCheckout = ({ onSuccess, onCancel }) => {
  const { currentUser, loadUserPlan } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          email: currentUser.email,
          plan: 'business'
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <h3>Upgrade to Business Plan</h3>
      <div className="plan-details">
        <p><strong>Price:</strong> ₨4,999/month</p>
        <p><strong>Features:</strong></p>
        <ul>
          <li>✅ Unlimited FAQ responses</li>
          <li>✅ Voice message processing</li>
          <li>✅ Calendar integration</li>
          <li>✅ Advanced analytics</li>
          <li>✅ Priority support</li>
        </ul>
      </div>
      
      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="btn-upgrade"
      >
        {loading ? 'Processing...' : 'Upgrade Now'}
      </button>
      
      {onCancel && (
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      )}
    </div>
  );
};

export default StripeCheckout;
```

## Step 5: Backend Setup (Node.js/Express)

Create `backend/server.js`:

```javascript
const express = require('express');
const stripe = require('stripe')('sk_test_your_secret_key_here');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId, email, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'AI Receptionist Business Plan',
              description: 'Monthly subscription for AI Receptionist',
            },
            unit_amount: 499900, // ₨4,999 in paisa
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/dashboard?canceled=true`,
      customer_email: email,
      metadata: {
        userId: userId,
        plan: plan
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_your_webhook_secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update user plan in Firestore
    const userId = session.metadata.userId;
    // Call your upgradeToBusiness function here
    console.log('Payment successful for user:', userId);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 6: Update Dashboard for Stripe Integration

Update your Dashboard component to use StripeCheckout:

```javascript
// In Dashboard.jsx, replace handleUpgrade function:

const handleUpgrade = () => {
  setShowStripeCheckout(true);
};

// Add state for showing checkout
const [showStripeCheckout, setShowStripeCheckout] = useState(false);

// Add StripeCheckout component to your JSX
{showStripeCheckout && (
  <div className="modal-overlay">
    <div className="modal-content">
      <StripeCheckout
        onSuccess={() => {
          setShowStripeCheckout(false);
          // Reload user plan
          loadUserPlan(currentUser.uid);
        }}
        onCancel={() => setShowStripeCheckout(false)}
      />
    </div>
  </div>
)}
```

## Step 7: Environment Variables

Create `.env` file:

```bash
# Stripe Keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Firebase Config
REACT_APP_FIREBASE_API_KEY=your_firebase_key
# ... other Firebase config
```

## Step 8: Test the Integration

1. Start your backend: `node backend/server.js`
2. Start your frontend: `npm start`
3. Register a new account
4. Try the upgrade flow
5. Check Stripe Dashboard for test payments

## Step 9: Production Deployment

1. Replace test keys with live keys
2. Set up proper webhook endpoints
3. Configure domain restrictions
4. Set up proper error handling
5. Add payment analytics

## Expected Flow

1. User clicks "Upgrade" in dashboard
2. Stripe Checkout opens
3. User enters payment details
4. Payment is processed
5. Webhook updates user plan in Firestore
6. User sees updated dashboard with business features

## Security Considerations

- Never expose secret keys in frontend
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Add payment logging

## Troubleshooting

- **Checkout not loading**: Verify publishable key
- **Payment failures**: Check Stripe Dashboard for errors
- **Webhook issues**: Verify endpoint secret and URL
- **Plan not updating**: Check Firestore permissions

## Next Steps

After Stripe integration:
1. Add subscription management
2. Implement usage tracking
3. Set up email notifications
4. Add payment analytics
5. Deploy to production

---

**🎉 Congratulations!** Your SaaS now has a complete payment system! 💰 