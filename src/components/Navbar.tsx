import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  Mail,
  Wallet,
  ShieldCheck,
  Bell,
  Menu,
  X,
  PlusCircle,
  User,
  ShoppingBag,
  Send,
  RefreshCw,
  Award,
  Star,
  IdCard,
  Settings,
  HelpCircle,
  ArrowRightLeft,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    notifications,
    setIsNotificationOpen,
    loginAsAdmin,
    loginAsUser,
    platformSettings,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Ticker / Notification Bar */}
      {platformSettings.announcementActive && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto overflow-hidden text-center justify-center">
            <span className="bg-slate-900 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              NOTICE
            </span>
            <span className="truncate">{platformSettings.announcement}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Mail Factory
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">
                {language === 'bn' ? 'বিশ্বস্ত জিমেইল বায়িং ও সেলিং প্ল্যাটফর্ম' : 'Trusted Mail Marketplace'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'sell'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'মেইল সেল' : 'Sell Mail'}</span>
            </button>

            <button
              onClick={() => setActiveTab('buy')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'buy'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{language === 'bn' ? 'ওয়ালেট' : 'Wallet'}</span>
            </button>

            <button
              onClick={() => setActiveTab('exchange')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'exchange'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'এক্সচেঞ্জ' : 'Exchange'}</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিভিউ' : 'Reviews'}</span>
            </button>

            {/* Admin Panel Direct Link */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ml-1 border ${
                  activeTab === 'admin'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wallet Balance Badge */}
            <div
              onClick={() => setActiveTab('wallet')}
              className="hidden sm:flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-medium leading-none">
                  {language === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Wallet'}
                </div>
                <div className="text-sm font-bold text-amber-400 leading-tight">
                  ৳{currentUser.balanceBdt.toFixed(2)}
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveTab('deposit');
                }}
                title="Deposit Funds"
                className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-colors ml-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 transition-colors"
              title="Toggle Language"
            >
              {language === 'bn' ? 'বাং' : 'EN'}
            </button>

            {/* User Profile & Role Switch Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white leading-none truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5 leading-none">
                    {isAdmin ? 'Super Admin' : 'Seller'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentUser.memberTier} Member
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Cloud Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-emerald-400 hover:bg-emerald-950/40 flex items-center gap-2.5 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>অ্যাডমিন ম্যানেজমেন্ট প্যানেল</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('id_card');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <IdCard className="w-4 h-4 text-amber-400" />
                      <span>মেম্বার আইডি কার্ড (ID Card)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <ShoppingBag className="w-4 h-4 text-sky-400" />
                      <span>আমার ক্রয়কৃত অর্ডার (Orders)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('transactions');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>লেনদেন হিস্ট্রি (Transactions)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>প্রোফাইল সেটিংস</span>
                    </button>
                  </div>

                  {/* Role Switcher Helper for Easy Testing */}
                  <div className="border-t border-slate-800 pt-2 pb-1 px-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 px-1">
                      Quick Role Switcher
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          loginAsAdmin();
                          setIsUserMenuOpen(false);
                        }}
                        className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                          isAdmin
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        👑 Admin
                      </button>
                      <button
                        onClick={() => {
                          loginAsUser();
                          setIsUserMenuOpen(false);
                        }}
                        className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                          !isAdmin
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        👤 User
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-1">
          <div className="p-3 bg-slate-800/80 rounded-xl mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">ব্যালেন্স:</div>
              <div className="text-lg font-bold text-amber-400">৳{currentUser.balanceBdt.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('deposit');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
              >
                + ডিপোজিট
              </button>
              <button
                onClick={() => {
                  setActiveTab('withdraw');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-slate-700 text-white text-xs font-medium rounded-lg"
              >
                উইথড্র
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('sell');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <Send className="w-5 h-5 text-amber-400" />
            <span>মেইল সেল করুন (Sell Gmail)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('buy');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <span>মার্কেটপ্লেস (Buy Gmail)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('wallet');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>ওয়ালেট ও লেনদেন</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('exchange');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <ArrowRightLeft className="w-5 h-5 text-purple-400" />
            <span>কারেন্সি এক্সচেঞ্জ (BDT/USD)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('leaderboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <Award className="w-5 h-5 text-yellow-400" />
            <span>টপ সেলার লিডারবোর্ড</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reviews');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <Star className="w-5 h-5 text-amber-400" />
            <span>ইউজার রিভিউ ও শিফট</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('id_card');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-3"
          >
            <IdCard className="w-5 h-5 text-indigo-400" />
            <span>ডিজিটাল মেম্বার কার্ড</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-3 mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>👑 অ্যাডমিন কন্ট্রোল প্যানেল</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
