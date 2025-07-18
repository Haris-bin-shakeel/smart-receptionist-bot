// Test script to verify your setup
// Run this in your browser console after setting up Firebase

console.log('🧪 Testing AI Receptionist Setup...');

// Test 1: Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
  console.log('✅ Firebase is loaded');
} else {
  console.log('❌ Firebase not found - check your firebase.js config');
}

// Test 2: Check if auth is available
if (typeof auth !== 'undefined') {
  console.log('✅ Firebase Auth is available');
} else {
  console.log('❌ Firebase Auth not found');
}

// Test 3: Check if Firestore is available
if (typeof db !== 'undefined') {
  console.log('✅ Firestore is available');
} else {
  console.log('❌ Firestore not found');
}

// Test 4: Test user registration (if not logged in)
if (!auth.currentUser) {
  console.log('ℹ️ No user logged in - registration test available');
  console.log('To test registration, go to /register and create an account');
} else {
  console.log('✅ User is logged in:', auth.currentUser.email);
  
  // Test 5: Check user plan in Firestore
  const testUserPlan = async () => {
    try {
      const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('✅ User plan found:', userData.plan);
        console.log('✅ Trial end date:', userData.trialEndDate?.toDate());
        console.log('✅ Is active:', userData.isActive);
      } else {
        console.log('❌ User document not found in Firestore');
      }
    } catch (error) {
      console.log('❌ Error fetching user plan:', error);
    }
  };
  
  testUserPlan();
}

// Test 6: Check if all required functions are available
const requiredFunctions = [
  'createUserWithTrial',
  'getUserPlan', 
  'upgradeToBusiness',
  'hasFeatureAccess',
  'getTrialDaysRemaining'
];

console.log('🔍 Checking required functions...');
requiredFunctions.forEach(func => {
  if (typeof window[func] !== 'undefined') {
    console.log(`✅ ${func} is available`);
  } else {
    console.log(`❌ ${func} not found`);
  }
});

console.log('\n📋 Manual Tests to Run:');
console.log('1. Go to /register and create an account');
console.log('2. Check Firebase Console → Authentication → Users');
console.log('3. Check Firebase Console → Firestore → users collection');
console.log('4. Login and go to Dashboard');
console.log('5. Verify trial countdown shows 7 days');
console.log('6. Check upgrade prompts appear');

console.log('\n🎯 If all tests pass, you\'re ready for Stripe integration!'); 