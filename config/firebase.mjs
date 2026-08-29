import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase for admin
let db = null;

try {
  if (admin.apps.length === 0) {
    initializeAdminApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  db = admin.database();
  console.log('✅ Firebase Realtime Database Connected');
} catch (error) {
  console.warn('⚠️  Firebase Connection Warning:', error.message);
  console.warn('💡 Setup Firebase: https://console.firebase.google.com');
}

export default db;
