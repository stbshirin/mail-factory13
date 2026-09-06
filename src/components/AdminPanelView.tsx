import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { MailBatch, MarketplaceItem, PaymentMethod, MailType, User, UserRole, MemberTier } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Settings,
  Package,
  FileText,
  Search,
  Check,
  X,
  Eye,
  Download,
  Plus,
  Edit2,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Key,
  Database,
  MailCheck,
  HelpCircle,
  Send,
  UserPlus,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  Award,
  Filter,
  Phone,
  Mail,
  Ban,
  UserCog,
  Bell,
  Star,
  MessageSquare,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    mailBatches,
    approveMailBatch,
    rejectMailBatch,
    transactions,
    approveTransaction,
    rejectTransaction,
    platformSettings,
    updatePlatformSettings,
    marketplaceItems,
    addMarketplaceStock,
    addMarketplacePackage,
    updateMarketplaceItem,
    allUsers,
    adjustUserBalance,
    updateUserRole,
    updateUserStatus,
    updateUserTier,
    updateMemberByAdmin,
    deleteUser,
    addUserManually,
    currentUser,
    switchUser,
    showToast,
    isAdmin,
    syncFirebaseData,
    checkFirebaseHealth,
    firebaseResetPassword,
    reviews,
    approveReview,
    rejectReview,
    deleteReview,
    notifications,
    sendAdminNotification,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'batches' | 'transactions' | 'rates' | 'inventory' | 'users' | 'notifications' | 'reviews'
  >('batches');

  // Admin Notification States
  const [notifTarget, setNotifTarget] = useState<string>('all');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'success' | 'warning' | 'alert'>('info');
  const [notifActionTab, setNotifActionTab] = useState('');

  // Admin Reviews Filter
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [showFirebaseTroubleshooting, setShowFirebaseTroubleshooting] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState(currentUser?.email || 'stb.shirin@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message?: string; code?: string } | null>(null);

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      showToast('অনুগ্রহ করে টেস্ট ইমেইল ঠিকানা লিখুন', 'error');
      return;
    }
    setIsTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await firebaseResetPassword(testEmailAddress.trim());
      setTestEmailResult(res);
      if (res.success) {
        showToast('টেস্ট ইমেইল পাঠানো হয়েছে! ইনবক্স অথবা Spam ফোল্ডার চেক করুন।', 'success');
      } else {
        showToast(res.message || 'ইমেইল পাঠানো ব্যর্থ হয়েছে', 'error');
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'অপ্রত্যাশিত সমস্যা হয়েছে',
        code: err.code,
      });
    } finally {
      setIsTestingEmail(false);
    }
  };
  const [firebaseStatusInfo, setFirebaseStatusInfo] = useState<{
    firestore: boolean;
    rtdb: boolean;
    auth: boolean;
    lastTested: string;
  } | null>(null);

  const handleManualFirebaseSync = async () => {
    setIsSyncingFirebase(true);
    try {
      await syncFirebaseData();
      const status = await checkFirebaseHealth();
      setFirebaseStatusInfo({
        firestore: status.firestoreConnected,
        rtdb: status.rtdbConnected,
        auth: status.authConfigured,
        lastTested: new Date().toLocaleTimeString(),
      });
    } catch (e: any) {
      showToast('Firebase সিঙ্ক ত্রুটি: ' + (e?.message || 'Unknown'), 'error');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  // Batch inspection modal state
  const [selectedBatch, setSelectedBatch] = useState<MailBatch | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Rate settings local form state
  const [ratesForm, setRatesForm] = useState(platformSettings);

  useEffect(() => {
    setRatesForm(platformSettings);
  }, [platformSettings]);

  // New package modal
  const [showNewPackageModal, setShowNewPackageModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgType, setNewPkgType] = useState<MailType>('fresh');
  const [newPkgPrice, setNewPkgPrice] = useState(12);
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgFeatures, setNewPkgFeatures] = useState('100% Fresh, Instant Delivery, 3 Days Replacement');
  const [newPkgStock, setNewPkgStock] = useState(50);
  const [newPkgBadge, setNewPkgBadge] = useState('New Release');

  // Add stock to package modal
  const [stockItem, setStockItem] = useState<MarketplaceItem | null>(null);
  const [newStockMailsText, setNewStockMailsText] = useState('');

  // Member Management Filters & States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'moderator' | 'user'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [userTierFilter, setUserTierFilter] = useState<string>('all');

  // User balance modal
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<{
    id: string;
    name: string;
    email: string;
    currentBdt: number;
    currentUsd: number;
  } | null>(null);
  const [balanceCurrency, setBalanceCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [balanceDeltaInput, setBalanceDeltaInput] = useState<number>(100);
  const [balanceReasonInput, setBalanceReasonInput] = useState('সেলার বোনাস / ম্যানুয়াল অ্যাডজাস্টমেন্ট');

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('user');
  const [newMemberTier, setNewMemberTier] = useState<MemberTier>('Silver');
  const [newMemberInitialBalance, setNewMemberInitialBalance] = useState<number>(0);

  // Edit Member Modal State
  const [editMemberModalUser, setEditMemberModalUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [editTier, setEditTier] = useState<MemberTier>('Silver');
  const [editPhone, setEditPhone] = useState('');
  const [editBalanceBdt, setEditBalanceBdt] = useState<number>(0);
  const [editIsBanned, setEditIsBanned] = useState(false);

  // Delete User Confirm Modal State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Batch filters
  const [batchStatusFilter, setBatchStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const userList = allUsers || [];
  const batchesList = mailBatches || [];
  const trxList = transactions || [];
  const marketList = marketplaceItems || [];

  const pendingBatchesCount = batchesList.filter(b => b.status === 'pending').length;
  const pendingTransactionsCount = trxList.filter(t => t.status === 'pending').length;
  const pendingReviewsCount = (reviews || []).filter(r => r.status === 'pending').length;

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      showToast('শিরোনাম এবং বার্তার বিবরণ লিখুন', 'error');
      return;
    }
    sendAdminNotification({
      targetUserId: notifTarget,
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      actionTab: notifActionTab || undefined,
    });
    setNotifTitle('');
    setNotifMessage('');
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(ratesForm);
    showToast('রেট ও সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
  };

  const handleConfirmRejectBatch = () => {
    if (!selectedBatch) return;
    rejectMailBatch(selectedBatch.id, rejectReasonInput || 'ভেরিফিকেশন ফেইলড অথবা ইনভ্যালিড ক্রেডেনশিয়াল');
    setShowRejectModal(false);
    setSelectedBatch(null);
    setRejectReasonInput('');
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle) return;

    addMarketplacePackage({
      title: newPkgTitle,
      type: newPkgType,
      pricePerUnit: Number(newPkgPrice),
      description: newPkgDesc,
      features: newPkgFeatures.split(',').map(s => s.trim()).filter(Boolean),
      stockAvailable: Number(newPkgStock),
      badge: newPkgBadge,
      minOrder: 5,
      credentialsPool: Array.from({ length: Number(newPkgStock) }).map(
        (_, i) => `user_${newPkgType}_${Date.now()}_${i + 1}@gmail.com:Strong#Pass2026:recovery_${i + 1}@outlook.com`
      ),
    });

    setShowNewPackageModal(false);
    setNewPkgTitle('');
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItem) return;
    const lines = newStockMailsText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showToast('মেইল লিস্ট পেস্ট করুন', 'error');
      return;
    }
    addMarketplaceStock(stockItem.id, lines);
    setStockItem(null);
    setNewStockMailsText('');
  };

  const handleBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    adjustUserBalance(selectedUserForBalance.id, balanceDeltaInput, balanceReasonInput, balanceCurrency);
    setSelectedUserForBalance(null);
  };

  const handleCreateMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast('নাম এবং ইমেইল প্রদান করুন', 'error');
      return;
    }
    addUserManually({
      name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      phone: newMemberPhone.trim(),
      role: newMemberRole,
      tier: newMemberTier,
      initialBalanceBdt: Number(newMemberInitialBalance) || 0,
    });
    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberRole('user');
    setNewMemberTier('Silver');
    setNewMemberInitialBalance(0);
  };

  const handleSaveEditMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMemberModalUser) return;
    updateMemberByAdmin(editMemberModalUser.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      role: editRole,
      tier: editTier,
      isBanned: editIsBanned,
      balanceBdt: Number(editBalanceBdt) || 0,
    });
    setEditMemberModalUser(null);
  };

  const handleConfirmDeleteUser = () => {
    if (!deleteConfirmUser) return;
    deleteUser(deleteConfirmUser.id);
    setDeleteConfirmUser(null);
  };

  const filteredUsers = userList.filter(u => {
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userStatusFilter === 'active' && u.isBanned) return false;
    if (userStatusFilter === 'banned' && !u.isBanned) return false;
    if (userTierFilter !== 'all' && u.tier !== userTierFilter) return false;
    return true;
  });

  const downloadBatchTxt = (b: MailBatch) => {
    const text = b.mails.map(m => `${m.email}:${m.password}:${m.recoveryEmail}`).join('\n');
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `batch_${b.id}_${b.userName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('ব্যাচ ফাইল ডাউনলোড হয়েছে', 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Super Admin Top Banner with Cloud Firestore Security Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/70 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ক্লাউড ফায়ারবেস সিকিউরড অ্যাডমিন প্যানেল (Super Admin)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              মেইল ফ্যাক্টরি মাস্টার কন্ট্রোল প্যানেল
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="text-slate-300">
                স্বীকৃত সুপার অ্যাডমিন:{' '}
                <strong className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  soheltajbhola@gmail.com
                </strong>
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-400 font-semibold">
                বর্তমান অ্যাক্সেস: {currentUser.email}
              </span>
            </div>
          </div>

          {/* Quick Admin Role Switcher for instant testing */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 font-medium">অ্যাডমিন অ্যাক্টিভেশন কন্ট্রোল:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchUser('soheltajbhola@gmail.com')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentUser.email === 'soheltajbhola@gmail.com'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                soheltajbhola (Admin)
              </button>
              <button
                onClick={() => switchUser('user@mailfactory.com')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentUser.email !== 'soheltajbhola@gmail.com'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Normal User
              </button>
            </div>
          </div>
        </div>

        {/* Real-time counters banner */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400">অপেক্ষমাণ মেইল ব্যাচ:</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{pendingBatchesCount} টি</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400">পেন্ডিং ডিপোজিট/উইথড্র:</div>
            <div className="text-xl font-black text-sky-400 mt-0.5">{pendingTransactionsCount} টি</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400">মোট নিবন্ধিত ইউজার:</div>
            <div className="text-xl font-black text-white mt-0.5">{userList.length} জন</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400">বর্তমান লাইভ শিফট:</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{platformSettings.activeShift}</div>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('batches')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'batches'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>মেইল ব্যাচ অনুমোদন ({pendingBatchesCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'transactions'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>লেনদেন ভেরিফিকেশন ({pendingTransactionsCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rates')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'rates'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>রেট ও শিফট কনফিগারেশন</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'inventory'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>মার্কেটপ্লেস ইনভেন্টরি ({marketList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ইউজার ও ব্যালেন্স ম্যানেজমেন্ট ({userList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'notifications'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>নোটিফিকেশন পাঠান</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'reviews'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>রিভিউ অনুমোদন ({pendingReviewsCount})</span>
        </button>
      </div>

      {/* SUBTAB 1: MAIL BATCHES REVIEW */}
      {activeSubTab === 'batches' && (
        <div className="space-y-6">
          {/* Firebase Cloud Sync & Email Diagnostics Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/40 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Firebase ক্লাউড ডাটাবেজ ও ইমেইল সার্ভিস
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      স্বয়ংক্রিয় সিঙ্ক সক্রিয়
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    সেলারদের সাবমিট করা সকল জিমেইল রিয়েলটাইমে Cloud Firestore (<code className="text-amber-300 font-mono text-[11px]">mail_batches</code>, <code className="text-amber-300 font-mono text-[11px]">submitted_emails</code>) এবং Realtime Database এ সেভ হচ্ছে।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFirebaseTroubleshooting(!showFirebaseTroubleshooting)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showFirebaseTroubleshooting ? 'নির্দেশিকা লুকান' : 'ইমেইল হেল্প'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleManualFirebaseSync}
                  disabled={isSyncingFirebase}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingFirebase ? 'সিঙ্ক হচ্ছে...' : 'Firebase এ সিঙ্ক করুন'}</span>
                </button>
              </div>
            </div>

            {/* Troubleshooting Guide Accordion */}
            {showFirebaseTroubleshooting && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-xs space-y-3 animate-fadeIn">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <MailCheck className="w-4 h-4" />
                  <span>Firebase থেকে ইমেইল না পৌঁছালে করণীয় (Troubleshooting Checklist):</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px] leading-relaxed">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
                      <span>Spam / Junk ফোল্ডার চেক করুন</span>
                    </div>
                    <p className="text-slate-400">
                      Firebase-এর ডিফল্ট নোরেপ্লাই (<code className="text-indigo-300">noreply@mail-fact20.firebaseapp.com</code>) ঠিকানা থেকে আসা পাসওয়ার্ড রিসেট বা ভেরিফিকেশন ইমেইল অনেক সময় জিমেইলের <strong>Spam / Junk</strong> অথবা <strong>All Mail</strong> ফোল্ডারে জমা হয়।
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                      <span>Firebase Console - Templates সক্রিয় করুন</span>
                    </div>
                    <p className="text-slate-400">
                      Firebase Console &gt; <strong>Authentication</strong> &gt; <strong>Templates</strong> ট্যাবে গিয়ে "Password reset" এবং "Email address verification" টেমপ্লেট সক্রিয় ও কনফিগার করা রয়েছে কি না নিশ্চিত করুন।
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                      <span>Authorized Domains চেক করুন</span>
                    </div>
                    <p className="text-slate-400">
                      Firebase Console &gt; <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong> এ আপনার বর্তমান ওয়েব ডোমেন তালিকাভুক্ত থাকা বাধ্যতামূলক।
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">4</span>
                      <span>জিমেইল ডেটাবেজ ভিউ</span>
                    </div>
                    <p className="text-slate-400">
                      অ্যাপে সেলারদের সাবমিট করা জিমেইলগুলো স্বয়ংক্রিয়ভাবে ক্লাউড ডেটাবেজে জমা হচ্ছে। "Firebase এ সিঙ্ক করুন" বাটনে ক্লিক করলে লোকাল সব ব্যাচও ক্লাউডে আপডেট হবে।
                    </p>
                  </div>
                </div>

                {/* Live Firebase Email Diagnostic Tester */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>Firebase ইমেইল লাইভ টেস্ট ও ডায়াগনস্টিক টুল:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">যেকোনো ইমেইলে রিসেট লিংক পাঠিয়ে টেস্ট করুন</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={e => setTestEmailAddress(e.target.value)}
                      placeholder="e.g. stb.shirin@gmail.com"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={isTestingEmail}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer transition-all"
                    >
                      <Send className={`w-3.5 h-3.5 ${isTestingEmail ? 'animate-spin' : ''}`} />
                      <span>{isTestingEmail ? 'পাঠানো হচ্ছে...' : 'টেস্ট ইমেইল পাঠান'}</span>
                    </button>
                  </div>

                  {testEmailResult && (
                    <div
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                        testEmailResult.success
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {testEmailResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{testEmailResult.message}</div>
                        {testEmailResult.code && (
                          <div className="text-[11px] font-mono opacity-80 mt-0.5">
                            Firebase Error Code: {testEmailResult.code}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {[
                { id: 'pending', label: `অপেক্ষমাণ (${pendingBatchesCount})` },
                { id: 'approved', label: 'অনুমোদিত' },
                { id: 'rejected', label: 'বাতিলকৃত' },
                { id: 'all', label: 'সব ব্যাচ' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setBatchStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    batchStatusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              সেলারদের মেইল ভেরিফাই করে অনুমোদন করুন। অনুমোদনের সাথে সাথে সেলারের একাউন্টে টাকা যুক্ত হবে।
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {batchesList.filter(b => batchStatusFilter === 'all' || b.status === batchStatusFilter).length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                এই ফিল্টারে কোনো মেইল ব্যাচ পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4 font-semibold">ব্যাচ আইডি</th>
                      <th className="py-3 px-4 font-semibold">সেলার</th>
                      <th className="py-3 px-4 font-semibold">ক্যাটাগরি</th>
                      <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                      <th className="py-3 px-4 font-semibold">প্রদেয় টাকা</th>
                      <th className="py-3 px-4 font-semibold">পেমেন্ট মেথড</th>
                      <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
                      <th className="py-3 px-4 font-semibold text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {mailBatches
                      .filter(b => batchStatusFilter === 'all' || b.status === batchStatusFilter)
                      .map(batch => (
                        <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-white">{batch.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{batch.userName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{batch.userEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-400 capitalize">{batch.mailType}</td>
                          <td className="py-3.5 px-4 font-black text-white text-sm">{batch.validMailsCount} টি</td>
                          <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                            ৳{batch.totalAmount.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{batch.paymentMethod}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{batch.payoutAccount}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            {batch.status === 'approved' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ✓ Approved
                              </span>
                            )}
                            {batch.status === 'pending' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                ⏳ Review Pending
                              </span>
                            )}
                            {batch.status === 'rejected' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ✕ Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedBatch(batch)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>মেইল দেখুন</span>
                            </button>

                            {batch.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveMailBatch(batch.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>অনুমোদন ও পে</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedBatch(batch);
                                    setShowRejectModal(true);
                                  }}
                                  className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>রিজেক্ট</span>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: TRANSACTIONS MANAGEMENT */}
      {activeSubTab === 'transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>ডিপোজিট ও ক্যাশআউট ভেরিফিকেশন</span>
            </h2>
            <span className="text-xs text-slate-400">
              TrxID মিলিয়ে ডিপোজিট সম্পন্ন করুন এবং বিকাশ/নগদে টাকা পাঠিয়ে উইথড্র সম্পন্ন করুন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">ইউজার</th>
                  <th className="py-3 px-4 font-semibold">ধরণ</th>
                  <th className="py-3 px-4 font-semibold">মেথড</th>
                  <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                  <th className="py-3 px-4 font-semibold">TrxID / মোবাইল নম্বর</th>
                  <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
                  <th className="py-3 px-4 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{trx.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">আইডি: {trx.userId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {trx.type === 'deposit' && <span className="text-sky-400">ডিপোজিট</span>}
                      {trx.type === 'withdraw' && <span className="text-rose-400">উইথড্র রিকোয়েস্ট</span>}
                      {trx.type === 'mail_sale' && <span className="text-emerald-400">মেইল বিক্রি</span>}
                      {trx.type === 'marketplace_buy' && <span className="text-amber-400">মার্কেটপ্লেস ক্রয়</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{trx.method}</td>
                    <td className="py-3.5 px-4 font-black text-sm text-white">৳{trx.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div>TrxID: <strong className="text-amber-400">{trx.trxId || 'N/A'}</strong></div>
                      <div>একাউন্ট: {trx.accountNumber || trx.senderNumber || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {trx.status === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Completed
                        </span>
                      )}
                      {trx.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                          ⏳ Pending
                        </span>
                      )}
                      {trx.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {trx.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveTransaction(trx.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>
                          <button
                            onClick={() => rejectTransaction(trx.id)}
                            className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RATES & SHIFT CONFIGURATION */}
      {activeSubTab === 'rates' && (
        <form onSubmit={handleSaveRates} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white">রেট, শিফট ও পেমেন্ট নাম্বার সেটিংস</h2>
              <p className="text-xs text-slate-400 mt-0.5">প্ল্যাটফর্মের মেইল কেনার রেট ও রিসিভিং অ্যাকাউন্ট আপডেট করুন</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buying Rates Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>সেলারদের থেকে জিমেইল কেনার রেট (প্রতি পিস BDT):</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">ফ্রেশ জিমেইল (Fresh):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailBuyingRateFresh}
                    onChange={e => setRatesForm({ ...ratesForm, mailBuyingRateFresh: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">রিকভারি জিমেইল (Recovery):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailBuyingRateRecovery}
                    onChange={e => setRatesForm({ ...ratesForm, mailBuyingRateRecovery: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">পুরাতন জিমেইল (Aged):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailBuyingRateAged}
                    onChange={e => setRatesForm({ ...ratesForm, mailBuyingRateAged: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">USA IP জিমেইল:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailBuyingRateUsa}
                    onChange={e => setRatesForm({ ...ratesForm, mailBuyingRateUsa: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Edu জিমেইল (Edu):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailBuyingRateEdu || 12}
                    onChange={e => setRatesForm({ ...ratesForm, mailBuyingRateEdu: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Selling Rates Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>মার্কেটপ্লেসে জিমেইল বিক্রয় রেট (বায়ারদের ক্রয় মূল্য BDT):</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">ফ্রেশ জিমেইল (Fresh):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailSellingRateFresh || 12.0}
                    onChange={e => setRatesForm({ ...ratesForm, mailSellingRateFresh: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">রিকভারি জিমেইল (Recovery):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailSellingRateRecovery || 15.0}
                    onChange={e => setRatesForm({ ...ratesForm, mailSellingRateRecovery: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">পুরাতন জিমেইল (Aged):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailSellingRateAged || 25.0}
                    onChange={e => setRatesForm({ ...ratesForm, mailSellingRateAged: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">USA IP জিমেইল:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailSellingRateUsa || 35.0}
                    onChange={e => setRatesForm({ ...ratesForm, mailSellingRateUsa: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Edu মেইল (Edu):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratesForm.mailSellingRateEdu || 45.0}
                    onChange={e => setRatesForm({ ...ratesForm, mailSellingRateEdu: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Custom Texts Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 md:col-span-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>ওয়েবসাইটের যেকোনো ধরনের লেখা পরিবর্তন (Custom Content & Notice):</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">হোম পেজ হেডলাইন (Main Headline):</label>
                  <input
                    type="text"
                    value={ratesForm.heroHeadline || ''}
                    placeholder="বিশ্বস্ত জিমেইল ক্রয়-বিক্রয় ও মাইক্রো-আর্নিং প্ল্যাটফর্ম"
                    onChange={e => setRatesForm({ ...ratesForm, heroHeadline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">হোম পেজ সাবটাইটেল (Subtitle):</label>
                  <input
                    type="text"
                    value={ratesForm.heroSubtitle || ''}
                    placeholder="নিরাপদে ফ্রেশ ও ওল্ড জিমেইল অ্যাকাউন্ট ক্রয় করুন অথবা নিজের তৈরি করা জিমেইল সাবমিট করে বিকাশ ও নগদে সরাসরি টাকা উইথড্র নিন।"
                    onChange={e => setRatesForm({ ...ratesForm, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">ঘোষণা স্ক্রল নোটিশ (Ticker Notice):</label>
                  <input
                    type="text"
                    value={ratesForm.tickerNotice || ''}
                    placeholder="মেইল ফ্যাক্টরি বিডি-তে স্বাগতম! আজকের স্পেশাল বোনাস রেট চলছে।"
                    onChange={e => setRatesForm({ ...ratesForm, tickerNotice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">শিফট বোনাস নোটিশ টেক্সট:</label>
                  <input
                    type="text"
                    value={ratesForm.shiftBonusText || ''}
                    placeholder="প্রতিদিন সকাল ৮টা থেকে রাত ১১টা পর্যন্ত ফ্রেশ জিমেইলে অতিরিক্ত ৫০ পয়সা বোনাস রেট প্রযোজ্য।"
                    onChange={e => setRatesForm({ ...ratesForm, shiftBonusText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Shift & Limits Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>শিফট ও লিমিট কনফিগারেশন:</span>
              </h3>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">বর্তমান শিফটের নাম:</label>
                <input
                  type="text"
                  value={ratesForm.activeShift}
                  onChange={e => setRatesForm({ ...ratesForm, activeShift: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">শিফট শিডিউল বর্ণনা:</label>
                <input
                  type="text"
                  value={ratesForm.shiftHours}
                  onChange={e => setRatesForm({ ...ratesForm, shiftHours: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">মিনিমাম উইথড্র (BDT):</label>
                  <input
                    type="number"
                    value={ratesForm.minWithdrawalBdt}
                    onChange={e => setRatesForm({ ...ratesForm, minWithdrawalBdt: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">মিনিমাম ডিপোজিট (BDT):</label>
                  <input
                    type="number"
                    value={ratesForm.minDepositBdt}
                    onChange={e => setRatesForm({ ...ratesForm, minDepositBdt: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Payment Receiving Accounts */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400">
              অ্যাডমিন পেমেন্ট রিসিভিং অ্যাকাউন্টস (ডিপোজিট করার জন্য ইউজাররা দেখবে):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">বিকাশ পার্সোনাল নম্বর:</label>
                <input
                  type="text"
                  value={ratesForm.bKashNumber}
                  onChange={e => setRatesForm({ ...ratesForm, bKashNumber: e.target.value, bKashType: 'Personal' })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">নগদ পার্সোনাল নম্বর:</label>
                <input
                  type="text"
                  value={ratesForm.nagadNumber}
                  onChange={e => setRatesForm({ ...ratesForm, nagadNumber: e.target.value, nagadType: 'Personal' })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">রকেট পার্সোনাল নম্বর:</label>
                <input
                  type="text"
                  value={ratesForm.rocketNumber}
                  onChange={e => setRatesForm({ ...ratesForm, rocketNumber: e.target.value, rocketType: 'Personal' })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Binance USDT TRC-20 Address:</label>
                <input
                  type="text"
                  value={ratesForm.binanceUsdtAddress}
                  onChange={e => setRatesForm({ ...ratesForm, binanceUsdtAddress: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Binance Pay ID:</label>
                <input
                  type="text"
                  value={ratesForm.binancePayId}
                  onChange={e => setRatesForm({ ...ratesForm, binancePayId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SUBTAB 4: MARKETPLACE INVENTORY */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">মার্কেটপ্লেস প্যাকেজ ও স্টক নিয়ন্ত্রণ</h2>
              <p className="text-xs text-slate-400">নতুন প্যাকেজ যোগ করুন বা যেকোনো প্যাকেজে সরাসরি মেইল স্টক আপলোড করুন</p>
            </div>

            <button
              onClick={() => setShowNewPackageModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>নতুন প্যাকেজ তৈরি করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map(item => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                    <span className="text-xl font-black text-white">৳{item.pricePerUnit.toFixed(2)}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">বর্তমান স্টক:</span>
                    <span className="font-bold text-emerald-400 text-sm">{item.stockAvailable} টি মেইল</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setStockItem(item)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>স্টক যোগ করুন</span>
                  </button>

                  <button
                    onClick={() => updateMarketplaceItem(item.id, { isActive: !item.isActive })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                      item.isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {item.isActive ? 'পজ' : 'চালু'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: USERS & MEMBER MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          {/* Top Member Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">মোট মেম্বার</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{userList.length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">নিবন্ধিত অ্যাকাউন্ট</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">সাধারণ ইউজার</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {userList.filter(u => u.role === 'user').length}
              </div>
              <div className="text-[11px] text-blue-400/80 mt-0.5">নিয়মিত গ্রাহক ও বিক্রেতা</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">এডমিন ও মডারেটর</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {userList.filter(u => u.role === 'admin' || u.role === 'moderator').length}
              </div>
              <div className="text-[11px] text-emerald-500/80 mt-0.5">ম্যানেজমেন্ট স্টাফ</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">ব্যানড / স্থগিত</span>
                <Ban className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400">
                {userList.filter(u => u.isBanned).length}
              </div>
              <div className="text-[11px] text-rose-500/80 mt-0.5">স্থগিত মেম্বার</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">মোট সঞ্চিত BDT</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">
                ৳{userList.reduce((acc, u) => acc + (u.balanceBdt || 0), 0).toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">ইউজার ওয়ালেট সঞ্চয়</div>
            </div>
          </div>

          {/* Member Management Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            {/* Action & Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-amber-400" />
                  <span>মেম্বার ও পারমিশন কন্ট্রোল প্যানেল</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ইউজারদের রোল পরিবর্তন, টায়ার অ্যাসাইন, ওয়ালেট ব্যালেন্স অ্যাডজাস্ট ও একাউন্ট পরিচালনা করুন
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualFirebaseSync}
                  disabled={isSyncingFirebase}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="ফায়ারবেস ক্লাউড ডেটা রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirebase ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isSyncingFirebase ? 'সিঙ্ক হচ্ছে...' : 'Firebase রিফ্রেশ'}</span>
                </button>

                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 inline-flex items-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>নতুন মেম্বার যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Role filter */}
              <div>
                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">সকল রোল (All Roles)</option>
                  <option value="user">সাধারণ ইউজার (User)</option>
                  <option value="moderator">মডারেটর (Moderator)</option>
                  <option value="admin">অ্যাডমিন (Admin)</option>
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={userStatusFilter}
                  onChange={e => setUserStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">সকল স্ট্যাটাস (All Status)</option>
                  <option value="active">সক্রিয় মেম্বার (Active)</option>
                  <option value="banned">স্থগিত / ব্যানড (Banned)</option>
                </select>
              </div>

              {/* Tier filter */}
              <div>
                <select
                  value={userTierFilter}
                  onChange={e => setUserTierFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">সকল টায়ার (All Tiers)</option>
                  <option value="Bronze">ব্রোঞ্জ (Bronze)</option>
                  <option value="Silver">সিলভার (Silver)</option>
                  <option value="Gold">গোল্ড (Gold)</option>
                  <option value="Diamond">ডায়মন্ড (Diamond)</option>
                </select>
              </div>
            </div>

            {/* User count badge */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>
                ফিল্টার ফলাফল: <strong className="text-amber-400">{filteredUsers.length}</strong> জন মেম্বার
              </span>
              {(userSearchQuery || userRoleFilter !== 'all' || userStatusFilter !== 'all' || userTierFilter !== 'all') && (
                <button
                  onClick={() => {
                    setUserSearchQuery('');
                    setUserRoleFilter('all');
                    setUserStatusFilter('all');
                    setUserTierFilter('all');
                  }}
                  className="text-amber-400 hover:underline text-xs"
                >
                  ফিল্টার ক্লিয়ার করুন
                </button>
              )}
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">মেম্বার প্রোফাইল</th>
                    <th className="py-3.5 px-4 font-semibold">রোল (Role)</th>
                    <th className="py-3.5 px-4 font-semibold">টায়ার (Tier)</th>
                    <th className="py-3.5 px-4 font-semibold">BDT ব্যালেন্স</th>
                    <th className="py-3.5 px-4 font-semibold">USD ব্যালেন্স</th>
                    <th className="py-3.5 px-4 font-semibold">মেইল বিক্রি</th>
                    <th className="py-3.5 px-4 font-semibold">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 font-semibold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 bg-slate-900/50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="font-semibold">কোনো মেম্বার পাওয়া যায়নি</p>
                        <p className="text-[11px] mt-1">অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isSuperAdmin = u.email === 'soheltajbhola@gmail.com' || u.email === 'stb.shirin@gmail.com';
                      const isMe = currentUser.id === u.id;

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                          {/* Member info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-black text-white text-xs shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                                  <span>{u.name}</span>
                                  {isSuperAdmin && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                                      SUPER ADMIN
                                    </span>
                                  )}
                                  {isMe && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-500/40">
                                      YOU
                                    </span>
                                  )}
                                  {u.isBanned && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40">
                                      স্থগিত
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono truncate">{u.email}</div>
                                {u.phone && (
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>{u.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            {isSuperAdmin ? (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>ADMIN</span>
                              </span>
                            ) : (
                              <select
                                value={u.role}
                                onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                              >
                                <option value="user">User (ইউজার)</option>
                                <option value="moderator">Moderator (মডারেটর)</option>
                                <option value="admin">Admin (অ্যাডমিন)</option>
                              </select>
                            )}
                          </td>

                          {/* Tier */}
                          <td className="py-3.5 px-4">
                            <select
                              value={u.memberTier || (u as any).tier || 'Silver'}
                              onChange={e => updateUserTier(u.id, e.target.value as MemberTier)}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="Bronze">Bronze (ব্রোঞ্জ)</option>
                              <option value="Silver">Silver (সিলভার)</option>
                              <option value="Gold">Gold (গোল্ড)</option>
                              <option value="Diamond">Diamond (ডায়মন্ড)</option>
                            </select>
                          </td>

                          {/* BDT Balance */}
                          <td className="py-3.5 px-4">
                            <span className="font-black text-amber-400 text-sm">
                              ৳{(u.balanceBdt || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* USD Balance */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-200">
                              ${(u.balanceUsd || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* Mails Sold */}
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                              {u.totalMailsSold || 0} টি
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {u.isBanned ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                BANNED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                ACTIVE
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Balance adjustment */}
                              <button
                                onClick={() => {
                                  setSelectedUserForBalance({
                                    id: u.id,
                                    name: u.name,
                                    email: u.email,
                                    currentBdt: u.balanceBdt || 0,
                                    currentUsd: u.balanceUsd || 0,
                                  });
                                  setBalanceDeltaInput(100);
                                  setBalanceCurrency('BDT');
                                }}
                                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                                title="ব্যালেন্স অ্যাডজাস্ট করুন"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit details */}
                              <button
                                onClick={() => {
                                  setEditMemberModalUser(u);
                                  setEditName(u.name || '');
                                  setEditRole(u.role);
                                  setEditTier(u.memberTier || (u as any).tier || 'Silver');
                                  setEditPhone(u.phone || '');
                                  setEditBalanceBdt(u.balanceBdt || 0);
                                  setEditIsBanned(!!u.isBanned);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                                title="মেম্বার এডিট করুন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Ban / Unban Toggle (disabled for super admins) */}
                              {!isSuperAdmin && (
                                <button
                                  onClick={() => updateUserStatus(u.id, !u.isBanned)}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    u.isBanned
                                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                                      : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                                  }`}
                                  title={u.isBanned ? 'একাউন্ট সক্রিয় করুন' : 'একাউন্ট স্থগিত / ব্যান করুন'}
                                >
                                  {u.isBanned ? (
                                    <UserCheck className="w-3.5 h-3.5" />
                                  ) : (
                                    <Ban className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}

                              {/* Delete (disabled for super admins) */}
                              {!isSuperAdmin && (
                                <button
                                  onClick={() => setDeleteConfirmUser(u)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors"
                                  title="মেম্বার মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: NOTIFICATIONS MANAGEMENT */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">অ্যাডমিন নোটিফিকেশন সেন্টার</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    একজন নির্দিষ্ট ইউজারকে অথবা সকল ব্যবহারকারীকে একই সাথে নোটিশ বা সতর্কবার্তা পাঠান।
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-5 bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>নতুন নোটিফিকেশন তৈরি করুন:</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    প্রাপক নির্বাচন করুন (Target Audience):
                  </label>
                  <select
                    value={notifTarget}
                    onChange={e => setNotifTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:border-amber-500 outline-none"
                  >
                    <option value="all">📢 সকল ইউজার (Broadcast to Everyone)</option>
                    <optgroup label="নির্দিষ্ট ব্যবহারকারী (Individual User)">
                      {userList.map(u => (
                        <option key={u.id} value={u.id}>
                          👤 {u.name || 'User'} ({u.email || u.phone || u.id})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Notification Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    বার্তার ধরণ (Notification Type):
                  </label>
                  <select
                    value={notifType}
                    onChange={e => setNotifType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:border-amber-500 outline-none"
                  >
                    <option value="info">ℹ️ তথ্যমূলক সাধারণ নোটিশ (Info)</option>
                    <option value="success">✅ সাফল্য বা বোনাস বার্তা (Success)</option>
                    <option value="warning">⚠️ সতর্কতা নোটিশ (Warning)</option>
                    <option value="alert">🚨 জরুরি অ্যালার্ট (Urgent Alert)</option>
                  </select>
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    নোটিফিকেশন শিরোনাম (Title):
                  </label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    placeholder="যেমন: আজকের নাইট শিফটে মেইল রেট বৃদ্ধি করা হয়েছে!"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    বার্তা বিবরণ (Message Content):
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={notifMessage}
                    onChange={e => setNotifMessage(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ লিখুন যা ইউজারদের নোটিফিকেশন বক্সে প্রদর্শিত হবে..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Optional Action Tab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ক্লিক করলে রিডাইরেক্ট ট্যাব (ঐচ্ছিক):
                  </label>
                  <select
                    value={notifActionTab}
                    onChange={e => setNotifActionTab(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:border-amber-500 outline-none"
                  >
                    <option value="">কোন রিডাইরেক্ট নেই (None)</option>
                    <option value="sell">সেল ফ্যাক্টরি (Sell Mails)</option>
                    <option value="buy">মার্কেটপ্লেস (Buy Mails)</option>
                    <option value="wallet">ওয়ালেট ও উইথড্র (Wallet)</option>
                    <option value="reviews">রিভিউ পেজ (Reviews)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>নোটিফিকেশন পাঠান</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Notifications History */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>সম্প্রতি প্রেরিত নোটিফিকেশন তালিকা ({notifications?.length || 0}):</span>
              </h3>

              {(!notifications || notifications.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                  এখনও কোনো নোটিফিকেশন পাঠানো হয়নি।
                </div>
              ) : (
                <div className="space-y-2.5">
                  {notifications.slice(0, 15).map(n => (
                    <div
                      key={n.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            n.type === 'alert' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            n.type === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            n.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {n.type?.toUpperCase() || 'INFO'}
                          </span>
                          <span className="text-xs font-bold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {n.targetUserId === 'all' ? (
                              <span className="text-amber-400 font-semibold">[📢 সবাইকে প্রেরিত]</span>
                            ) : (
                              <span className="text-sky-400 font-semibold">[👤 নির্দিষ্ট গ্রাহক: {n.targetUserId}]</span>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{n.message}</p>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 flex-shrink-0 font-mono">
                        {new Date(n.timestamp).toLocaleString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: REVIEWS APPROVAL WORKFLOW */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">ইউজার রিভিউ ম্যানেজমেন্ট ও অনুমোদন</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    হোম পেজে পাবলিক হওয়ার পূর্বে ব্যবহারকারীদের আবেদনকৃত রিভিউ রিভিউ করুন এবং অনুমোদন দিন।
                  </p>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reviewStatusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ⏳ অপেক্ষারত ({pendingReviewsCount})
                </button>
                <button
                  onClick={() => setReviewStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reviewStatusFilter === 'approved'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ✓ অনুমোদিত ({(reviews || []).filter(r => r.status === 'approved').length})
                </button>
                <button
                  onClick={() => setReviewStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reviewStatusFilter === 'all'
                      ? 'bg-slate-700 text-white font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  সব ({reviews?.length || 0})
                </button>
              </div>
            </div>

            {/* Reviews List */}
            {(!reviews || reviews.length === 0) ? (
              <div className="p-12 text-center text-slate-400 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                কোনো রিভিউ এখনও সাবমিট করা হয়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews
                  .filter(r => {
                    if (reviewStatusFilter === 'pending') return r.status === 'pending';
                    if (reviewStatusFilter === 'approved') return r.status === 'approved';
                    return true;
                  })
                  .map(rev => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{rev.userName}</span>
                              {rev.shift && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                                  {rev.shift}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{rev.date}</span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {/* Rating Stars */}
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Status Badge */}
                            {rev.status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ✓ পাবলিক অনুমোদিত
                              </span>
                            )}
                            {rev.status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                ⏳ অপেক্ষারত
                              </span>
                            )}
                            {rev.status === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ✕ বাতিল
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          "{rev.comment}"
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                        {rev.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                approveReview(rev.id);
                                showToast('রিভিউ অনুমোদিত হয়েছে এবং হোম পেজে পাবলিক করা হয়েছে!', 'success');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>অনুমোদন করুন</span>
                            </button>
                            <button
                              onClick={() => {
                                rejectReview(rev.id);
                                showToast('রিভিউটি বাতিল করা হয়েছে', 'info');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>বাতিল</span>
                            </button>
                          </>
                        )}
                        {rev.status === 'approved' && (
                          <button
                            onClick={() => {
                              rejectReview(rev.id);
                              showToast('রিভিউটি প্রত্যাহার করা হয়েছে', 'info');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            পাবলিক বাতিল
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('আপনি কি নিশ্চিত যে এই রিভিউটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
                              deleteReview(rev.id);
                              showToast('রিভিউ মুছে ফেলা হয়েছে', 'success');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inspect Mails Modal */}
      {selectedBatch && !showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedBatch.batchName}</h3>
                <p className="text-xs text-slate-400">
                  সেলার: <strong className="text-white">{selectedBatch.userName}</strong> ({selectedBatch.userEmail})
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950">
                <span className="text-slate-400">মোট মেইল:</span>
                <div className="font-bold text-white text-sm">{selectedBatch.mails?.length || 0} টি</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950">
                <span className="text-slate-400">প্রদেয় টাকা:</span>
                <div className="font-black text-emerald-400 text-sm">৳{selectedBatch.totalAmount.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950">
                <span className="text-slate-400">পেমেন্ট মেথড:</span>
                <div className="font-bold text-amber-400">{selectedBatch.paymentMethod} ({selectedBatch.payoutAccount})</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-300">মেইল তালিকা ({selectedBatch.mails?.length || 0}টি):</span>
                <button
                  onClick={() => downloadBatchTxt(selectedBatch)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.txt ডাউনলোড</span>
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 space-y-1 select-all">
                {selectedBatch.mails.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                    <span>
                      {m.email}:{m.password}:{m.recoveryEmail}
                    </span>
                    <span className="text-[10px] text-emerald-400">✓ Ready</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {selectedBatch.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      approveMailBatch(selectedBatch.id);
                      setSelectedBatch(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>অনুমোদন ও ওয়ালেটে টাকা দিন</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="py-3 px-5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>রিজেক্ট করুন</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedBatch(null)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>মেইল ব্যাচ রিজেক্ট করুন</span>
            </h3>
            <p className="text-xs text-slate-300">
              সেলার ({selectedBatch.userName}) কে বাতিলের কারণ প্রদর্শন করা হবে:
            </p>

            <textarea
              value={rejectReasonInput}
              onChange={e => setRejectReasonInput(e.target.value)}
              placeholder="e.g. পাসওয়ার্ড ভুল / টু-ফ্যাক্টর অন ছিল / রিকভারি মেইল যুক্ত ছিল না..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmRejectBatch}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                নিশ্চিত রিজেক্ট
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock to Package Modal */}
      {stockItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">স্টক মেইল যোগ করুন</h3>
                <p className="text-xs text-amber-400">{stockItem.title}</p>
              </div>
              <button
                onClick={() => setStockItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  জিমেইল লিস্ট পেস্ট করুন (প্রতি লাইনে email:pass:recovery):
                </label>
                <textarea
                  value={newStockMailsText}
                  onChange={e => setNewStockMailsText(e.target.value)}
                  rows={8}
                  placeholder={`readymail1@gmail.com:Pass#2026:rec1@outlook.com
readymail2@gmail.com:Pass#2026:rec2@outlook.com`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStockItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  স্টক আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>ব্যালেন্স অ্যাডজাস্টমেন্ট</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedUserForBalance.name} ({selectedUserForBalance.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBalanceAdjustment} className="space-y-4">
              {/* Current Balances */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">বর্তমান BDT</span>
                  <div className="text-lg font-black text-amber-400">
                    ৳{selectedUserForBalance.currentBdt.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">বর্তমান USD</span>
                  <div className="text-lg font-black text-slate-200">
                    ${selectedUserForBalance.currentUsd.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">মুদ্রা নির্বাচন করুন:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceCurrency('BDT')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      balanceCurrency === 'BDT'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    BDT (৳ টাকা)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceCurrency('USD')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      balanceCurrency === 'USD'
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    USD ($ ডলার)
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  পরিবর্তনের পরিমাণ (+ বৃদ্ধি / - হ্রাস {balanceCurrency}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={balanceDeltaInput}
                  onChange={e => setBalanceDeltaInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-black text-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Quick Amount Chips */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">কুইক অ্যামাউন্ট:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[50, 100, 200, 500, 1000, -100, -500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBalanceDeltaInput(val)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        val > 0
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">কারণ বা রেফারেন্স নোট:</label>
                <input
                  type="text"
                  value={balanceReasonInput}
                  onChange={e => setBalanceReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  placeholder="e.g. সেলার বোনাস / অ্যাডমিন রিফান্ড"
                />
              </div>

              {/* Calculation Preview */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>নতুন প্রত্যাশিত ব্যালেন্স:</span>
                <span className="font-bold text-white">
                  {balanceCurrency === 'BDT'
                    ? `৳${Math.max(0, selectedUserForBalance.currentBdt + balanceDeltaInput).toFixed(2)}`
                    : `$${Math.max(0, selectedUserForBalance.currentUsd + balanceDeltaInput).toFixed(2)}`}
                </span>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  ব্যালেন্স পরিবর্তন কনফার্ম
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">নতুন মেম্বার যুক্ত করুন</h3>
                  <p className="text-xs text-slate-400">প্ল্যাটফর্মে ম্যানুয়ালি মেম্বার তৈরি করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">মেম্বারের নাম *:</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="e.g. মোঃ সাকিব আহমেদ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ইমেইল অ্যাড্রেস *:</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ফোন নম্বর:</label>
                  <input
                    type="text"
                    value={newMemberPhone}
                    onChange={e => setNewMemberPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">রোল (Role):</label>
                  <select
                    value={newMemberRole}
                    onChange={e => setNewMemberRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="user">User (সাধারণ মেম্বার)</option>
                    <option value="moderator">Moderator (মডারেটর)</option>
                    <option value="admin">Admin (অ্যাডমিন)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">টায়ার (Tier):</label>
                  <select
                    value={newMemberTier}
                    onChange={e => setNewMemberTier(e.target.value as MemberTier)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bronze">Bronze (ব্রোঞ্জ)</option>
                    <option value="Silver">Silver (সিলভার)</option>
                    <option value="Gold">Gold (গোল্ড)</option>
                    <option value="Diamond">Diamond (ডায়মন্ড)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  প্রাথমিক ওয়ালেট ব্যালেন্স (BDT):
                </label>
                <input
                  type="number"
                  value={newMemberInitialBalance}
                  onChange={e => setNewMemberInitialBalance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  মেম্বার যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editMemberModalUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">মেম্বার তথ্য পরিবর্তন</h3>
                  <p className="text-xs text-slate-400">{editMemberModalUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditMemberModalUser(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">মেম্বার নাম (Name):</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="মেম্বারের পুরো নাম"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ইমেইল (অপরিবর্তনীয়):</label>
                <input
                  type="text"
                  value={editMemberModalUser.email}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ফোন নম্বর (Phone):</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">রোল (Role):</label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="user">User (সাধারণ মেম্বার)</option>
                    <option value="moderator">Moderator (মডারেটর)</option>
                    <option value="admin">Admin (অ্যাডমিন)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">টায়ার (Tier):</label>
                  <select
                    value={editTier}
                    onChange={e => setEditTier(e.target.value as MemberTier)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Bronze">Bronze (ব্রোঞ্জ)</option>
                    <option value="Silver">Silver (সিলভার)</option>
                    <option value="Gold">Gold (গোল্ড)</option>
                    <option value="Diamond">Diamond (ডায়মন্ড)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ওয়ালেট ব্যালেন্স (BDT):</label>
                  <input
                    type="number"
                    value={editBalanceBdt}
                    onChange={e => setEditBalanceBdt(Number(e.target.value))}
                    min="0"
                    step="any"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">অ্যাকাউন্ট স্ট্যাটাস:</label>
                  <select
                    value={editIsBanned ? 'banned' : 'active'}
                    onChange={e => setEditIsBanned(e.target.value === 'banned')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active (সক্রিয়)</option>
                    <option value="banned">Banned (স্থগিত/ব্যান)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMemberModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/20"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">মেম্বার ডিলিট নিশ্চিতকরণ</h3>
                <p className="text-xs text-slate-400">এই অ্যাকশনটি বাতিল করা যাবে না</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="text-white font-bold">{deleteConfirmUser.name}</div>
              <div className="text-slate-400 font-mono">{deleteConfirmUser.email}</div>
              <div className="text-amber-400 font-semibold pt-1">
                ব্যালেন্স: ৳{(deleteConfirmUser.balanceBdt || 0).toFixed(2)} | ${(deleteConfirmUser.balanceUsd || 0).toFixed(2)}
              </div>
            </div>

            <p className="text-xs text-rose-300/80 leading-relaxed">
              সতর্কতা: এই মেম্বারকে ডিলিট করলে ক্লাউড ফায়ারবেস (Firestore এবং Realtime Database) ও লোকাল স্টোর থেকে তার সমস্ত তথ্য সম্পূর্ণ মুছে যাবে।
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all inline-flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Package Creation Modal */}
      {showNewPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">নতুন মার্কেটপ্লেস প্যাকেজ যোগ করুন</h3>
              <button
                onClick={() => setShowNewPackageModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">প্যাকেজ টাইটেল:</label>
                <input
                  type="text"
                  value={newPkgTitle}
                  onChange={e => setNewPkgTitle(e.target.value)}
                  placeholder="e.g. প্রিমিয়াম ফ্রেশ ইউএসএ জিমেইল"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ক্যাটাগরি:</label>
                  <select
                    value={newPkgType}
                    onChange={e => setNewPkgType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="fresh">Fresh Gmail</option>
                    <option value="recovery">Recovery Mail</option>
                    <option value="aged">Aged 2019-2022</option>
                    <option value="usa">USA IP Mail</option>
                    <option value="edu">Edu Mail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">প্রতি পিস মূল্য (BDT):</label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={e => setNewPkgPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">বিবরণ:</label>
                <input
                  type="text"
                  value={newPkgDesc}
                  onChange={e => setNewPkgDesc(e.target.value)}
                  placeholder="সংক্ষিপ্ত বর্ণনা..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">প্রাথমিক স্টক পরিমাণ:</label>
                  <input
                    type="number"
                    value={newPkgStock}
                    onChange={e => setNewPkgStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">হাইলাইট ব্যাজ:</label>
                  <input
                    type="text"
                    value={newPkgBadge}
                    onChange={e => setNewPkgBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPackageModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  প্যাকেজ পাবলিশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
