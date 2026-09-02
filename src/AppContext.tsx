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
  initialAdminUser,
  initialDemoUser,
  initialMarketplaceItems,
  initialMailBatches,
  initialTransactions,
  initialSettings,
  initialReviews,
  SUPER_ADMIN_EMAIL,
} from './data/initialData';

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
  isAdmin: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  users: User[];
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
  deleteMarketplaceItem: (id: string) => void;
  buyerOrders: BuyerOrder[];
  buyMarketplaceItem: (itemId: string, quantity: number) => { success: boolean; message: string; order?: BuyerOrder };
  transactions: Transaction[];
  submitDeposit: (data: { amount: number; method: PaymentMethod; trxId: string; senderNumber: string }) => boolean;
  approveDeposit: (trxId: string) => void;
  rejectDeposit: (trxId: string, reason?: string) => void;
  submitWithdrawal: (data: { amount: number; method: PaymentMethod; accountNumber: string }) => { success: boolean; message: string };
  approveWithdrawal: (trxId: string) => void;
  rejectWithdrawal: (trxId: string, reason?: string) => void;
  exchangeCurrency: (from: 'BDT' | 'USD', amount: number) => { success: boolean; message: string };
  reviews: Review[];
  addReview: (rating: number, comment: string, shift: string) => void;
  notifications: NotificationItem[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'mail_factory_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
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
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage('current_user', initialAdminUser)
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage('users', [initialAdminUser, initialDemoUser])
  );

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    loadFromStorage('settings', initialSettings)
  );

  const [mailBatches, setMailBatches] = useState<MailBatch[]>(() =>
    loadFromStorage('batches', initialMailBatches)
  );

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() =>
    loadFromStorage('market_items', initialMarketplaceItems)
  );

  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>(() =>
    loadFromStorage('orders', [])
  );

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('transactions', initialTransactions)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage('reviews', initialReviews)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    {
      id: 'notif-1',
      userId: currentUser.id,
      title: 'স্বাগতম Mail Factory তে',
      message: 'আপনার অ্যাকাউন্ট সক্রিয় হয়েছে। এখন ফ্রেশ জিমেইল সাবমিট করুন বা মার্কেটপ্লেস থেকে কিনুন।',
      type: 'system',
      read: false,
      timestamp: new Date().toLocaleTimeString('bn-BD'),
    },
    {
      id: 'notif-2',
      userId: currentUser.id,
      title: 'লাইভ শিফট রেট আপডেট',
      message: 'ফ্রেশ জিমেইল রেট ৳৯.৫০ এবং রিকভারি মেইল রেট ৳১১.০০ চলমান।',
      type: 'payment',
      read: false,
      timestamp: 'আজ সকাল ১০:০০',
    },
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGlobalPopupOpen, setIsGlobalPopupOpen] = useState(true);

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

  // Is Admin Check (strictly considers soheltajbhola@gmail.com and admin role)
  const isAdmin =
    currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ||
    currentUser.role === 'admin' ||
    platformSettings.adminEmails.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase());

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loginAsAdmin = () => {
    setCurrentUser(initialAdminUser);
    showToast('সুপার অ্যাডমিন হিসেবে প্রবেশ করেছেন (soheltajbhola@gmail.com)', 'success');
  };

  const loginAsUser = () => {
    setCurrentUser(initialDemoUser);
    showToast('সেলর/বায়ার ইউজার হিসেবে প্রবেশ করেছেন', 'info');
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
    const trx = transactions.find(t => t.id === trxId);
    if (!trx || trx.status !== 'pending') return;

    setTransactions(prev =>
      prev.map(t => (t.id === trxId ? { ...t, status: 'completed', processedAt: new Date().toISOString() } : t))
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

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('সকল নোটিফিকেশন পঠিত হিসেবে চিহ্নিত হয়েছে', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAdmin,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        users,
        platformSettings,
        updatePlatformSettings,
        mailBatches,
        submitMailBatch,
        approveMailBatch,
        rejectMailBatch,
        marketplaceItems,
        updateMarketplaceItem,
        addMarketplaceItem,
        deleteMarketplaceItem,
        buyerOrders,
        buyMarketplaceItem,
        transactions,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        exchangeCurrency,
        reviews,
        addReview,
        notifications,
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
