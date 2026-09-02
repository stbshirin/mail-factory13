import React from 'react';
import { useApp } from '../AppContext';
import {
  Send,
  ShoppingBag,
  Wallet,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  DollarSign,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  Headphones,
  FileText,
  Star,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    platformSettings,
    marketplaceItems,
    reviews,
    mailBatches,
    currentUser,
    isAdmin,
  } = useApp();

  const totalSold = mailBatches
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + b.validMailsCount, 28450);

  const totalPaidOut = mailBatches
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + b.totalAmount, 270275);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>বাংলাদেশ ও আন্তর্জাতিক মার্কেটের শীর্ষ মেইল ফ্যাক্টরি</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
            জিমেইল বিক্রি করুন ও কিনুন{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              নিমিষেই বিকাশ/নগদে
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            প্রতিটি ফ্রেশ ও রিকভারি জিমেইল সবচেয়ে বেশি রেটে সাবমিট করুন। শিফট অনুযায়ী দ্রুত রিভিউ, অটোম্যাপড ব্যালেন্স এবং ইনস্ট্যান্ট ক্যাশআউট।
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setActiveTab('sell')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>মেইল সেল করুন (Sell Mail)</span>
            </button>

            <button
              onClick={() => setActiveTab('buy')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-white font-semibold text-sm sm:text-base border border-slate-700 shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <span>মার্কেটপ্লেস ব্রাউজ করুন</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-sm border border-emerald-600/50 flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>অ্যাডমিন ম্যানেজমেন্ট</span>
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>১০০% নিরাপদ লেনদেন</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>তাৎক্ষণিক ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>দ্রুত শিফট রিভিউ</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>২৪/৭ কাস্টমার সাপোর্ট</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Shifts & Current Buying Rates Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  লাইভ শিফট অ্যাক্টিভ
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                আজকের জিমেইল কেনার রেট তালিকা
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
              শিফট: <span className="text-amber-400 font-bold">{platformSettings.activeShift}</span>
            </div>
          </div>

          {/* Rates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-colors">
              <p className="text-xs font-medium text-slate-400">ফ্রেশ জিমেইল</p>
              <div className="mt-2 text-2xl font-extrabold text-amber-400">
                ৳{platformSettings.mailBuyingRateFresh.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">প্রতি পিস ফ্রেশ মেইল</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-colors">
              <p className="text-xs font-medium text-slate-400">রিকভারি জিমেইল</p>
              <div className="mt-2 text-2xl font-extrabold text-yellow-400">
                ৳{platformSettings.mailBuyingRateRecovery.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">আউটলুক/ইয়াহু রিকভারি</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-colors">
              <p className="text-xs font-medium text-slate-400">পুরাতন জিমেইল</p>
              <div className="mt-2 text-2xl font-extrabold text-sky-400">
                ৳{platformSettings.mailBuyingRateAged.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">২০১৯-২০২২ ওল্ড মেইল</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-colors">
              <p className="text-xs font-medium text-slate-400">ইউএসএ আইপি মেইল</p>
              <div className="mt-2 text-2xl font-extrabold text-emerald-400">
                ৳{platformSettings.mailBuyingRateUsa.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">USA Residential IP</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">শিফট নির্দেশিকা</p>
                <p className="text-xs sm:text-sm font-medium text-white">{platformSettings.shiftHours}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('sell')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 ml-auto"
            >
              <span>এখনই মেইল সাবমিট করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Platform Stat Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              প্ল্যাটফর্ম পরিসংখ্যান
            </span>
            <h3 className="text-xl font-black text-white mt-1 mb-6">
              বিশ্বাসযোগ্যতার মাইলফলক
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">মোট বিক্রিত মেইল</div>
                    <div className="text-lg font-bold text-white">{totalSold.toLocaleString()} টি</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">মোট পরিশোধিত পেমেন্ট</div>
                    <div className="text-lg font-bold text-emerald-400">৳{totalPaidOut.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">সক্রিয় ইউজার ও সেলার</div>
                    <div className="text-lg font-bold text-white">৩,৪০০+ জন</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">যেকোনো সহায়তার জন্য টেলিগ্রাম সাপোর্ট</p>
            <a
              href={platformSettings.supportTelegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-bold transition-colors"
            >
              <Headphones className="w-4 h-4" />
              <span>টেলিগ্রাম সাপোর্টে যুক্ত হন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Featured Marketplace Items Preview */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-white">মার্কেটপ্লেস প্যাকেজ সমূহ</h2>
            <p className="text-sm text-slate-400 mt-0.5">রেডিমেড জিমেইল অ্যাকাউন্ট কিনুন তাৎক্ষণিক ডেলিভারিতে</p>
          </div>
          <button
            onClick={() => setActiveTab('buy')}
            className="text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center gap-1"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketplaceItems.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge || 'Available'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">৳{item.pricePerUnit.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 block -mt-1">প্রতি পিস</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>

                <div className="mt-4 space-y-1.5">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  স্টক: <span className="text-emerald-400 font-bold">{item.stockAvailable}টি</span>
                </div>
                <button
                  onClick={() => setActiveTab('buy')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>অর্ডার করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">ব্যবহারকারীদের রিভিউ ও অভিজ্ঞতা</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">আমাদের সাথে নিয়মিত কাজ করা ভাইদের মতামত</p>
          </div>
          <button
            onClick={() => setActiveTab('reviews')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            সব রিভিউ ও আপনার মতামত দিন
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map(rev => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-none">{rev.userName}</div>
                      <div className="text-[10px] text-amber-400">{rev.shift}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic mt-2 leading-relaxed">"{rev.comment}"</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-emerald-400 font-medium">✓ ভেরিফাইড সেলার</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
