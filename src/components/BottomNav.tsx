import React from 'react';
import { useApp } from '../AppContext';
import { Home, Send, ShoppingBag, Wallet, ShieldCheck, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">হোম</span>
        </button>

        <button
          onClick={() => setActiveTab('sell')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'sell' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">সেল</span>
        </button>

        <button
          onClick={() => setActiveTab('buy')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'buy' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">মার্কেট</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ওয়ালেট</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'admin' ? 'text-emerald-400 font-bold scale-105' : 'text-emerald-500/80 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] mt-0.5">অ্যাডমিন</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">প্রোফাইল</span>
          </button>
        )}
      </div>
    </div>
  );
};
