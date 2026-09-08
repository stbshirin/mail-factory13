import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { TransactionType } from '../types';
import { RefreshCw, Search, ArrowUpRight, PlusCircle, ArrowDownLeft, DollarSign, Shield } from 'lucide-react';
import { maskPhoneNumber } from '../utils/maskUtils';

export const BuyerTransactionsView: React.FC = () => {
  const { transactions, currentUser, language } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);

  const filtered = myTransactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      (t.trxId && t.trxId.toLowerCase().includes(search.toLowerCase())) ||
      t.method.toLowerCase().includes(search.toLowerCase()) ||
      (t.accountNumber && t.accountNumber.includes(search));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {language === 'bn' ? 'ওয়ালেট লেনদেন হিস্ট্রি (Transactions)' : 'Wallet Transaction History'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'আপনার সমস্ত ডিপোজিট, উইথড্র, মেইল ক্রয় ও বিক্রয়ের হিসাব'
            : 'Track all your deposits, withdrawals, mail purchases and sales'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', labelBn: 'সকল লেনদেন', labelEn: 'All Transactions' },
            { id: 'deposit', labelBn: 'ডিপোজিট', labelEn: 'Deposit' },
            { id: 'withdraw', labelBn: 'উইথড্র', labelEn: 'Withdraw' },
            { id: 'mail_sale', labelBn: 'মেইল বিক্রি আয়', labelEn: 'Mail Sale' },
            { id: 'marketplace_buy', labelBn: 'মেইল ক্রয়', labelEn: 'Mail Purchase' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {language === 'bn' ? f.labelBn : f.labelEn}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'TrxID বা নাম্বার দিয়ে খুঁজুন...' : 'Search by TrxID or number...'}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            {language === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি।' : 'No transactions found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'আইডি' : 'ID'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'ধরণ' : 'Type'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'মেথড' : 'Method'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'রেফারেন্স / TrxID' : 'Reference / TrxID'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 font-semibold text-right">{language === 'bn' ? 'তারিখ ও সময়' : 'Date & Time'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{trx.id}</td>
                    <td className="py-3.5 px-4 font-semibold">
                      {trx.type === 'deposit' && (
                        <span className="text-sky-400">
                          {language === 'bn' ? '+ ডিপোজিট' : '+ Deposit'}
                        </span>
                      )}
                      {trx.type === 'withdraw' && (
                        <span className="text-rose-400">
                          {language === 'bn' ? '- উইথড্র' : '- Withdraw'}
                        </span>
                      )}
                      {trx.type === 'mail_sale' && (
                        <span className="text-emerald-400">
                          {language === 'bn' ? '+ মেইল বিক্রি' : '+ Mail Sale'}
                        </span>
                      )}
                      {trx.type === 'marketplace_buy' && (
                        <span className="text-amber-400">
                          {language === 'bn' ? '- মেইল ক্রয়' : '- Mail Purchase'}
                        </span>
                      )}
                      {trx.type === 'exchange' && (
                        <span className="text-purple-400">
                          {language === 'bn' ? 'এক্সচেঞ্জ' : 'Exchange'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{trx.method}</td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      <span
                        className={
                          trx.type === 'deposit' || trx.type === 'mail_sale'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }
                      >
                        {trx.type === 'deposit' || trx.type === 'mail_sale' ? '+' : '-'}৳{trx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
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
                    <td className="py-3.5 px-4">
                      {trx.status === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                        </span>
                      )}
                      {trx.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⏳ {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
                        </span>
                      )}
                      {trx.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ {language === 'bn' ? 'বাতিল' : 'Rejected'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(trx.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
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
