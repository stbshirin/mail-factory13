import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default / fallback configuration
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Check if firebase-applet-config.json exists in project root (dynamically or statically)
  const firebaseConfig = {
    apiKey: "AIzaSyDemo-MailFactoryAppKey12345",
    authDomain: "mail-factory-app.firebaseapp.com",
    projectId: "mail-factory-app",
    storageBucket: "mail-factory-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456",
  };

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase initialized in local/offline fallback mode:', err);
}

export { app, auth, db };
export const ADMIN_EMAIL = 'soheltajbhola@gmail.com';
