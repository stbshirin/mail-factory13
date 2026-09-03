import React from 'react';
import { useApp } from '../AppContext';
import { Home, ShoppingBag, Wallet, ShieldCheck, Sparkles, LogIn, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin, isLoggedIn, setIsAuthModalOpen, setAuthModalMode } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around relative">
        {/* হোম */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">হোম</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>

        {/* বাই */}
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'buy' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">মার্কেট</span>
          {activeTab === 'buy' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>

        {/* সেল করুন (Center Elevated Floating Button) */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={() => setActiveTab('sell')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-transform border-4 border-slate-950"
            title="সেল করুন"
          >
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[11px] font-bold text-emerald-400 mt-0.5">সেল করুন</span>
        </div>

        {/* এডমিন অথবা অ্যাকাউন্ট */}
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'admin' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">এডমিন</span>
            {activeTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5"></span>
            )}
          </button>
        ) : !isLoggedIn ? (
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex flex-col items-center py-1 px-3 rounded-xl transition-all text-amber-400 hover:text-amber-300"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 font-bold">লগইন</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">প্রোফাইল</span>
            {activeTab === 'profile' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
            )}
          </button>
        )}

        {/* ওয়ালেট */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            } else {
              setActiveTab('wallet');
            }
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">ওয়ালেট</span>
          {(activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw') && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>
      </div>
    </div>
  );
};

