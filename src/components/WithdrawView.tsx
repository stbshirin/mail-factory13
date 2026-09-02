import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { PaymentMethod } from '../types';
import {
  Wallet,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const { currentUser, platformSettings, submitWithdrawal, setActiveTab, showToast } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [amount, setAmount] = useState<number>(300);
  const [accountNumber, setAccountNumber] = useState(currentUser.bKashNumber || currentUser.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitWithdrawal({
      amount: Number(amount),
      method,
      accountNumber,
    });

    if (res.success) {
      setActiveTab('wallet');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('wallet')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">টাকা উত্তোলন (Withdraw)</h1>
          <p className="text-xs text-slate-400">বিকাশ, নগদ বা রকেটে ওয়ালেট থেকে ক্যাশআউট করুন</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Available Balance Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">উত্তোলনযোগ্য ব্যালেন্স:</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              ৳{currentUser.balanceBdt.toFixed(2)}
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <div>সর্বনিম্ন উইথড্র: <strong>৳{platformSettings.minWithdrawalBdt}</strong></div>
            <div className="text-emerald-400 font-medium">ক্যাশআউট চার্জ: ৳০ (ফ্রি)</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              ১. উইথড্র মেথড সিলেক্ট করুন:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    method === m
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                ২. উত্তোলনের পরিমাণ (BDT):
              </label>
              <button
                type="button"
                onClick={() => setAmount(Math.floor(currentUser.balanceBdt))}
                className="text-[11px] text-amber-400 font-semibold hover:underline"
              >
                সব ব্যালেন্স তুলুন
              </button>
            </div>
            <input
              type="number"
              min={platformSettings.minWithdrawalBdt}
              max={currentUser.balanceBdt}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-base focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ৩. আপনার {method} একাউন্ট নাম্বার:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="01XXXXXXXXX (Personal)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * সঠিক পার্সোনাল বিকাশ/নগদ নাম্বার দিন যাতে সহজে টাকা পাঠানো যায়।
            </p>
          </div>

          {/* Payout Time Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 text-xs text-slate-300">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              উইথড্র রিকোয়েস্ট সাবমিটের সাধারণত ৫ থেকে ৩০ মিনিটের মধ্যে অ্যাডমিন ভেরিফাই করে টাকা পাঠিয়ে দেয়।
            </span>
          </div>

          <button
            type="submit"
            disabled={currentUser.balanceBdt < amount || amount < platformSettings.minWithdrawalBdt}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            <span>উইথড্র রিকোয়েস্ট সাবমিট করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
};
