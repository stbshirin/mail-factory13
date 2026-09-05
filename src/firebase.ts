import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFirestore, Firestore } from 'firebase/firestore';

// User provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCxQ-Nc-cqziN55BFBJ1hI_6_q7deebtMI",
  authDomain: "mail-fact20.firebaseapp.com",
  projectId: "mail-fact20",
  storageBucket: "mail-fact20.firebasestorage.app",
  messagingSenderId: "538739421300",
  appId: "1:538739421300:web:fba647302c943d0df92121",
  databaseURL: "https://mail-fact20-default-rtdb.firebaseio.com"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

let db: Database | null = null;
try {
  db = getDatabase(app);
} catch {
  try {
    db = getDatabase(app, "https://mail-fact20-default-rtdb.firebaseio.com");
  } catch (err) {
    console.warn('Realtime Database not initialized:', err);
  }
}

let firestore: Firestore | null = null;
try {
  firestore = getFirestore(app);
} catch (err) {
  console.warn('Firestore not initialized:', err);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Default admin and contact info
export const PRIMARY_ADMIN_EMAIL = 'soheltajbhola@gmail.com';
export const ADMIN_PHONE = '01748247931';
export const TELEGRAM_CHANNEL = '@techlystb';
export const TELEGRAM_URL = 'https://t.me/techlystb';

// Known admin emails list
export const KNOWN_ADMIN_EMAILS = [
  'soheltajbhola@gmail.com',
  'stb.shirin@gmail.com',
  'limonk829@gmail.com'
];

export { app, auth, db, firestore, googleProvider };
