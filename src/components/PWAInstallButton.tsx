import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Share, PlusSquare, Monitor, HelpCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'footer' | 'pill' | 'header';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'footer',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guidePlatform, setGuidePlatform] = useState<'ios' | 'android' | 'desktop'>('android');

  const handleInstallClick = async () => {
    if (isIOS) {
      setGuidePlatform('ios');
      setShowGuideModal(true);
      return;
    }

    if (isInstallable) {
      const result = await install();
      if (result === 'accepted') {
        return;
      }
    }

    // If install prompt couldn't trigger directly (e.g. preview iframe, already dismissed, or desktop)
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    setGuidePlatform(isMobile ? 'android' : 'desktop');
    setShowGuideModal(true);
  };

  if (isInstalled) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs ${className}`}
        title="অ্যাপ্লিকেশনটি ইতোমধ্যে ইনস্টল্ড অবস্থায় চলছে"
      >
        <Check className="w-3.5 h-3.5" />
        <span>অ্যাপ ইনস্টল্ড (Installed)</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:shadow-lg transition-all active:scale-95 ${className}`}
        title="MailFactory মোবাইল বা ডেক্সটপ অ্যাপ হিসেবে ইনস্টল করুন"
      >
        <Smartphone className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span>অ্যাপ ইনস্টল করুন (PWA)</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
      </button>

      {/* Installation Guide Modal (for iOS or browsers needing manual Home Screen addition) */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">অ্যাপ ইনস্টলেশন গাইড</h3>
                  <p className="text-[11px] text-slate-400">MailFactory PWA ইন্সটল করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setGuidePlatform('android')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  guidePlatform === 'android' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Android / Chrome
              </button>
              <button
                onClick={() => setGuidePlatform('ios')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  guidePlatform === 'ios' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                onClick={() => setGuidePlatform('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  guidePlatform === 'desktop' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Computer / PC
              </button>
            </div>

            {/* Instructions Body */}
            {guidePlatform === 'ios' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="text-amber-400 font-semibold text-[11px]">
                  অ্যাপল ডিভাইসে Safari ব্রাউজার ব্যবহার করুন:
                </p>
                <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
                  <li>
                    সাফারি ব্রাউজারের নিচে থাকা <strong className="text-white">Share (শেয়ার)</strong> বাটনে ক্লিক করুন।
                  </li>
                  <li>
                    নিচে স্ক্রোল করে <strong className="text-white">"Add to Home Screen"</strong> অপশনে চাপুন।
                  </li>
                  <li>
                    উপরে ডানপাশে <strong className="text-emerald-400 font-bold">"Add"</strong> বাটনে ক্লিক করলেই আপনার ফোনে অফিশিয়াল অ্যাপ হিসেবে ইন্সটল হয়ে যাবে!
                  </li>
                </ol>
              </div>
            )}

            {guidePlatform === 'android' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="text-amber-400 font-semibold text-[11px]">
                  Android ডিভাইসে Google Chrome ব্যবহার করুন:
                </p>
                <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
                  <li>
                    ব্রাউজারের উপরের ডান কোণায় <strong className="text-white">তিনটি ডট (⋮)</strong> মেনু চাপুন।
                  </li>
                  <li>
                    <strong className="text-white">"Install app"</strong> অথবা <strong className="text-white">"Add to Home screen"</strong> সিলেক্ট করুন।
                  </li>
                  <li>
                    <strong className="text-emerald-400 font-bold">Install</strong> চাপুন। কয়েক সেকেন্ডে অ্যাপ আইকন আপনার মোবাইলের হোম স্ক্রিনে চলে আসবে।
                  </li>
                </ol>
              </div>
            )}

            {guidePlatform === 'desktop' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="text-amber-400 font-semibold text-[11px]">
                  ডেক্সটপ / ল্যাপটপ ব্রাউজারে:
                </p>
                <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
                  <li>
                    Chrome বা Edge ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা <strong className="text-white">Install (⊕)</strong> আইকনে ক্লিক করুন।
                  </li>
                  <li>
                    অথবা ব্রাউজার মেনু <strong className="text-white">(⋮) &gt; Cast, save, and share &gt; Install Mail Factory</strong> চাপুন।
                  </li>
                  <li>
                    সরাসরি আলাদা উইন্ডোতে ফুলস্ক্রিন ফাস্ট অ্যাপ উপভোগ করুন।
                  </li>
                </ol>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs transition-colors"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
