import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ArrowRightLeft, DollarSign, Wallet, RefreshCw, Sparkles } from 'lucide-react';

export const ExchangeView: React.FC = () => {
  const { currentUser, platformSettings, exchangeCurrency, showToast } = useApp();

  const [fromCurrency, setFromCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [amount, setAmount] = useState<number>(1225);

  const rate = platformSettings.usdToBdtRate;

  const toCurrency = fromCurrency === 'BDT' ? 'USD' : 'BDT';
  const convertedAmount = fromCurrency === 'BDT' ? (amount / rate).toFixed(2) : (amount * rate).toFixed(2);

  const handleSwap = () => {
    setFromCurrency(prev => (prev === 'BDT' ? 'USD' : 'BDT'));
    setAmount(prev => (fromCurrency === 'BDT' ? Math.max(1, Math.round(prev / rate)) : Math.round(prev * rate)));
  };

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = exchangeCurrency(fromCurrency, amount);
    if (!res.success) {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>লাইভ কারেন্সি এক্সচেঞ্জার</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">BDT ⇄ USD এক্সচেঞ্জ</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          লাইভ রেট: <strong>1 USD = ৳{rate.toFixed(2)} BDT</strong>
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <form onSubmit={handleExchange} className="space-y-4">
          {/* From Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>আপনি প্রদান করবেন:</span>
              <span>
                ব্যালেন্স:{' '}
                <strong className="text-white">
                  {fromCurrency === 'BDT' ? `৳${currentUser.balanceBdt.toFixed(2)}` : `$${currentUser.balanceUsd.toFixed(2)}`}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent text-2xl font-black text-white focus:outline-none"
                required
              />
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm text-amber-400">
                {fromCurrency}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-transform active:rotate-180"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>আপনি পাবেন:</span>
              <span>
                ব্যালেন্স:{' '}
                <strong className="text-white">
                  {toCurrency === 'BDT' ? `৳${currentUser.balanceBdt.toFixed(2)}` : `$${currentUser.balanceUsd.toFixed(2)}`}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full text-2xl font-black text-emerald-400 select-all">
                {convertedAmount}
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm text-emerald-400">
                {toCurrency}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all"
          >
            তাৎক্ষণিক এক্সচেঞ্জ কনফার্ম করুন
          </button>
        </form>
      </div>
    </div>
  );
};
