import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { MailBatch, MarketplaceItem, PaymentMethod, MailType } from '../types';
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
    currentUser,
    switchUser,
    showToast,
    isAdmin,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'batches' | 'transactions' | 'rates' | 'inventory' | 'users'
  >('batches');

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

  // User balance modal
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<{ id: string; name: string; current: number } | null>(null);
  const [balanceDeltaInput, setBalanceDeltaInput] = useState<number>(100);
  const [balanceReasonInput, setBalanceReasonInput] = useState('সেলার বোনাস / ম্যানুয়াল অ্যাডজাস্টমেন্ট');

  // Batch filters
  const [batchStatusFilter, setBatchStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const userList = allUsers || [];
  const batchesList = mailBatches || [];
  const trxList = transactions || [];
  const marketList = marketplaceItems || [];

  const pendingBatchesCount = batchesList.filter(b => b.status === 'pending').length;
  const pendingTransactionsCount = trxList.filter(t => t.status === 'pending').length;

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
    adjustUserBalance(selectedUserForBalance.id, balanceDeltaInput, balanceReasonInput);
    setSelectedUserForBalance(null);
  };

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
      </div>

      {/* SUBTAB 1: MAIL BATCHES REVIEW */}
      {activeSubTab === 'batches' && (
        <div className="space-y-6">
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

      {/* SUBTAB 5: USERS & BALANCE MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">নিবন্ধিত ইউজার ও ব্যালেন্স মডিফিকেশন</h2>
              <p className="text-xs text-slate-400">ইউজারদের ওয়ালেটে ম্যানুয়ালি ব্যালেন্স অ্যাড বা ডিক্রিজ করুন</p>
            </div>
            <span className="text-xs font-bold text-amber-400">মোট ইউজার: {userList.length} জন</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">ইউজার নাম</th>
                  <th className="py-3 px-4 font-semibold">ইমেইল</th>
                  <th className="py-3 px-4 font-semibold">রোল</th>
                  <th className="py-3 px-4 font-semibold">BDT ব্যালেন্স</th>
                  <th className="py-3 px-4 font-semibold">USD ব্যালেন্স</th>
                  <th className="py-3 px-4 font-semibold">মোট মেইল বিক্রি</th>
                  <th className="py-3 px-4 font-semibold text-right">ব্যালেন্স অ্যাডজাস্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span>{u.name}</span>
                      {u.email === 'soheltajbhola@gmail.com' && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                          SUPER ADMIN
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-amber-400 text-sm">৳{u.balanceBdt.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">${u.balanceUsd.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{u.totalMailsSold} টি</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() =>
                          setSelectedUserForBalance({ id: u.id, name: u.name, current: u.balanceBdt })
                        }
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 inline-flex items-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>ব্যালেন্স পরিবর্তন</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h3 className="text-lg font-bold text-white">ব্যালেন্স অ্যাডজাস্টমেন্ট</h3>
                <p className="text-xs text-slate-400">{selectedUserForBalance.name}</p>
              </div>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBalanceAdjustment} className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">বর্তমান ব্যালেন্স:</span>
                <div className="text-2xl font-black text-white">৳{selectedUserForBalance.current.toFixed(2)}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  পরিবর্তনের পরিমাণ (+ বৃদ্ধি / - হ্রাস BDT):
                </label>
                <input
                  type="number"
                  step="1"
                  value={balanceDeltaInput}
                  onChange={e => setBalanceDeltaInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-black text-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">কারণ বা রেফারেন্স নোট:</label>
                <input
                  type="text"
                  value={balanceReasonInput}
                  onChange={e => setBalanceReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  ব্যালেন্স পরিবর্তন কনফার্ম
                </button>
              </div>
            </form>
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
