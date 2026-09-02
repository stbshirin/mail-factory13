import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { BuyerOrder } from '../types';
import {
  ShoppingBag,
  Download,
  Copy,
  Check,
  Eye,
  X,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const BuyerOrdersView: React.FC = () => {
  const { buyerOrders, currentUser, setActiveTab, showToast } = useApp();

  const [activeOrderDetails, setActiveOrderDetails] = useState<BuyerOrder | null>(null);
  const [copied, setCopied] = useState(false);

  const myOrders = buyerOrders.filter(o => o.buyerId === currentUser.id);

  const handleCopy = (mails: string[]) => {
    navigator.clipboard.writeText(mails.join('\n'));
    setCopied(true);
    showToast('মেইল ক্রেডেনশিয়াল কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (order: BuyerOrder) => {
    const element = document.createElement('a');
    const file = new Blob([order.deliveredMails.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `order_${order.id}_${order.itemTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('ফাইল ডাউনলোড হয়েছে', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">আমার ক্রয়কৃত অর্ডারসমূহ (My Orders)</h1>
          <p className="text-xs text-slate-400 mt-1">মার্কেটপ্লেস থেকে আপনার কেনা সমস্ত মেইল ও ক্রেডেনশিয়াল</p>
        </div>
        <button
          onClick={() => setActiveTab('buy')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>নতুন অর্ডার করুন</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {myOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto stroke-1" />
            <p className="text-sm">আপনি এখনো কোনো মেইল অর্ডার করেননি।</p>
            <button
              onClick={() => setActiveTab('buy')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2"
            >
              <span>মার্কেটপ্লেস ব্রাউজ করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">অর্ডার আইডি</th>
                  <th className="py-3 px-4 font-semibold">প্যাকেজ নাম</th>
                  <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                  <th className="py-3 px-4 font-semibold">মূল্য</th>
                  <th className="py-3 px-4 font-semibold">ডেলিভারি স্ট্যাটাস</th>
                  <th className="py-3 px-4 font-semibold">তারিখ</th>
                  <th className="py-3 px-4 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {myOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{order.id}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">{order.itemTitle}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{order.quantity} টি</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">৳{order.totalPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Delivered
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveOrderDetails(order)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>মেইল দেখুন</span>
                      </button>
                      <button
                        onClick={() => handleDownload(order)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs rounded-lg border border-amber-500/30 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ডাউনলোড</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Delivered Credentials Modal */}
      {activeOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{activeOrderDetails.itemTitle}</h3>
                <p className="text-xs text-slate-400">অর্ডার আইডি: {activeOrderDetails.id}</p>
              </div>
              <button
                onClick={() => setActiveOrderDetails(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  ডেলিভারিকৃত মেইল তালিকা ({activeOrderDetails.deliveredMails?.length || 0}টি):
                </span>
                <button
                  onClick={() => handleCopy(activeOrderDetails.deliveredMails || [])}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি করুন</span>
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-300 space-y-1 select-all">
                {(activeOrderDetails.deliveredMails || []).map((mailLine, idx) => (
                  <div key={idx} className="border-b border-slate-900/60 pb-1 flex justify-between">
                    <span>{mailLine}</span>
                    <span className="text-slate-600 text-[10px]">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDownload(activeOrderDetails)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>ফাইল ডাউনলোড করুন (.txt)</span>
              </button>

              <button
                onClick={() => setActiveOrderDetails(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
