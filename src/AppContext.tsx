import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  MailBatch,
  MarketplaceItem,
  BuyerOrder,
  Transaction,
  PlatformSettings,
  Review,
  NotificationItem,
  PaymentMethod,
  MailType,
} from './types';
import {
  initialGuestUser,
  initialAdminUser,
  initialDemoUser,
  initialMarketplaceItems,
  initialMailBatches,
  initialTransactions,
  initialSettings,
  initialReviews,
  SUPER_ADMIN_EMAIL,
} from './data/initialData';
import {
  auth,
  db,
  googleProvider,
  PRIMARY_ADMIN_EMAIL,
  KNOWN_ADMIN_EMAILS,
} from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get, onValue } from 'firebase/database';

export type ActiveTab =
  | 'home'
  | 'sell'
  | 'buy'
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'orders'
  | 'transactions'
  | 'exchange'
  | 'leaderboard'
  | 'id_card'
  | 'reviews'
  | 'profile'
  | 'admin'
  | 'faq'
  | 'policies'
  | 'contact';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  users: User[];
  allUsers: User[];
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  mailBatches: MailBatch[];
  submitMailBatch: (data: {
    rawText: string;
    mailType: MailType;
    paymentMethod: PaymentMethod;
    payoutAccount: string;
    shiftName: string;
  }) => boolean;
  approveMailBatch: (batchId: string) => void;
  rejectMailBatch: (batchId: string, reason: string) => void;
  marketplaceItems: MarketplaceItem[];
  updateMarketplaceItem: (item: MarketplaceItem) => void;
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id'>) => void;
  addMarketplacePackage: (item: Omit<MarketplaceItem, 'id'>) => void;
  addMarketplaceStock: (itemId: string, newMails: string[]) => void;
  deleteMarketplaceItem: (id: string) => void;
  buyerOrders: BuyerOrder[];
  buyMarketplaceItem: (itemId: string, quantity: number) => { success: boolean; message: string; order?: BuyerOrder };
  transactions: Transaction[];
  approveTransaction: (trxId: string) => void;
  rejectTransaction: (trxId: string, reason?: string) => void;
  submitDeposit: (data: { amount: number; method: PaymentMethod; trxId: string; senderNumber: string }) => boolean;
  approveDeposit: (trxId: string) => void;
  rejectDeposit: (trxId: string, reason?: string) => void;
  submitWithdrawal: (data: { amount: number; method: PaymentMethod; accountNumber: string }) => { success: boolean; message: string };
  approveWithdrawal: (trxId: string) => void;
  rejectWithdrawal: (trxId: string, reason?: string) => void;
  adjustUserBalance: (userId: string, deltaAmount: number, reason: string) => void;
  updateUserRole: (userId: string, role: 'admin' | 'user') => void;
  switchUser: (email: string) => void;
  exchangeCurrency: (from: 'BDT' | 'USD', amount: number) => { success: boolean; message: string };
  reviews: Review[];
  addReview: (rating: number, comment: string, shift: string) => void;
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  loginAsAdmin: () => void;
  loginAsUser: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  isLiveChatOpen: boolean;
  setIsLiveChatOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isGlobalPopupOpen: boolean;
  setIsGlobalPopupOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  firebaseAuthUser: any;
  firebaseLoginWithEmail: (emailVal: string, passVal: string) => Promise<{ success: boolean; message?: string }>;
  firebaseRegisterWithEmail: (emailVal: string, passVal: string, nameVal: string, phoneVal: string) => Promise<{ success: boolean; message?: string }>;
  firebaseLoginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  firebaseLogout: () => Promise<void>;
  firebaseResetPassword: (emailVal: string) => Promise<{ success: boolean; message?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'mail_factory_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed !== null && parsed !== undefined) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const loaded = loadFromStorage<User | null>('current_user', null);
    if (loaded && loaded.email && loaded.id && loaded.id !== 'guest') {
      return loaded;
    }
    return initialGuestUser;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadFromStorage('users', [initialAdminUser, initialDemoUser]);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : [initialAdminUser, initialDemoUser];
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const loaded = loadFromStorage('settings', initialSettings);
    const merged = { ...initialSettings, ...(loaded || {}) };
    // Migrate old demo placeholder numbers if present in existing localStorage
    if (!merged.bKashNumber || merged.bKashNumber.includes('01812-345678')) {
      merged.bKashNumber = '01748247931';
      merged.bKashType = 'Personal';
    }
    if (!merged.nagadNumber || merged.nagadNumber.includes('01712-345678')) {
      merged.nagadNumber = '01748247931';
      merged.nagadType = 'Personal';
    }
    if (!merged.rocketNumber || merged.rocketNumber.includes('01912-345678')) {
      merged.rocketNumber = '01748247931';
      merged.rocketType = 'Personal';
    }
    return merged;
  });

  const [mailBatches, setMailBatches] = useState<MailBatch[]>(() => {
    const loaded = loadFromStorage('batches', initialMailBatches);
    return Array.isArray(loaded) ? loaded : initialMailBatches;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const loaded = loadFromStorage('market_items', initialMarketplaceItems);
    return Array.isArray(loaded) ? loaded : initialMarketplaceItems;
  });

  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>(() => {
    const loaded = loadFromStorage('orders', []);
    return Array.isArray(loaded) ? loaded : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const loaded = loadFromStorage('transactions', initialTransactions);
    return Array.isArray(loaded) ? loaded : initialTransactions;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const loaded = loadFromStorage('reviews', initialReviews);
    return Array.isArray(loaded) ? loaded : initialReviews;
  });

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: currentUser?.id || 'admin-sohel',
      title: 'মেইল লিস্টিং বিক্রয় সফল! (+৳৪৫০.০০)',
      message: 'আপনার "Fresh Gmail Shift 1" ব্যাচের ৪৫টি জিমেইল ভেরিফাই ও বিক্রয় সম্পন্ন হয়েছে। ওয়ালেটে ৳৪৫০.০০ যুক্ত হয়েছে।',
      type: 'mail_sale',
      category: 'mail_sold',
      amount: 450,
      read: false,
      timestamp: 'আজ দুপুর ১২:৪৫',
      link: 'sell',
    },
    {
      id: 'notif-2',
      userId: currentUser?.id || 'admin-sohel',
      title: 'ওয়ালেট ডিপোজিট কনফার্মড (+৳১,০০০.০০)',
      message: 'বিকাশ TrxID: 9G7B88X2 এর মাধ্যমে ৳১,০০০.০০ ডিপোজিট সফলভাবে ভেরিফাই ও মূল ওয়ালেটে জমা হয়েছে।',
      type: 'deposit',
      category: 'deposit_confirmed',
      amount: 1000,
      read: false,
      timestamp: 'আজ সকাল ১১:১৫',
      link: 'wallet',
    },
    {
      id: 'notif-3',
      userId: currentUser?.id || 'admin-sohel',
      title: 'নতুন কারেন্সি এক্সচেঞ্জ অফার রেট!',
      message: 'লাইভ কারেন্সি এক্সচেঞ্জ রেট আপডেট হয়েছে: 1 USD = ৳১২২.৫০ BDT। এখনই তাৎক্ষণিক BDT ⇄ USD কনভার্ট করুন!',
      type: 'exchange',
      category: 'exchange_offer',
      read: false,
      timestamp: 'আজ সকাল ১০:০০',
      link: 'exchange',
    },
    {
      id: 'notif-4',
      userId: currentUser?.id || 'admin-sohel',
      title: 'স্বাগতম Mail Factory তে',
      message: 'আপনার অ্যাকাউন্ট সক্রিয় হয়েছে। এখন ফ্রেশ জিমেইল সাবমিট করুন বা মার্কেটপ্লেস থেকে কিনুন।',
      type: 'system',
      category: 'general',
      read: true,
      timestamp: 'গতকাল',
      link: 'home',
    },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const loaded = loadFromStorage('notifications', initialNotifications);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : initialNotifications;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGlobalPopupOpen, setIsGlobalPopupOpen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<any>(null);

  // Sync to local storage
  useEffect(() => {
    saveToStorage('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('settings', platformSettings);
  }, [platformSettings]);

  useEffect(() => {
    saveToStorage('batches', mailBatches);
  }, [mailBatches]);

  useEffect(() => {
    saveToStorage('market_items', marketplaceItems);
  }, [marketplaceItems]);

  useEffect(() => {
    saveToStorage('orders', buyerOrders);
  }, [buyerOrders]);

  useEffect(() => {
    saveToStorage('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage('reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    saveToStorage('notifications', notifications);
  }, [notifications]);

  // Realtime Database Admins list from Firebase
  const [rtdbAdmins, setRtdbAdmins] = useState<string[]>([]);

  useEffect(() => {
    if (!db) return;
    try {
      const adminsRef = ref(db, 'admins');
      const unsubscribe = onValue(adminsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (typeof val === 'object' && val !== null) {
            const list: string[] = [];
            Object.entries(val).forEach(([k, v]) => {
              if (typeof v === 'string') list.push(v.toLowerCase());
              if (typeof v === 'boolean' && v === true) list.push(k.toLowerCase().replace(/_/g, '.'));
              if (typeof v === 'object' && v && (v as any).email) list.push(String((v as any).email).toLowerCase());
              list.push(k.toLowerCase());
            });
            setRtdbAdmins(list);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not listen to admins in RTDB:', e);
    }
  }, []);

  // Firebase Auth State Listener & Realtime Sync
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseAuthUser(fbUser);
      if (fbUser) {
        const email = (fbUser.email || '').toLowerCase();
        const isKnownAdmin =
          email === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
          email === SUPER_ADMIN_EMAIL.toLowerCase() ||
          email === 'stb.shirin@gmail.com' ||
          email === 'soheltajbhola@gmail.com' ||
          KNOWN_ADMIN_EMAILS.some(e => e.toLowerCase() === email) ||
          rtdbAdmins.includes(email) ||
          rtdbAdmins.includes(fbUser.uid.toLowerCase());

        const role = isKnownAdmin ? 'admin' : 'user';

        // 1. Immediately set user to ensure zero latency and immediate isLoggedIn = true
        setCurrentUser(prev => ({
          id: fbUser.uid,
          name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || prev?.email || '',
          phone: prev?.phone || fbUser.phoneNumber || '',
          role: role,
          balanceBdt: prev?.balanceBdt ?? 0,
          balanceUsd: prev?.balanceUsd ?? 0,
          sellerBalance: prev?.sellerBalance ?? 0,
          buyerBalance: prev?.buyerBalance ?? 0,
          referralCode: prev?.referralCode || fbUser.uid.substring(0, 6).toUpperCase(),
          referralEarnings: prev?.referralEarnings ?? 0,
          memberTier: prev?.memberTier || (role === 'admin' ? 'Diamond' : 'Silver'),
          joinedAt: prev?.joinedAt || new Date().toISOString().split('T')[0],
          avatarUrl: fbUser.photoURL || prev?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          totalSubmittedMails: prev?.totalSubmittedMails ?? 0,
          totalApprovedMails: prev?.totalApprovedMails ?? 0,
          totalEarnings: prev?.totalEarnings ?? 0,
          totalBoughtMails: prev?.totalBoughtMails ?? 0,
          bKashNumber: prev?.bKashNumber || '',
          nagadNumber: prev?.nagadNumber || '',
        }));

        // 2. Fetch and merge additional RTDB data in the background
        try {
          if (db) {
            const userRef = ref(db, `users/${fbUser.uid}`);
            const snap = await get(userRef);
            if (snap.exists()) {
              const rtdbUser: Partial<User> = snap.val() || {};
              const resolvedRole = (isKnownAdmin || rtdbUser.role === 'admin') ? 'admin' : 'user';
              setCurrentUser(prev => ({
                ...prev,
                name: rtdbUser.name || prev.name,
                phone: rtdbUser.phone || prev.phone,
                role: resolvedRole,
                balanceBdt: rtdbUser.balanceBdt ?? prev.balanceBdt,
                balanceUsd: rtdbUser.balanceUsd ?? prev.balanceUsd,
                sellerBalance: rtdbUser.sellerBalance ?? prev.sellerBalance,
                buyerBalance: rtdbUser.buyerBalance ?? prev.buyerBalance,
                referralCode: rtdbUser.referralCode || prev.referralCode,
                referralEarnings: rtdbUser.referralEarnings ?? prev.referralEarnings,
                memberTier: rtdbUser.memberTier || prev.memberTier,
                joinedAt: rtdbUser.joinedAt || prev.joinedAt,
                avatarUrl: rtdbUser.avatarUrl || prev.avatarUrl,
                totalSubmittedMails: rtdbUser.totalSubmittedMails ?? prev.totalSubmittedMails,
                totalApprovedMails: rtdbUser.totalApprovedMails ?? prev.totalApprovedMails,
                totalEarnings: rtdbUser.totalEarnings ?? prev.totalEarnings,
                totalBoughtMails: rtdbUser.totalBoughtMails ?? prev.totalBoughtMails,
                bKashNumber: rtdbUser.bKashNumber || prev.bKashNumber,
                nagadNumber: rtdbUser.nagadNumber || prev.nagadNumber,
              }));
            }
          }
        } catch (err) {
          console.warn('Could not read user from RTDB:', err);
        }

        // Keep local users list updated
        setUsers(prevUsers => {
          const exists = prevUsers.some(u => u.id === fbUser.uid || u.email?.toLowerCase() === email);
          if (!exists) {
            return [
              ...prevUsers,
              {
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email || '',
                phone: '',
                role: role,
                balanceBdt: 0,
                balanceUsd: 0,
                referralCode: fbUser.uid.substring(0, 6).toUpperCase(),
                memberTier: role === 'admin' ? 'Diamond' : 'Silver',
                joinedAt: new Date().toISOString().split('T')[0],
                avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                totalSubmittedMails: 0,
                totalApprovedMails: 0,
                totalEarnings: 0,
                totalBoughtMails: 0,
              },
            ];
          }
          return prevUsers;
        });
      } else {
        setFirebaseAuthUser(null);
        setCurrentUser(prev => {
          // If the user deliberately switched to demo admin or demo user, keep it
          if (prev?.id === 'admin-sohel' || prev?.id === 'demo-user-1') {
            return prev;
          }
          // If we already have a persistent authenticated identity stored, don't clear on temporary null
          if (prev?.id && prev?.id !== 'guest' && prev?.email && prev.email !== '') {
            return prev;
          }
          return initialGuestUser;
        });
      }
    });
    return () => unsubscribe();
  }, [rtdbAdmins]);

  // Is Logged In Check: User must have an active session or valid authenticated identity
  const isLoggedIn = Boolean(
    (firebaseAuthUser && firebaseAuthUser.email) ||
    (currentUser?.email && currentUser.id && currentUser.id !== 'guest')
  );

  // Is Admin Check (strictly requires being logged in and matching admin emails/roles)
  const currentEmail = (currentUser?.email || '').toLowerCase();
  const adminList = (platformSettings?.adminEmails || []).map(e => (e || '').toLowerCase());
  const isAdmin =
    isLoggedIn &&
    (currentEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
      currentEmail === SUPER_ADMIN_EMAIL.toLowerCase() ||
      currentEmail === 'stb.shirin@gmail.com' ||
      currentEmail === 'soheltajbhola@gmail.com' ||
      currentUser?.role === 'admin' ||
      adminList.includes(currentEmail) ||
      KNOWN_ADMIN_EMAILS.some(e => e.toLowerCase() === currentEmail) ||
      rtdbAdmins.includes(currentEmail) ||
      (currentUser?.id && rtdbAdmins.includes(currentUser.id.toLowerCase())));

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loginAsAdmin = () => {
    setCurrentUser(initialAdminUser);
    showToast(`সুপার অ্যাডমিন হিসেবে প্রবেশ করেছেন (${PRIMARY_ADMIN_EMAIL})`, 'success');
  };

  const loginAsUser = () => {
    setCurrentUser(initialDemoUser);
    showToast('সেলর/বায়ার ইউজার হিসেবে প্রবেশ করেছেন', 'info');
  };

  // Firebase Auth Functions
  const firebaseLoginWithEmail = async (emailVal: string, passVal: string) => {
    try {
      if (!auth) return { success: false, message: 'Firebase Auth প্রস্তুত নয়' };
      const cred = await signInWithEmailAndPassword(auth, emailVal, passVal);
      const fbUser = cred.user;
      setFirebaseAuthUser(fbUser);
      const cleanEmail = (fbUser.email || emailVal).toLowerCase();
      const isKnownAdmin =
        cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === 'stb.shirin@gmail.com' ||
        cleanEmail === 'soheltajbhola@gmail.com' ||
        KNOWN_ADMIN_EMAILS.some(e => e.toLowerCase() === cleanEmail);
      const role = isKnownAdmin ? 'admin' : 'user';

      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0] || 'User',
        email: cleanEmail,
        phone: fbUser.phoneNumber || '',
        role: role,
        balanceBdt: 0,
        balanceUsd: 0,
        sellerBalance: 0,
        buyerBalance: 0,
        referralCode: fbUser.uid.substring(0, 6).toUpperCase(),
        referralEarnings: 0,
        memberTier: role === 'admin' ? 'Diamond' : 'Silver',
        joinedAt: new Date().toISOString().split('T')[0],
        avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        totalSubmittedMails: 0,
        totalApprovedMails: 0,
        totalEarnings: 0,
        totalBoughtMails: 0,
      };

      setCurrentUser(userObj);
      saveToStorage('current_user', userObj);
      return { success: true };
    } catch (err: any) {
      let msg = 'লগইন ব্যর্থ হয়েছে।';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'সঠিক ইমেইল ঠিকানা দিন।';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg };
    }
  };

  const firebaseRegisterWithEmail = async (
    emailVal: string,
    passVal: string,
    nameVal: string,
    phoneVal: string
  ) => {
    try {
      if (!auth) return { success: false, message: 'Firebase Auth প্রস্তুত নয়' };
      const cred = await createUserWithEmailAndPassword(auth, emailVal, passVal);
      try {
        await updateProfile(cred.user, { displayName: nameVal });
      } catch (e) {
        console.warn('Could not update displayName:', e);
      }

      const isKnownAdmin =
        emailVal.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
        emailVal.toLowerCase() === 'stb.shirin@gmail.com' ||
        KNOWN_ADMIN_EMAILS.some(e => e.toLowerCase() === emailVal.toLowerCase());

      const role = isKnownAdmin ? 'admin' : 'user';
      const newUser: User = {
        id: cred.user.uid,
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        role: role,
        balanceBdt: 0,
        balanceUsd: 0,
        sellerBalance: 0,
        buyerBalance: 0,
        referralCode: cred.user.uid.substring(0, 6).toUpperCase(),
        referralEarnings: 0,
        memberTier: role === 'admin' ? 'Diamond' : 'Silver',
        joinedAt: new Date().toISOString().split('T')[0],
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        totalSubmittedMails: 0,
        totalApprovedMails: 0,
        totalEarnings: 0,
        totalBoughtMails: 0,
        bKashNumber: phoneVal,
        nagadNumber: phoneVal,
      };

      setCurrentUser(newUser);

      if (db) {
        try {
          await set(ref(db, `users/${cred.user.uid}`), newUser);
        } catch (err) {
          console.warn('Could not save user to RTDB:', err);
        }
      }
      return { success: true };
    } catch (err: any) {
      let msg = 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।';
      } else if (err.code === 'auth/weak-password') {
        msg = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg };
    }
  };

  const firebaseLoginWithGoogle = async () => {
    try {
      if (!auth) return { success: false, message: 'Firebase Auth প্রস্তুত নয়' };
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      setFirebaseAuthUser(fbUser);
      const cleanEmail = (fbUser.email || '').toLowerCase();
      const isKnownAdmin =
        cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === 'stb.shirin@gmail.com' ||
        cleanEmail === 'soheltajbhola@gmail.com' ||
        KNOWN_ADMIN_EMAILS.some(e => e.toLowerCase() === cleanEmail);
      const role = isKnownAdmin ? 'admin' : 'user';

      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0] || 'User',
        email: cleanEmail,
        phone: fbUser.phoneNumber || '',
        role: role,
        balanceBdt: 0,
        balanceUsd: 0,
        sellerBalance: 0,
        buyerBalance: 0,
        referralCode: fbUser.uid.substring(0, 6).toUpperCase(),
        referralEarnings: 0,
        memberTier: role === 'admin' ? 'Diamond' : 'Silver',
        joinedAt: new Date().toISOString().split('T')[0],
        avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        totalSubmittedMails: 0,
        totalApprovedMails: 0,
        totalEarnings: 0,
        totalBoughtMails: 0,
      };

      setCurrentUser(userObj);
      saveToStorage('current_user', userObj);
      return { success: true };
    } catch (err: any) {
      let msg = 'গুগল সাইন-ইন সম্পন্ন হয়নি।';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'লগইন পপআপ উইন্ডো বন্ধ করা হয়েছে।';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg };
    }
  };

  const firebaseLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err: any) {
      console.error('Logout error:', err);
    }
    setFirebaseAuthUser(null);
    setCurrentUser(initialGuestUser);
    try {
      localStorage.removeItem('mail_factory_current_user');
    } catch {}
    showToast('সফলভাবে লগআউট হয়েছে', 'info');
  };

  const firebaseResetPassword = async (emailVal: string) => {
    try {
      if (!auth) return { success: false, message: 'Firebase Auth প্রস্তুত নয়' };
      await sendPasswordResetEmail(auth, emailVal);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।' };
    }
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profile };
      setUsers(uList => uList.map(u => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('প্রোফাইল সফলভাবে আপডেট করা হয়েছে', 'success');
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    if (
      newSettings.usdToBdtRate !== undefined &&
      newSettings.usdToBdtRate !== platformSettings.usdToBdtRate
    ) {
      addNotification({
        userId: 'all',
        title: 'নতুন কারেন্সি এক্সচেঞ্জ অফার রেট!',
        message: `BDT ⇄ USD লাইভ এক্সচেঞ্জ রেট আপডেট হয়েছে: 1 USD = ৳${newSettings.usdToBdtRate} BDT। এখনই তাৎক্ষণিক এক্সচেঞ্জ করুন!`,
        type: 'exchange',
        category: 'exchange_offer',
        read: false,
        link: 'exchange',
      });
    }
    setPlatformSettings(prev => ({ ...prev, ...newSettings }));
    showToast('প্ল্যাটফর্ম সেটিংস ও রেট আপডেট করা হয়েছে', 'success');
  };

  // Submit Mail Batch by Seller
  const submitMailBatch = (data: {
    rawText: string;
    mailType: MailType;
    paymentMethod: PaymentMethod;
    payoutAccount: string;
    shiftName: string;
  }): boolean => {
    const lines = data.rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 5);

    if (lines.length < platformSettings.minMailSubmission) {
      showToast(`কমপক্ষে ${platformSettings.minMailSubmission}টি জিমেইল সাবমিট করতে হবে`, 'error');
      return false;
    }

    let rate = platformSettings.mailBuyingRateFresh;
    if (data.mailType === 'recovery') rate = platformSettings.mailBuyingRateRecovery;
    else if (data.mailType === 'aged') rate = platformSettings.mailBuyingRateAged;
    else if (data.mailType === 'usa') rate = platformSettings.mailBuyingRateUsa;
    else if (data.mailType === 'edu') rate = platformSettings.mailBuyingRateEdu;

    const parsedMails = lines.map((line, idx) => {
      const parts = line.split(/[:\t, ]+/);
      const email = parts[0] || '';
      const password = parts[1] || '';
      const recoveryEmail = parts[2] || '';
      const isValid = email.includes('@') && password.length >= 6;
      return {
        id: `m-${Date.now()}-${idx}`,
        email,
        password,
        recoveryEmail,
        status: (isValid ? 'valid' : 'invalid') as 'valid' | 'invalid',
      };
    });

    const validCount = parsedMails.filter(m => m.status === 'valid').length;
    const totalAmount = Number((validCount * rate).toFixed(2));

    const newBatch: MailBatch = {
      id: `batch-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      batchName: `${data.mailType.toUpperCase()} Batch (${validCount} Mails)`,
      mailType: data.mailType,
      mails: parsedMails,
      rawText: data.rawText,
      pricePerMail: rate,
      totalMails: lines.length,
      validMailsCount: validCount,
      totalAmount,
      status: 'pending',
      shiftName: data.shiftName || platformSettings.activeShift,
      submittedAt: new Date().toISOString(),
      paymentMethod: data.paymentMethod,
      payoutAccount: data.payoutAccount,
    };

    setMailBatches(prev => [newBatch, ...prev]);

    // Update user submitted mail statistics
    setCurrentUser(prev => ({
      ...prev,
      totalSubmittedMails: prev.totalSubmittedMails + validCount,
    }));

    showToast(`সফলভাবে ${validCount}টি জিমেইল সাবমিট হয়েছে! অ্যাডমিন রিভিউ শিফটে ভেরিফাই করবে।`, 'success');
    return true;
  };

  // Admin approves batch & automatically credits seller's balance
  const approveMailBatch = (batchId: string) => {
    const batch = mailBatches.find(b => b.id === batchId);
    if (!batch) return;

    setMailBatches(prev =>
      prev.map(b =>
        b.id === batchId
          ? {
              ...b,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.email,
            }
          : b
      )
    );

    // Credit seller's wallet balance
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === batch.userId) {
          return {
            ...u,
            balanceBdt: Number((u.balanceBdt + batch.totalAmount).toFixed(2)),
            totalEarnings: Number((u.totalEarnings + batch.totalAmount).toFixed(2)),
            totalApprovedMails: u.totalApprovedMails + batch.validMailsCount,
          };
        }
        return u;
      })
    );

    if (currentUser.id === batch.userId) {
      setCurrentUser(u => ({
        ...u,
        balanceBdt: Number((u.balanceBdt + batch.totalAmount).toFixed(2)),
        totalEarnings: Number((u.totalEarnings + batch.totalAmount).toFixed(2)),
        totalApprovedMails: u.totalApprovedMails + batch.validMailsCount,
      }));
    }

    // Add completed transaction record
    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      userId: batch.userId,
      userName: batch.userName,
      userEmail: batch.userEmail,
      type: 'mail_sale',
      amount: batch.totalAmount,
      currency: 'BDT',
      method: 'System',
      status: 'completed',
      createdAt: new Date().toISOString(),
      adminNote: `Batch ${batch.batchName} (${batch.validMailsCount} mails) approved by Admin`,
    };
    setTransactions(prev => [newTrx, ...prev]);

    // Alert seller about mail sold
    addNotification({
      userId: batch.userId,
      title: `মেইল লিস্টিং বিক্রয় সফল! (+৳${batch.totalAmount.toFixed(2)})`,
      message: `আপনার "${batch.batchName}" লিস্টিংয়ের ${batch.validMailsCount}টি জিমেইল ভেরিফাই ও সেল সম্পন্ন হয়েছে। ওয়ালেটে ৳${batch.totalAmount.toFixed(2)} যুক্ত করা হয়েছে।`,
      type: 'mail_sale',
      category: 'mail_sold',
      amount: batch.totalAmount,
      read: false,
      link: 'sell',
    });

    showToast(`মেইল ব্যাচ অ্যাপ্রুভ হয়েছে এবং সেলার ওয়ালেটে ৳${batch.totalAmount} যুক্ত করা হয়েছে।`, 'success');
  };

  const rejectMailBatch = (batchId: string, reason: string) => {
    setMailBatches(prev =>
      prev.map(b =>
        b.id === batchId
          ? {
              ...b,
              status: 'rejected',
              rejectReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.email,
            }
          : b
      )
    );
    showToast(`মেইল ব্যাচ রিজেক্ট করা হয়েছে (${reason})`, 'info');
  };

  // Marketplace Buy & Instant Delivery
  const buyMarketplaceItem = (
    itemId: string,
    quantity: number
  ): { success: boolean; message: string; order?: BuyerOrder } => {
    const item = marketplaceItems.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'প্যাকেজ পাওয়া যায়নি।' };

    if (quantity < item.minOrder) {
      return { success: false, message: `সর্বনিম্ন ${item.minOrder}টি অর্ডার করতে হবে।` };
    }

    if (item.stockAvailable < quantity) {
      return { success: false, message: `পর্যাপ্ত স্টক নেই। অবশিষ্ট স্টক: ${item.stockAvailable}টি।` };
    }

    const totalPrice = Number((item.pricePerUnit * quantity).toFixed(2));
    if (currentUser.balanceBdt < totalPrice) {
      return {
        success: false,
        message: `আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই। প্রয়োজন ৳${totalPrice}, বর্তমান ব্যালেন্স ৳${currentUser.balanceBdt}। দয়া করে ডিপোজিট করুন।`,
      };
    }

    // Deduct user balance
    setCurrentUser(u => ({
      ...u,
      balanceBdt: Number((u.balanceBdt - totalPrice).toFixed(2)),
      totalBoughtMails: u.totalBoughtMails + quantity,
    }));

    // Deduct stock and deliver credentials
    const pool = item.credentialsPool || [];
    const deliveredMails: string[] = [];
    for (let i = 0; i < quantity; i++) {
      if (pool[i]) {
        deliveredMails.push(pool[i]);
      } else {
        deliveredMails.push(`fresh.gmail.${Date.now() + i}@gmail.com:Pass${Math.random().toString(36).substring(2, 8)}:rec.user${i}@outlook.com`);
      }
    }

    // Update item stock
    setMarketplaceItems(prev =>
      prev.map(i =>
        i.id === itemId
          ? {
              ...i,
              stockAvailable: Math.max(0, i.stockAvailable - quantity),
              credentialsPool: i.credentialsPool ? i.credentialsPool.slice(quantity) : [],
            }
          : i
      )
    );

    // Create Order
    const newOrder: BuyerOrder = {
      id: `ord-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      itemId: item.id,
      itemTitle: item.title,
      quantity,
      unitPrice: item.pricePerUnit,
      totalPrice,
      status: 'completed',
      deliveredMails,
      createdAt: new Date().toISOString(),
    };

    setBuyerOrders(prev => [newOrder, ...prev]);

    // Create Transaction
    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'marketplace_buy',
      amount: totalPrice,
      currency: 'BDT',
      method: 'System',
      status: 'completed',
      createdAt: new Date().toISOString(),
      adminNote: `Purchased ${quantity}x ${item.title}`,
    };
    setTransactions(prev => [newTrx, ...prev]);

    // Alert buyer about order delivery
    addNotification({
      userId: currentUser.id,
      title: `মেইল প্যাকেজ ডেলিভারি সম্পন্ন (${quantity}টি)`,
      message: `${quantity}টি ${item.title} জিমেইল সফলভাবে ক্রয় ও তাৎক্ষণিক ডেলিভারি হয়েছে (মোট: ৳${totalPrice})।`,
      type: 'order',
      category: 'general',
      amount: totalPrice,
      read: false,
      link: 'buy',
    });

    if (item.sellerId && item.sellerId !== currentUser.id) {
      // Alert listing owner that their mail listing was sold
      addNotification({
        userId: item.sellerId,
        title: `মেইল লিস্টিং বিক্রয় সফল! (+৳${totalPrice})`,
        message: `আপনার "${item.title}" লিস্টিং থেকে ${quantity}টি জিমেইল সফলভাবে সেল হয়েছে। ওয়ালেটে টাকা যুক্ত হয়েছে।`,
        type: 'mail_sale',
        category: 'mail_sold',
        amount: totalPrice,
        read: false,
        link: 'sell',
      });
    }

    showToast(`অর্ডার সফল! ${quantity}টি জিমেইল তাৎক্ষণিক ডেলিভারি দেওয়া হয়েছে।`, 'success');
    return { success: true, message: 'অর্ডার সফল হয়েছে!', order: newOrder };
  };

  const updateMarketplaceItem = (updatedItem: MarketplaceItem) => {
    setMarketplaceItems(prev => prev.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    showToast('মার্কেটপ্লেস আইটেম আপডেট করা হয়েছে', 'success');
  };

  const addMarketplaceItem = (newItem: Omit<MarketplaceItem, 'id'>) => {
    const item: MarketplaceItem = {
      ...newItem,
      id: `item-${Date.now()}`,
    };
    setMarketplaceItems(prev => [item, ...prev]);
    showToast('নতুন মার্কেটপ্লেস আইটেম যুক্ত হয়েছে', 'success');
  };

  const deleteMarketplaceItem = (id: string) => {
    setMarketplaceItems(prev => prev.filter(i => i.id !== id));
    showToast('আইটেম ডিলিট করা হয়েছে', 'info');
  };

  // Deposit Management
  const submitDeposit = (data: {
    amount: number;
    method: PaymentMethod;
    trxId: string;
    senderNumber: string;
  }): boolean => {
    if (data.amount < platformSettings.minDepositBdt) {
      showToast(`সর্বনিম্ন ডিপোজিট ৳${platformSettings.minDepositBdt}`, 'error');
      return false;
    }
    if (!data.trxId.trim()) {
      showToast('ট্রানজেকশন আইডি (TrxID) দিন', 'error');
      return false;
    }

    const newTrx: Transaction = {
      id: `dep-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'deposit',
      amount: data.amount,
      currency: 'BDT',
      method: data.method,
      trxId: data.trxId.toUpperCase(),
      senderNumber: data.senderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTrx, ...prev]);
    showToast('ডিপোজিট রিকোয়েস্ট সাবমিট হয়েছে। অ্যাডমিন ভেরিফাই করে ওয়ালেটে টাকা যোগ করবেন।', 'success');
    return true;
  };

  const approveDeposit = (trxId: string) => {
    const trx = transactions.find(t => t.id === trxId || t.trxId === trxId);
    if (!trx || trx.status !== 'pending') return;

    setTransactions(prev =>
      prev.map(t => (t.id === trx.id ? { ...t, status: 'completed', processedAt: new Date().toISOString() } : t))
    );

    // Credit user balance
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === trx.userId ? { ...u, balanceBdt: Number((u.balanceBdt + trx.amount).toFixed(2)) } : u))
    );

    if (currentUser.id === trx.userId) {
      setCurrentUser(u => ({
        ...u,
        balanceBdt: Number((u.balanceBdt + trx.amount).toFixed(2)),
      }));
    }

    // Alert user that deposit is confirmed
    addNotification({
      userId: trx.userId,
      title: `ওয়ালেট ডিপোজিট কনফার্মড (+৳${trx.amount.toFixed(2)})`,
      message: `আপনার TrxID: ${trx.trxId || trx.id} এর মাধ্যমে ৳${trx.amount.toFixed(2)} ডিপোজিট ভেরিফাইড এবং মেইন ওয়ালেটে ক্রেডিট হয়েছে।`,
      type: 'deposit',
      category: 'deposit_confirmed',
      amount: trx.amount,
      read: false,
      link: 'wallet',
    });

    showToast(`ডিপোজিট অ্যাপ্রুভ হয়েছে। ৳${trx.amount} যুক্ত করা হয়েছে।`, 'success');
  };

  const rejectDeposit = (trxId: string, reason?: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === trxId
          ? { ...t, status: 'rejected', adminNote: reason || 'Invalid TrxID', processedAt: new Date().toISOString() }
          : t
      )
    );
    showToast(`ডিপোজিট রিকোয়েস্ট বাতিল করা হয়েছে (${reason || 'ভুল TrxID'})`, 'info');
  };

  // Withdrawal Management
  const submitWithdrawal = (data: {
    amount: number;
    method: PaymentMethod;
    accountNumber: string;
  }): { success: boolean; message: string } => {
    if (data.amount < platformSettings.minWithdrawalBdt) {
      return { success: false, message: `সর্বনিম্ন উইথড্র ৳${platformSettings.minWithdrawalBdt}` };
    }
    if (currentUser.balanceBdt < data.amount) {
      return { success: false, message: 'আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।' };
    }
    if (!data.accountNumber.trim()) {
      return { success: false, message: 'পেমেন্ট নাম্বার দিন।' };
    }

    // Deduct balance instantly
    setCurrentUser(u => ({
      ...u,
      balanceBdt: Number((u.balanceBdt - data.amount).toFixed(2)),
    }));

    const newTrx: Transaction = {
      id: `wth-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'withdraw',
      amount: data.amount,
      currency: 'BDT',
      method: data.method,
      accountNumber: data.accountNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTrx, ...prev]);
    showToast('উইথড্র রিকোয়েস্ট সাবমিট হয়েছে। কিছুক্ষণের মধ্যে পেমেন্ট পাঠিয়ে দেওয়া হবে।', 'success');
    return { success: true, message: 'উইথড্র রিকোয়েস্ট গৃহীত হয়েছে।' };
  };

  const approveWithdrawal = (trxId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === trxId ? { ...t, status: 'completed', processedAt: new Date().toISOString(), adminNote: 'Paid by Admin' } : t
      )
    );
    showToast('উইথড্র পেমেন্ট সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।', 'success');
  };

  const rejectWithdrawal = (trxId: string, reason?: string) => {
    const trx = transactions.find(t => t.id === trxId);
    if (!trx || trx.status !== 'pending') return;

    // Refund funds back to user
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === trx.userId ? { ...u, balanceBdt: Number((u.balanceBdt + trx.amount).toFixed(2)) } : u))
    );

    if (currentUser.id === trx.userId) {
      setCurrentUser(u => ({
        ...u,
        balanceBdt: Number((u.balanceBdt + trx.amount).toFixed(2)),
      }));
    }

    setTransactions(prev =>
      prev.map(t =>
        t.id === trxId
          ? { ...t, status: 'rejected', adminNote: reason || 'Rejected & Refunded', processedAt: new Date().toISOString() }
          : t
      )
    );
    showToast(`উইথড্র বাতিল এবং ৳${trx.amount} ইউজার ওয়ালেটে ফেরত দেওয়া হয়েছে।`, 'info');
  };

  // Currency Exchange (BDT <-> USD)
  const exchangeCurrency = (from: 'BDT' | 'USD', amount: number): { success: boolean; message: string } => {
    const rate = platformSettings.usdToBdtRate;
    if (amount <= 0) return { success: false, message: 'সঠিক পরিমাণ লিখুন।' };

    if (from === 'BDT') {
      if (currentUser.balanceBdt < amount) {
        return { success: false, message: 'পর্যাপ্ত BDT ব্যালেন্স নেই।' };
      }
      const usdReceived = Number((amount / rate).toFixed(2));
      setCurrentUser(u => ({
        ...u,
        balanceBdt: Number((u.balanceBdt - amount).toFixed(2)),
        balanceUsd: Number((u.balanceUsd + usdReceived).toFixed(2)),
      }));

      // Alert currency exchange success
      addNotification({
        userId: currentUser.id,
        title: 'কারেন্সি এক্সচেঞ্জ সম্পন্ন (BDT ➔ USD)',
        message: `৳${amount} BDT সফলভাবে এক্সচেঞ্জ হয়ে $${usdReceived} USD ওয়ালেটে জমা হয়েছে (রেট: ৳${rate})।`,
        type: 'exchange',
        category: 'exchange_offer',
        amount: usdReceived,
        read: false,
        link: 'exchange',
      });

      showToast(`৳${amount} রূপান্তর করে $${usdReceived} USD ওয়ালেটে জমা হয়েছে`, 'success');
      return { success: true, message: 'এক্সচেঞ্জ সফল!' };
    } else {
      if (currentUser.balanceUsd < amount) {
        return { success: false, message: 'পর্যাপ্ত USD ব্যালেন্স নেই।' };
      }
      const bdtReceived = Number((amount * rate).toFixed(2));
      setCurrentUser(u => ({
        ...u,
        balanceUsd: Number((u.balanceUsd - amount).toFixed(2)),
        balanceBdt: Number((u.balanceBdt + bdtReceived).toFixed(2)),
      }));

      // Alert currency exchange success
      addNotification({
        userId: currentUser.id,
        title: 'কারেন্সি এক্সচেঞ্জ সম্পন্ন (USD ➔ BDT)',
        message: `$${amount} USD সফলভাবে এক্সচেঞ্জ হয়ে ৳${bdtReceived} BDT ওয়ালেটে জমা হয়েছে (রেট: ৳${rate})।`,
        type: 'exchange',
        category: 'exchange_offer',
        amount: bdtReceived,
        read: false,
        link: 'exchange',
      });

      showToast(`$${amount} USD রূপান্তর করে ৳${bdtReceived} BDT ওয়ালেটে জমা হয়েছে`, 'success');
      return { success: true, message: 'এক্সচেঞ্জ সফল!' };
    }
  };

  const addReview = (rating: number, comment: string, shift: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating,
      comment,
      shift,
      date: 'আজকের শিফট',
      verifiedSale: true,
      likes: 1,
      status: 'approved',
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('আপনার মূল্যবান রিভিউ পোস্ট করার জন্য ধন্যবাদ!', 'success');
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: notif.timestamp || new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('সকল নোটিফিকেশন পঠিত হিসেবে চিহ্নিত হয়েছে', 'info');
  };

  const addMarketplacePackage = (item: Omit<MarketplaceItem, 'id'>) => {
    addMarketplaceItem(item);
  };

  const addMarketplaceStock = (itemId: string, newMails: string[]) => {
    setMarketplaceItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const pool = item.credentialsPool || [];
          return {
            ...item,
            credentialsPool: [...pool, ...newMails],
            stockAvailable: item.stockAvailable + newMails.length,
          };
        }
        return item;
      })
    );
    showToast(`${newMails.length}টি মেইল সফলভাবে স্টকে যুক্ত করা হয়েছে`, 'success');
  };

  const approveTransaction = (trxId: string) => {
    const trx = transactions.find(t => t.id === trxId || t.trxId === trxId);
    if (!trx) return;
    if (trx.type === 'deposit') {
      approveDeposit(trx.id);
    } else if (trx.type === 'withdrawal' || trx.type === 'withdraw') {
      approveWithdrawal(trx.id);
    } else {
      setTransactions(prev =>
        prev.map(t => (t.id === trx.id ? { ...t, status: 'completed' as const } : t))
      );
      showToast('লেনদেন অনুমোদন সম্পন্ন হয়েছে', 'success');
    }
  };

  const rejectTransaction = (trxId: string, reason?: string) => {
    const trx = transactions.find(t => t.id === trxId || t.trxId === trxId);
    if (!trx) return;
    if (trx.type === 'deposit') {
      rejectDeposit(trx.id, reason);
    } else if (trx.type === 'withdrawal' || trx.type === 'withdraw') {
      rejectWithdrawal(trx.id, reason);
    } else {
      setTransactions(prev =>
        prev.map(t => (t.id === trx.id ? { ...t, status: 'rejected' as const, adminNote: reason } : t))
      );
      showToast('লেনদেন বাতিল করা হয়েছে', 'info');
    }
  };

  const adjustUserBalance = (userId: string, deltaAmount: number, reason: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newBalance = Math.max(0, Number((u.balanceBdt + deltaAmount).toFixed(2)));
          return { ...u, balanceBdt: newBalance };
        }
        return u;
      })
    );
    if (currentUser.id === userId) {
      setCurrentUser(u => ({
        ...u,
        balanceBdt: Math.max(0, Number((u.balanceBdt + deltaAmount).toFixed(2))),
      }));
    }
    const newTrx: Transaction = {
      id: `trx-adj-${Date.now()}`,
      userId,
      userName: users.find(u => u.id === userId)?.name || 'User',
      userEmail: users.find(u => u.id === userId)?.email || '',
      type: deltaAmount >= 0 ? 'bonus' : 'adjustment',
      amount: Math.abs(deltaAmount),
      currency: 'BDT',
      method: 'System',
      status: 'completed',
      createdAt: new Date().toISOString(),
      adminNote: reason,
    };
    setTransactions(prev => [newTrx, ...prev]);
    showToast(`ইউজার ব্যালেন্স ${deltaAmount >= 0 ? '+' : ''}${deltaAmount} ৳ অ্যাডজাস্ট করা হয়েছে।`, 'success');
  };

  const updateUserRole = (userId: string, role: 'admin' | 'user') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
    if (currentUser.id === userId) {
      setCurrentUser(u => ({ ...u, role }));
    }
    showToast(`ইউজার রোল ${role} হিসেবে আপডেট করা হয়েছে`, 'success');
  };

  const switchUser = (email: string) => {
    const targetEmail = (email || '').toLowerCase();
    const found = users.find(u => (u.email || '').toLowerCase() === targetEmail);
    if (found) {
      setCurrentUser(found);
      showToast(`${found.name} (${found.role}) হিসেবে লগইন করা হয়েছে`, 'info');
    } else if (targetEmail === SUPER_ADMIN_EMAIL.toLowerCase() || targetEmail.includes('admin')) {
      loginAsAdmin();
    } else {
      loginAsUser();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        isAdmin,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        users,
        allUsers: users,
        platformSettings,
        updatePlatformSettings,
        mailBatches,
        submitMailBatch,
        approveMailBatch,
        rejectMailBatch,
        marketplaceItems,
        updateMarketplaceItem,
        addMarketplaceItem,
        addMarketplacePackage,
        addMarketplaceStock,
        deleteMarketplaceItem,
        buyerOrders,
        buyMarketplaceItem,
        transactions,
        approveTransaction,
        rejectTransaction,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        adjustUserBalance,
        updateUserRole,
        switchUser,
        exchangeCurrency,
        reviews,
        addReview,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        loginAsAdmin,
        loginAsUser,
        updateUserProfile,
        isLiveChatOpen,
        setIsLiveChatOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isGlobalPopupOpen,
        setIsGlobalPopupOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        firebaseAuthUser,
        firebaseLoginWithEmail,
        firebaseRegisterWithEmail,
        firebaseLoginWithGoogle,
        firebaseLogout,
        firebaseResetPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
