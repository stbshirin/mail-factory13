import { doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, set, get, onValue } from 'firebase/database';
import { sendEmailVerification, sendPasswordResetEmail, User as FirebaseUser } from 'firebase/auth';
import { auth, db, firestore } from '../firebase';
import { MailBatch, User, Transaction } from '../types';

export interface FirebaseConnectionStatus {
  authOk: boolean;
  firestoreOk: boolean;
  rtdbOk: boolean;
  message?: string;
}

/**
 * Test connections to Firebase services
 */
export async function testFirebaseConnection(): Promise<FirebaseConnectionStatus> {
  let authOk = Boolean(auth);
  let firestoreOk = false;
  let rtdbOk = false;
  let message = '';

  // Test Firestore
  if (firestore) {
    try {
      const pingDoc = doc(firestore, '_health', 'ping');
      await setDoc(pingDoc, {
        timestamp: new Date().toISOString(),
        client: 'MailFactory-Client',
      }, { merge: true });
      firestoreOk = true;
    } catch (err: any) {
      console.warn('Firestore ping warning:', err.message);
      message += `Firestore: ${err.message || 'Permission denied or not created'}. `;
    }
  }

  // Test Realtime Database
  if (db) {
    try {
      const pingRef = ref(db, '_health/ping');
      await set(pingRef, {
        timestamp: new Date().toISOString(),
        client: 'MailFactory-Client',
      });
      rtdbOk = true;
    } catch (err: any) {
      console.warn('RTDB ping warning:', err.message);
      message += `RTDB: ${err.message || 'Permission denied or not created'}. `;
    }
  }

  return {
    authOk,
    firestoreOk,
    rtdbOk,
    message: message.trim() || 'Firebase সার্ভিস সফলভাবে সংযুক্ত রয়েছে।',
  };
}

/**
 * Save Mail Batch & all submitted emails to Firebase (both Firestore and RTDB)
 */
export async function saveBatchToFirebase(batch: MailBatch): Promise<{ success: boolean; firestore: boolean; rtdb: boolean; error?: string }> {
  let firestoreSaved = false;
  let rtdbSaved = false;
  let errorMsg = '';

  // Clean data for Firebase (avoid undefined values)
  const cleanBatchData = {
    id: batch.id,
    userId: batch.userId || '',
    userName: batch.userName || 'Anonymous',
    userEmail: batch.userEmail || '',
    batchName: batch.batchName || 'Gmail Batch',
    mailType: batch.mailType || 'fresh',
    pricePerMail: Number(batch.pricePerMail) || 0,
    totalMails: Number(batch.totalMails) || 0,
    validMailsCount: Number(batch.validMailsCount) || 0,
    totalAmount: Number(batch.totalAmount) || 0,
    status: batch.status || 'pending',
    shiftName: batch.shiftName || 'Morning Shift',
    submittedAt: batch.submittedAt || new Date().toISOString(),
    paymentMethod: batch.paymentMethod || 'bkash',
    payoutAccount: batch.payoutAccount || '',
    rawText: batch.rawText || '',
    // Detailed mails array
    mails: (batch.mails || []).map(m => ({
      id: m.id || '',
      email: m.email || '',
      password: m.password || '',
      recoveryEmail: m.recoveryEmail || '',
      status: m.status || 'valid',
    })),
  };

  // 1. Save to Cloud Firestore
  if (firestore) {
    try {
      // Save batch metadata & mails in mail_batches collection
      const batchDocRef = doc(firestore, 'mail_batches', batch.id);
      await setDoc(batchDocRef, cleanBatchData, { merge: true });

      // Also save in a dedicated submitted_emails collection for easy querying in console
      const submittedMailsDocRef = doc(firestore, 'submitted_emails', batch.id);
      await setDoc(submittedMailsDocRef, {
        batchId: batch.id,
        userId: batch.userId,
        userName: batch.userName,
        userEmail: batch.userEmail,
        mailType: batch.mailType,
        validCount: batch.validMailsCount,
        totalAmount: batch.totalAmount,
        submittedAt: cleanBatchData.submittedAt,
        status: batch.status,
        emailsList: cleanBatchData.mails,
      }, { merge: true });

      firestoreSaved = true;
      console.log(`[Firebase] Batch ${batch.id} saved to Cloud Firestore`);
    } catch (err: any) {
      console.warn('[Firebase] Firestore batch save error:', err);
      errorMsg += `Firestore: ${err.message}. `;
    }
  }

  // 2. Save to Realtime Database
  if (db) {
    try {
      const batchRef = ref(db, `batches/${batch.id}`);
      await set(batchRef, cleanBatchData);

      const submittedRef = ref(db, `submitted_emails/${batch.id}`);
      await set(submittedRef, {
        batchId: batch.id,
        userId: batch.userId,
        userEmail: batch.userEmail,
        validCount: batch.validMailsCount,
        emailsList: cleanBatchData.mails,
        submittedAt: cleanBatchData.submittedAt,
      });

      rtdbSaved = true;
      console.log(`[Firebase] Batch ${batch.id} saved to Realtime Database`);
    } catch (err: any) {
      console.warn('[Firebase] RTDB batch save error:', err);
      errorMsg += `RTDB: ${err.message}. `;
    }
  }

  const success = firestoreSaved || rtdbSaved;
  return {
    success,
    firestore: firestoreSaved,
    rtdb: rtdbSaved,
    error: errorMsg.trim() || undefined,
  };
}

/**
 * Save user profile and account details to Firebase
 */
export async function saveUserToFirebase(user: User): Promise<{ success: boolean; firestore: boolean; rtdb: boolean }> {
  let firestoreSaved = false;
  let rtdbSaved = false;

  const cleanUserData = {
    id: user.id,
    name: user.name || 'User',
    email: (user.email || '').toLowerCase(),
    phone: user.phone || '',
    role: user.role || 'user',
    balanceBdt: Number(user.balanceBdt) || 0,
    balanceUsd: Number(user.balanceUsd) || 0,
    sellerBalance: Number(user.sellerBalance) || 0,
    buyerBalance: Number(user.buyerBalance) || 0,
    referralCode: user.referralCode || '',
    referralEarnings: Number(user.referralEarnings) || 0,
    memberTier: user.memberTier || 'Silver',
    joinedAt: user.joinedAt || new Date().toISOString().split('T')[0],
    avatarUrl: user.avatarUrl || '',
    totalSubmittedMails: Number(user.totalSubmittedMails) || 0,
    totalApprovedMails: Number(user.totalApprovedMails) || 0,
    totalEarnings: Number(user.totalEarnings) || 0,
    totalBoughtMails: Number(user.totalBoughtMails) || 0,
    bKashNumber: user.bKashNumber || '',
    nagadNumber: user.nagadNumber || '',
    updatedAt: new Date().toISOString(),
  };

  // 1. Cloud Firestore
  if (firestore) {
    try {
      const userDocRef = doc(firestore, 'users', user.id);
      await setDoc(userDocRef, cleanUserData, { merge: true });
      firestoreSaved = true;
    } catch (err) {
      console.warn('[Firebase] Firestore user save error:', err);
    }
  }

  // 2. Realtime Database
  if (db) {
    try {
      const userRef = ref(db, `users/${user.id}`);
      await set(userRef, cleanUserData);
      rtdbSaved = true;
    } catch (err) {
      console.warn('[Firebase] RTDB user save error:', err);
    }
  }

  return { success: firestoreSaved || rtdbSaved, firestore: firestoreSaved, rtdb: rtdbSaved };
}

/**
 * Delete user from Firebase (Firestore and Realtime Database)
 */
export async function deleteUserFromFirebase(userId: string): Promise<boolean> {
  let deleted = false;
  if (firestore) {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      const userDocRef = doc(firestore, 'users', userId);
      await deleteDoc(userDocRef);
      deleted = true;
    } catch (err) {
      console.warn('[Firebase] Firestore delete user error:', err);
    }
  }
  if (db) {
    try {
      const { remove } = await import('firebase/database');
      const userRef = ref(db, `users/${userId}`);
      await remove(userRef);
      deleted = true;
    } catch (err) {
      console.warn('[Firebase] RTDB delete user error:', err);
    }
  }
  return deleted;
}

/**
 * Trigger email verification to Firebase user
 */
export async function sendVerificationEmailToUser(firebaseUser: FirebaseUser): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    if (!firebaseUser) {
      return { success: false, message: 'ইউজার লগইন করা নেই।' };
    }
    await sendEmailVerification(firebaseUser);
    return {
      success: true,
      message: 'ভেরিফিকেশন ইমেইল সফলভাবে পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স অথবা স্প্যাম (Spam/Junk) ফোল্ডার চেক করুন।',
    };
  } catch (err: any) {
    console.warn('[Firebase] Verification email error:', err);
    let msg = 'ভেরিফিকেশন ইমেইল পাঠানো সম্ভব হয়নি।';
    const code = err.code || '';
    if (code === 'auth/too-many-requests') {
      msg = 'অতিরিক্ত অনুরোধ করা হয়েছে। ফায়ারবেস সিকিউরিটির জন্য কিছুক্ষণ পর আবার চেষ্টা করুন।';
    } else if (code === 'auth/user-token-expired') {
      msg = 'সেশন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে পুনরায় লগইন করে চেষ্টা করুন।';
    } else if (code === 'auth/network-request-failed') {
      msg = 'ইন্টারনেট সংযোগে সমস্যা হয়েছে। সংযোগ পরীক্ষা করুন।';
    } else if (err.message) {
      msg = `ত্রুটি (${code || 'unknown'}): ${err.message}`;
    }
    return { success: false, message: msg, code };
  }
}

/**
 * Trigger password reset email from Firebase Auth
 */
export async function sendPasswordReset(emailVal: string): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    if (!auth) return { success: false, message: 'Firebase Auth প্রস্তুত নয়।' };
    const cleanEmail = (emailVal || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'অনুগ্রহ করে সঠিক জিমেইল বা ইমেইল ঠিকানা দিন।' };
    }
    
    await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: `পাসওয়ার্ড রিসেট লিংক (${cleanEmail}) ঠিকানায় পাঠানো হয়েছে! আপনার ইনবক্স এবং স্প্যাম (Spam / Junk) ফোল্ডার চেক করুন।`,
    };
  } catch (err: any) {
    console.warn('[Firebase] Password reset error:', err);
    let msg = 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি।';
    const code = err.code || '';
    if (code === 'auth/user-not-found') {
      msg = 'এই ইমেইলে কোনো ফায়ারবেস একাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক জিমেইল দিন।';
    } else if (code === 'auth/invalid-email') {
      msg = 'সঠিক ফরম্যাটের ইমেইল ঠিকানা প্রদান করুন।';
    } else if (code === 'auth/too-many-requests') {
      msg = 'অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে। ফায়ারবেস সিকিউরিটির কারণে কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।';
    } else if (code === 'auth/unauthorized-continue-uri') {
      msg = 'ফায়ারবেস কনসোলে ডোমেইনটি Authorized Domains তালিকায় যুক্ত করা নেই।';
    } else if (code === 'auth/network-request-failed') {
      msg = 'নেটওয়ার্ক রিকোয়েস্ট ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।';
    } else if (err.message) {
      msg = `ত্রুটি (${code || 'error'}): ${err.message}`;
    }
    return { success: false, message: msg, code };
  }
}

/**
 * Bulk sync all local batches and users to Firebase
 */
export async function syncAllDataToFirebase(
  batches: MailBatch[],
  users: User[],
  transactions?: Transaction[]
): Promise<{ batchesCount: number; usersCount: number; errors: string[] }> {
  const errors: string[] = [];
  let batchesCount = 0;
  let usersCount = 0;

  // Sync users
  for (const u of users) {
    try {
      const res = await saveUserToFirebase(u);
      if (res.success) usersCount++;
    } catch (err: any) {
      errors.push(`User ${u.email}: ${err.message}`);
    }
  }

  // Sync batches & submitted emails
  for (const b of batches) {
    try {
      const res = await saveBatchToFirebase(b);
      if (res.success) batchesCount++;
    } catch (err: any) {
      errors.push(`Batch ${b.id}: ${err.message}`);
    }
  }

  return { batchesCount, usersCount, errors };
}
