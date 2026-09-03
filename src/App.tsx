import React from 'react';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { SellersView } from './components/SellersView';
import { BuyerMarketplaceView } from './components/BuyerMarketplaceView';
import { BuyerWalletView } from './components/BuyerWalletView';
import { BuyerDepositView } from './components/BuyerDepositView';
import { WithdrawView } from './components/WithdrawView';
import { ExchangeView } from './components/ExchangeView';
import { BuyerOrdersView } from './components/BuyerOrdersView';
import { BuyerTransactionsView } from './components/BuyerTransactionsView';
import { ReferralLeaderboard } from './components/ReferralLeaderboard';
import { MemberIdCardView } from './components/MemberIdCardView';
import { ReviewsView } from './components/ReviewsView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AdminPanelView } from './components/AdminPanelView';
import { AuthModal } from './components/AuthModal';
import { PRIMARY_ADMIN_EMAIL } from './firebase';
import {
  Headphones,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Flame,
  Send,
  Heart,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toasts,
    platformSettings,
    isAdmin,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'sell':
        return <SellersView />;
      case 'buy':
        return <BuyerMarketplaceView />;
      case 'wallet':
        return <BuyerWalletView />;
      case 'deposit':
        return <BuyerDepositView />;
      case 'withdraw':
        return <WithdrawView />;
      case 'exchange':
        return <ExchangeView />;
      case 'orders':
        return <BuyerOrdersView />;
      case 'transactions':
        return <BuyerTransactionsView />;
      case 'referral':
      case 'leaderboard':
        return <ReferralLeaderboard />;
      case 'idcard':
      case 'id_card':
        return <MemberIdCardView />;
      case 'reviews':
        return <ReviewsView />;
      case 'profile':
        return <ProfileSettingsView />;
      case 'admin':
        return <AdminPanelView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification Container */}
      {toasts && Array.isArray(toasts) && toasts.length > 0 && (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold pointer-events-auto transition-all ${
                t.type === 'success'
                  ? 'bg-emerald-950/95 text-emerald-300 border-emerald-500/50'
                  : t.type === 'error'
                  ? 'bg-rose-950/95 text-rose-300 border-rose-500/50'
                  : 'bg-sky-950/95 text-sky-300 border-sky-500/50'
              }`}
            >
              {t.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Top Header */}
      <Navbar />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        {renderActiveView()}
      </main>

      {/* Floating Telegram Support Quick Action */}
      <aside className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-40">
        <a
          href={platformSettings.supportTelegram}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-2xl shadow-sky-500/30 transition-all hover:scale-105 active:scale-95 group"
          title="টেলিগ্রাম হেল্পলাইন ও সাপোর্ট"
        >
          <div className="relative">
            <Headphones className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline">সাপোর্ট ও সাহায্য</span>
        </a>
      </aside>

      {/* Desktop & Tablet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">MAIL FACTORY</span>
            <span>— জিমেইল বিক্রি ও ক্রয় প্ল্যাটফর্ম</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('home')} className="hover:text-amber-400">হোম</button>
            <button onClick={() => setActiveTab('sell')} className="hover:text-amber-400">মেইল সেল</button>
            <button onClick={() => setActiveTab('buy')} className="hover:text-amber-400">মার্কেটপ্লেস</button>
            <button onClick={() => setActiveTab('wallet')} className="hover:text-amber-400">ওয়ালেট</button>
            <button onClick={() => setActiveTab('referral')} className="hover:text-amber-400">লিডারবোর্ড</button>
            <button onClick={() => setActiveTab('reviews')} className="hover:text-amber-400">রিভিউ</button>
            {isAdmin && (
              <button onClick={() => setActiveTab('admin')} className="text-emerald-400 font-bold">
                অ্যাডমিন প্যানেল
              </button>
            )}
          </div>

          <div className="text-slate-500 text-[11px]">
            Cloud Fire Admin: <strong className="text-slate-400">{PRIMARY_ADMIN_EMAIL}</strong>
          </div>
        </div>
      </footer>

      {/* Auth Modal for Login / Registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
