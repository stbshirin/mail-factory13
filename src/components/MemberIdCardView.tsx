import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import {
  ShieldCheck,
  Award,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  RotateCw,
  Palette,
  ExternalLink,
  QrCode,
  LogIn,
  UserPlus,
  Wifi,
  Lock,
  Phone,
  Mail,
  Calendar,
  Layers,
} from 'lucide-react';

type CardTheme = 'gold' | 'diamond' | 'onyx' | 'emerald';

export const MemberIdCardView: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthModalMode,
    platformSettings,
    showToast,
  } = useApp();

  const [isFlipped, setIsFlipped] = useState(false);
  const [theme, setTheme] = useState<CardTheme>('gold');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic user data with fallbacks
  const displayUser = {
    id: currentUser.id && currentUser.id !== 'guest' ? currentUser.id : 'MF-89342',
    name: currentUser.name || (isLoggedIn ? 'User' : 'ডেমো ইউজার (Demo Member)'),
    email: currentUser.email || (isLoggedIn ? 'user@mailfactory.com' : 'demo@mailfactory.com'),
    phone: currentUser.phone || '+880 1700-000000',
    tier: currentUser.memberTier || 'Silver',
    role: currentUser.role || 'user',
    joinedAt: currentUser.joinedAt || '2024-01-15',
    referralCode: currentUser.referralCode || 'MF8899',
    totalApprovedMails: currentUser.totalApprovedMails || 0,
    avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  const memberIdClean = `MF-${displayUser.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase()}`;

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`${label} কপি করা হয়েছে!`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast('কপি ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${displayUser.name} - MailFactory ডিজিটাল আইডি কার্ড`,
      text: `মেইল ফ্যাক্টরি ভেরিফাইড মেম্বার আইডি: ${memberIdClean}। রেফারেল কোড: ${displayUser.referralCode}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopy(`${shareData.text} \n${shareData.url}`, 'আইডি কার্ড তথ্য');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme Styles
  const themeStyles = {
    gold: {
      cardBg: 'from-slate-950 via-slate-900 to-amber-950/80',
      border: 'border-amber-500/50 shadow-amber-500/10',
      chip: 'from-amber-300 via-yellow-500 to-amber-600 border-yellow-200/60',
      accentText: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      holo: 'bg-amber-500/10',
      glow: 'shadow-amber-500/20',
      name: 'Gold & Amber',
    },
    diamond: {
      cardBg: 'from-slate-950 via-slate-900 to-cyan-950/80',
      border: 'border-cyan-400/50 shadow-cyan-400/10',
      chip: 'from-cyan-300 via-sky-400 to-blue-600 border-cyan-200/60',
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
      holo: 'bg-cyan-500/10',
      glow: 'shadow-cyan-500/20',
      name: 'Cyber Diamond',
    },
    onyx: {
      cardBg: 'from-black via-zinc-900 to-slate-900',
      border: 'border-slate-500/50 shadow-slate-500/10',
      chip: 'from-slate-200 via-zinc-400 to-slate-600 border-slate-300/60',
      accentText: 'text-slate-200',
      badgeBg: 'bg-slate-700/50 border-slate-500/50 text-slate-200',
      holo: 'bg-slate-400/10',
      glow: 'shadow-slate-500/20',
      name: 'Midnight Onyx',
    },
    emerald: {
      cardBg: 'from-slate-950 via-slate-900 to-emerald-950/80',
      border: 'border-emerald-500/50 shadow-emerald-500/10',
      chip: 'from-emerald-300 via-teal-400 to-emerald-600 border-emerald-200/60',
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      holo: 'bg-emerald-500/10',
      glow: 'shadow-emerald-500/20',
      name: 'Royal Emerald',
    },
  }[theme];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16 px-1 sm:px-0">
      {/* Printable CSS overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card-container, #printable-card-container * {
            visibility: visible;
          }
          #printable-card-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100% !important;
            max-width: 500px !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>অফিসিয়াল ডিজিটাল মেম্বার পরিচিতিপত্র</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ডিজিটাল মেম্বার আইডি কার্ড
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          মেইল ফ্যাক্টরি ভেরিফাইড সেলার ও ট্রাস্টেড বায়ার পরিচিতিপত্র। এটি আপনার অনন্য মেম্বারশিপ প্রুফ।
        </p>
      </div>

      {/* Unauthenticated / Guest Warning Banner */}
      {!isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-300">
              ⚠️ আপনি বর্তমানে লগইন করেননি (প্রিভিউ মোড)
            </p>
            <p className="text-[11px] text-slate-400">
              আপনার ব্যক্তিগত নাম ও আইডি সহ কার্ড পেতে লগ-ইন অথবা ফ্রি রেজিস্ট্রেশন করুন।
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন করুন</span>
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>রেজিস্ট্রেশন</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Theme Selector Bar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold px-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">কার্ড থিম:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {(['gold', 'diamond', 'onyx', 'emerald'] as CardTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all capitalize ${
                theme === t
                  ? 'bg-amber-500 text-slate-950 shadow-sm scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        id="printable-card-container"
        className="relative perspective-1000 select-none cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        title="কার্ডে ট্যাপ করে সামনের বা পেছনের দিক দেখুন"
      >
        <div
          ref={cardRef}
          style={{
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          className="relative w-full min-h-[320px] sm:min-h-[340px]"
        >
          {/* ========================================================
              CARD FRONT SIDE
             ======================================================== */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className={`w-full h-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Holographic Glowing Orbs */}
            <div className={`absolute -top-12 -right-12 w-52 h-52 ${themeStyles.holo} rounded-full blur-3xl pointer-events-none`} />
            <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Microcircuit watermark texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Unauthenticated Demo Watermark */}
            {!isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-4xl sm:text-5xl font-black text-white/5 -rotate-12 uppercase tracking-widest">
                  DEMO PREVIEW
                </span>
              </div>
            )}

            {/* Top Bar: Brand, Hologram & Tier */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md flex-shrink-0">
                  MF
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-white flex items-center gap-1.5">
                    <span>MAIL FACTORY</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-amber-400/90 font-mono tracking-widest uppercase">
                    OFFICIAL DIGITAL MEMBER ID
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-full ${themeStyles.badgeBg} border font-bold text-[10px] sm:text-xs flex items-center gap-1 shadow-sm`}>
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {isAdmin ? 'CLOUD ADMIN' : `${displayUser.tier.toUpperCase()} MEMBER`}
                  </span>
                </div>
              </div>
            </div>

            {/* EMV Chip & Contactless Wave */}
            <div className="relative z-10 my-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Metallic Gold EMV Chip */}
                <div className={`w-11 h-8 rounded-lg bg-gradient-to-tr ${themeStyles.chip} border flex flex-col justify-between p-1 shadow-md`}>
                  <div className="w-full h-1 bg-black/30 rounded" />
                  <div className="flex justify-between items-center gap-1">
                    <div className="w-2 h-2.5 rounded-sm bg-black/25" />
                    <div className="w-2 h-2.5 rounded-sm bg-black/25" />
                  </div>
                  <div className="w-full h-1 bg-black/30 rounded" />
                </div>
                {/* Contactless Wifi Icon */}
                <Wifi className="w-5 h-5 text-white/40 rotate-90" />
              </div>

              {/* ID Badge with Copy */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(memberIdClean, 'মেম্বার আইডি');
                }}
                className="font-mono text-xs text-white/90 bg-black/40 hover:bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors group"
                title="কপি করতে ক্লিক করুন"
              >
                <span className={themeStyles.accentText}>{memberIdClean}</span>
                {copiedField === 'মেম্বার আইডি' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-white/50 group-hover:text-white" />
                )}
              </button>
            </div>

            {/* Member Details Body */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                {/* Avatar with Verified Ring */}
                <div className="relative flex-shrink-0">
                  <img
                    src={displayUser.avatarUrl}
                    alt={displayUser.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                    ✓
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                    মেম্বার নাম / Cardholder Name
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white tracking-wide truncate">
                    {displayUser.name}
                  </div>
                  <div className={`text-xs font-mono ${themeStyles.accentText} truncate flex items-center gap-1`}>
                    <Mail className="w-3 h-3 flex-shrink-0 opacity-70" />
                    <span>{displayUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Data Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-white/10 text-xs">
                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-white/50 font-semibold uppercase">যোগদান / Joined</div>
                  <div className="font-mono font-bold text-white text-[11px] truncate">
                    {displayUser.joinedAt}
                  </div>
                </div>

                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-white/50 font-semibold uppercase">রেফারেল কোড</div>
                  <div className={`font-mono font-bold ${themeStyles.accentText} text-[11px] truncate`}>
                    {displayUser.referralCode}
                  </div>
                </div>

                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-white/50 font-semibold uppercase">মেইল সেল্ড</div>
                  <div className="font-bold text-white text-[11px]">
                    {displayUser.totalApprovedMails} টি
                  </div>
                </div>

                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-white/50 font-semibold uppercase">স্ট্যাটাস</div>
                  <div className="font-bold text-emerald-400 text-[11px] flex items-center gap-1 truncate">
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Hologram Ribbon */}
            <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>SECURED BY 256-BIT ENCRYPTION</span>
              </span>
              <span className="text-amber-400 font-bold tracking-wider">
                MAIL FACTORY BD
              </span>
            </div>
          </div>

          {/* ========================================================
              CARD BACK SIDE (Revealed upon flip)
             ======================================================== */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className={`absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white flex flex-col justify-between overflow-hidden`}
          >
            {/* Magnetic Stripe */}
            <div className="absolute top-4 left-0 right-0 h-10 sm:h-12 bg-black/90 border-y border-white/10 flex items-center justify-end px-4">
              <span className="text-[8px] font-mono text-white/30 tracking-widest">
                MF-ELECTRONIC-DATA-CARD-ISO7816
              </span>
            </div>

            {/* Top spacing for magnetic stripe */}
            <div className="pt-10" />

            {/* Signature Panel & Security Code */}
            <div className="space-y-1.5 my-2">
              <div className="text-[9px] text-white/50 uppercase font-semibold">
                কার্ডহোল্ডার স্বাক্ষর ও ভেরিফিকেশন কোড / Authorized Signature
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 sm:h-9 bg-white/90 rounded-lg px-3 flex items-center justify-between text-slate-900 font-mono font-bold text-xs italic tracking-wider shadow-inner">
                  <span className="truncate">{displayUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal not-italic">
                    {displayUser.joinedAt}
                  </span>
                </div>
                <div className="w-14 h-8 sm:h-9 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center font-mono text-amber-400 font-black text-xs">
                  CVC {displayUser.id.replace(/[^0-9]/g, '').slice(0, 3) || '786'}
                </div>
              </div>
            </div>

            {/* Middle QR Code & Support info */}
            <div className="flex items-center justify-between gap-4 py-2 border-y border-white/10">
              <div className="space-y-1 flex-1 text-[10px] text-white/70">
                <p className="font-semibold text-white">
                  মেইল ফ্যাক্টরি অফিসিয়াল মেম্বারশিপ সার্ভিস
                </p>
                <p className="text-[9px] text-white/50 leading-relaxed">
                  এই ডিজিটাল কার্ডটি মেইল ফ্যাক্টরি প্ল্যাটফর্মের একজন নিবন্ধিত ও ভেরিফাইড মেম্বারের অনন্য পরিচয় বহন করে।
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                  <span className="text-sky-400">টেলিগ্রাম: @techlystb</span>
                  <span className="text-emerald-400">হেল্পলাইন: 24/7 সাপোর্ট</span>
                </div>
              </div>

              {/* Dynamic Mock QR Code */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 p-1 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <QrCode className="w-full h-full text-slate-950 stroke-[1.8]" />
              </div>
            </div>

            {/* Barcode & Disclaimer Footer */}
            <div className="space-y-1.5">
              {/* Mock Barcode */}
              <div className="h-6 w-full flex items-center justify-between px-1 bg-white/5 rounded overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-white/60"
                    style={{
                      width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px',
                      opacity: i % 4 === 0 ? 0.3 : 0.8,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-white/40">
                <span>AUTHORIZED BY MAIL FACTORY BD</span>
                <span>SECURITY LEVEL: CLASS-A VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tap Hint */}
      <div className="text-center">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-400 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>
            {isFlipped ? 'সামনের দিক দেখতে ট্যাপ করুন (Show Front)' : 'পেছনের দিক দেখতে ট্যাপ করুন (Show Back)'}
          </span>
        </button>
      </div>

      {/* Action Toolbar Grid - 100% Mobile Friendly */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <RotateCw className="w-4 h-4 text-amber-400" />
          <span>কার্ড ফ্লিপ</span>
        </button>

        <button
          onClick={() => handleCopy(memberIdClean, 'মেম্বার আইডি')}
          className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          {copiedField === 'মেম্বার আইডি' ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">কপি হয়েছে</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-sky-400" />
              <span>আইডি কপি</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>শেয়ার করুন</span>
        </button>

        <button
          onClick={handlePrint}
          className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>প্রিন্ট / সেভ</span>
        </button>
      </div>

      {/* Member Benefits Information Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>ডিজিটাল মেম্বারশিপের বিশেষ সুবিধাসমূহ:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">ইনস্ট্যান্ট পেমেন্ট অগ্রাধিকার</p>
              <p className="text-[11px] text-slate-400">ভেরিফাইড মেম্বারদের বিকাশ ও নগদে দ্রুত ক্যাশআউট সম্পন্ন হয়।</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">আনলিমিটেড মেইল সাবমিশন</p>
              <p className="text-[11px] text-slate-400">দৈনিক যে কোনো শিফটে বড় লট মেইল বিক্রির সুবিধা।</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">১০০% সিকিউরড সেলার ব্যাজ</p>
              <p className="text-[11px] text-slate-400">বায়ারদের কাছে আপনার প্রোফাইল থাকবে সর্বোচ্চ বিশ্বস্ত।</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">২৪/৭ ভিআইপি সাপোর্ট</p>
              <p className="text-[11px] text-slate-400">অ্যাডমিন হেল্পলাইনে যেকোনো সমস্যায় তাৎক্ষণিক সহায়তা।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
