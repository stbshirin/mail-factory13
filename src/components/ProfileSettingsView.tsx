import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import {
  User,
  ShieldCheck,
  Phone,
  CreditCard,
  Save,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Award,
  TrendingUp,
  Wallet,
  KeyRound,
  Send,
  LogOut,
  Mail,
  HelpCircle,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

const AVATAR_PRESETS = [
  {
    id: 'avatar-1',
    label: 'Cyber Trader',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Elite VIP',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Pro Gamer',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Tech Master',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    label: 'Gold Specialist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    label: 'Verified Member',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  },
];

export const ProfileSettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    showToast,
    setActiveTab,
    isAdmin,
    language,
    firebaseResetPassword,
    firebaseLogout,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'edit' | 'payment' | 'security'>('overview');

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bKashNumber, setBKashNumber] = useState(currentUser.bKashNumber || '');
  const [nagadNumber, setNagadNumber] = useState(currentUser.nagadNumber || '');
  const [rocketNumber, setRocketNumber] = useState(currentUser.rocketNumber || '');
  const [telegram, setTelegram] = useState(currentUser.telegram || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  // Photo state
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const memberIdClean = `MF-${currentUser.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase() || '789123'}`;

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(language === 'bn' ? `${label} কপি করা হয়েছে!` : `${label} copied!`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast(language === 'bn' ? 'কপি ব্যর্থ হয়েছে' : 'Copy failed', 'error');
    }
  };

  // Client-side image compression
  const processImageFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(
        language === 'bn' ? 'অনুগ্রহ করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন' : 'Please choose a valid image file',
        'error'
      );
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(
        language === 'bn' ? 'ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে' : 'Image size must be less than 8MB',
        'error'
      );
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressed);
          updateUserProfile({ avatarUrl: compressed });
          showToast(
            language === 'bn'
              ? 'প্রোফাইল ছবি সফলভাবে আপলোড ও সেভ করা হয়েছে!'
              : 'Profile photo uploaded and saved successfully!',
            'success'
          );
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        showToast(language === 'bn' ? 'ছবি প্রসেসিংয়ে সমস্যা হয়েছে' : 'Failed to process image', 'error');
        setIsUploading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyPreset = (url: string) => {
    setAvatarUrl(url);
    updateUserProfile({ avatarUrl: url });
    showToast(
      language === 'bn' ? 'অবতার ছবি সফলভাবে পরিবর্তন করা হয়েছে!' : 'Avatar updated successfully!',
      'success'
    );
  };

  const handleApplyCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setAvatarUrl(customImageUrl.trim());
    updateUserProfile({ avatarUrl: customImageUrl.trim() });
    setCustomImageUrl('');
    setShowUrlInput(false);
    showToast(
      language === 'bn' ? 'কাস্টম ইমেজ লিংক সফলভাবে সেভ করা হয়েছে!' : 'Custom image URL saved!',
      'success'
    );
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    updateUserProfile({ avatarUrl: '' });
    showToast(
      language === 'bn' ? 'প্রোফাইল ছবি সরিয়ে ডিফল্ট করা হয়েছে' : 'Profile photo reset to default',
      'info'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      bKashNumber,
      nagadNumber,
      rocketNumber,
      telegram,
      bio,
    });
    showToast(
      language === 'bn'
        ? 'আপনার প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!'
        : 'Profile details saved successfully!',
      'success'
    );
  };

  const handleSendPasswordReset = async () => {
    if (!currentUser.email) return;
    setIsSendingReset(true);
    const res = await firebaseResetPassword(currentUser.email);
    setIsSendingReset(false);
    if (res.success) {
      showToast(
        language === 'bn'
          ? `পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে: ${currentUser.email}`
          : `Password reset link sent to ${currentUser.email}`,
        'success'
      );
    } else {
      showToast(res.message || (language === 'bn' ? 'রিসেট ব্যর্থ হয়েছে' : 'Failed to send reset'), 'error');
    }
  };

  // Tier color & badges
  const tierColor =
    currentUser.memberTier === 'Diamond'
      ? 'from-cyan-400 to-blue-500 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20'
      : currentUser.memberTier === 'Gold'
      ? 'from-amber-400 to-yellow-500 text-amber-300 border-amber-500/40 shadow-amber-500/20'
      : currentUser.memberTier === 'Silver'
      ? 'from-slate-300 to-slate-400 text-slate-200 border-slate-400/40 shadow-slate-500/20'
      : 'from-amber-700 to-amber-800 text-amber-300 border-amber-700/40 shadow-amber-700/20';

  const approvalRate =
    currentUser.totalSubmittedMails > 0
      ? Math.round((currentUser.totalApprovedMails / currentUser.totalSubmittedMails) * 100)
      : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? 'ইউনিক মেম্বার প্রোফাইল' : 'Member Profile & Identity'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {currentUser.memberTier || 'Silver'} VIP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'ব্যক্তিগত পরিচিতি, কাস্টম ছবি আপলোড, পেমেন্ট অ্যাকাউন্ট ও সিকিউরিটি ব্যবস্থাপনা'
              : 'Manage your profile photo, payout accounts, performance badges, and security settings'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('idcard')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Card'}</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Wallet'}</span>
          </button>
        </div>
      </div>

      {/* UNIQUE HERO PROFILE BANNER WITH PHOTO UPLOAD */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Dynamic Glowing Cover Mesh */}
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-amber-600/30 via-purple-600/25 to-sky-600/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.25),transparent_60%)]" />
          <div className="absolute bottom-2 right-4 text-[10px] font-mono font-bold text-slate-400/80 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified System ID: {memberIdClean}</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-14 mb-6">
            {/* Left: Avatar with interactive photo upload overlay */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative group rounded-3xl p-1 bg-slate-950 border-2 transition-all ${
                  isDragging
                    ? 'border-amber-400 scale-105 shadow-2xl shadow-amber-500/30'
                    : 'border-slate-800 shadow-xl'
                }`}
              >
                {/* Avatar Display */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-4xl shadow-inner">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  {/* Uploading Spinner Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1 text-amber-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="text-[10px] font-bold">আপলোড হচ্ছে...</span>
                    </div>
                  )}

                  {/* Hover Upload Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white p-2 text-center"
                    title={language === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload photo'}
                  >
                    <Camera className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-[10px] font-bold leading-tight">
                      {language === 'bn' ? 'ছবি পরিবর্তন' : 'Change Photo'}
                    </span>
                  </div>
                </div>

                {/* Floating Quick Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
                  title={language === 'bn' ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload from device'}
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* User Bio & Titles */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${tierColor}`}
                  >
                    {currentUser.memberTier || 'Silver'}
                  </span>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
                  <span className="font-mono">{currentUser.email}</span>
                  <span>•</span>
                  <span>{currentUser.phone || '+880 17XXXXXXXX'}</span>
                </div>

                {currentUser.bio && (
                  <p className="text-xs text-slate-300 max-w-md pt-1 italic font-light">
                    "{currentUser.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick ID & Referral Badges with Copy Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleCopy(memberIdClean, 'মেম্বার আইডি')}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="মেম্বার আইডি কপি করুন"
              >
                <span className="text-slate-500">ID:</span>
                <span className="font-bold text-white">{memberIdClean}</span>
                {copiedField === 'মেম্বার আইডি' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => handleCopy(currentUser.referralCode, 'রেফারেল কোড')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="রেফারেল কোড কপি করুন"
              >
                <span className="text-amber-400/70">Ref:</span>
                <span className="font-bold">{currentUser.referralCode}</span>
                {copiedField === 'রেফারেল কোড' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          {/* PHOTO UPLOAD & AVATAR GALLERY SECTION */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? 'ছবি ও অবতার কাস্টমাইজেশন:' : 'Photo & Avatar Customization:'}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {language === 'bn' ? '(ডিভাইস থেকে আপলোড করুন বা অবতার বাছুন)' : '(Upload photo or choose preset)'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{language === 'bn' ? 'ডিভাইস থেকে আপলোড' : 'Upload Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>{language === 'bn' ? 'ইমেজ লিংক' : 'Image URL'}</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title={language === 'bn' ? 'ছবি রিমুভ করুন' : 'Remove photo'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'রিমুভ' : 'Remove'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Custom URL Input Accordion */}
            {showUrlInput && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                >
                  {language === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
                </button>
              </div>
            )}

            {/* Curated Presets Grid */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                {language === 'bn' ? 'অথবা দ্রুত সিলেক্ট করুন প্রিসেট অবতার:' : 'Or choose a preset avatar:'}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_PRESETS.map(preset => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset.url)}
                      className={`group relative p-1 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 scale-102'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[70px]">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'bn' ? 'ওভারভিউ ও পারফরম্যান্স' : 'Overview & Stats'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('edit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'edit'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payment')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'payment'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{language === 'bn' ? 'পেমেন্ট ও উইথড্র অ্যাকাউন্ট' : 'Payout Accounts'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'security'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{language === 'bn' ? 'নিরাপত্তা ও সেটিংস' : 'Security & Settings'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PERFORMANCE */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric 4-Card Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Total Earnings */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'bn' ? 'মোট উপার্জিত টাকা' : 'Total Earnings'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                ৳{(currentUser.totalEarnings || 0).toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 block">
                {language === 'bn' ? 'আজীবন মেইল বিক্রয়' : 'Lifetime Sales'}
              </span>
            </div>

            {/* Current Wallet */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'bn' ? 'উইথড্রযোগ্য ব্যালেন্স' : 'Available Balance'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                ৳{(currentUser.balanceBdt || 0).toFixed(2)}
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">
                ${(currentUser.balanceUsd || 0).toFixed(2)} USD
              </span>
            </div>

            {/* Total Mails Submitted */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'bn' ? 'মোট মেইল সাবমিট' : 'Submitted Mails'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-sky-400">
                {currentUser.totalSubmittedMails || 0}টি
              </div>
              <span className="text-[10px] text-slate-500 block">
                {currentUser.totalApprovedMails || 0}টি ভেরিফায়েড
              </span>
            </div>

            {/* Referral Earnings */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'bn' ? 'রেফারেল কমিশন' : 'Referral Bonus'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                ৳{(currentUser.referralEarnings || 0).toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 block">৫% আজীবন বোনাস</span>
            </div>
          </div>

          {/* Member Tier Progression Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {language === 'bn'
                      ? `${currentUser.memberTier || 'Silver'} মেম্বারশিপ লেভেল`
                      : `${currentUser.memberTier || 'Silver'} VIP Membership`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'অ্যাপ্রুভড মেইলের সংখ্যার ভিত্তিতে বোনাস ও স্পেশাল শিফট সুবিধা বাড়ে'
                      : 'Tier unlocks higher shift rates, instant withdrawal priority, and special bonuses'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                সাকসেস রেট: {approvalRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{currentUser.memberTier || 'Silver'}</span>
                <span>
                  {currentUser.memberTier === 'Diamond'
                    ? 'সর্বোচ্চ স্তর অর্জিত!'
                    : 'পরবর্তী স্তর: Gold VIP (৫০+ মেইল)'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(15, ((currentUser.totalApprovedMails || 0) / 50) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">ইনস্ট্যান্ট ৩ মিনিটে উইথড্র প্রসেসিং</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">নাইট শিফটে সর্বোচ্চ রেট বোনাস</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">প্রাইমারি ২৪/৭ সাপোর্ট টিকিট এক্সেস</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL INFO FORM */}
      {activeSubTab === 'edit' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
        >
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'ব্যক্তিগত তথ্য পরিবর্তন' : 'Edit Personal Details'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn'
                  ? 'আপনার নাম, মোবাইল নাম্বার এবং যোগাযোগ সংক্রান্ত তথ্য হালনাগাদ করুন'
                  : 'Update your display name, phone number, and telegram handle'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'bn' ? 'পূর্ণ নাম (Full Name): *' : 'Full Name: *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'মোবাইল নাম্বার:' : 'Phone Number:'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'টেলিগ্রাম ইউজারনেম (ঐচ্ছিক):' : 'Telegram Handle (Optional):'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">@</span>
                  <input
                    type="text"
                    value={telegram}
                    onChange={e => setTelegram(e.target.value)}
                    placeholder="my_telegram_user"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'bn' ? 'সংক্ষিপ্ত বায়ো / স্ট্যাটাস নোট:' : 'Short Bio / Seller Note:'}
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: এক্টিভ ফ্রেশ জিমেইল সেলার ও রেগুলার বায়ার'
                    : 'e.g., Active Gmail seller and trusted partner'
                }
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'bn' ? 'লগইন ইমেইল ঠিকানা (পরিবর্তন অযোগ্য):' : 'Linked Email Address:'}
              </label>
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 text-xs font-mono">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="flex-1 truncate">{currentUser.email}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  ভেরিফায়েড
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'তথ্য আপডেট সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PAYOUT ACCOUNTS */}
      {activeSubTab === 'payment' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
        >
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'পেমেন্ট ও উইথড্র নম্বর ব্যবস্থাপনা' : 'Payout Accounts & Payment Numbers'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'মেইল বিক্রি করে আয় করা টাকা দ্রুত পেতে আপনার পার্সোনাল বিকাশ ও নগদ নম্বর যোগ করুন'
                : 'Configure your personal payout numbers for 3-minute instant automatic withdrawals'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>বিকাশ পার্সোনাল নম্বর (bKash Personal):</span>
              </label>
              <input
                type="text"
                value={bKashNumber}
                onChange={e => setBKashNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>নগদ পার্সোনাল নম্বর (Nagad Personal):</span>
              </label>
              <input
                type="text"
                value={nagadNumber}
                onChange={e => setNagadNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>রকেট নম্বর (Rocket Personal / Optional):</span>
              </label>
              <input
                type="text"
                value={rocketNumber}
                onChange={e => setRocketNumber(e.target.value)}
                placeholder="01XXXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'bn'
                ? 'পেমেন্ট তথ্যের গোপনীয়তা ১০০% সুরক্ষিত। উইথড্র রিকোয়েস্ট দেওয়ার সাথে সাথে অ্যাডমিন উক্ত নাম্বারে সরাসরি টাকা ট্রান্সফার করবে।'
                : 'Your payout details are encrypted and safe. Auto-withdrawal sends funds directly to these accounts.'}
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'পেমেন্ট নম্বর সেভ করুন' : 'Save Payout Details'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SECURITY & SETTINGS */}
      {activeSubTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'অ্যাকাউন্ট নিরাপত্তা ও আইডি কার্ড' : 'Account Security & Member Card'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'পাসওয়ার্ড রিসেট লিংক, ডিজিটাল মেম্বার কার্ড ও সিকিউরিটি কনফিগারেশন'
                : 'Security controls, password reset, and official digital member card'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Digital ID Card Preview / Access */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'অফিসিয়াল ডিজিটাল আইডি কার্ড' : 'Official Digital Member ID Card'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'ভেরিফাইড মেম্বার আইডি কার্ড ডাউনলোড বা শেয়ার করুন'
                      : 'View, flip, customize theme, and download your member ID card'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('idcard')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>{language === 'bn' ? 'আইডি কার্ড ওপেন করুন' : 'Open ID Card'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Password Reset */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'পাসওয়ার্ড রিসেট বা পরিবর্তন' : 'Change or Reset Password'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {currentUser.email} {language === 'bn' ? 'ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হবে' : 'will receive a reset email'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSendPasswordReset}
                disabled={isSendingReset}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isSendingReset
                    ? language === 'bn'
                      ? 'পাঠানো হচ্ছে...'
                      : 'Sending...'
                    : language === 'bn'
                    ? 'রিসেট লিংক পাঠান'
                    : 'Send Reset Link'}
                </span>
              </button>
            </div>

            {/* Logout */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'অ্যাকাউন্ট থেকে লগআউট' : 'Sign Out of Account'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'নিরাপদে বর্তমান সেশন শেষ করে অতিথি মোডে ফিরে যান'
                      : 'Securely end your session on this device'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await firebaseLogout();
                  showToast(
                    language === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে' : 'Logged out successfully',
                    'info'
                  );
                  setActiveTab('home');
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
