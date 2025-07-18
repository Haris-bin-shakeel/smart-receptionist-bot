// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserWithTrial, getUserPlan } from '../utils/userPlan';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with free trial
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user plan with free trial
      await createUserWithTrial(user.uid, {
        email,
        ...userData
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Load user plan data
  const loadUserPlan = async (userId) => {
    try {
      const plan = await getUserPlan(userId);
      setUserPlan(plan);
      return plan;
    } catch (error) {
      console.error('Error loading user plan:', error);
      setUserPlan(null);
    }
  };

  // Update user plan (for manual upgrades)
  const updateUserPlan = (newPlan) => {
    setUserPlan(newPlan);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user plan when user is authenticated
        await loadUserPlan(user.uid);
      } else {
        setUserPlan(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userPlan,
    signup,
    login,
    logout,
    resetPassword,
    loadUserPlan,
    updateUserPlan,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 