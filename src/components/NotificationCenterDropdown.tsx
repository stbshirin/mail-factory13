import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { NotificationItem } from '../types';
import {
  Bell,
  CheckCircle2,
  Wallet,
  ArrowRightLeft,
  MailCheck,
  Check,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface NotificationCenterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = 'all' | 'mail_sold' | 'deposit_confirmed' | 'exchange_offer';

export const NotificationCenterDropdown: React.FC<NotificationCenterDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    currentUser,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter notifications relevant to the current user or global broadcasts
  const userNotifications = (notifications || []).filter(
    n => n.userId === currentUser.id || n.userId === 'all' || !n.userId
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Categorize
  const filteredNotifications = userNotifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mail_sold') {
      return n.type === 'mail_sale' || n.category === 'mail_sold';
    }
    if (activeFilter === 'deposit_confirmed') {
      return n.type === 'deposit' || n.category === 'deposit_confirmed';
    }
    if (activeFilter === 'exchange_offer') {
      return n.type === 'exchange' || n.category === 'exchange_offer';
    }
    return true;
  });

  const mailSoldCount = userNotifications.filter(
    n => n.type === 'mail_sale' || n.category === 'mail_sold'
  ).length;
  const depositCount = userNotifications.filter(
    n => n.type === 'deposit' || n.category === 'deposit_confirmed'
  ).length;
  const exchangeCount = userNotifications.filter(
    n => n.type === 'exchange' || n.category === 'exchange_offer'
  ).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.link) {
      setActiveTab(notif.link);
      onClose();
    }
  };

  const getNotificationIcon = (notif: NotificationItem) => {
    if (notif.type === 'mail_sale' || notif.category === 'mail_sold') {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <MailCheck className="w-5 h-5" />
        </div>
      );
    }
    if (notif.type === 'deposit' || notif.category === 'deposit_confirmed') {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Wallet className="w-5 h-5" />
        </div>
      );
    }
    if (notif.type === 'exchange' || notif.category === 'exchange_offer') {
      return (
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <ArrowRightLeft className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Info className="w-5 h-5" />
      </div>
    );
  };

  const getBadge = (notif: NotificationItem) => {
    if (notif.type === 'mail_sale' || notif.category === 'mail_sold') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <Sparkles className="w-2.5 h-2.5" />
          <span>মেইল সেলড</span>
        </span>
      );
    }
    if (notif.type === 'deposit' || notif.category === 'deposit_confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <CheckCircle2 className="w-2.5 h-2.5" />
          <span>ডিপোজিট কনফার্মড</span>
        </span>
      );
    }
    if (notif.type === 'exchange' || notif.category === 'exchange_offer') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/40">
          <TrendingUp className="w-2.5 h-2.5" />
          <span>এক্সচেঞ্জ অফার</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-[420px] max-w-[430px] rounded-3xl bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      style={{ right: '0px' }}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide">
                নোটিফিকেশন সেন্টার
              </h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                  {unreadCount} নতুন
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px]">
                  সব পঠিত
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              মেইল সেলস, ডিপোজিট কনফার্মেশন ও এক্সচেঞ্জ অ্যালার্ট
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-amber-500/10 transition-colors flex items-center gap-1"
              title="সবগুলো পঠিত হিসেবে চিহ্নিত করুন"
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">সব পঠিত</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800/80 text-[11px] font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <span>সকল</span>
          <span className="text-[9px] px-1 rounded-full bg-black/20">
            {userNotifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('mail_sold')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'mail_sold'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60'
          }`}
        >
          <MailCheck className="w-3.5 h-3.5" />
          <span>মেইল সেল</span>
          {mailSoldCount > 0 && (
            <span className="text-[9px] px-1 rounded-full bg-black/20">
              {mailSoldCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFilter('deposit_confirmed')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'deposit_confirmed'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/60'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>ডিপোজিট</span>
          {depositCount > 0 && (
            <span className="text-[9px] px-1 rounded-full bg-black/20">
              {depositCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFilter('exchange_offer')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'exchange_offer'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-purple-400 hover:bg-slate-800/60'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>এক্সচেঞ্জ</span>
          {exchangeCount > 0 && (
            <span className="text-[9px] px-1 rounded-full bg-black/20">
              {exchangeCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List Body */}
      <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto divide-y divide-slate-800/70 p-1.5">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-6 h-6 opacity-40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-300">কোনো নোটিফিকেশন নেই</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeFilter === 'mail_sold' && 'মেইল লিস্টিং বিক্রয় হলে এখানে তাৎক্ষণিক অ্যালার্ট আসবে।'}
                {activeFilter === 'deposit_confirmed' && 'ওয়ালেট ডিপোজিট অ্যাপ্রুভ হলে কনফার্মেশন মেসেজ পাবেন।'}
                {activeFilter === 'exchange_offer' && 'কারেন্সি এক্সচেঞ্জ অফার ও লাইভ রেট আপডেট এখানে দেখাবে।'}
                {activeFilter === 'all' && 'আপনার জন্য নতুন কোনো বার্তা বা লেনদেনের অ্যালার্ট নেই।'}
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer group flex items-start gap-3 relative ${
                  isUnread
                    ? 'bg-slate-800/50 hover:bg-slate-800 border border-amber-500/20 hover:border-amber-500/40'
                    : 'hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                {/* Unread Accent Dot */}
                {isUnread && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}

                {/* Icon */}
                {getNotificationIcon(notif)}

                {/* Body Content */}
                <div className="flex-1 min-w-0 pr-4 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getBadge(notif)}
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 opacity-60" />
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4
                    className={`text-xs sm:text-sm font-bold leading-snug ${
                      isUnread ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {notif.title}
                  </h4>

                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed break-words">
                    {notif.message}
                  </p>

                  {/* Action Link Footer */}
                  {notif.link && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                      <span>
                        {notif.link === 'sell' && 'মেইল সেলার হিস্ট্রি দেখুন'}
                        {notif.link === 'wallet' && 'ওয়ালেটে ব্যালেন্স চেক করুন'}
                        {notif.link === 'exchange' && 'এক্সচেঞ্জ পেইজে যান'}
                        {notif.link === 'buy' && 'মার্কেটপ্লেস অর্ডার দেখুন'}
                        {notif.link !== 'sell' &&
                          notif.link !== 'wallet' &&
                          notif.link !== 'exchange' &&
                          notif.link !== 'buy' &&
                          'বিস্তারিত দেখুন'}
                      </span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Banner */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>রিয়েল-টাইম লাইভ নোটিফিকেশন</span>
        </span>
        <button
          onClick={() => {
            markAllNotificationsRead();
          }}
          className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
        >
          সব চেক হয়েছে
        </button>
      </div>
    </div>
  );
};
