import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NotificationCenterDropdown } from './NotificationCenterDropdown';
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
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    loginAsAdmin,
    loginAsUser,
    platformSettings,
    setIsAuthModalOpen,
    setAuthModalMode,
    firebaseLogout,
    firebaseAuthUser,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n?.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Ticker / Notification Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 sm:px-6 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-left">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-amber-400 font-bold truncate flex items-center gap-1.5">
            ⚡ {platformSettings.activeShift === 'Evening' || true ? 'সন্ধ্যা শিফট চালু: ' : 'লাইভ শিফট: '}
            <span className="text-slate-200 font-normal">রেট ৳১০.৫০/মেইল!</span>
          </span>
        </div>

        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-0.5 rounded-lg transition-colors flex-shrink-0 ml-2"
        >
          <span className="text-amber-400">🌐</span>
          <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand - Extra Compact Size */}
          <div
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-6 h-6 rounded-md bg-slate-950 border border-amber-500/40 p-0.5 flex items-center justify-center shadow-xs shadow-amber-500/10 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full rounded bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Mail className="w-3 h-3 text-slate-950 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
                Mail<span className="text-amber-400">Factory</span>
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[8px] px-1 py-0.5 rounded leading-none">
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'sell'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মেইল সেল' : 'Sell Mail'}</span>
            </button>

            <button
              onClick={() => setActiveTab('buy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'buy'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ওয়ালেট' : 'Wallet'}</span>
            </button>

            <button
              onClick={() => setActiveTab('exchange')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'exchange'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'এক্সচেঞ্জ' : 'Exchange'}</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিভিউ' : 'Reviews'}</span>
            </button>

            {/* Admin Panel Direct Link */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-1 border ${
                  activeTab === 'admin'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Area - Note: Balance has been completely removed as requested */}
          <div className="flex items-center gap-2">
            {/* Quick Auth Button - Only shown when not logged in */}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                title="লগ-ইন বা রেজিস্ট্রেশন"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">লগইন / রেজিস্টার</span>
              </button>
            )}

            {/* Notification Center Dropdown & Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-xl border transition-colors ${
                  isNotificationOpen
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
                }`}
                aria-label="Notifications"
                title="নোটিফিকেশন সেন্টার"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationCenterDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 transition-colors"
              title="Toggle Language"
            >
              {language === 'bn' ? 'বাং' : 'EN'}
            </button>

            {/* User Profile / Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-colors"
              >
                {isLoggedIn ? (
                  <>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-xs font-semibold text-white leading-none truncate max-w-[100px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5 leading-none">
                        {isAdmin ? 'Admin' : 'Member'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-xs font-semibold text-white leading-none">
                        লগইন
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5 leading-none">
                        অ্যাকাউন্ট
                      </div>
                    </div>
                  </>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-3 px-3 z-50 text-sm">
                  {!isLoggedIn ? (
                    /* Guest / Unauthenticated: ONLY Login and Registration options */
                    <div className="text-center py-1">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-2.5 text-amber-400 shadow-inner">
                        <LogIn className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <p className="font-bold text-white text-sm">MailFactory অ্যাকাউন্ট</p>
                      <p className="text-[11px] text-slate-400 mt-1 mb-3.5 px-1 leading-relaxed">
                        লগইন করে আপনার ওয়ালেট, জিমেইল সেল, মার্কেটপ্লেস ও অর্ডার ড্যাশবোর্ড এক্সেস করুন
                      </p>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setAuthModalMode('login');
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                        >
                          <LogIn className="w-4 h-4 stroke-[2.5]" />
                          <span>লগ-ইন করুন (Login)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setAuthModalMode('register');
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <UserPlus className="w-4 h-4 text-amber-400" />
                          <span>নতুন রেজিস্ট্রেশন (Register)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Authenticated: All features visible only AFTER login */
                    <div>
                      <div className="px-2 py-1.5 border-b border-slate-800">
                        <p className="font-semibold text-white truncate">{currentUser.name || 'User'}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {currentUser.memberTier || 'Silver'} Member
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
                            className="w-full text-left px-3 py-2 text-emerald-400 hover:bg-emerald-950/40 rounded-lg flex items-center gap-2.5 font-semibold text-xs transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>অ্যাডমিন ম্যানেজমেন্ট প্যানেল</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveTab('wallet');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2.5 text-xs transition-colors"
                        >
                          <Wallet className="w-4 h-4 text-amber-400" />
                          <span>আমার ওয়ালেট ও ডিপোজিট</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('id_card');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2.5 text-xs transition-colors"
                        >
                          <IdCard className="w-4 h-4 text-amber-400" />
                          <span>মেম্বার আইডি কার্ড (ID Card)</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('orders');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2.5 text-xs transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-sky-400" />
                          <span>আমার ক্রয়কৃত অর্ডার (Orders)</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('transactions');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2.5 text-xs transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-emerald-400" />
                          <span>লেনদেন হিস্ট্রি (Transactions)</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2.5 text-xs transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>প্রোফাইল সেটিংস</span>
                        </button>
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-slate-800 pt-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            firebaseLogout();
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-400" />
                          <span>লগআউট (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
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
          {/* User Info or Quick Auth in Mobile Drawer */}
          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>লগইন করুন</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>নতুন রেজিস্টার</span>
              </button>
            </div>
          ) : (
            <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm truncate">{currentUser.name || 'User'}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                      {currentUser.memberTier || 'Silver'}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">ব্যালেন্স:</span>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="text-amber-400">৳{(currentUser.balanceBdt || 0).toLocaleString()}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400">${(currentUser.balanceUsd || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

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

          <button
            onClick={() => {
              setIsNotificationOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:bg-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>নোটিফিকেশন সেন্টার</span>
            </div>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {unreadCount} নতুন
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">সব পঠিত</span>
            )}
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

          <div className="pt-2 border-t border-slate-800">
            {!isLoggedIn ? (
              <div className="p-2 rounded-xl bg-slate-800/40 text-center">
                <p className="text-[11px] text-slate-400">
                  অ্যাকাউন্টে প্রবেশ করে সহজে মেইল সেল ও বাই করুন
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>প্রোফাইল ও অ্যাকাউন্ট সেটিংস</span>
                </button>
                <button
                  onClick={() => {
                    firebaseLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন (Logout)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
