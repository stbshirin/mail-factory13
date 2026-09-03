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
} from 'lucide-react';
import { LiveChatModal } from './LiveChatModal';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    platformSettings,
    marketplaceItems,
    mailBatches,
    currentUser,
  } = useApp();

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const safeMarketplaceItems = marketplaceItems || [];

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
      {/* 1. HERO SECTION (Screenshot 1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-8 shadow-2xl text-center">
        {/* Glow Effects */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Flame Live Rate Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-bold shadow-sm mb-4">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>বর্তমান লাইভ রেট: ৳{platformSettings.activeShift === 'Evening' ? '10.50' : platformSettings.mailBuyingRateRecovery.toFixed(2)} / মেইল</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight max-w-2xl">
            বিশ্বস্ত জিমেইল <span className="text-amber-400">ক্রয়-বিক্রয়</span> ও{' '}
            <span className="text-teal-400">মাইক্রো-আর্নিং</span> প্ল্যাটফর্ম
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            নিরাপদে ফ্রেশ ও ওল্ড জিমেইল অ্যাকাউন্ট ক্রয় করুন অথবা নিজের তৈরি করা জিমেইল সাবমিট করে বিকাশ ও নগদে সরাসরি টাকা উইথড্র নিন।
          </p>

          {/* Big Green Primary CTA Button */}
          <div className="mt-6 w-full max-w-md space-y-3">
            <button
              onClick={() => setActiveTab('sell')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              <span>সেল ফ্যাক্টরি ↗</span>
            </button>

            {/* Two Side-by-Side Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('buy')}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>বাই জিমেইল</span>
              </button>

              <button
                onClick={() => setActiveTab('exchange')}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>এক্সচেঞ্জ</span>
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
              সাম্প্রতিক লাইভ পেমেন্ট প্রুফ
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('reviews')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>সকল রিভিউ দেখুন</span>
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
            <h2 className="text-lg sm:text-xl font-black">আজকের সেলার শিফট ও বোনাস</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            শিফট চলাকালীন সময়ে মেইল জমা দিয়ে অতিরিক্ত বোনাস ক্যাশ উপভোগ করুন।
          </p>
        </div>

        {/* 3 Shift Cards Grid */}
        <div className="space-y-4">
          {/* Card 1: সকাল শিফট */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">সকাল শিফট (Morning Shift)</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>08:00 AM - 02:00 PM</span>
                </div>
              </div>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">মৌলিক রেট: ৳8.50</div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">শিফট বোনাস: +৳0.50</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">মোট রেট</div>
                <div className="text-lg font-black text-emerald-400">৳9.00 / মেইল</div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>সব মেইলে Outlook রিকভারি বাধ্যতামূলক</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>পাসওয়ার্ড ৮ ডিজিটের বেশি হতে হবে</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>প্রতি মেইলে স্পেশাল রেট ৳৯.০০</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sell')}
              className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              মেইল সাবমিট করুন
            </button>
          </div>

          {/* Card 2: সন্ধ্যা শিফট (Active Live Badge) */}
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">সন্ধ্যা শিফট (Prime Evening Shift)</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>02:00 PM - 09:00 PM</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>লাইভ চালু</span>
              </span>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">মৌলিক রেট: ৳9.50</div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">শিফট বোনাস: +৳1.00</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">মোট রেট</div>
                <div className="text-xl font-black text-emerald-400">৳10.50 / মেইল</div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>হট শিফট: প্রতি মেইলে ৳১০.৫০ পর্যন্ত আয়</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>যেকোনো আইপি মেইল গ্রহণযোগ্য</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>ইনস্ট্যান্ট ৩ মিনিটে চেকিং ও পেমেন্ট</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sell')}
              className="mt-5 w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all"
            >
              মেইল সাবমিট করুন
            </button>
          </div>

          {/* Card 3: নাইট শিফট */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">নাইট শিফট (VIP Night Shift)</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>09:00 PM - 04:00 AM</span>
                </div>
              </div>
            </div>

            {/* Rate Breakdown Box */}
            <div className="mt-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">মৌলিক রেট: ৳10.00</div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">শিফট বোনাস: +৳1.50</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">মোট রেট</div>
                <div className="text-lg font-black text-emerald-400">৳11.50 / মেইল</div>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>সর্বোচ্চ রেট শিফট ৳১১.৫০</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>টপ ৫ সেলারে জন্য নগদ ৳১,০০০ বোনাস</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>আনলিমিটেড সাবমিট করা যাবে</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sell')}
              className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              মেইল সাবমিট করুন
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
              <h2 className="text-lg sm:text-xl font-black">হট ডিলস: জিমেইল মার্কেটপ্লেস</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ১০০% রিকভারি যুক্ত ফ্রেশ ও ওল্ড জিমেইল কিনুন ইনস্ট্যান্ট অটো-ডেলিভারি সহ।
            </p>
          </div>
          <button
            onClick={() => setActiveTab('buy')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 hover:underline flex-shrink-0"
          >
            <span>সব প্যাকেজ দেখুন</span>
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
                    {item.badge || 'হট ডিল'}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">৳{item.pricePerUnit.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block -mt-1">প্রতি পিস</span>
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
                  স্টক: <span className="text-emerald-400 font-bold">{item.stockAvailable}টি</span>
                </div>
                <button
                  onClick={() => setActiveTab('buy')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  কিনুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TRUST & FEATURE GUARANTEES (Screenshots 6 & 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: ৩ মিনিটে উইথড্র */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">ইনস্ট্যান্ট ৩ মিনিটে উইথড্র</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              বিকাশ ও নগদ পার্সোনালে সর্বনিম্ন মাত্র ৳৫০ উইথড্র করুন কোনো ফি ছাড়া।
            </p>
          </div>
        </div>

        {/* Card 2: ১০০% রিপ্লেসমেন্ট ওয়ারেন্টি */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">১০০% রিপ্লেসমেন্ট ওয়ারেন্টি</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              কোনো মেইলে সমস্যা হলে ২৪-৪৮ ঘণ্টার মধ্যে সাথে সাথে রিপ্লেসমেন্ট বা রিফান্ড।
            </p>
          </div>
        </div>

        {/* Card 3: ৫% আজীবন রেফারেল কমিশন */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">৫% আজীবন রেফারেল কমিশন</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              বন্ধুদের ইনভাইট করুন এবং তাদের প্রতিটি মেইল বিক্রির উপর ৫% বোনাস উপভোগ করুন।
            </p>
          </div>
        </div>

        {/* Card 4: ২৪/৭ লাইভ বাংলা সাপোর্ট */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">২৪/৭ লাইভ বাংলা সাপোর্ট</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              টেলিগ্রাম ও অন-সাইট লাইভ চ্যাটে যেকোনো সহায়তার জন্য আমরা সদা প্রস্তুত।
            </p>
          </div>
        </div>
      </div>

      {/* 6. COMMUNITY & OFFICIAL TELEGRAM CHANNEL (Screenshot 7) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/70 via-slate-900 to-slate-950 border border-blue-800/50 p-6 sm:p-8 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold mb-3">
            অফিসিয়াল টেলিগ্রাম চ্যানেল
          </span>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-black text-white">
            ১০,০০০+ সেলার ও বায়ারের কমিউনিটিতে যোগ দিন
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            প্রতিদিনের স্পেশাল শিফট আপডেট, রেট বাড়ানো-কমানোর নোটিশ এবং পেমেন্ট প্রুফ সবার আগে টেলিগ্রামে পেতে এখনি যোগ দিন।
          </p>

          {/* Two Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsChatModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>লাইভ সাপোর্ট চ্যাট</span>
            </button>

            <a
              href={platformSettings.supportTelegram}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>✈️</span>
              <span>টেলিগ্রাম গ্রুপে জয়েন করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Live Support Chat Modal */}
      <LiveChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};
