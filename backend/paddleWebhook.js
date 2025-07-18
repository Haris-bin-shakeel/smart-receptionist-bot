const express = require('express');
const bodyParser = require('body-parser');
const { getFirestore, doc, updateDoc } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Firebase Admin SDK (if not already done)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use serviceAccount
  });
}
const db = getFirestore();

app.post('/paddle/webhook', async (req, res) => {
  const alertName = req.body.alert_name;
  let userId = null;
  try {
    userId = JSON.parse(req.body.passthrough).userId;
  } catch (e) {
    return res.status(400).send('Invalid passthrough');
  }

  // Handle subscription creation or payment success
  if (
    alertName === 'subscription_created' ||
    alertName === 'subscription_payment_succeeded'
  ) {
    try {
      // Update user plan in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        plan: 'business',
        isActive: true,
        businessStartDate: new Date(),
        updatedAt: new Date(),
        paymentData: {
          paddleSubscriptionId: req.body.subscription_id,
          paddleEmail: req.body.email,
          paddleStatus: req.body.status,
          paddleRaw: req.body,
        },
      });
      console.log(`User ${userId} upgraded to business plan.`);
      return res.send('OK');
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Error updating user');
    }
  }

  // Handle subscription cancellation, etc. as needed

  res.send('OK');
});

// Export or use in your main server
module.exports = app; 