import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  ExternalLink,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  const { platformSettings, currentUser } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! MailFactory PRO লাইভ সাপোর্টে আপনাকে স্বাগতম। আমি আপনার ভার্চুয়াল অ্যাসিস্ট্যান্ট। আপনাকে কীভাবে সহায়তা করতে পারি?',
      time: 'এখনই',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'আজকের লাইভ রেট কত?',
    'উইথড্র কতক্ষণে পাই?',
    'শিফট বোনাস কিভাবে পাব?',
    'টেলিগ্রাম গ্রুপ লিংক দিন',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'ধন্যবাদ আপনার বার্তার জন্য। যেকোনো জটিল সহায়তার জন্য আমাদের টেলিগ্রাম সাপোর্টে (@mailfactory_support) যোগাযোগ করুন।';

      const lower = query.toLowerCase();
      if (lower.includes('রেট') || lower.includes('দাম') || lower.includes('rate')) {
        reply = `বর্তমান ফ্রেশ মেইল রেট ৳${platformSettings.mailBuyingRateFresh.toFixed(2)} এবং রিকভারি রেট ৳${platformSettings.mailBuyingRateRecovery.toFixed(2)}। সন্ধ্যা শিফটে রেট ৳১০.৫০ পর্যন্ত!`;
      } else if (lower.includes('উইথড্র') || lower.includes('পেমেন্ট') || lower.includes('বিকাশ') || lower.includes('নগদ')) {
        reply = `বিকাশ, নগদ ও রকেট পার্সোনালে সর্বনিম্ন মাত্র ৳${platformSettings.minWithdrawBdt} উইথড্র করা যায়। উইথড্র রিকোয়েস্টের পর সর্বোচ্চ ৩-১০ মিনিটের মধ্যে পেমেন্ট সম্পন্ন হয়!`;
      } else if (lower.includes('শিফট') || lower.includes('বোনাস')) {
        reply = `আমাদের প্রতিদিন ৩টি শিফট চালু থাকে: সকাল (০৮:০০ AM - ০২:০০ PM), সন্ধ্যা (০২:০০ PM - ০৯:০০ PM) এবং নাইট শিফট (০৯:০০ PM - ০৪:০০ AM)। শিফটে মেইল দিলে অতিরিক্ত ৳০.৫০ থেকে ৳১.৫০ পর্যন্ত বোনাস যোগ হয়।`;
      } else if (lower.includes('টেলিগ্রাম') || lower.includes('গ্রুপ') || lower.includes('telegram')) {
        reply = `আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন শিফট আপডেট ও পেমেন্ট প্রুফের জন্য: ${platformSettings.supportTelegram}`;
      } else if (lower.includes('নিয়ম') || lower.includes('রুলস') || lower.includes('পাসওয়ার্ড')) {
        reply = `জিমেইল বানানোর নিয়ম: পাসওয়ার্ড ৮ ডিজিট+ হতে হবে, Outlook বা Yahoo রিকভারি মেইল যুক্ত থাকতে হবে এবং টু-ফ্যাক্টর অথেন্টিকেশন অফ থাকতে হবে।`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">লাইভ বাংলা সাপোর্ট</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                  অনলাইন
                </span>
              </div>
              <p className="text-[11px] text-slate-300">গড়ে ৩ মিনিটে রেসপন্স</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={platformSettings.supportTelegram}
              target="_blank"
              rel="noreferrer"
              title="টেলিগ্রাম সাপোর্ট"
              className="p-2 rounded-xl text-blue-400 hover:bg-slate-800/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Promo Banner */}
        <div className="bg-blue-950/40 border-b border-blue-900/40 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-blue-300 truncate">
            ✈️ টেলিগ্রাম চ্যানেলে সকল পেমেন্ট প্রুফ ও শিফট নোটিশ
          </span>
          <a
            href={platformSettings.supportTelegram}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 font-bold hover:underline flex-shrink-0 ml-2"
          >
            যোগ দিন &gt;
          </a>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1 ${
                    msg.sender === 'user' ? 'text-slate-900/70 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 px-3 py-2 rounded-2xl rounded-tl-none border border-slate-700">
                <span className="animate-pulse">টাইপ করছে...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন বাংলায় লিখুন..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
