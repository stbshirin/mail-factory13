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
  Shield,
} from 'lucide-react';
import { maskPhoneNumber } from '../utils/maskUtils';

export const BuyerWalletView: React.FC = () => {
  const { currentUser, setActiveTab, transactions, language } = useApp();

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
                  {language === 'bn' ? 'মেইন একাউন্ট ব্যালেন্স' : 'Main Account Balance'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentUser.memberTier} Tier
                </span>
              </div>
              <div className="mt-4 text-3xl sm:text-5xl font-black text-white">
                ৳{currentUser.balanceBdt.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' ? 'সমপরিমাণ USD: ' : 'Equivalent USD: '}
                <strong className="text-slate-200">${(currentUser.balanceBdt / 122.5).toFixed(2)} USD</strong>
              </p>
            </div>

            {/* Quick Wallet Actions */}
            <div className="mt-8 pt-6 border-t border-slate-700/70 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{language === 'bn' ? 'টাকা যোগ করুন (ডিপোজিট)' : 'Add Funds (Deposit)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('withdraw')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'উইথড্র / ক্যাশআউট' : 'Withdraw / Cashout'}</span>
              </button>

              <button
                onClick={() => setActiveTab('exchange')}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                <span>{language === 'bn' ? 'কারেন্সি এক্সচেঞ্জ' : 'Currency Exchange'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary USD Balance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'ইউএসডি ওয়ালেট (USD)' : 'USD Wallet (USD)'}
            </span>
            <div className="mt-4 text-3xl font-black text-emerald-400">
              ${currentUser.balanceUsd.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn' ? 'Binance / Crypto ব্যালেন্স' : 'Binance / Crypto Balance'}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">{language === 'bn' ? 'মোট ডিপোজিট:' : 'Total Deposited:'}</span>
                <span className="font-bold text-white">৳{totalDeposited.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">{language === 'bn' ? 'মোট উইথড্র:' : 'Total Withdrawn:'}</span>
                <span className="font-bold text-white">৳{totalWithdrawn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">{language === 'bn' ? 'মোট সেলিং আয়:' : 'Total Selling Earnings:'}</span>
                <span className="font-bold text-amber-400">৳{currentUser.totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('transactions')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {language === 'bn' ? 'সম্পূর্ণ লেনদেন হিস্ট্রি দেখুন' : 'View Full Transaction History'}
          </button>
        </div>
      </div>

      {/* Recent Ledger History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>{language === 'bn' ? 'সাম্প্রতিক ওয়ালেট লেনদেন' : 'Recent Wallet Transactions'}</span>
          </h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            {language === 'bn' ? 'সব লেনদেন' : 'All Transactions'}
          </button>
        </div>

        {userTransactions.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            {language === 'bn' ? 'এখনো কোনো লেনদেন সম্পন্ন হয়নি।' : 'No transactions completed yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'ধরণ' : 'Type'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'মেথড' : 'Method'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'TrxID / একাউন্ট' : 'TrxID / Account'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 font-semibold text-right">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {userTransactions.slice(0, 6).map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      {trx.type === 'deposit' && <span className="font-bold text-sky-400">+{language === 'bn' ? ' ডিপোজিট' : ' Deposit'}</span>}
                      {trx.type === 'withdraw' && <span className="font-bold text-rose-400">-{language === 'bn' ? ' উইথড্র' : ' Withdraw'}</span>}
                      {trx.type === 'mail_sale' && <span className="font-bold text-emerald-400">+{language === 'bn' ? ' মেইল বিক্রি' : ' Mail Sold'}</span>}
                      {trx.type === 'marketplace_buy' && <span className="font-bold text-amber-400">-{language === 'bn' ? ' মেইল ক্রয়' : ' Mail Bought'}</span>}
                      {trx.type === 'exchange' && <span className="font-bold text-purple-400">{language === 'bn' ? 'এক্সচেঞ্জ' : 'Exchange'}</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{trx.method}</td>
                    <td className="py-3 px-4 font-black text-sm text-white">
                      {trx.type === 'deposit' || trx.type === 'mail_sale' ? '+' : '-'}৳{trx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {trx.trxId ? (
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{trx.trxId}</span>
                          {trx.senderNumber && (
                            <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-400" />
                              {maskPhoneNumber(trx.senderNumber)}
                            </span>
                          )}
                        </div>
                      ) : trx.accountNumber ? (
                        <span className="inline-flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          {maskPhoneNumber(trx.accountNumber)}
                        </span>
                      ) : (
                        trx.adminNote || 'System'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {trx.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ {language === 'bn' ? 'সফল' : 'Completed'}
                        </span>
                      )}
                      {trx.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⏳ {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
                        </span>
                      )}
                      {trx.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ {language === 'bn' ? 'বাতিল' : 'Rejected'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(trx.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
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
