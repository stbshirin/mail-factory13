import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MailType, PaymentMethod, MailBatch } from '../types';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  HelpCircle,
  Copy,
  Check,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

export const SellersView: React.FC = () => {
  const {
    currentUser,
    platformSettings,
    submitMailBatch,
    mailBatches,
    showToast,
  } = useApp();

  const [mailType, setMailType] = useState<MailType>('fresh');
  const [rawText, setRawText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [payoutAccount, setPayoutAccount] = useState(currentUser.bKashNumber || currentUser.phone || '');
  const [shiftName, setShiftName] = useState(platformSettings.activeShift);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<MailBatch | null>(null);

  // Parse lines
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const parsedValid = lines.filter(l => {
    const parts = l.split(/[:\t, ]+/);
    return parts[0] && parts[0].includes('@') && parts[1] && parts[1].length >= 6;
  });

  // Current rate based on type
  let currentRate = platformSettings.mailBuyingRateFresh;
  if (mailType === 'recovery') currentRate = platformSettings.mailBuyingRateRecovery;
  else if (mailType === 'aged') currentRate = platformSettings.mailBuyingRateAged;
  else if (mailType === 'usa') currentRate = platformSettings.mailBuyingRateUsa;
  else if (mailType === 'edu') currentRate = platformSettings.mailBuyingRateEdu;

  const estimatedTotal = (parsedValid.length * currentRate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length < platformSettings.minMailSubmission) {
      showToast(`সর্বনিম্ন ${platformSettings.minMailSubmission}টি জিমেইল সাবমিট করতে হবে`, 'error');
      return;
    }
    if (!payoutAccount.trim()) {
      showToast('পেমেন্ট গ্রহণ করার একাউন্ট নাম্বার লিখুন', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = submitMailBatch({
      rawText,
      mailType,
      paymentMethod,
      payoutAccount,
      shiftName,
    });

    setIsSubmitting(false);
    if (success) {
      setRawText('');
    }
  };

  // Filter user's batches
  const myBatches = mailBatches.filter(b => b.userId === currentUser.id);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/50 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সেলার পোর্টাল (Seller Center)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            জিমেইল বিক্রি করুন (Sell Gmail)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            আপনার তৈরি করা ফ্রেশ অথবা রিকভারি জিমেইল সাবমিট করুন। অ্যাডমিন ভেরিফাই করে তাৎক্ষণিক আপনার ওয়ালেট ব্যালেন্সে টাকা যুক্ত করবে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>নতুন মেইল ব্যাচ সাবমিট করুন</span>
            </h2>

            {/* Step 1: Select Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                ১. মেইল ক্যাটাগরি নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMailType('fresh')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mailType === 'fresh'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">ফ্রেশ জিমেইল</div>
                  <div className="text-lg font-black text-amber-400 mt-1">
                    ৳{platformSettings.mailBuyingRateFresh.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">প্রতি পিস</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMailType('recovery')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mailType === 'recovery'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">রিকভারি জিমেইল</div>
                  <div className="text-lg font-black text-yellow-400 mt-1">
                    ৳{platformSettings.mailBuyingRateRecovery.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">প্রতি পিস</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMailType('aged')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mailType === 'aged'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">পুরাতন জিমেইল</div>
                  <div className="text-lg font-black text-sky-400 mt-1">
                    ৳{platformSettings.mailBuyingRateAged.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">২০১৯-২০২২</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMailType('usa')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mailType === 'usa'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">USA IP মেইল</div>
                  <div className="text-lg font-black text-emerald-400 mt-1">
                    ৳{platformSettings.mailBuyingRateUsa.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">USA Proxy</div>
                </button>
              </div>
            </div>

            {/* Step 2: Paste Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  ২. জিমেইল লিস্ট পেস্ট করুন (প্রতি লাইনে একটি করে):
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  ফরম্যাট: <span className="text-amber-400 font-bold">email:password:recovery</span>
                </span>
              </div>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={`example1@gmail.com:Pass#1234:recovery1@outlook.com
example2@gmail.com:Secret!2026:recovery2@outlook.com
example3@gmail.com:UserPass99:recovery3@outlook.com`}
                rows={8}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />

              {/* Real-time counters */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    মোট লাইন: <strong className="text-white">{lines.length}</strong>
                  </span>
                  <span className="text-slate-400">
                    ভ্যালিড ফরম্যাট: <strong className="text-emerald-400">{parsedValid.length}</strong>
                  </span>
                  {lines.length - parsedValid.length > 0 && (
                    <span className="text-amber-400">
                      ইনভ্যালিড: {lines.length - parsedValid.length}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-slate-400">সম্ভাব্য মোট উপার্জন: </span>
                  <span className="text-base font-black text-amber-400">৳{estimatedTotal}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Payout Account & Shift Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  ৩. পেমেন্ট মেথড ও নাম্বার:
                </label>
                <div className="flex gap-2 mb-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        paymentMethod === method
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={payoutAccount}
                  onChange={e => setPayoutAccount(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  ৪. বর্তমান রিভিউ শিফট:
                </label>
                <input
                  type="text"
                  value={shiftName}
                  onChange={e => setShiftName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-semibold focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  শিফট চলাকালীন সময়ে দ্রুত ভেরিফাই করে পে করা হয়।
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || lines.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 stroke-[2.5]" />
              <span>মেইল ব্যাচ জমা দিন (Submit Batch)</span>
            </button>
          </form>
        </div>

        {/* Right Col: Guidelines & Instructions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>মেইল তৈরির নিয়মাবলী ও গাইডলাইন</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">১. রিকভারি মেইল:</strong>
                প্রতিটি জিমেইলে অবশ্যই আউটলুক (Outlook) অথবা ইয়াহু (Yahoo) রিকভারি মেইল যুক্ত থাকতে হবে।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">২. টু-ফ্যাক্টর অথেনটিকেশন (2FA):</strong>
                মেইলে কোনো ফোন নাম্বার বা ২-ফ্যাক্টর কোড অন রাখা যাবে না।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">৩. ইউনিক পাসওয়ার্ড:</strong>
                কমপক্ষে ৮ অক্ষরের স্ট্রং পাসওয়ার্ড ব্যবহার করুন (e.g. Pass#2026Secure)।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-0.5">৪. নাম ও ইউজারনেম:</strong>
                ইংলিশ রিয়েল নাম ব্যবহার করবেন, কোনো এলোমেলো বর্ণ (e.g. asdfg991) নয়।
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">তাৎক্ষণিক পেমেন্ট পলিসি</h4>
            <p className="text-xs text-slate-400 mt-1">
              ব্যাচ অ্যাপ্রুভ হওয়ামাত্র টাকা ওয়ালেটে যুক্ত হবে। এরপর যেকোনো সময় বিকাশ/নগদে উইথড্র দিতে পারবেন।
            </p>
          </div>
        </div>
      </div>

      {/* Seller Batch History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-black text-white mb-4 flex items-center justify-between">
          <span>আমার সাবমিটকৃত ব্যাচ হিস্ট্রি</span>
          <span className="text-xs font-normal text-slate-400">মোট ব্যাচ: {myBatches.length}টি</span>
        </h2>

        {myBatches.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            এখনো কোনো মেইল ব্যাচ সাবমিট করেননি। উপরে ফরম পূরণ করে প্রথম ব্যাচ সাবমিট করুন।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">ব্যাচ আইডি</th>
                  <th className="py-3 px-4 font-semibold">ক্যাটাগরি</th>
                  <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                  <th className="py-3 px-4 font-semibold">রেট</th>
                  <th className="py-3 px-4 font-semibold">মোট মূল্য</th>
                  <th className="py-3 px-4 font-semibold">পেমেন্ট মেথড</th>
                  <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
                  <th className="py-3 px-4 font-semibold">সময়</th>
                  <th className="py-3 px-4 font-semibold text-right">ডিটেইলস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {myBatches.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{b.id}</td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-amber-400">{b.mailType}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{b.validMailsCount} টি</td>
                    <td className="py-3.5 px-4 text-slate-400">৳{b.pricePerMail.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">৳{b.totalAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {b.paymentMethod} ({b.payoutAccount})
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Approved
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⏳ Review Pending
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(b.submittedAt).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBatchDetails(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        দেখুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatchDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedBatchDetails.batchName}</h3>
                <p className="text-xs text-slate-400 font-mono">আইডি: {selectedBatchDetails.id}</p>
              </div>
              <button
                onClick={() => setSelectedBatchDetails(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60">
                <span className="text-slate-400 block">স্ট্যাটাস:</span>
                <span className="font-bold text-amber-400 uppercase">{selectedBatchDetails.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60">
                <span className="text-slate-400 block">মোট প্রদেয় টাকা:</span>
                <span className="font-bold text-emerald-400">৳{selectedBatchDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {selectedBatchDetails.rejectReason && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <strong>রিজেক্ট কারণ:</strong> {selectedBatchDetails.rejectReason}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                সাবমিটকৃত মেইল তালিকা ({selectedBatchDetails.mails.length}টি):
              </label>
              <div className="max-h-56 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1">
                {selectedBatchDetails.mails.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                    <span>
                      {m.email}:{m.password}:{m.recoveryEmail}
                    </span>
                    <span className="text-[10px] text-emerald-400">✓ Valid</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedBatchDetails(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
