import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { User, ShieldCheck, Phone, CreditCard, Save, CheckCircle2 } from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, updateUserProfile, showToast, setActiveTab, isAdmin } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bKashNumber, setBKashNumber] = useState(currentUser.bKashNumber || '');
  const [nagadNumber, setNagadNumber] = useState(currentUser.nagadNumber || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      bKashNumber,
      nagadNumber,
    });
    showToast('প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">আমার প্রোফাইল ও সেটিংস</h1>
        <p className="text-xs text-slate-400 mt-1">ব্যক্তিগত তথ্য ও পেমেন্ট নম্বর আপডেট করুন</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* User Badge Info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentUser.memberTier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
            {isAdmin && (
              <p className="text-xs text-emerald-400 font-bold mt-1">
                ✓ Super Administrator (Cloud Fire Auth)
              </p>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              পূর্ণ নাম:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              মোবাইল নাম্বার:
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                বিকাশ পার্সোনাল নম্বর (bKash):
              </label>
              <input
                type="text"
                value={bKashNumber}
                onChange={e => setBKashNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                নগদ পার্সোনাল নম্বর (Nagad):
              </label>
              <input
                type="text"
                value={nagadNumber}
                onChange={e => setNagadNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>তথ্য আপডেট করুন</span>
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={() => setActiveTab('idcard')}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            ডিজিটাল আইডি কার্ড দেখুন
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            রেফারেল লিংক ও বোনাস
          </button>
        </div>
      </div>
    </div>
  );
};
