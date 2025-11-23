import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ REPLACE WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyA4ayYObm1p0HDA0qU5DjOXZLkCtE8rFLI",
  authDomain: "curiouschloe-104ca.firebaseapp.com",
  projectId: "curiouschloe-104ca",
  storageBucket: "curiouschloe-104ca.firebasestorage.app",
  messagingSenderId: "96165888428",
  appId: "1:96165888428:web:f28d9b372878e1c13fba09",
  measurementId: "G-7Z0W2WBJ7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (NOT Analytics)
const db = getFirestore(app);

// Export db
export { db };