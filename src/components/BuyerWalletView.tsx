import React from 'react';
import { useApp } from '../AppContext';
import {
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const BuyerWalletView: React.FC = () => {
  const { currentUser, setActiveTab, transactions } = useApp();

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  const totalDeposited = userTransactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = userTransactions
    .filter(t => t.type === 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main BDT Balance Card */}
        <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  মেইন অ্যাকাউন্ট ব্যালেন্স
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentUser.memberTier} Tier
                </span>
              </div>
              <div className="mt-4 text-3xl sm:text-5xl font-black text-white">
                ৳{currentUser.balanceBdt.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                সমপরিমাণ USD: <strong className="text-slate-200">${(currentUser.balanceBdt / 122.5).toFixed(2)} USD</strong>
              </p>
            </div>

            {/* Quick Wallet Actions */}
            <div className="mt-8 pt-6 border-t border-slate-700/70 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>টাকা যোগ করুন (ডিপোজিট)</span>
              </button>

              <button
                onClick={() => setActiveTab('withdraw')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>উইথড্র / ক্যাশআউট</span>
              </button>

              <button
                onClick={() => setActiveTab('exchange')}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                <span>কারেন্সি এক্সচেঞ্জ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary USD Balance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ইউএসডি ওয়ালেট (USD)
            </span>
            <div className="mt-4 text-3xl font-black text-emerald-400">
              ${currentUser.balanceUsd.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Binance / Crypto ব্যালেন্স</p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">মোট ডিপোজিট:</span>
                <span className="font-bold text-white">৳{totalDeposited.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">মোট উইথড্র:</span>
                <span className="font-bold text-white">৳{totalWithdrawn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">মোট সেলিং আয়:</span>
                <span className="font-bold text-amber-400">৳{currentUser.totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('transactions')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            সম্পূর্ণ লেনদেন হিস্ট্রি দেখুন
          </button>
        </div>
      </div>

      {/* Recent Ledger History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>সাম্প্রতিক ওয়ালেট লেনদেন</span>
          </h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            সব লেনদেন
          </button>
        </div>

        {userTransactions.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            এখনো কোনো লেনদেন সম্পন্ন হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">ধরণ</th>
                  <th className="py-3 px-4 font-semibold">মেথড</th>
                  <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                  <th className="py-3 px-4 font-semibold">TrxID / একাউন্ট</th>
                  <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
                  <th className="py-3 px-4 font-semibold text-right">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {userTransactions.slice(0, 6).map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      {trx.type === 'deposit' && <span className="font-bold text-sky-400">+ ডিপোজিট</span>}
                      {trx.type === 'withdraw' && <span className="font-bold text-rose-400">- উইথড্র</span>}
                      {trx.type === 'mail_sale' && <span className="font-bold text-emerald-400">+ মেইল বিক্রি</span>}
                      {trx.type === 'marketplace_buy' && <span className="font-bold text-amber-400">- মেইল ক্রয়</span>}
                      {trx.type === 'exchange' && <span className="font-bold text-purple-400">এক্সচেঞ্জ</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{trx.method}</td>
                    <td className="py-3 px-4 font-black text-sm text-white">
                      {trx.type === 'deposit' || trx.type === 'mail_sale' ? '+' : '-'}৳{trx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {trx.trxId || trx.accountNumber || trx.adminNote || 'System'}
                    </td>
                    <td className="py-3 px-4">
                      {trx.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Completed
                        </span>
                      )}
                      {trx.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⏳ Pending
                        </span>
                      )}
                      {trx.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(trx.createdAt).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
