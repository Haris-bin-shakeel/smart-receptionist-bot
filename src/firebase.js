// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVM-BxPePQLuCFOS9f8EPAL_raabKDPks",
  authDomain: "ai-receptionist-website.firebaseapp.com",
  projectId: "ai-receptionist-website",
  storageBucket: "ai-receptionist-website.firebasestorage.app",
  messagingSenderId: "509358227034",
  appId: "1:509358227034:web:edca5eb97f3672184b2263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 