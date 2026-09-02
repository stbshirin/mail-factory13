import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, addReview, currentUser, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [shift, setShift] = useState('Night Shift');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('মতামত লিখুন', 'error');
      return;
    }

    addReview({
      userName: currentUser.name,
      rating,
      comment,
      shift,
    });

    setComment('');
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">ব্যবহারকারীদের রিভিউ ও অভিজ্ঞতা</h1>
        <p className="text-xs text-slate-400 mt-1">মেইল ফ্যাক্টরি পরিবারের সদস্যদের সততা ও ফিডব্যাক</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Submit Review Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>আপনার রিভিউ প্রদান করুন</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">রেটিং সিলেক্ট করুন:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">কোন শিফটে কাজ করেছেন:</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Morning Shift">সকালের শিফট (Morning Shift)</option>
                <option value="Day Shift">দিনের শিফট (Day Shift)</option>
                <option value="Night Shift">রাতের শিফট (Night Shift)</option>
                <option value="Marketplace Buyer">মার্কেটপ্লেস বায়ার (Buyer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">আপনার মতামত ও অভিজ্ঞতা:</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="মেইল সাবমিটের কতক্ষণের মধ্যে পেমেন্ট পেয়েছেন বা সার্ভিসের অভিজ্ঞতা কেমন..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>রিভিউ জমা দিন</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Reviews Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{rev.userName}</div>
                        <div className="text-[10px] text-amber-400">{rev.shift}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ভেরিফাইড ইউজার
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
