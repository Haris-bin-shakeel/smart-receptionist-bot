// src/utils/userPlan.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Plan types
export const PLAN_TYPES = {
  FREE_TRIAL: 'free_trial',
  BUSINESS: 'business',
  EXPIRED: 'expired'
};

// Plan features
export const PLAN_FEATURES = {
  [PLAN_TYPES.FREE_TRIAL]: {
    name: 'Free Trial',
    duration: 7, // days
    features: {
      basicChatbot: true,
      limitedFaq: true,
      voiceMessages: false,
      calendarIntegration: false,
      analytics: false,
      prioritySupport: false
    }
  },
  [PLAN_TYPES.BUSINESS]: {
    name: 'Business Integration',
    duration: null, // unlimited
    features: {
      basicChatbot: true,
      unlimitedFaq: true,
      voiceMessages: true,
      calendarIntegration: true,
      analytics: true,
      prioritySupport: true
    }
  }
};

// Create new user with free trial
export const createUserWithTrial = async (userId, userData) => {
  try {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + PLAN_FEATURES[PLAN_TYPES.FREE_TRIAL].duration);

    const userPlan = {
      userId,
      plan: PLAN_TYPES.FREE_TRIAL,
      trialStartDate: new Date(),
      trialEndDate: trialEndDate,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };

    await setDoc(doc(db, 'users', userId), userPlan);
    return userPlan;
  } catch (error) {
    console.error('Error creating user with trial:', error);
    throw error;
  }
};

// Get user plan
export const getUserPlan = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    
    // Check if trial has expired
    if (userData.plan === PLAN_TYPES.FREE_TRIAL && userData.trialEndDate) {
      const now = new Date();
      const trialEnd = userData.trialEndDate.toDate();
      
      if (now > trialEnd) {
        // Trial expired, update user plan
        await updateDoc(doc(db, 'users', userId), {
          plan: PLAN_TYPES.EXPIRED,
          isActive: false,
          updatedAt: new Date()
        });
        
        return {
          ...userData,
          plan: PLAN_TYPES.EXPIRED,
          isActive: false
        };
      }
    }

    return userData;
  } catch (error) {
    console.error('Error getting user plan:', error);
    throw error;
  }
};

// Upgrade user to business plan
export const upgradeToBusiness = async (userId, paymentData = {}) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      plan: PLAN_TYPES.BUSINESS,
      isActive: true,
      businessStartDate: new Date(),
      paymentData: {
        ...paymentData,
        upgradedAt: new Date()
      },
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error upgrading user:', error);
    throw error;
  }
};

// Check if user has access to a feature
export const hasFeatureAccess = (userPlan, feature) => {
  if (!userPlan || !userPlan.isActive) {
    return false;
  }

  const planFeatures = PLAN_FEATURES[userPlan.plan]?.features;
  return planFeatures?.[feature] || false;
};

// Get days remaining in trial
export const getTrialDaysRemaining = (userPlan) => {
  if (userPlan?.plan !== PLAN_TYPES.FREE_TRIAL || !userPlan.trialEndDate) {
    return 0;
  }

  const now = new Date();
  const trialEnd = userPlan.trialEndDate.toDate();
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Get plan pricing
export const getPlanPricing = () => {
  return {
    [PLAN_TYPES.FREE_TRIAL]: {
      price: '₨0',
      duration: '7 days',
      currency: 'PKR'
    },
    [PLAN_TYPES.BUSINESS]: {
      price: '₨4,999',
      priceUSD: '$19.99',
      duration: 'month',
      currency: 'PKR'
    }
  };
}; 