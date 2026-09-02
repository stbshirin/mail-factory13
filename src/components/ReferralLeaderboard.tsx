import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Award, Copy, Check, Users, Gift, TrendingUp, Sparkles } from 'lucide-react';

export const ReferralLeaderboard: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `${window.location.origin}?ref=${currentUser.referralCode}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('রেফারেল লিংক কপি হয়েছে!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const leaderboardUsers = [
    { rank: 1, name: 'Sabbir Hossain (Pro)', mails: 5420, earnings: 51490, tier: 'Diamond', badge: '🥇 Top Champion' },
    { rank: 2, name: 'Tanvir Ahmed', mails: 4190, earnings: 39805, tier: 'Diamond', badge: '🥈 2nd Place' },
    { rank: 3, name: 'Md Farhan Coder', mails: 3650, earnings: 34675, tier: 'Gold', badge: '🥉 3rd Place' },
    { rank: 4, name: 'Kamrul Islam', mails: 2980, earnings: 28310, tier: 'Gold' },
    { rank: 5, name: 'Sohel Taj (Super Admin)', mails: 1420, earnings: 13490, tier: 'Diamond' },
    { rank: 6, name: 'Anik Rahman', mails: 1150, earnings: 10925, tier: 'Silver' },
    { rank: 7, name: 'Shakil Mahmud', mails: 980, earnings: 9310, tier: 'Silver' },
    { rank: 8, name: 'Hasan Ali', mails: 740, earnings: 7030, tier: 'Silver' },
    { rank: 9, name: 'Rahman Khan (You)', mails: 280, earnings: 2660, tier: 'Silver', isCurrent: true },
    { rank: 10, name: 'Bappi Mia', mails: 210, earnings: 1995, tier: 'Bronze' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Referral Program Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>রেফারেল ও এফিলিয়েট প্রোগ্রাম</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            বন্ধু ও টিমকে রেফার করে পান ৫% লাইফটাইম কমিশন
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            আপনার আমন্ত্রিত ফ্রেন্ডরা যখনই মেইল সেল করবে বা মার্কেটপ্লেস থেকে কিনবে, প্রতি সফল লেনদেনে আপনার ওয়ালেটে ৫% ইনস্ট্যান্ট রেফারেল বোনাস যোগ হবে।
          </p>

          {/* User's Referral Link Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400">আপনার ইউনিক রেফারেল লিংক:</div>
              <div className="font-mono font-bold text-xs sm:text-sm text-amber-400 select-all break-all">
                {referralLink}
              </div>
            </div>
            <button
              onClick={copyRefLink}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span>টপ ১০ সেলার লিডারবোর্ড (Top Sellers)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">বর্তমান মাসের সর্বোচ্চ জিমেইল সেলার ও আয়ের তালিকা</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400">
            মাসিক রিওয়ার্ড লাইভ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">র‌্যাঙ্ক</th>
                <th className="py-3 px-4 font-semibold">সেলার নাম</th>
                <th className="py-3 px-4 font-semibold">মোট বিক্রিত মেইল</th>
                <th className="py-3 px-4 font-semibold">মোট উপার্জন</th>
                <th className="py-3 px-4 font-semibold">মেম্বার টিয়ার</th>
                <th className="py-3 px-4 font-semibold text-right">সম্মাননা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboardUsers.map(user => (
                <tr
                  key={user.rank}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    user.isCurrent ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                  }`}
                >
                  <td className="py-4 px-4 font-black text-sm">
                    {user.rank === 1 && <span className="text-yellow-400 text-base">🥇 #1</span>}
                    {user.rank === 2 && <span className="text-slate-300 text-base">🥈 #2</span>}
                    {user.rank === 3 && <span className="text-amber-600 text-base">🥉 #3</span>}
                    {user.rank > 3 && <span className="text-slate-400 font-mono">#{user.rank}</span>}
                  </td>
                  <td className="py-4 px-4 font-bold text-white text-sm flex items-center gap-2">
                    <span>{user.name}</span>
                    {user.isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-white text-sm">{user.mails.toLocaleString()} টি</td>
                  <td className="py-4 px-4 font-black text-emerald-400 text-sm">
                    ৳{user.earnings.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-amber-300">
                      {user.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {user.badge ? (
                      <span className="font-bold text-xs text-amber-400">{user.badge}</span>
                    ) : (
                      <span className="text-slate-500 text-xs">Verified Partner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
