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
  QrCode,
  LogIn,
  UserPlus,
  Wifi,
  Lock,
  Mail,
  Layers,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

type CardTheme = 'gold' | 'diamond' | 'onyx' | 'emerald';

// Helper to draw rounded rectangle on Canvas safely across all browsers
function drawCanvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }
}

// Helper to load image safely
const loadCanvasImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

export const MemberIdCardView: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthModalMode,
    showToast,
    language,
  } = useApp();

  const [isFlipped, setIsFlipped] = useState(false);
  const [viewLayout, setViewLayout] = useState<'flip' | 'stacked'>('stacked');
  const [theme, setTheme] = useState<CardTheme>('gold');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
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
    avatarUrl:
      currentUser.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  const memberIdClean = `MF-${displayUser.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase()}`;

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(language === 'bn' ? `${label} কপি করা হয়েছে!` : `${label} copied!`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast(language === 'bn' ? 'কপি ব্যর্থ হয়েছে' : 'Copy failed', 'error');
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

  // Theme Styles for React UI
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

  // High-Resolution PNG Generator (Front Side on Top, Back Side on Bottom)
  const handleDownloadStackedPng = async () => {
    setIsDownloadingPng(true);
    showToast(
      language === 'bn'
        ? 'আইডি কার্ডের (সামনে ও পেছনে) হাই-রেজুলেশন PNG তৈরি হচ্ছে...'
        : 'Generating high-resolution Front & Back PNG...',
      'info'
    );

    try {
      // 1. Create Canvas (1000px width x 1280px height for ultra-crisp output)
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // 2. Base Canvas Background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle background radial glow
      const bgRadial = ctx.createRadialGradient(500, 300, 50, 500, 300, 600);
      if (theme === 'gold') {
        bgRadial.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        bgRadial.addColorStop(1, 'rgba(6, 9, 19, 0)');
      } else if (theme === 'diamond') {
        bgRadial.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        bgRadial.addColorStop(1, 'rgba(6, 9, 19, 0)');
      } else if (theme === 'emerald') {
        bgRadial.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
        bgRadial.addColorStop(1, 'rgba(6, 9, 19, 0)');
      } else {
        bgRadial.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
        bgRadial.addColorStop(1, 'rgba(6, 9, 19, 0)');
      }
      ctx.fillStyle = bgRadial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color pallete config for canvas
      const pal = {
        gold: {
          gradStart: '#0f172a',
          gradMid: '#1a140b',
          gradEnd: '#3b2207',
          accent: '#f59e0b',
          accentLight: '#fde68a',
          border: 'rgba(245, 158, 11, 0.65)',
          badgeBg: 'rgba(245, 158, 11, 0.18)',
          chipGrad: ['#fde68a', '#eab308', '#92400e'],
        },
        diamond: {
          gradStart: '#0f172a',
          gradMid: '#082f49',
          gradEnd: '#164e63',
          accent: '#06b6d4',
          accentLight: '#cffafe',
          border: 'rgba(6, 182, 212, 0.65)',
          badgeBg: 'rgba(6, 182, 212, 0.18)',
          chipGrad: ['#a5f3fc', '#0284c7', '#075985'],
        },
        onyx: {
          gradStart: '#09090b',
          gradMid: '#18181b',
          gradEnd: '#27272a',
          accent: '#e4e4e7',
          accentLight: '#ffffff',
          border: 'rgba(161, 161, 170, 0.55)',
          badgeBg: 'rgba(113, 113, 122, 0.25)',
          chipGrad: ['#f4f4f5', '#a1a1aa', '#52525b'],
        },
        emerald: {
          gradStart: '#042119',
          gradMid: '#064e3b',
          gradEnd: '#065f46',
          accent: '#10b981',
          accentLight: '#d1fae5',
          border: 'rgba(16, 185, 129, 0.65)',
          badgeBg: 'rgba(16, 185, 129, 0.18)',
          chipGrad: ['#6ee7b7', '#059669', '#064e3b'],
        },
      }[theme];

      // Load avatar image if present
      let avatarImg: HTMLImageElement | null = null;
      if (displayUser.avatarUrl) {
        avatarImg = await loadCanvasImage(displayUser.avatarUrl);
      }

      // ========================================================
      // 1. DRAW FRONT SIDE (TOP CARD: y = 45 to y = 585, h = 540)
      // ========================================================
      const frontX = 60;
      const frontY = 45;
      const cardW = 880;
      const cardH = 540;
      const cardR = 28;

      // Front Card Background Gradient
      ctx.save();
      drawCanvasRoundRect(ctx, frontX, frontY, cardW, cardH, cardR);
      ctx.clip();

      const frontGrad = ctx.createLinearGradient(frontX, frontY, frontX + cardW, frontY + cardH);
      frontGrad.addColorStop(0, pal.gradStart);
      frontGrad.addColorStop(0.4, pal.gradMid);
      frontGrad.addColorStop(1, pal.gradEnd);
      ctx.fillStyle = frontGrad;
      ctx.fillRect(frontX, frontY, cardW, cardH);

      // Microcircuit dot pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let px = frontX + 15; px < frontX + cardW; px += 18) {
        for (let py = frontY + 15; py < frontY + cardH; py += 18) {
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Front Card Border
      ctx.save();
      drawCanvasRoundRect(ctx, frontX, frontY, cardW, cardH, cardR);
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Front Side Header: Logo + "MAIL FACTORY" + Member Tier
      // Logo badge
      ctx.save();
      drawCanvasRoundRect(ctx, frontX + 32, frontY + 28, 48, 48, 14);
      const logoGrad = ctx.createLinearGradient(frontX + 32, frontY + 28, frontX + 80, frontY + 76);
      logoGrad.addColorStop(0, '#fbbf24');
      logoGrad.addColorStop(0.5, '#f59e0b');
      logoGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = logoGrad;
      ctx.fill();
      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MF', frontX + 56, frontY + 52);
      ctx.restore();

      // Title & Subtitle
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.fillText('MAIL FACTORY', frontX + 92, frontY + 30);

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 11px monospace';
      ctx.fillText('OFFICIAL DIGITAL MEMBER ID • FRONT SIDE', frontX + 92, frontY + 56);

      // Top Right Tier Badge
      const tierLabel = isAdmin ? 'CLOUD ADMIN' : `${displayUser.tier.toUpperCase()} MEMBER`;
      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      const tierTextW = ctx.measureText(tierLabel).width;
      const tierPillW = tierTextW + 36;
      const tierPillX = frontX + cardW - tierPillW - 32;

      ctx.save();
      drawCanvasRoundRect(ctx, tierPillX, frontY + 32, tierPillW, 36, 18);
      ctx.fillStyle = pal.badgeBg;
      ctx.fill();
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = pal.accentLight;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`★  ${tierLabel}`, tierPillX + tierPillW / 2, frontY + 50);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(frontX + 32, frontY + 90);
      ctx.lineTo(frontX + cardW - 32, frontY + 90);
      ctx.stroke();

      // EMV Chip + Contactless Wave + Member ID Pill
      // Metallic Chip
      const chipX = frontX + 35;
      const chipY = frontY + 110;
      ctx.save();
      drawCanvasRoundRect(ctx, chipX, chipY, 62, 44, 9);
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 62, chipY + 44);
      chipGrad.addColorStop(0, pal.chipGrad[0]);
      chipGrad.addColorStop(0.5, pal.chipGrad[1]);
      chipGrad.addColorStop(1, pal.chipGrad[2]);
      ctx.fillStyle = chipGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Chip lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(chipX, chipY + 15);
      ctx.lineTo(chipX + 62, chipY + 15);
      ctx.moveTo(chipX, chipY + 29);
      ctx.lineTo(chipX + 62, chipY + 29);
      ctx.moveTo(chipX + 22, chipY);
      ctx.lineTo(chipX + 22, chipY + 44);
      ctx.moveTo(chipX + 40, chipY);
      ctx.lineTo(chipX + 40, chipY + 44);
      ctx.stroke();
      ctx.restore();

      // Contactless Wifi Arcs
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      const wifiX = chipX + 85;
      const wifiY = chipY + 22;
      for (let r = 8; r <= 20; r += 6) {
        ctx.beginPath();
        ctx.arc(wifiX, wifiY, r, -Math.PI * 0.3, Math.PI * 0.3);
        ctx.stroke();
      }
      ctx.restore();

      // Member ID Pill on right
      const idText = memberIdClean;
      ctx.save();
      const idPillW = 190;
      const idPillH = 38;
      const idPillX = frontX + cardW - idPillW - 32;
      drawCanvasRoundRect(ctx, idPillX, chipY + 3, idPillW, idPillH, 12);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(idText, idPillX + idPillW / 2, chipY + 22);
      ctx.restore();

      // Member Details Body: Avatar + Name + Email + Phone
      const avatarSize = 92;
      const avatarX = frontX + 35;
      const avatarY = frontY + 175;

      ctx.save();
      drawCanvasRoundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 22);
      ctx.clip();

      if (avatarImg) {
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      } else {
        // Fallback Monogram
        const avGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
        avGrad.addColorStop(0, '#f59e0b');
        avGrad.addColorStop(1, '#eab308');
        ctx.fillStyle = avGrad;
        ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

        ctx.fillStyle = '#09090b';
        ctx.font = 'black 40px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = displayUser.name ? displayUser.name.charAt(0).toUpperCase() : 'U';
        ctx.fillText(initial, avatarX + avatarSize / 2, avatarY + avatarSize / 2);
      }
      ctx.restore();

      // Avatar Border & Verified Check Tick
      ctx.save();
      drawCanvasRoundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 22);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Green Tick Badge
      const tickX = avatarX + avatarSize - 6;
      const tickY = avatarY + avatarSize - 6;
      ctx.beginPath();
      ctx.arc(tickX, tickY, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', tickX, tickY);
      ctx.restore();

      // Cardholder Text block
      const textLeft = avatarX + avatarSize + 24;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = 'bold 11px "Segoe UI", sans-serif';
      ctx.fillText('মেম্বার নাম / CARDHOLDER NAME', textLeft, avatarY + 6);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Segoe UI", sans-serif';
      const truncatedName =
        displayUser.name.length > 28 ? displayUser.name.substring(0, 26) + '...' : displayUser.name;
      ctx.fillText(truncatedName, textLeft, avatarY + 28);

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`✉  ${displayUser.email}`, textLeft, avatarY + 62);

      // Data Metrics 4-Box Grid (Joined, Referral, Sold, Status)
      const metricsY = frontY + 300;
      const boxW = 190;
      const boxH = 68;
      const boxGap = 18;

      const metrics = [
        { label: 'যোগদান / JOINED', value: displayUser.joinedAt, color: '#ffffff' },
        { label: 'রেফারেল কোড / REF', value: displayUser.referralCode, color: pal.accent },
        { label: 'মেইল সেল্ড / SOLD', value: `${displayUser.totalApprovedMails} টি`, color: '#ffffff' },
        { label: 'স্ট্যাটাস / STATUS', value: '✓ VERIFIED', color: '#34d399' },
      ];

      metrics.forEach((m, idx) => {
        const bx = frontX + 35 + idx * (boxW + boxGap);
        ctx.save();
        drawCanvasRoundRect(ctx, bx, metricsY, boxW, boxH, 14);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 10px "Segoe UI", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(m.label, bx + 14, metricsY + 12);

        ctx.fillStyle = m.color;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(m.value, bx + 14, metricsY + 36);
        ctx.restore();
      });

      // Front Footer Ribbon
      const frontFootY = frontY + cardH - 52;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(frontX + 32, frontFootY);
      ctx.lineTo(frontX + cardW - 32, frontFootY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒 256-BIT SECURED ENCRYPTION • VERIFIED SELLER CREDENTIAL', frontX + 35, frontFootY + 26);

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('MAIL FACTORY BD', frontX + cardW - 35, frontFootY + 26);

      // ========================================================
      // 2. MIDDLE DIVIDER (SEPARATING FRONT AND BACK SIDES)
      // ========================================================
      const midY = frontY + cardH + 32;

      // Dashed horizontal line
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(frontX + 20, midY);
      ctx.lineTo(frontX + cardW - 20, midY);
      ctx.stroke();
      ctx.restore();

      // Center pill tag
      const midBadgeW = 280;
      const midBadgeH = 26;
      const midBadgeX = (canvas.width - midBadgeW) / 2;
      ctx.save();
      drawCanvasRoundRect(ctx, midBadgeX, midY - midBadgeH / 2, midBadgeW, midBadgeH, 13);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = pal.accentLight;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('▼ BACK SIDE (পেছনের দিক) ▼', canvas.width / 2, midY);
      ctx.restore();

      // ========================================================
      // 3. DRAW BACK SIDE (BOTTOM CARD: y = 650 to y = 1190, h = 540)
      // ========================================================
      const backX = 60;
      const backY = midY + 30;

      // Back Card Background Gradient
      ctx.save();
      drawCanvasRoundRect(ctx, backX, backY, cardW, cardH, cardR);
      ctx.clip();

      const backGrad = ctx.createLinearGradient(backX, backY, backX + cardW, backY + cardH);
      backGrad.addColorStop(0, pal.gradStart);
      backGrad.addColorStop(0.4, pal.gradMid);
      backGrad.addColorStop(1, pal.gradEnd);
      ctx.fillStyle = backGrad;
      ctx.fillRect(backX, backY, cardW, cardH);

      // Magnetic Stripe across top
      const magH = 68;
      const magY = backY + 28;
      ctx.fillStyle = '#050505';
      ctx.fillRect(backX, magY, cardW, magH);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('MF-ELECTRONIC-DATA-CARD-ISO7816-COMPLIANT', backX + cardW - 35, magY + magH / 2);
      ctx.restore();

      // Back Card Border
      ctx.save();
      drawCanvasRoundRect(ctx, backX, backY, cardW, cardH, cardR);
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Authorized Signature Panel & CVC Box
      const sigLabelY = backY + 120;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 11px "Segoe UI", sans-serif';
      ctx.fillText('কার্ডহোল্ডার স্বাক্ষর ও সিকিউরিটি কোড / AUTHORIZED SIGNATURE & CVC', backX + 35, sigLabelY);

      const sigBoxY = sigLabelY + 24;
      const sigBoxW = 580;
      const sigBoxH = 52;

      // Signature White/Metallic Strip
      ctx.save();
      drawCanvasRoundRect(ctx, backX + 35, sigBoxY, sigBoxW, sigBoxH, 10);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      // Subtle security hatch lines in signature strip
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < sigBoxW; i += 16) {
        ctx.beginPath();
        ctx.moveTo(backX + 35 + i, sigBoxY);
        ctx.lineTo(backX + 35 + i + 10, sigBoxY + sigBoxH);
        ctx.stroke();
      }

      // Cursive signature of user name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px "Brush Script MT", "Segoe Script", cursive, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayUser.name, backX + 55, sigBoxY + 26);

      // Date in signature strip
      ctx.font = 'normal 11px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText(displayUser.joinedAt, backX + 35 + sigBoxW - 18, sigBoxY + 26);
      ctx.restore();

      // CVC Box on right
      const cvcBoxX = backX + 35 + sigBoxW + 24;
      const cvcBoxW = 200;
      const cvcNum = displayUser.id.replace(/[^0-9]/g, '').slice(0, 3) || '786';

      ctx.save();
      drawCanvasRoundRect(ctx, cvcBoxX, sigBoxY, cvcBoxW, sigBoxH, 10);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 17px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`CVC ${cvcNum}`, cvcBoxX + cvcBoxW / 2, sigBoxY + 26);
      ctx.restore();

      // Middle Info: Terms + Support Helpline + QR Code
      const midInfoY = sigBoxY + 76;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(backX + 32, midInfoY);
      ctx.lineTo(backX + cardW - 32, midInfoY);
      ctx.stroke();

      const textStartY = midInfoY + 20;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Segoe UI", sans-serif';
      ctx.fillText('মেইল ফ্যাক্টরি অফিসিয়াল মেম্বারশিপ সার্ভিস', backX + 35, textStartY);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '12px "Segoe UI", sans-serif';
      ctx.fillText(
        'এই ডিজিটাল কার্ডটি মেইল ফ্যাক্টরি প্ল্যাটফর্মের একজন নিবন্ধিত ও ভেরিফাইড মেম্বারের অনন্য পরিচয় বহন করে।',
        backX + 35,
        textStartY + 28
      );

      ctx.fillStyle = pal.accent;
      ctx.font = 'bold 13px monospace';
      ctx.fillText('টেলিগ্রাম সাপোর্ট: @techlystb    |    ২৪/৭ লাইভ সাপোর্ট হেল্পলাইন', backX + 35, textStartY + 56);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '11px "Segoe UI", sans-serif';
      ctx.fillText('শর্তাবলী: এই কার্ডটি ব্যক্তিগত ব্যবহারের জন্য নির্ধারিত এবং হস্তান্তরযোগ্য নয়।', backX + 35, textStartY + 84);

      // Stylized QR Code Graphic Tile on Right
      const qrTileSize = 100;
      const qrTileX = backX + cardW - qrTileSize - 35;
      const qrTileY = textStartY - 5;

      ctx.save();
      drawCanvasRoundRect(ctx, qrTileX, qrTileY, qrTileSize, qrTileSize, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw QR finder corners & matrix patterns
      ctx.fillStyle = '#09090b';
      // Top-Left Finder
      ctx.fillRect(qrTileX + 10, qrTileY + 10, 24, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrTileX + 14, qrTileY + 14, 16, 16);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(qrTileX + 18, qrTileY + 18, 8, 8);

      // Top-Right Finder
      ctx.fillRect(qrTileX + qrTileSize - 34, qrTileY + 10, 24, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrTileX + qrTileSize - 30, qrTileY + 14, 16, 16);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(qrTileX + qrTileSize - 26, qrTileY + 18, 8, 8);

      // Bottom-Left Finder
      ctx.fillRect(qrTileX + 10, qrTileY + qrTileSize - 34, 24, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrTileX + 14, qrTileY + qrTileSize - 30, 16, 16);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(qrTileX + 18, qrTileY + qrTileSize - 26, 8, 8);

      // Decorative QR Data Dots
      ctx.fillStyle = '#09090b';
      const matrixPattern = [
        [42, 12], [48, 12], [54, 16], [42, 22], [50, 26], [62, 14],
        [12, 42], [18, 46], [26, 42], [42, 42], [48, 48], [56, 44],
        [68, 42], [76, 46], [82, 42], [42, 60], [52, 64], [64, 62],
        [74, 68], [80, 62], [42, 76], [50, 80], [60, 78], [72, 82],
      ];
      matrixPattern.forEach(([px, py]) => {
        ctx.fillRect(qrTileX + px, qrTileY + py, 4, 4);
      });
      ctx.restore();

      // Realistic Mock Barcode Strip
      const barcodeY = textStartY + 120;
      const barcodeW = cardW - 70;
      const barcodeH = 46;

      ctx.save();
      drawCanvasRoundRect(ctx, backX + 35, barcodeY, barcodeW, barcodeH, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fill();

      // Draw alternating vertical barcode stripes
      let currentBarX = backX + 50;
      const barEndY = barcodeY + 32;
      ctx.fillStyle = '#f8fafc';
      let toggle = 0;
      while (currentBarX < backX + 35 + barcodeW - 20) {
        const thickness = (toggle % 4 === 0) ? 4 : (toggle % 3 === 0) ? 1.5 : (toggle % 2 === 0) ? 3 : 2;
        ctx.fillRect(currentBarX, barcodeY + 6, thickness, 20);
        currentBarX += thickness + (toggle % 3 === 0 ? 3 : 2);
        toggle++;
      }

      // Barcode Serial Text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`*MF-${memberIdClean}-${displayUser.referralCode}*`, backX + 35 + barcodeW / 2, barcodeY + 38);
      ctx.restore();

      // Back Card Disclaimer & Authority
      const backFootY = backY + cardH - 42;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('AUTHORIZED BY MAIL FACTORY BD • ISO 7816 CLASS-A', backX + 35, backFootY);

      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'right';
      ctx.fillText('STATUS: ACTIVE & VERIFIED', backX + cardW - 35, backFootY);

      // 4. Trigger Instant PNG Download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Could not create image blob');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MailFactory_ID_Card_${memberIdClean}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsDownloadingPng(false);
        showToast(
          language === 'bn'
            ? 'ডিজিটাল আইডি কার্ডের (সামনে ও পেছনে) PNG সফলভাবে ডাউনলোড হয়েছে!'
            : 'Digital ID Card (Front & Back) PNG downloaded successfully!',
          'success'
        );
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate card PNG:', err);
      setIsDownloadingPng(false);
      showToast(
        language === 'bn' ? 'PNG তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন' : 'Failed to generate PNG image',
        'error'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16 px-1 sm:px-0">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অফিসিয়াল ডিজিটাল মেম্বার পরিচিতিপত্র' : 'Official Member Credential'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {language === 'bn' ? 'ডিজিটাল মেম্বার আইডি কার্ড' : 'Digital Member ID Card'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          {language === 'bn'
            ? 'মেইল ফ্যাক্টরি ভেরিফাইড সেলার ও ট্রাস্টেড বায়ার পরিচিতিপত্র। সামনে ও পেছনের দিক উপরে-নিচে PNG ফরম্যাটে ডাউনলোড করুন।'
            : 'Verified seller & trusted buyer ID. Download Front & Back sides stacked in PNG format.'}
        </p>
      </div>

      {/* Unauthenticated / Guest Warning Banner */}
      {!isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-300">
              ⚠️ {language === 'bn' ? 'আপনি বর্তমানে লগইন করেননি (প্রিভিউ মোড)' : 'You are not logged in (Preview Mode)'}
            </p>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'আপনার ব্যক্তিগত নাম ও ছবি সহ কার্ড পেতে লগ-ইন অথবা ফ্রি রেজিস্ট্রেশন করুন।'
                : 'Sign in to generate card with your personal name, photo, and ID.'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}</span>
            </button>
          </div>
        </div>
      )}

      {/* View Mode & Theme Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        {/* Layout Switcher: 3D Flip vs Stacked Front & Back */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewLayout('stacked')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              viewLayout === 'stacked'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'উপরে-নিচে উভয় পাশ' : 'Stacked View'}</span>
          </button>
          <button
            onClick={() => setViewLayout('flip')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              viewLayout === 'flip'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '৩ডি ফ্লিপ মোড' : '3D Flip'}</span>
          </button>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 justify-end">
          <div className="hidden sm:flex items-center gap-1 text-slate-400 font-semibold px-1">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'থিম:' : 'Theme:'}</span>
          </div>
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

      {/* ========================================================
          CARD DISPLAY AREA: EITHER STACKED OR 3D FLIP
         ======================================================== */}
      {viewLayout === 'stacked' ? (
        /* STACKED VIEW: FRONT SIDE ON TOP, BACK SIDE ON BOTTOM */
        <div className="space-y-4 select-none">
          {/* Tag: Front Side */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>▲ {language === 'bn' ? 'সামনের দিক (Front Side)' : 'Front Side'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{memberIdClean}</span>
          </div>

          {/* FRONT CARD CONTAINER */}
          <div
            className={`w-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white space-y-4 relative overflow-hidden`}
          >
            {/* Holographic Glowing Orbs */}
            <div className={`absolute -top-12 -right-12 w-52 h-52 ${themeStyles.holo} rounded-full blur-3xl pointer-events-none`} />
            <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Brand, Hologram & Tier */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
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

            {/* EMV Chip & Contactless Wave & ID */}
            <div className="relative z-10 flex items-center justify-between pt-1">
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

              <button
                onClick={() => handleCopy(memberIdClean, 'মেম্বার আইডি')}
                className="font-mono text-xs text-white/90 bg-black/40 hover:bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors group cursor-pointer"
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
            <div className="relative z-10 space-y-3 pt-1">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
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

            {/* Front Security Ribbon */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>SECURED BY 256-BIT ENCRYPTION</span>
              </span>
              <span className="text-amber-400 font-bold tracking-wider">
                MAIL FACTORY BD
              </span>
            </div>
          </div>

          {/* Visual Stacked Separator */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-slate-700/80" />
            </div>
            <span className="relative px-3 py-1 rounded-full bg-slate-900 border border-slate-750 text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5 shadow-sm">
              <span>▼ {language === 'bn' ? 'পেছনের দিক (Back Side)' : 'Back Side'} ▼</span>
            </span>
          </div>

          {/* BACK CARD CONTAINER */}
          <div
            className={`w-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white space-y-4 relative overflow-hidden`}
          >
            {/* Magnetic Stripe */}
            <div className="h-10 sm:h-12 -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 bg-black/90 border-b border-white/10 flex items-center justify-end px-4">
              <span className="text-[8px] sm:text-[9px] font-mono text-white/40 tracking-widest">
                MF-ELECTRONIC-DATA-CARD-ISO7816-COMPLIANT
              </span>
            </div>

            {/* Signature Panel & Security Code */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[9px] text-white/50 uppercase font-semibold">
                কার্ডহোল্ডার স্বাক্ষর ও ভেরিফিকেশন কোড / Authorized Signature
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 sm:h-9 bg-white/95 rounded-lg px-3 flex items-center justify-between text-slate-900 font-mono font-bold text-xs italic tracking-wider shadow-inner">
                  <span className="truncate">{displayUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal not-italic">
                    {displayUser.joinedAt}
                  </span>
                </div>
                <div className="w-16 h-8 sm:h-9 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center font-mono text-amber-400 font-black text-xs">
                  CVC {displayUser.id.replace(/[^0-9]/g, '').slice(0, 3) || '786'}
                </div>
              </div>
            </div>

            {/* QR Code & Helpline */}
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

              {/* Dynamic QR Code */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 p-1.5 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <QrCode className="w-full h-full text-slate-950 stroke-[1.8]" />
              </div>
            </div>

            {/* Barcode & Footer */}
            <div className="space-y-1.5">
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
                <span className="text-emerald-400">SECURITY LEVEL: CLASS-A VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3D FLIP CARD VIEW */
        <div className="space-y-3">
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
              {/* FRONT SIDE */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className={`w-full h-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden`}
              >
                <div className={`absolute -top-12 -right-12 w-52 h-52 ${themeStyles.holo} rounded-full blur-3xl pointer-events-none`} />
                <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top Bar */}
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

                  <div className={`px-2.5 py-1 rounded-full ${themeStyles.badgeBg} border font-bold text-[10px] sm:text-xs flex items-center gap-1 shadow-sm`}>
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{isAdmin ? 'CLOUD ADMIN' : `${displayUser.tier.toUpperCase()} MEMBER`}</span>
                  </div>
                </div>

                {/* EMV Chip & Contactless Wave */}
                <div className="relative z-10 my-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-8 rounded-lg bg-gradient-to-tr ${themeStyles.chip} border flex flex-col justify-between p-1 shadow-md`}>
                      <div className="w-full h-1 bg-black/30 rounded" />
                      <div className="flex justify-between items-center gap-1">
                        <div className="w-2 h-2.5 rounded-sm bg-black/25" />
                        <div className="w-2 h-2.5 rounded-sm bg-black/25" />
                      </div>
                      <div className="w-full h-1 bg-black/30 rounded" />
                    </div>
                    <Wifi className="w-5 h-5 text-white/40 rotate-90" />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(memberIdClean, 'মেম্বার আইডি');
                    }}
                    className="font-mono text-xs text-white/90 bg-black/40 hover:bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors group"
                  >
                    <span className={themeStyles.accentText}>{memberIdClean}</span>
                    {copiedField === 'মেম্বার আইডি' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white/50 group-hover:text-white" />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
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

                  {/* 4 Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-white/10 text-xs">
                    <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                      <div className="text-[9px] text-white/50 font-semibold uppercase">যোগদান / Joined</div>
                      <div className="font-mono font-bold text-white text-[11px] truncate">{displayUser.joinedAt}</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                      <div className="text-[9px] text-white/50 font-semibold uppercase">রেফারেল কোড</div>
                      <div className={`font-mono font-bold ${themeStyles.accentText} text-[11px] truncate`}>{displayUser.referralCode}</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                      <div className="text-[9px] text-white/50 font-semibold uppercase">মেইল সেল্ড</div>
                      <div className="font-bold text-white text-[11px]">{displayUser.totalApprovedMails} টি</div>
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

                {/* Front Footer */}
                <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50 font-mono">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>SECURED BY 256-BIT ENCRYPTION</span>
                  </span>
                  <span className="text-amber-400 font-bold tracking-wider">MAIL FACTORY BD</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className={`absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br ${themeStyles.cardBg} border-2 ${themeStyles.border} p-5 sm:p-7 shadow-2xl text-white flex flex-col justify-between overflow-hidden`}
              >
                <div className="absolute top-4 left-0 right-0 h-10 sm:h-12 bg-black/90 border-y border-white/10 flex items-center justify-end px-4">
                  <span className="text-[8px] font-mono text-white/30 tracking-widest">
                    MF-ELECTRONIC-DATA-CARD-ISO7816
                  </span>
                </div>

                <div className="pt-10" />

                <div className="space-y-1.5 my-2">
                  <div className="text-[9px] text-white/50 uppercase font-semibold">
                    কার্ডহোল্ডার স্বাক্ষর ও ভেরিফিকেশন কোড / Authorized Signature
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 sm:h-9 bg-white/90 rounded-lg px-3 flex items-center justify-between text-slate-900 font-mono font-bold text-xs italic tracking-wider shadow-inner">
                      <span className="truncate">{displayUser.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal not-italic">{displayUser.joinedAt}</span>
                    </div>
                    <div className="w-14 h-8 sm:h-9 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center font-mono text-amber-400 font-black text-xs">
                      CVC {displayUser.id.replace(/[^0-9]/g, '').slice(0, 3) || '786'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 py-2 border-y border-white/10">
                  <div className="space-y-1 flex-1 text-[10px] text-white/70">
                    <p className="font-semibold text-white">মেইল ফ্যাক্টরি অফিসিয়াল মেম্বারশিপ সার্ভিস</p>
                    <p className="text-[9px] text-white/50 leading-relaxed">
                      এই ডিজিটাল কার্ডটি মেইল ফ্যাক্টরি প্ল্যাটফর্মের একজন নিবন্ধিত ও ভেরিফাইড মেম্বারের অনন্য পরিচয় বহন করে।
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                      <span className="text-sky-400">টেলিগ্রাম: @techlystb</span>
                      <span className="text-emerald-400">হেল্পলাইন: 24/7 সাপোর্ট</span>
                    </div>
                  </div>

                  <div className="w-16 h-16 sm:w-18 sm:h-18 p-1 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <QrCode className="w-full h-full text-slate-950 stroke-[1.8]" />
                  </div>
                </div>

                <div className="space-y-1.5">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-400 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                {isFlipped
                  ? language === 'bn' ? 'সামনের দিক দেখতে ট্যাপ করুন (Show Front)' : 'Show Front Side'
                  : language === 'bn' ? 'পেছনের দিক দেখতে ট্যাপ করুন (Show Back)' : 'Show Back Side'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ACTION TOOLBAR: PNG DOWNLOAD ONLY (NO PDF) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
        {/* Main Prominent PNG Download Button */}
        <button
          onClick={handleDownloadStackedPng}
          disabled={isDownloadingPng}
          className="sm:col-span-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-75"
        >
          {isDownloadingPng ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{language === 'bn' ? 'PNG তৈরি হচ্ছে...' : 'Generating PNG...'}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 stroke-[2.5]" />
              <div className="text-left flex items-center gap-2">
                <span>{language === 'bn' ? 'PNG ডাউনলোড (সামনে ও পেছনে)' : 'Download PNG (Front & Back)'}</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950/20 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  PNG Image
                </span>
              </div>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'শেয়ার করুন' : 'Share ID'}</span>
        </button>
      </div>

      {/* Member Benefits Information Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{language === 'bn' ? 'ডিজিটাল মেম্বারশিপের বিশেষ সুবিধাসমূহ:' : 'Member Card Benefits:'}</span>
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
