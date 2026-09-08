import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  Send,
  ShoppingBag,
  ArrowRightLeft,
  Flame,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  ShieldCheck,
  Gift,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  DollarSign,
  MessageCircle,
  Star,
  X,
  Check,
  Edit3,
  Trash2,
  Plus,
} from 'lucide-react';
import { TrustCard } from '../types';
import { LiveChatModal } from './LiveChatModal';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    platformSettings,
    marketplaceItems,
    mailBatches,
    currentUser,
    reviews,
    addReview,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthModalMode,
    showToast,
    trustCards,
    updateTrustCard,
    deleteTrustCard,
    addTrustCard,
    isAdmin,
    language,
    t,
  } = useApp();

  const isGuest = !isLoggedIn || !currentUser.email || currentUser.id === 'guest';

  const handleSellClick = () => {
    if (isGuest) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'জিমেইল বিক্রয় করার পূর্বে একাউন্টে লগ-ইন বা রেজিস্ট্রেশন করে নিতে হবে।'
          : 'Please log in or register before selling Gmail accounts.',
        'error'
      );
      return;
    }
    setActiveTab('sell');
  };

  const handleBuyClick = () => {
    if (isGuest) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'জিমেইল ক্রয় করার পূর্বে একাউন্টে লগ-ইন বা রেজিস্ট্রেশন করে নিতে হবে।'
          : 'Please log in or register before buying Gmail accounts.',
        'error'
      );
      return;
    }
    setActiveTab('buy');
  };

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewShift, setReviewShift] = useState(platformSettings.activeShift || 'Night Shift');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Trust Card Admin Management states
  const [editingCard, setEditingCard] = useState<TrustCard | null>(null);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardIcon, setCardIcon] = useState<'zap' | 'shield' | 'gift' | 'support' | 'star' | 'sparkles'>('zap');

  const handleOpenEditCard = (card: TrustCard) => {
    setEditingCard(card);
    setCardTitle(card.title);
    setCardDesc(card.description);
    setCardIcon((card.iconType as any) || 'zap');
  };

  const handleOpenCreateCard = () => {
    setIsCreatingCard(true);
    setCardTitle('');
    setCardDesc('');
    setCardIcon('zap');
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      showToast('কার্ডের শিরোনাম দিন', 'error');
      return;
    }
    if (editingCard) {
      updateTrustCard({
        ...editingCard,
        title: cardTitle.trim(),
        description: cardDesc.trim(),
        iconType: cardIcon,
      });
      setEditingCard(null);
    } else if (isCreatingCard) {
      addTrustCard({
        title: cardTitle.trim(),
        description: cardDesc.trim(),
        iconType: cardIcon,
      });
      setIsCreatingCard(false);
    }
  };

  const safeMarketplaceItems = marketplaceItems || [];
  const approvedReviews = (reviews || []).filter(r => r.status === 'approved');
  const myPendingReviews = (reviews || []).filter(
    r => r.status === 'pending' && currentUser?.id && r.userId === currentUser.id
  );

  const handleOpenReviewModal = () => {
    if (!isLoggedIn || !currentUser?.email || currentUser.id === 'guest') {
      showToast('রিভিউ আবেদন করার পূর্বে অনুগ্রহ করে লগ-ইন বা রেজিস্ট্রেশন করুন।', 'error');
      setIsAuthModalOpen(true);
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('অনুগ্রহ করে রিভিউ ও আপনার অভিজ্ঞতা লিখুন', 'error');
      return;
    }
    setIsSubmittingReview(true);
    addReview(reviewRating, reviewComment.trim(), reviewShift);
    setIsSubmittingReview(false);
    setIsReviewModalOpen(false);
    setReviewComment('');
    showToast('আপনার রিভিউ আবেদন সফল হয়েছে! এডমিন কনফার্ম করার পর এটি হোম পেজে পাবলিক হবে।', 'success');
  };

  // Recent payment proof items matching Screenshot 2
  const paymentProofs = [
    { name: 'Tanvir Ahmed', time: '২ মিনিট আগে', amount: 1050, method: 'bKash', methodColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { name: 'Sumon Mia', time: '৫ মিনিট আগে', amount: 2400, method: 'Nagad', methodColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { name: 'Rakib Hasan', time: '৮ মিনিট আগে', amount: 850, method: 'bKash', methodColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { name: 'Freelancer Asif', time: '১২ মিনিট আগে', amount: 3200, method: 'Rocket', methodColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { name: 'Nayeem Sheikh', time: '১৫ মিনিট আগে', amount: 1500, method: 'bKash', methodColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Dynamic Ticker Notice from Admin Settings */}
      {platformSettings.tickerNotice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs sm:text-sm text-amber-300 shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-bold text-amber-400 flex-shrink-0">
            {language === 'bn' ? 'ঘোষণা:' : 'Notice:'}
          </span>
          <span className="font-medium">{platformSettings.tickerNotice}</span>
        </div>
      )}

      {/* 1. HERO SECTION (Screenshot 1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-8 shadow-2xl text-center">
        {/* Glow Effects */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Flame Live Rate Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-bold shadow-sm mb-4">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              {language === 'bn' ? 'বর্তমান লাইভ রেট:' : 'Current Live Rate:'} ৳
              {platformSettings.activeShift === 'Evening' ? '10.50' : platformSettings.mailBuyingRateRecovery.toFixed(2)}{' '}
              / {language === 'bn' ? 'মেইল' : 'mail'}
            </span>
          </div>

          {/* Main Title - Dynamic from Admin Settings */}
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight max-w-2xl">
            {platformSettings.heroHeadline ? (
              <span>{platformSettings.heroHeadline}</span>
            ) : language === 'bn' ? (
              <>
                বিশ্বস্ত জিমেইল <span className="text-amber-400">ক্রয়-বিক্রয়</span> ও{' '}
                <span className="text-teal-400">মাইক্রো-আর্নিং</span> প্ল্যাটফর্ম
              </>
            ) : (
              <>
                Trusted Gmail <span className="text-amber-400">Trading</span> &{' '}
                <span className="text-teal-400">Micro-Earning</span> Platform
              </>
            )}
          </h1>

          {/* Subtitle - Dynamic from Admin Settings */}
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            {platformSettings.heroSubtitle ||
              (language === 'bn'
                ? 'নিরাপদে ফ্রেশ ও ওল্ড জিমেইল অ্যাকাউন্ট ক্রয় করুন অথবা নিজের তৈরি করা জিমেইল সাবমিট করে বিকাশ ও নগদে সরাসরি টাকা উইথড্র নিন।'
                : 'Safely purchase fresh and aged Gmail accounts or submit your crafted emails to withdraw cash instantly via bKash and Nagad.')}
          </p>

          {/* Big Green Primary CTA Button */}
          <div className="mt-6 w-full max-w-md space-y-3">
            <button
              onClick={handleSellClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              <span>{language === 'bn' ? 'সেল ফ্যাক্টরি ↗' : 'Sell Factory ↗'}</span>
            </button>

            {/* Two Side-by-Side Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBuyClick}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'বাই জিমেইল' : 'Buy Gmail'}</span>
              </button>

              <button
                onClick={() => setActiveTab('exchange')}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'এক্সচেঞ্জ' : 'Exchange'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECENT LIVE PAYMENT PROOFS (Screenshot 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {language === 'bn' ? 'সাম্প্রতিক লাইভ পেমেন্ট প্রুফ' : 'Recent Live Payment Proofs'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('reviews')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>{language === 'bn' ? 'সকল রিভিউ দেখুন' : 'View All Reviews'}</span>
            <span>&gt;</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {paymentProofs.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-3 sm:px-4 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">{item.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.time}</div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-sm sm:text-base font-black text-emerald-400">
                  ৳{item.amount}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${item.methodColor}`}>
                  {item.method}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TODAY'S SELLER SHIFTS & BONUSES (Screenshots 3, 4, 5) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-black">
              {language === 'bn' ? 'আজকের সেলার শিফট ও বোনাস' : "Today's Seller Shifts & Bonuses"}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'শিফট চলাকালীন সময়ে মেইল জমা দিয়ে অতিরিক্ত বোনাস ক্যাশ উপভোগ করুন।'
              : 'Submit emails during active shift hours to enjoy additional bonus cash.'}
          </p>
        </div>

        {/* 3 Shift Cards Grid */}
        <div className="space-y-4">
          {/* Card 1: সকাল শিফট */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'সকাল শিফট (Morning Shift)' : 'Morning Shift'}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>08:00 AM - 02:00 PM</span>
                </div>
              </div>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'নতুন জিমেইল মৌলিক রেট:' : 'New Gmail Base Rate:'} ৳{platformSettings.mailBuyingRateFresh.toFixed(2)}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">
                  {language === 'bn' ? 'শিফট বোনাস: +৳0.50' : 'Shift Bonus: +৳0.50'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'মোট রেট' : 'Total Rate'}
                </div>
                <div className="text-lg font-black text-emerald-400">
                  ৳{(platformSettings.mailBuyingRateFresh + 0.50).toFixed(2)} / {language === 'bn' ? 'মেইল' : 'mail'}
                </div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'সব মেইলে Outlook রিকভারি বাধ্যতামূলক'
                    : 'Outlook recovery mail mandatory for all'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'পাসওয়ার্ড ৮ ডিজিটের বেশি হতে হবে'
                    : 'Password must be 8+ characters'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? `প্রতি নতুন মেইলে রেট ৳${(platformSettings.mailBuyingRateFresh + 0.50).toFixed(2)}`
                    : `Special rate ৳${(platformSettings.mailBuyingRateFresh + 0.50).toFixed(2)} per verified email`}
                </span>
              </div>
            </div>

            <button
              onClick={handleSellClick}
              className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              {language === 'bn' ? 'নতুন জিমেইল সাবমিট করুন' : 'Submit New Gmail'}
            </button>
          </div>

          {/* Card 2: সন্ধ্যা শিফট (Active Live Badge) */}
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn' ? 'সন্ধ্যা শিফট (Prime Evening Shift)' : 'Prime Evening Shift'}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>02:00 PM - 09:00 PM</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{language === 'bn' ? 'লাইভ চালু' : 'Live Active'}</span>
              </span>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'মৌলিক রেট:' : 'Base Rate:'} ৳{platformSettings.mailBuyingRateFresh.toFixed(2)}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">
                  {language === 'bn' ? 'শিফট বোনাস: +৳1.00' : 'Shift Bonus: +৳1.00'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'মোট রেট' : 'Total Rate'}
                </div>
                <div className="text-xl font-black text-emerald-400">
                  ৳{(platformSettings.mailBuyingRateFresh + 1.00).toFixed(2)} / {language === 'bn' ? 'মেইল' : 'mail'}
                </div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? `হট শিফট: প্রতি মেইলে ৳${(platformSettings.mailBuyingRateFresh + 1.00).toFixed(2)} পর্যন্ত আয়`
                    : `Hot Shift: Earn up to ৳${(platformSettings.mailBuyingRateFresh + 1.00).toFixed(2)} per mail`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'যেকোনো আইপি মেইল গ্রহণযোগ্য'
                    : 'Any IP mails accepted worldwide'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'ইনস্ট্যান্ট ৩ মিনিটে চেকিং ও পেমেন্ট'
                    : 'Instant 3-minute check and payment'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSellClick}
              className="mt-5 w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all"
            >
              {language === 'bn' ? 'মেইল সাবমিট করুন' : 'Submit Mails'}
            </button>
          </div>

          {/* Card 3: নাইট শিফট (Old Gmail VIP) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'পুরাতন জিমেইল নাইট শিফট (Old Gmail VIP)' : 'Old Gmail VIP Night Shift'}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>09:00 PM - 04:00 AM</span>
                </div>
              </div>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'পুরাতন জিমেইল রেট:' : 'Old Gmail Rate:'} ৳{platformSettings.mailBuyingRateAged.toFixed(2)}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">
                  {language === 'bn' ? 'শিফট বোনাস: +৳1.50' : 'Shift Bonus: +৳1.50'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'মোট রেট' : 'Total Rate'}
                </div>
                <div className="text-lg font-black text-emerald-400">
                  ৳{(platformSettings.mailBuyingRateAged + 1.50).toFixed(2)} / {language === 'bn' ? 'মেইল' : 'mail'}
                </div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? `সর্বোচ্চ পুরাতন জিমেইল রেট ৳${(platformSettings.mailBuyingRateAged + 1.50).toFixed(2)}`
                    : `Highest Old Gmail rate ৳${(platformSettings.mailBuyingRateAged + 1.50).toFixed(2)} per mail`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'টপ ৫ সেলারে জন্য নগদ ৳১,০০০ বোনাস'
                    : '৳1,000 cash bonus for top 5 sellers'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  {language === 'bn'
                    ? 'আনলিমিটেড সাবমিট করা যাবে'
                    : 'Unlimited submissions allowed'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSellClick}
              className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              {language === 'bn' ? 'পুরাতন জিমেইল সাবমিট করুন' : 'Submit Old Gmail'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. HOT DEALS: GMAIL MARKETPLACE (Screenshot 5 bottom) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-white">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-black">
                {language === 'bn' ? 'হট ডিলস: জিমেইল মার্কেটপ্লেস' : 'Hot Deals: Gmail Marketplace'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? '১০০% রিকভারি যুক্ত ফ্রেশ ও ওল্ড জিমেইল কিনুন ইনস্ট্যান্ট অটো-ডেলিভারি সহ।'
                : 'Buy 100% recovery verified fresh and aged Gmail accounts with instant auto-delivery.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('buy')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 hover:underline flex-shrink-0"
          >
            <span>{language === 'bn' ? 'সব প্যাকেজ দেখুন' : 'View All Packages'}</span>
            <span>&gt;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {safeMarketplaceItems.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge || (language === 'bn' ? 'হট ডিল' : 'Hot Deal')}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">৳{item.pricePerUnit.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block -mt-1">
                      {language === 'bn' ? 'প্রতি পিস' : 'per piece'}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>

                <div className="mt-3 space-y-1">
                  {item.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {language === 'bn' ? 'স্টক:' : 'Stock:'}{' '}
                  <span className="text-emerald-400 font-bold">
                    {item.stockAvailable}{language === 'bn' ? 'টি' : ' pcs'}
                  </span>
                </div>
                <button
                  onClick={handleBuyClick}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  {language === 'bn' ? 'কিনুন' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TRUST & FEATURE GUARANTEES (Screenshots 6 & 7) - WITH ADMIN MANAGEMENT */}
      <div className="space-y-3">
        {isAdmin && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn' ? 'অ্যাডমিন ম্যানেজমেন্ট পারমিশন' : 'Admin Management Permission'}
                </span>
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                {language === 'bn'
                  ? 'যেকোনো সুবিধা কার্ড এডিট বা ডিলিট করতে পারবেন'
                  : 'You can edit or delete any feature guarantee card'}
              </span>
            </div>
            <button
              onClick={handleOpenCreateCard}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'নতুন সুবিধা কার্ড যোগ করুন' : 'Add New Feature Card'}
              </span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(trustCards && trustCards.length > 0
            ? trustCards
            : [
                {
                  id: 'trust-1',
                  title: language === 'bn' ? 'ইনস্ট্যান্ট ৩ মিনিটে উইথড্র' : 'Instant 3-Minute Withdraw',
                  description:
                    language === 'bn'
                      ? 'বিকাশ ও নগদ পার্সোনালে সর্বনিম্ন মাত্র ৳৫০ উইথড্র করুন কোনো ফি ছাড়া।'
                      : 'Withdraw minimum ৳50 to bKash or Nagad personal with zero extra fees.',
                  iconType: 'zap',
                },
                {
                  id: 'trust-2',
                  title: language === 'bn' ? '১০০% রিপ্লেসমেন্ট ওয়ারেন্টি' : '100% Replacement Warranty',
                  description:
                    language === 'bn'
                      ? 'কোনো মেইলে সমস্যা হলে ২৪-৪৮ ঘণ্টার মধ্যে সাথে সাথে রিপ্লেসমেন্ট বা রিফান্ড।'
                      : 'Instant replacement or refund if any account faces issues within 24-48 hours.',
                  iconType: 'shield',
                },
                {
                  id: 'trust-3',
                  title: language === 'bn' ? '৫% আজীবন রেফারেল কমিশন' : '5% Lifetime Referral Bonus',
                  description:
                    language === 'bn'
                      ? 'বন্ধুদের ইনভাইট করুন এবং তাদের প্রতিটি মেইল বিক্রির উপর ৫% বোনাস উপভোগ করুন।'
                      : 'Invite friends and earn a 5% cash commission on every email they sell.',
                  iconType: 'gift',
                },
                {
                  id: 'trust-4',
                  title: language === 'bn' ? '২৪/৭ লাইভ সাপোর্ট' : '24/7 Live Support',
                  description:
                    language === 'bn'
                      ? 'টেলিগ্রাম ও অন-সাইট লাইভ চ্যাটে যেকোনো সহায়তার জন্য আমরা সদা প্রস্তুত।'
                      : 'Always ready to assist via Telegram and on-site real-time chat.',
                  iconType: 'support',
                },
              ]
          ).map(card => {
            const iconType = card.iconType || 'zap';
            return (
              <div
                key={card.id}
                className="relative group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg transition-all"
              >
                {/* Admin direct edit & delete buttons */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenEditCard(card);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400 shadow-md transition-all"
                      title={language === 'bn' ? 'এই সুবিধা কার্ডটি এডিট করুন' : 'Edit this card'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            language === 'bn'
                              ? `আপনি কি "${card.title}" কার্ডটি মুছে ফেলতে চান?`
                              : `Are you sure you want to delete "${card.title}"?`
                          )
                        ) {
                          deleteTrustCard(card.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/40 shadow-md transition-all"
                      title={language === 'bn' ? 'এই সুবিধা কার্ডটি ডিলিট করুন' : 'Delete this card'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Card Icon */}
                {iconType === 'shield' && (
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {iconType === 'gift' && (
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {(iconType === 'support' || iconType === 'phone') && (
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {iconType === 'star' && (
                  <div className="w-11 h-11 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {iconType === 'sparkles' && (
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {iconType === 'zap' && (
                  <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}

                <div className="pr-12 sm:pr-14">
                  <h3 className="text-sm sm:text-base font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. COMMUNITY & OFFICIAL TELEGRAM CHANNEL (Screenshot 7) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/70 via-slate-900 to-slate-950 border border-blue-800/50 p-6 sm:p-8 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold mb-3">
            {language === 'bn' ? 'অফিসিয়াল টেলিগ্রাম চ্যানেল' : 'Official Telegram Channel'}
          </span>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'bn'
              ? '১০,০০০+ সেলার ও বায়ারের কমিউনিটিতে যোগ দিন'
              : 'Join our Community of 10,000+ Sellers & Buyers'}
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'প্রতিদিনের স্পেশাল শিফট আপডেট, রেট বাড়ানো-কমানোর নোটিশ এবং পেমেন্ট প্রুফ সবার আগে টেলিগ্রামে পেতে এখনি যোগ দিন।'
              : 'Join today to receive daily shift notices, instant rate change alerts, and live verified payment proofs first on Telegram.'}
          </p>

          {/* Two Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsChatModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'লাইভ সাপোর্ট চ্যাট' : 'Live Support Chat'}</span>
            </button>

            <a
              href={platformSettings.supportTelegram}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>✈️</span>
              <span>{language === 'bn' ? 'টেলিগ্রাম গ্রুপে জয়েন করুন' : 'Join Telegram Group'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 7. CUSTOMER & SELLER REVIEWS SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {language === 'bn' ? 'গ্রাহক ও সেলারদের রিভিউ' : 'Customer & Seller Reviews'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  {language === 'bn' ? 'যাচাইকৃত ব্যবহারকারী' : 'Verified Users'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn'
                  ? 'সেলার ও বায়ারদের বাস্তব কাজের অভিজ্ঞতা ও মতামত'
                  : 'Authentic feedback and work experiences from our community'}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenReviewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>{language === 'bn' ? 'রিভিউ আবেদন করুন' : 'Submit Review'}</span>
          </button>
        </div>

        {/* User's Pending Review Status Banner */}
        {myPendingReviews.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">
                {language === 'bn' ? 'রিভিউ আবেদন প্রক্রিয়াধীন:' : 'Review Under Review:'}
              </strong>{' '}
              {language === 'bn'
                ? `আপনার ${myPendingReviews.length}টি রিভিউ অ্যাডমিন অনুমোদনের জন্য অপেক্ষারত রয়েছে। অ্যাডমিন কনফার্ম করার পর এটি হোম পেজে প্রকাশ পাবে।`
                : `Your ${myPendingReviews.length} review submission(s) are awaiting admin approval. They will appear here once approved.`}
            </div>
          </div>
        )}

        {/* Approved Reviews List */}
        {approvedReviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2">
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'এখনও কোনো অনুমোদিত পাবলিক রিভিউ নেই। প্রথম রিভিউ আবেদন করতে "রিভিউ আবেদন করুন" বাটনে ক্লিক করুন!'
                : 'No approved reviews yet. Click "Submit Review" to share your first experience!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {approvedReviews.map(rev => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{rev.userName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                {rev.shift && (
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {rev.shift}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal (Requires Login & Admin Approval) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn' ? 'রিভিউ ও অভিজ্ঞতা আবেদন' : 'Submit Review & Experience'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'এডমিন কনফার্ম করার পর এটি হোম পেজে পাবলিক হবে'
                      : 'Will be publicly visible after admin approval'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {language === 'bn' ? 'আপনার স্টার রেটিং নির্বাচন করুন:' : 'Select Star Rating:'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                        reviewRating >= star
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-amber-400' : ''}`} />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift Tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'bn' ? 'কাজের শিফট / ক্যাটাগরি:' : 'Shift / Category:'}
                </label>
                <input
                  type="text"
                  value={reviewShift}
                  onChange={e => setReviewShift(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: Evening Shift, Fresh Gmail, Buy Package'
                      : 'e.g. Evening Shift, Fresh Gmail, Buy Package'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'bn'
                    ? 'আপনার বিস্তারিত মতামত ও কাজের অভিজ্ঞতা:'
                    : 'Your Detailed Feedback & Experience:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'প্ল্যাটফর্মের লেনদেনের গতি, পেমেন্ট পাওয়ার অভিজ্ঞতা বা সেবার মান সম্পর্কে লিখুন...'
                      : 'Share your thoughts about payout speed, support quality, or trading experience...'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                🔒 <strong>{language === 'bn' ? 'নিরাপত্তা ও যাচাইকরণ:' : 'Security & Verification:'}</strong>{' '}
                {language === 'bn'
                  ? `আপনার ইউজারনেম (${currentUser.name}) দিয়ে রিভিউ জমা হবে। স্প্যাম রোধে অ্যাডমিন ভেরিফিকেশনের পর তা হোম পেজে দৃশ্যমান হবে।`
                  : `Your review will be submitted under your name (${currentUser.name}) and shown on home page upon admin verification.`}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isSubmittingReview
                      ? language === 'bn'
                        ? 'জমা হচ্ছে...'
                        : 'Submitting...'
                      : language === 'bn'
                      ? 'রিভিউ আবেদন জমা দিন'
                      : 'Submit Review'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Trust Card Management Modal */}
      {(editingCard || isCreatingCard) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>
                  {editingCard
                    ? language === 'bn'
                      ? 'সুবিধা কার্ড এডিট করুন'
                      : 'Edit Feature Card'
                    : language === 'bn'
                    ? 'নতুন সুবিধা কার্ড তৈরি করুন'
                    : 'Create New Feature Card'}
                </span>
              </h3>
              <button
                onClick={() => {
                  setEditingCard(null);
                  setIsCreatingCard(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'কার্ড টাইটেল (শিরোনাম) *:' : 'Card Title *:'}
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={e => setCardTitle(e.target.value)}
                  placeholder="e.g. ইনস্ট্যান্ট ৩ মিনিটে উইথড্র"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'বিবরণ (Description):' : 'Description:'}
                </label>
                <textarea
                  value={cardDesc}
                  onChange={e => setCardDesc(e.target.value)}
                  rows={3}
                  placeholder="e.g. বিকাশ ও নগদ পার্সোনালে সর্বনিম্ন মাত্র ৳৫০ উইথড্র করুন কোনো ফি ছাড়া।"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'bn' ? 'আইকন ও থিম বেছে নিন:' : 'Choose Icon & Theme:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'zap', label: language === 'bn' ? 'বিদ্যুৎ (Zap)' : 'Speed (Zap)', icon: Zap, color: 'text-teal-400' },
                    { id: 'shield', label: language === 'bn' ? 'নিরাপত্তা (Shield)' : 'Shield', icon: ShieldCheck, color: 'text-amber-400' },
                    { id: 'gift', label: language === 'bn' ? 'কমিশন (Gift)' : 'Commission', icon: Gift, color: 'text-blue-400' },
                    { id: 'support', label: language === 'bn' ? 'সাপোর্ট (Phone)' : 'Support', icon: PhoneCall, color: 'text-purple-400' },
                    { id: 'star', label: language === 'bn' ? 'স্টার (Star)' : 'Star', icon: Star, color: 'text-yellow-400' },
                    { id: 'sparkles', label: language === 'bn' ? 'স্পার্কল (Sparkles)' : 'Sparkles', icon: Sparkles, color: 'text-emerald-400' },
                  ].map(opt => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCardIcon(opt.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] cursor-pointer ${
                          cardIcon === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                {editingCard && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          language === 'bn'
                            ? `আপনি কি "${editingCard.title}" কার্ডটি মুছে ফেলতে চান?`
                            : `Are you sure you want to delete "${editingCard.title}"?`
                        )
                      ) {
                        deleteTrustCard(editingCard.id);
                        setEditingCard(null);
                      }
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                    title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingCard(null);
                    setIsCreatingCard(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingCard
                    ? language === 'bn'
                      ? 'আপডেট সংরক্ষণ করুন'
                      : 'Save Changes'
                    : language === 'bn'
                    ? 'কার্ড যোগ করুন'
                    : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Live Support Chat Modal */}
      <LiveChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};
