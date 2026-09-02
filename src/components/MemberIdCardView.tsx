import React, { useRef } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, Award, QrCode, Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

export const MemberIdCardView: React.FC = () => {
  const { currentUser, isAdmin } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white">ডিজিটাল মেম্বার আইডি কার্ড</h1>
        <p className="text-xs text-slate-400">মেইল ফ্যাক্টরি ভেরিফাইড সেলার ও ট্রাস্টেড বায়ার পরিচিতিপত্র</p>
      </div>

      {/* Futuristic Digital Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/80 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl text-white space-y-6 select-none"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
              MF
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase text-white">MAIL FACTORY</div>
              <div className="text-[10px] text-amber-400 font-mono tracking-widest">OFFICIAL MEMBER ID</div>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'SUPER ADMIN' : `${currentUser.memberTier.toUpperCase()} MEMBER`}</span>
          </div>
        </div>

        {/* Card Chip & Hologram */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 to-yellow-600 border border-yellow-200/50 flex flex-col justify-between p-1.5 shadow-inner">
            <div className="w-full h-1 bg-amber-900/30 rounded" />
            <div className="w-full h-1 bg-amber-900/30 rounded" />
          </div>

          <div className="font-mono text-xs text-slate-400">
            CHIP ID: MF-{currentUser.id.toUpperCase()}
          </div>
        </div>

        {/* Card Body */}
        <div className="relative z-10 space-y-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">নাম / Holder Name</div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-wide">{currentUser.name}</div>
            <div className="text-xs font-mono text-amber-400">{currentUser.email}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">যোগদানের তারিখ:</div>
              <div className="font-mono text-slate-200">{currentUser.joinDate}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold">রেফারেল কোড:</div>
              <div className="font-mono font-bold text-amber-400">{currentUser.referralCode}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold">মোট মেইল ট্রেডেড:</div>
              <div className="font-bold text-white">{currentUser.totalMailsSold} টি</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold">স্ট্যাটাস:</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
          <span>AUTHORIZED BY MAIL FACTORY BD</span>
          <span className="font-mono text-amber-400/80">AUTHENTIC SECURITY SEAL</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>কার্ড ডাউনলোড / প্রিন্ট করুন</span>
        </button>
      </div>
    </div>
  );
};
