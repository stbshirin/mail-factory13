import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Zap,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    firebaseLoginWithEmail,
    firebaseRegisterWithEmail,
    firebaseLoginWithGoogle,
    firebaseResetPassword,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setResetSent(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { color: 'bg-slate-300 dark:bg-slate-700', width: '0%' };
    if (pass.length < 6) return { color: 'bg-rose-500', width: '33%' };
    if (pass.length < 9) return { color: 'bg-amber-500', width: '66%' };
    return { color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('অনুগ্রহ করে জিমেইল এবং পাসওয়ার্ড প্রদান করুন।');
          setIsLoading(false);
          return;
        }
        const res = await firebaseLoginWithEmail(email.trim(), password);
        if (res.success) {
          showToast('সফলভাবে লগইন হয়েছে!', 'success');
          onClose();
        } else {
          setErrorMessage(res.message || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
        }
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          setErrorMessage('অনুগ্রহ করে নাম, জিমেইল এবং পাসওয়ার্ড পূরণ করুন।');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ ডিজিটের হতে হবে।');
          setIsLoading(false);
          return;
        }
        if (confirmPassword && password !== confirmPassword) {
          setErrorMessage('পাসওয়ার্ড দুটি মিলছে না!');
          setIsLoading(false);
          return;
        }
        if (!agreeTerms) {
          setErrorMessage('অনুগ্রহ করে শর্তাবলীতে সম্মতি দিন।');
          setIsLoading(false);
          return;
        }
        const res = await firebaseRegisterWithEmail(email.trim(), password, name.trim(), phone.trim());
        if (res.success) {
          showToast(res.message || 'রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে! ৳২৫ বোনাস যুক্ত হয়েছে।', 'success');
          onClose();
        } else {
          setErrorMessage(res.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('পাসওয়ার্ড রিসেট করতে জিমেইল ঠিকানা দিন।');
          setIsLoading(false);
          return;
        }
        const res = await firebaseResetPassword(email.trim());
        if (res.success) {
          setResetSent(true);
          showToast('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে!', 'success');
        } else {
          setErrorMessage(res.message || 'পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে।');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await firebaseLoginWithGoogle();
      if (res.success) {
        showToast('গুগল দিয়ে সফলভাবে লগইন হয়েছে!', 'success');
        onClose();
      } else {
        setErrorMessage(res.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'গুগল সাইন-ইন করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative max-h-[92vh] overflow-y-auto">
        {/* Header - Gradient with Brand, Close, and Trust Badges */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl mx-auto mb-2 shadow-md border border-white/20 bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Mail className="w-7 h-7 text-amber-300 stroke-[2.5]" />
          </div>

          <h3 className="text-lg font-black tracking-tight">
            {mode === 'login' && 'স্বাগতম Mail Factory তে'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'পাসওয়ার্ড রিসেট করুন'}
          </h3>

          <p className="text-xs text-indigo-200 mt-0.5 font-medium">
            {mode === 'login' && 'নিরাপদে জিমেইল বিক্রি করুন ও ক্যাশ পেমেন্ট নিন'}
            {mode === 'register' && 'Bangladesh #1 Trusted Gmail Exchange Platform'}
            {mode === 'forgot' && 'আপনার অ্যাকাউন্টের জিমেইল ঠিকানা দিন'}
          </p>

          <div className="flex justify-center gap-4 mt-3 text-[10px] text-white/90 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Trusted
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Instant
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              50K+ Users
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Google Sign-In Button */}
          {mode !== 'forgot' && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>
          )}

          {/* Divider */}
          {mode !== 'forgot' && (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] font-bold">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span>অথবা ইমেইল দিয়ে</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>
          )}

          {/* Alert Messages */}
          {resetSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে!</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                আমরা <span className="font-bold text-emerald-700 dark:text-emerald-300">{email}</span> ঠিকানায় লিঙ্ক পাঠিয়েছি।
              </p>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400">💡 গুরুত্বপূর্ণ নির্দেশিকা:</div>
                <div>• আপনার Gmail এর <strong>Primary Inbox</strong> চেক করুন।</div>
                <div>• ইনবক্সে না পেলে অবশ্যই <strong>Spam / Junk (স্প্যাম)</strong> অথবা <strong>All Mail</strong> ফোল্ডারটি চেক করুন।</div>
                <div>• ইমেইলের ভেতর দেওয়া লিঙ্কে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন।</div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    পুরো নাম
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 pl-9"
                    />
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 pl-9"
                    />
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                জিমেইল এড্রেস
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 pl-9"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 pl-9 pr-9"
                  />
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {mode === 'register' && password && (
                  <div className="mt-1.5">
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  কনফার্ম পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 pl-9"
                  />
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer font-medium">
                    I agree to the Terms & Conditions (শর্তাবলী মেনে নিচ্ছি)
                  </label>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
                  ✉️ রেজিস্ট্রেশন শেষে আপনার ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডারে ভেরিফিকেশন লিঙ্ক পাঠানো হবে।
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white text-xs font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading
                ? 'Connecting...'
                : mode === 'login'
                ? 'লগইন'
                : mode === 'register'
                ? 'Create Account (Get ৳25 Bonus)'
                : 'পাসওয়ার্ড রিসেট লিংক পাঠান'}
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' ? (
              <p>
                একাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                >
                  রেজিস্ট্রেশন
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                আগে থেকেই একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                >
                  লগইন
                </button>
              </p>
            ) : (
              <p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← লগইন স্ক্রিনে ফিরে যান
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
