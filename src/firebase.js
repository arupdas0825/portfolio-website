// src/firebase.js
// ✏️ Replace with YOUR Firebase config from console.firebase.google.com
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyAUOWCYogkSr70_w2mtHRmvX0HQN6nmGrY",
  authDomain: "arup-portfolio.firebaseapp.com",
  projectId: "arup-portfolio",
  messagingSenderId: "695869509670",
  appId: "1:695869509670:web:339e7da2cc0ada144fd6e7",
  measurementId: "G-YRHP147LKR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;