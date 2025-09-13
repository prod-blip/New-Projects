// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDFBgnT13lNOXZNQzxIfluuCSFWTxXnZs",
  authDomain: "meal-planner-ed0a6.firebaseapp.com",
  projectId: "meal-planner-ed0a6",
  storageBucket: "meal-planner-ed0a6.firebasestorage.app",
  messagingSenderId: "1073880355498",
  appId: "1:1073880355498:web:99a716dd20b4234d1976d3",
  measurementId: "G-Z8D28C89JB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;