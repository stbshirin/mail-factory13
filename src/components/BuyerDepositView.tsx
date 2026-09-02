import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { PaymentMethod } from '../types';
import {
  Wallet,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  QrCode,
  ArrowLeft,
} from 'lucide-react';

export const BuyerDepositView: React.FC = () => {
  const { platformSettings, submitDeposit, setActiveTab, showToast } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [amount, setAmount] = useState<number>(500);
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const getRecipientNumber = () => {
    if (method === 'bKash') return `${platformSettings.bKashNumber} (${platformSettings.bKashType})`;
    if (method === 'Nagad') return `${platformSettings.nagadNumber} (${platformSettings.nagadType})`;
    if (method === 'Rocket') return `${platformSettings.rocketNumber} (${platformSettings.rocketType})`;
    if (method === 'Binance') return `${platformSettings.binanceUsdtAddress} (Pay ID: ${platformSettings.binancePayId})`;
    return '';
  };

  const getRawNumberOnly = () => {
    if (method === 'bKash') return platformSettings.bKashNumber;
    if (method === 'Nagad') return platformSettings.nagadNumber;
    if (method === 'Rocket') return platformSettings.rocketNumber;
    if (method === 'Binance') return platformSettings.binanceUsdtAddress;
    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRawNumberOnly());
    setCopiedNumber(true);
    showToast('নাম্বার কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < platformSettings.minDepositBdt) {
      showToast(`সর্বনিম্ন ডিপোজিট ৳${platformSettings.minDepositBdt}`, 'error');
      return;
    }
    if (!trxId.trim()) {
      showToast('অনুগ্রহ করে TrxID বা ট্রানজেকশন আইডি দিন', 'error');
      return;
    }

    const success = submitDeposit({
      amount: Number(amount),
      method,
      trxId,
      senderNumber,
    });

    if (success) {
      setTrxId('');
      setSenderNumber('');
      setActiveTab('wallet');
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
          <h1 className="text-2xl font-black text-white">ওয়ালেট ডিপোজিট (Add Money)</h1>
          <p className="text-xs text-slate-400">বিকাশ, নগদ, রকেট অথবা বাইন্যান্স থেকে টাকা যোগ করুন</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Step 1: Select Method */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            ১. পেমেন্ট মেথড নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['bKash', 'Nagad', 'Rocket', 'Binance'] as PaymentMethod[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`py-3 px-3 rounded-2xl border text-center font-bold text-xs transition-all ${
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

        {/* Step 2: Payment Recipient Info */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium">
            নিচের নাম্বারে টাকা সেন্ড মানি (Send Money) বা ক্যাশ ইন করুন:
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/80">
            <span className="font-mono font-bold text-sm sm:text-base text-amber-400 select-all">
              {getRecipientNumber()}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            * টাকা পাঠানোর পর প্রাপ্ত এসএমএস থেকে <strong>TrxID</strong> কপি করে নিচের বক্সে দিন।
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ২. প্রেরিত টাকার পরিমাণ (BDT):
            </label>
            <input
              type="number"
              min={platformSettings.minDepositBdt}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              placeholder="e.g. 500"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-base focus:outline-none focus:border-amber-500"
              required
            />
            <div className="flex gap-2 mt-2">
              {[100, 300, 500, 1000, 2000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  ৳{val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ৩. ট্রানজেকশন আইডি (TrxID):
            </label>
            <input
              type="text"
              value={trxId}
              onChange={e => setTrxId(e.target.value)}
              placeholder="e.g. BL92K81M9Q"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ৪. প্রেরক নাম্বার (যে নাম্বার থেকে পাঠিয়েছেন):
            </label>
            <input
              type="text"
              value={senderNumber}
              onChange={e => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>ডিপোজিট রিকোয়েস্ট সাবমিট করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
};
