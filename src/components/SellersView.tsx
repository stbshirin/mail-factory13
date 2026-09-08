import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MailType, PaymentMethod, MailBatch } from '../types';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  HelpCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  X,
  Sparkles,
  ArrowLeft,
  Plus,
  ClipboardPaste,
  Trash2,
} from 'lucide-react';

interface MailInputRow {
  id: string;
  email: string;
  password: string;
  recovery?: string;
  showPassword?: boolean;
}

export const SellersView: React.FC = () => {
  const {
    currentUser,
    platformSettings,
    submitMailBatch,
    mailBatches,
    showToast,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthModalMode,
    setActiveTab,
    language,
  } = useApp();

  const isGuest = !isLoggedIn || !currentUser.email || currentUser.id === 'guest';

  const requireAuth = (actionName = language === 'bn' ? 'জিমেইল বিক্রয়' : 'Gmail Selling') => {
    if (isGuest) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? `${actionName} করার পূর্বে একাউন্টে লগ-ইন বা রেজিস্ট্রেশন করে নিতে হবে।`
          : `Please sign in or register before performing ${actionName}.`,
        'error'
      );
      return true;
    }
    return false;
  };

  const [mailType, setMailType] = useState<MailType>('fresh');
  const [inputMode, setInputMode] = useState<'boxes' | 'bulk'>('boxes');
  const [mailRows, setMailRows] = useState<MailInputRow[]>([
    { id: '1', email: '', password: '', recovery: '', showPassword: false },
    { id: '2', email: '', password: '', recovery: '', showPassword: false },
  ]);
  const [rawText, setRawText] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteModalText, setPasteModalText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [payoutAccount, setPayoutAccount] = useState(currentUser.bKashNumber || currentUser.phone || '');
  const [shiftName, setShiftName] = useState(platformSettings.activeShift);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<MailBatch | null>(null);

  // Current rate based on type
  let currentRate = platformSettings.mailBuyingRateFresh;
  if (mailType === 'recovery') currentRate = platformSettings.mailBuyingRateRecovery;
  else if (mailType === 'aged') currentRate = platformSettings.mailBuyingRateAged;
  else if (mailType === 'usa') currentRate = platformSettings.mailBuyingRateUsa;
  else if (mailType === 'edu') currentRate = platformSettings.mailBuyingRateEdu;

  // Row operations
  const handleRowChange = (id: string, field: 'email' | 'password' | 'recovery', value: string) => {
    setMailRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const togglePasswordVisibility = (id: string) => {
    setMailRows(prev =>
      prev.map(row => (row.id === id ? { ...row, showPassword: !row.showPassword } : row))
    );
  };

  const handleAddRow = () => {
    if (requireAuth('নতুন অ্যাকাউন্ট যোগ')) return;
    setMailRows(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, email: '', password: '', recovery: '', showPassword: false },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (mailRows.length <= 1) {
      setMailRows([{ id: '1', email: '', password: '', recovery: '', showPassword: false }]);
      return;
    }
    setMailRows(prev => prev.filter(row => row.id !== id));
  };

  // Quick Paste from Clipboard
  const handleQuickPasteFromClipboard = async () => {
    if (requireAuth('ক্লিপবোর্ড থেকে পেস্ট')) return;
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          applyPastedLinesToRows(text);
          return;
        }
      }
    } catch {
      // If clipboard permission is denied, open modal
    }
    setShowPasteModal(true);
  };

  const applyPastedLinesToRows = (text: string) => {
    const rawLines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (rawLines.length === 0) {
      showToast(language === 'bn' ? 'কোনো বৈধ ডাটা পাওয়া যায়নি' : 'No valid data found', 'error');
      return;
    }

    const newRows: MailInputRow[] = rawLines.map((line, idx) => {
      const parts = line.split(/[:\t, ]+/);
      return {
        id: `paste-${Date.now()}-${idx}`,
        email: parts[0] || '',
        password: parts[1] || '',
        recovery: parts[2] || '',
        showPassword: false,
      };
    });

    setMailRows(newRows);
    setShowPasteModal(false);
    setPasteModalText('');
    showToast(
      language === 'bn'
        ? `${newRows.length}টি অ্যাকাউন্ট সফলভাবে বক্সে পেস্ট করা হয়েছে!`
        : `${newRows.length} accounts pasted into boxes successfully!`,
      'success'
    );
  };

  // Valid calculations
  const validRows = mailRows.filter(r => r.email.trim().includes('@') && r.password.trim().length >= 4);
  const bulkLines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  const bulkValid = bulkLines.filter(l => {
    const parts = l.split(/[:\t, ]+/);
    return parts[0] && parts[0].includes('@') && parts[1] && parts[1].length >= 4;
  });

  const validCount = inputMode === 'boxes' ? validRows.length : bulkValid.length;
  const totalCount = inputMode === 'boxes' ? mailRows.length : bulkLines.length;
  const displayAccountCount = validCount > 0 ? validCount : totalCount;
  const estimatedTotal = (validCount * currentRate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireAuth(language === 'bn' ? 'জিমেইল বিক্রয়' : 'Sell Gmail')) return;

    let submissionText = '';
    if (inputMode === 'boxes') {
      if (validRows.length === 0) {
        showToast(
          language === 'bn'
            ? 'অনুগ্রহ করে অন্তত একটি বৈধ ইমেইল ও পাসওয়ার্ড লিখুন'
            : 'Please enter at least one valid email and password',
          'error'
        );
        return;
      }
      submissionText = validRows
        .map(r => `${r.email.trim()}:${r.password.trim()}${r.recovery?.trim() ? `:${r.recovery.trim()}` : ''}`)
        .join('\n');
    } else {
      if (bulkValid.length === 0) {
        showToast(
          language === 'bn'
            ? 'অনুগ্রহ করে অন্তত একটি বৈধ ইমেইল ও পাসওয়ার্ড লিখুন'
            : 'Please enter at least one valid email and password',
          'error'
        );
        return;
      }
      submissionText = rawText;
    }

    if (!payoutAccount.trim()) {
      showToast(
        language === 'bn'
          ? 'পেমেন্ট গ্রহণ করার একাউন্ট নাম্বার লিখুন'
          : 'Please enter your payout account number',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    const success = submitMailBatch({
      rawText: submissionText,
      mailType,
      paymentMethod,
      payoutAccount,
      shiftName,
    });

    setIsSubmitting(false);
    if (success) {
      setRawText('');
      setMailRows([
        { id: '1', email: '', password: '', recovery: '', showPassword: false },
        { id: '2', email: '', password: '', recovery: '', showPassword: false },
      ]);
    }
  };

  // Filter user's batches
  const myBatches = mailBatches.filter(b => b.userId === currentUser.id);

  // VIP Level Name
  const userTierName = currentUser.memberTier || 'Bronze';
  const vipLevelText = userTierName === 'Diamond' ? 'Level 4 VIP' : userTierName === 'Gold' ? 'Level 3 VIP' : userTierName === 'Silver' ? 'Level 2 VIP' : 'Level 1 VIP';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Return button and VIP Badge */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ {vipLevelText}</span>
        </div>
      </div>

      {/* Guest Notice Banner */}
      {isGuest && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'জিমেইল বিক্রয়ের পূর্বে লগ-ইন আবশ্যক' : 'Sign in required before selling Gmail'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {language === 'bn' ? 'লক করা' : 'Locked'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {language === 'bn'
                  ? 'জিমেইল সাবমিট এবং ভেরিফিকেশন শেষে সরাসরি বিকাশ বা নগদে টাকা পাওয়ার জন্য পূর্বে আপনার অ্যাকাউন্টে লগ-ইন বা রেজিস্ট্রেশন করুন।'
                  : 'Please sign in or create an account first to submit Gmail batches and receive payouts via bKash/Nagad.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{language === 'bn' ? 'লগ-ইন / রেজিস্ট্রেশন করুন ↗' : 'Sign In / Register ↗'}</span>
          </button>
        </div>
      )}

      {/* Main Gmail Buy/Sell Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form with Rate Card and Gmail Row Inputs */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* HERO RATE CARD */}
            <div className="bg-[#0c1527] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'bn' ? 'আপনার লেভেল রেট:' : 'Your Level Rate:'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#00D06C] tracking-tight mt-1">
                    ৳{currentRate.toFixed(2)} <span className="text-sm sm:text-base font-bold text-slate-400">/ Gmail</span>
                  </div>
                </div>

                {/* Mail Type Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setMailType('fresh')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      mailType === 'fresh'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {language === 'bn' ? 'নতুন জিমেইল' : 'Fresh Gmail'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMailType('aged')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      mailType === 'aged'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {language === 'bn' ? 'পুরাতন জিমেইল' : 'Aged Gmail'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMailType(mailType === 'recovery' ? 'fresh' : 'recovery')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all hidden sm:inline-block ${
                      mailType === 'recovery'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={language === 'bn' ? 'রিকভারি যুক্ত জিমেইল' : 'With Recovery Mail'}
                  >
                    {language === 'bn' ? 'রিকভারি' : 'Recovery'}
                  </button>
                </div>
              </div>

              {/* Input Mode Selector & Quick Paste buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('boxes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'boxes'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'bn' ? 'ইনপুট বক্স মোড' : 'Box Input Mode'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('bulk')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'bulk'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'bn' ? 'বাল্ক টেক্সট এরিয়া' : 'Bulk Text Mode'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleQuickPasteFromClipboard}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ক্লিপবোর্ড থেকে কুইক পেস্ট' : 'Quick Paste from Clipboard'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GMAIL INPUT BOXES AREA */}
            {inputMode === 'boxes' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">
                    {language === 'bn'
                      ? `ইমেইল ও পাসওয়ার্ড লিখুন বা পেস্ট করুন (${mailRows.length}টি রো):`
                      : `Enter or paste Email & Password (${mailRows.length} rows):`}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {language === 'bn' ? 'ভ্যালিড একাউন্ট:' : 'Valid Accounts:'}{' '}
                    <strong className="text-[#00D06C]">{validCount}</strong>
                  </span>
                </div>

                {/* Email & Password Input Rows */}
                <div className="space-y-3">
                  {mailRows.map((row, idx) => (
                    <div key={row.id} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 text-center text-xs font-mono font-bold text-slate-500 flex-shrink-0">
                        {idx + 1}.
                      </div>

                      {/* Email Input */}
                      <div className="flex-1">
                        <input
                          type="email"
                          value={row.email}
                          onChange={e => handleRowChange(row.id, 'email', e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full bg-[#0a1120] border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono outline-none transition-colors"
                        />
                      </div>

                      {/* Password Input with Show/Hide Eye Toggle */}
                      <div className="flex-1 relative">
                        <input
                          type={row.showPassword ? 'text' : 'password'}
                          value={row.password}
                          onChange={e => handleRowChange(row.id, 'password', e.target.value)}
                          placeholder={language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                          className="w-full bg-[#0a1120] border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 rounded-2xl pl-4 pr-10 py-3 text-sm text-white placeholder-slate-500 font-mono outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(row.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-lg"
                          title={row.showPassword ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'দেখুন' : 'Show')}
                        >
                          {row.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Delete Row button */}
                      {mailRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                          title={language === 'bn' ? 'এই রো মুছুন' : 'Delete Row'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* + Add More Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 shadow-md transition-all active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{language === 'bn' ? '+ আরও রো যোগ করুন' : '+ Add More Rows'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* BULK TEXTAREA MODE */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {language === 'bn'
                      ? 'জিমেইল লিস্ট পেস্ট করুন (প্রতি লাইনে email:password):'
                      : 'Paste Gmail List (email:password per line):'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {language === 'bn' ? 'ফরম্যাট:' : 'Format:'}{' '}
                    <span className="text-amber-400 font-bold">email:password:recovery</span>
                  </span>
                </div>

                <textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder={`example1@gmail.com:Pass#1234:recovery1@outlook.com
example2@gmail.com:Secret!2026:recovery2@outlook.com
example3@gmail.com:UserPass99:recovery3@outlook.com`}
                  rows={7}
                  className="w-full bg-[#0a1120] border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            {/* Payout Details & Shift Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {language === 'bn' ? 'পেমেন্ট মেথড ও নাম্বার:' : 'Payout Method & Number:'}
                  </label>
                  <div className="flex gap-2 mb-2">
                    {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          paymentMethod === method
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={payoutAccount}
                    onChange={e => setPayoutAccount(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#0a1120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {language === 'bn' ? 'বর্তমান রিভিউ শিফট:' : 'Active Review Shift:'}
                  </label>
                  <input
                    type="text"
                    value={shiftName}
                    onChange={e => setShiftName(e.target.value)}
                    className="w-full bg-[#0a1120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {language === 'bn'
                      ? 'শিফট চলাকালীন সময়ে দ্রুত ভেরিফাই করে ওয়ালেটে টাকা যুক্ত করা হয়।'
                      : 'Accounts are promptly checked and funds added to wallet during active shifts.'}
                  </p>
                </div>
              </div>

              {/* Real-time counters summary */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    {language === 'bn' ? 'মোট অ্যাকাউন্ট:' : 'Total Accounts:'}{' '}
                    <strong className="text-white">{displayAccountCount}</strong>
                  </span>
                  <span className="text-slate-400">
                    {language === 'bn' ? 'ভ্যালিড রেডি:' : 'Valid Ready:'}{' '}
                    <strong className="text-[#00D06C]">{validCount}</strong>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">
                    {language === 'bn' ? 'সম্ভাব্য মোট উপার্জন: ' : 'Estimated Total Earning: '}
                  </span>
                  <span className="text-base font-black text-[#00D06C]">৳{estimatedTotal}</span>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            {isGuest ? (
              <button
                type="button"
                onClick={() => requireAuth(language === 'bn' ? 'জিমেইল বিক্রয়' : 'Sell Gmail')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {language === 'bn' ? '🔒 লগ-ইন করে মেইল সাবমিট করুন' : '🔒 Sign In & Submit Gmail Batch'}
                </span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || displayAccountCount === 0}
                className="w-full py-4 rounded-2xl bg-[#00D06C] hover:bg-[#00B95F] text-white font-black text-base shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {language === 'bn'
                    ? `${displayAccountCount}টি অ্যাকাউন্ট সাবমিট করুন`
                    : `Submit ${displayAccountCount} Account(s)`}
                </span>
              </button>
            )}
          </form>
        </div>

        {/* Right Col: Guidelines & Instructions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{language === 'bn' ? 'মেইল তৈরির নিয়মাবলী ও গাইডলাইন' : 'Gmail Creation Guidelines'}</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">
                  {language === 'bn' ? '১. রিকভারি মেইল:' : '1. Recovery Mail:'}
                </strong>
                {language === 'bn'
                  ? 'প্রতিটি জিমেইলে অবশ্যই আউটলুক (Outlook) অথবা ইয়াহু (Yahoo) রিকভারি মেইল যুক্ত থাকতে হবে।'
                  : 'Every Gmail must include a valid Outlook or Yahoo recovery email.'}
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">
                  {language === 'bn' ? '২. টু-ফ্যাক্টর অথেনটিকেশন (2FA):' : '2. Two-Factor Authentication (2FA):'}
                </strong>
                {language === 'bn'
                  ? 'মেইলে কোনো ফোন নাম্বার বা ২-ফ্যাক্টর কোড অন রাখা যাবে না।'
                  : 'No phone number or 2FA prompt should be active on the accounts.'}
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">
                  {language === 'bn' ? '৩. ইউনিক পাসওয়ার্ড:' : '3. Strong Password:'}
                </strong>
                {language === 'bn'
                  ? 'কমপক্ষে ৮ অক্ষরের স্ট্রং পাসওয়ার্ড ব্যবহার করুন (যেমন: Pass#2026Secure)।'
                  : 'Use at least 8 characters strong password (e.g. Pass#2026Secure).'}
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">
                  {language === 'bn' ? '৪. নাম ও ইউজারনেম:' : '4. Name & Username:'}
                </strong>
                {language === 'bn'
                  ? 'ইংলিশ রিয়েল নাম ব্যবহার করবেন, কোনো এলোমেলো বর্ণ নয়।'
                  : 'Use realistic English human names, not random meaningless characters.'}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">
              {language === 'bn' ? 'তাৎক্ষণিক পেমেন্ট পলিসি' : 'Instant Payout Policy'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn'
                ? 'ব্যাচ অ্যাডমিন রিভিউ শেষে অনুমোদিত হওয়ামাত্র টাকা ওয়ালেটে যুক্ত হবে। এরপর বিকাশ/নগদে যেকোনো সময় উইথড্র দিতে পারবেন।'
                : 'Funds are credited to your wallet immediately after admin verification. Withdraw anytime to bKash or Nagad.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-indigo-400" />
                <span>{language === 'bn' ? 'ক্লিপবোর্ড থেকে জিমেইল পেস্ট করুন' : 'Paste Gmail from Clipboard'}</span>
              </h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'bn' ? (
                <>নিচের বক্সে প্রতি লাইনে <span className="text-amber-400 font-mono">email:password</span> অথবা <span className="text-amber-400 font-mono">email password</span> আকারে লেখা পেস্ট করুন:</>
              ) : (
                <>Paste accounts line by line in <span className="text-amber-400 font-mono">email:password</span> format:</>
              )}
            </p>

            <textarea
              value={pasteModalText}
              onChange={e => setPasteModalText(e.target.value)}
              rows={6}
              placeholder={`test1@gmail.com:Secret#123\ntest2@gmail.com:Pass#456\ntest3@gmail.com:Safe#789`}
              className="w-full bg-[#0a1120] border border-slate-700 rounded-2xl p-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => applyPastedLinesToRows(pasteModalText)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                {language === 'bn' ? 'বক্সে পেস্ট করুন' : 'Paste to Rows'}
              </button>
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Batch History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-black text-white mb-4 flex items-center justify-between">
          <span>{language === 'bn' ? 'আমার সাবমিটকৃত ব্যাচ হিস্ট্রি' : 'My Submitted Batch History'}</span>
          <span className="text-xs font-normal text-slate-400">
            {language === 'bn' ? `মোট ব্যাচ: ${myBatches.length}টি` : `Total Batches: ${myBatches.length}`}
          </span>
        </h2>

        {myBatches.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            {language === 'bn'
              ? 'এখনো কোনো মেইল ব্যাচ সাবমিট করেননি। উপরে ফরম পূরণ করে প্রথম ব্যাচ সাবমিট করুন।'
              : 'No Gmail batches submitted yet. Fill out the form above to submit your first batch.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'ব্যাচ আইডি' : 'Batch ID'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'ক্যাটাগরি' : 'Type'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'পরিমাণ' : 'Quantity'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'রেট' : 'Rate'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'মোট মূল্য' : 'Total'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'সময়' : 'Date'}</th>
                  <th className="py-3 px-4 font-semibold text-right">{language === 'bn' ? 'ডিটেইলস' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {myBatches.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{b.id}</td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-amber-400">{b.mailType}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {b.validMailsCount} {language === 'bn' ? 'টি' : 'qty'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">৳{b.pricePerMail.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">৳{b.totalAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {b.paymentMethod} ({b.payoutAccount})
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {language === 'bn' ? '✓ অনুমোদিত' : '✓ Approved'}
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {language === 'bn' ? '✕ বাতিল' : '✕ Rejected'}
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'bn' ? '⏳ যাচাই চলছে' : '⏳ Reviewing'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(b.submittedAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBatchDetails(b)}
                        className="text-amber-400 hover:underline font-semibold"
                      >
                        {language === 'bn' ? 'মেইল দেখুন' : 'View Mails'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatchDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>
                  {language === 'bn' ? 'ব্যাচ বিবরণ:' : 'Batch Details:'} {selectedBatchDetails.batchName}
                </span>
              </h3>
              <button
                onClick={() => setSelectedBatchDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">{language === 'bn' ? 'মোট মেইল সংখ্যা:' : 'Total Mails:'}</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  {selectedBatchDetails.validMailsCount} {language === 'bn' ? 'টি' : 'qty'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">{language === 'bn' ? 'মোট প্রদেয় মূল্য:' : 'Total Payout:'}</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">৳{selectedBatchDetails.totalAmount.toFixed(2)}</div>
              </div>
            </div>

            {selectedBatchDetails.rejectReason && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <strong>{language === 'bn' ? 'রিজেক্ট কারণ:' : 'Rejection Reason:'}</strong> {selectedBatchDetails.rejectReason}
              </div>
            )}

            <div>
              <div className="text-xs font-bold text-slate-300 mb-1.5">
                {language === 'bn'
                  ? `জিমেইল তালিকা (${selectedBatchDetails.mails?.length || 0}টি):`
                  : `Gmail List (${selectedBatchDetails.mails?.length || 0} accounts):`}
              </div>
              <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-1 select-all">
                {selectedBatchDetails.mails.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-900 pb-1">
                    <span className="truncate">{m.email}</span>
                    <span className="text-emerald-400 text-[10px]">✓ Ready</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedBatchDetails(null)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
