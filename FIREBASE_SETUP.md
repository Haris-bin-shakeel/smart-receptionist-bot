# 🔥 Firebase Setup Guide for AI Receptionist

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `ai-receptionist-website`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password"
3. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select location: `asia-south1` (Mumbai) for best performance in Pakistan
4. Click "Done"

## Step 4: Get Your Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Name it: `ai-receptionist-web`
5. Copy the config object

## Step 5: Update Your Code

Replace the placeholder config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 6: Test Your App

1. Run: `npm start`
2. Go to: `http://localhost:3000`
3. Click "Register" and create an account
4. Check Firebase Console → Firestore → users collection
5. Verify the user document has:
   - `plan: "free_trial"`
   - `trialStartDate` and `trialEndDate`
   - `isActive: true`

## Step 7: Test Features

1. Login and go to Dashboard
2. Check trial countdown (should show 7 days)
3. Try accessing restricted features
4. Verify upgrade prompts appear

## Expected Firestore Document Structure

```json
{
  "userId": "firebase-auth-uid",
  "email": "user@example.com",
  "plan": "free_trial",
  "trialStartDate": "2024-01-15T10:30:00Z",
  "trialEndDate": "2024-01-22T10:30:00Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Troubleshooting

- **Auth errors**: Check if Email/Password auth is enabled
- **Firestore errors**: Ensure database is created and rules allow read/write
- **Config errors**: Double-check your Firebase config values

## Next Steps

Once testing is successful, you'll be ready for Stripe integration! 