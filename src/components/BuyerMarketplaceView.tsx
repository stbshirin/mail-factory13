import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MarketplaceItem, MailType } from '../types';
import {
  ShoppingBag,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Zap,
  AlertCircle,
  X,
  Wallet,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const BuyerMarketplaceView: React.FC = () => {
  const {
    marketplaceItems,
    buyMarketplaceItem,
    currentUser,
    setActiveTab,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemForPurchase, setActiveItemForPurchase] = useState<MarketplaceItem | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(5);
  const [purchasedOrderResult, setPurchasedOrderResult] = useState<{
    itemTitle: string;
    deliveredMails: string[];
    quantity: number;
    totalPrice: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter items
  const filteredItems = marketplaceItems.filter(item => {
    if (!item.isActive) return false;
    const matchesCat = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenPurchaseModal = (item: MarketplaceItem) => {
    setActiveItemForPurchase(item);
    setPurchaseQuantity(item.minOrder || 5);
  };

  const handleConfirmPurchase = () => {
    if (!activeItemForPurchase) return;

    const res = buyMarketplaceItem(activeItemForPurchase.id, purchaseQuantity);
    if (res.success && res.order) {
      setPurchasedOrderResult({
        itemTitle: activeItemForPurchase.title,
        deliveredMails: res.order.deliveredMails,
        quantity: purchaseQuantity,
        totalPrice: res.order.totalPrice,
      });
      setActiveItemForPurchase(null);
    } else {
      showToast(res.message, 'error');
    }
  };

  const copyDeliveredMails = () => {
    if (!purchasedOrderResult) return;
    navigator.clipboard.writeText(purchasedOrderResult.deliveredMails.join('\n'));
    setCopied(true);
    showToast('সকল মেইল কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadDeliveredTxt = () => {
    if (!purchasedOrderResult) return;
    const element = document.createElement('a');
    const file = new Blob([purchasedOrderResult.deliveredMails.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `mailfactory_${purchasedOrderResult.itemTitle.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('টেক্সট ফাইল ডাউনলোড হয়েছে', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>ইনস্ট্যান্ট ডেলিভারি মার্কেটপ্লেস</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            জিমেইল অ্যাকাউন্ট কিনুন (Buy Gmail)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            ১০০% ফ্রেশ, ওল্ড ও ভেরিফাইড রিকভারি জিমেইল সংগ্রহ করুন। অর্ডারের সাথে সাথেই স্ক্রিনে ক্রেডেনশিয়াল এবং টেক্সট ফাইল ডাউনলোড করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'সব ক্যাটাগরি' },
            { id: 'fresh', label: 'ফ্রেশ জিমেইল' },
            { id: 'recovery', label: 'রিকভারি মেইল' },
            { id: 'aged', label: 'পুরাতন মেইল (Old)' },
            { id: 'usa', label: 'USA IP মেইল' },
            { id: 'edu', label: 'Edu Mail' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="প্যাকেজ খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500">
          কোনো প্যাকেজ পাওয়া যায়নি। অন্য ক্যাটাগরি ফিল্টার সিলেক্ট করুন।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/60 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge || 'Active Stock'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">৳{item.pricePerUnit.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 block -mt-1">প্রতি পিস</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>

                <div className="mt-4 space-y-2">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">
                    স্টক: <strong className="text-emerald-400">{item.stockAvailable} টি</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    সর্বনিম্ন: {item.minOrder} টি
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPurchaseModal(item)}
                  disabled={item.stockAvailable === 0}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>এখনই কিনুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {activeItemForPurchase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">অর্ডার কনফার্মেশন</h3>
                <p className="text-xs text-slate-400">{activeItemForPurchase.title}</p>
              </div>
              <button
                onClick={() => setActiveItemForPurchase(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  পরিমাণ সিলেক্ট করুন (সর্বনিম্ন {activeItemForPurchase.minOrder}টি):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={activeItemForPurchase.minOrder}
                    max={activeItemForPurchase.stockAvailable}
                    value={purchaseQuantity}
                    onChange={e => setPurchaseQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    / অবশিষ্ট {activeItemForPurchase.stockAvailable}টি
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {[5, 10, 20, 50, 100].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setPurchaseQuantity(qty)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      purchaseQuantity === qty
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>প্রতি পিস মূল্য:</span>
                  <span className="font-bold text-white">৳{activeItemForPurchase.pricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>মোট পরিমাণ:</span>
                  <span className="font-bold text-white">{purchaseQuantity} টি</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between text-sm">
                  <span className="font-bold text-white">সর্বমোট খরচ:</span>
                  <span className="font-black text-amber-400 text-base">
                    ৳{(activeItemForPurchase.pricePerUnit * purchaseQuantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Balance Check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">আপনার ওয়ালেট ব্যালেন্স:</span>
                </div>
                <strong
                  className={
                    currentUser.balanceBdt >= activeItemForPurchase.pricePerUnit * purchaseQuantity
                      ? 'text-emerald-400 font-bold'
                      : 'text-rose-400 font-bold'
                  }
                >
                  ৳{currentUser.balanceBdt.toFixed(2)}
                </strong>
              </div>

              {currentUser.balanceBdt < activeItemForPurchase.pricePerUnit * purchaseQuantity && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <span>পর্যাপ্ত ব্যালেন্স নেই!</span>
                  <button
                    onClick={() => {
                      setActiveItemForPurchase(null);
                      setActiveTab('deposit');
                    }}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 text-[11px]"
                  >
                    + ব্যালেন্স যোগ করুন
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveItemForPurchase(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                বাতিল
              </button>

              <button
                onClick={handleConfirmPurchase}
                disabled={currentUser.balanceBdt < activeItemForPurchase.pricePerUnit * purchaseQuantity}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                পেমেন্ট সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivered Credentials Dialog */}
      {purchasedOrderResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-white">অর্ডার সফল ও তাৎক্ষণিক ডেলিভারি!</h3>
              <p className="text-xs text-slate-400 mt-1">
                {purchasedOrderResult.quantity}টি {purchasedOrderResult.itemTitle} ক্রেডেনশিয়াল নিচে দেওয়া হলো।
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  ডেলিভারিকৃত একাউন্টসমূহ ({purchasedOrderResult.deliveredMails?.length || 0}টি):
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">✓ ৩ দিন রিপ্লেসমেন্ট সাপোর্ট</span>
              </div>

              <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-300 space-y-1.5 select-all">
                {(purchasedOrderResult.deliveredMails || []).map((mailLine, idx) => (
                  <div key={idx} className="border-b border-slate-900/60 pb-1 flex justify-between">
                    <span>{mailLine}</span>
                    <span className="text-slate-600 text-[10px]">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyDeliveredMails}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'কপি হয়েছে!' : 'সবগুলো কপি করুন'}</span>
              </button>

              <button
                onClick={downloadDeliveredTxt}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>ফাইল ডাউনলোড করুন (.txt)</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setPurchasedOrderResult(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                উইন্ডো বন্ধ করুন (My Orders এও সংরক্ষণ থাকবে)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
