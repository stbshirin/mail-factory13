export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    // Navigation
    nav_home: 'হোম',
    nav_sell: 'মেইল সেল',
    nav_buy: 'মার্কেটপ্লেস',
    nav_wallet: 'ওয়ালেট',
    nav_exchange: 'এক্সচেঞ্জ',
    nav_leaderboard: 'লিডারবোর্ড',
    nav_reviews: 'রিভিউ',
    nav_admin: 'অ্যাডমিন প্যানেল',
    nav_id_card: 'আইডি কার্ড',
    nav_settings: 'সেটিংস',
    nav_support: 'সাপোর্ট ও সাহায্য',
    nav_login: 'লগ-ইন',
    nav_register: 'রেজিস্ট্রেশন',
    nav_logout: 'লগআউট',
    nav_switch_lang: 'English',
    nav_shift_active: 'সন্ধ্যা শিফট চালু: ',
    nav_rate_per_mail: 'রেট ৳১০.৫০/মেইল!',

    // Common / Auth alerts
    auth_required_title: 'লগ-ইন আবশ্যক',
    auth_required_desc: 'কোনো প্রকার কেনাকাটা, মেইল বিক্রি অথবা ডিপোজিট করার পূর্বে দয়া করে লগ-ইন বা রেজিস্ট্রেশন করুন।',
    auth_login_btn: 'লগ-ইন করুন',
    auth_register_btn: 'রেজিস্ট্রেশন করুন',
    auth_close: 'বন্ধ করুন',
    guest_welcome: 'অতিথি ব্যবহারকারী',
    welcome: 'স্বাগতম',

    // Home View
    hero_badge_rate: 'বর্তমান লাইভ রেট: ৳10.50 / মেইল',
    hero_title: 'বিশ্বস্ত জিমেইল ক্রয়-বিক্রয় ও মাইক্রো-আর্নিং প্ল্যাটফর্ম',
    hero_desc: 'নিরাপদে ফ্রেশ ও ওল্ড জিমেইল অ্যাকাউন্ট ক্রয় করুন অথবা নিজের তৈরি করা জিমেইল সাবমিট করে বিকাশ ও নগদে সরাসরি টাকা উইথড্র নিন।',
    hero_cta_sell: 'সেল ফ্যাক্টরি ↗',
    hero_cta_buy: 'বাই জিমেইল',
    hero_cta_exchange: 'এক্সচেঞ্জ',
    recent_proofs_title: 'সাম্প্রতিক লাইভ পেমেন্ট প্রুফ',
    all_reviews_link: 'সকল রিভিউ দেখুন',
    shifts_title: 'আজকের সেলার শিফট ও বোনাস',
    shifts_desc: 'শিফট চলাকালীন সময়ে মেইল জমা দিয়ে অতিরিক্ত বোনাস ক্যাশ উপভোগ করুন।',
    shift_morning: 'সকাল শিফট (Morning Shift)',
    shift_evening: 'সন্ধ্যা শিফট (Evening Shift)',
    shift_night: 'রাত শিফট (Night Shift)',
    shift_base_rate: 'মৌলিক রেট',
    shift_bonus: 'শিফট বোনাস',
    shift_total_rate: 'সর্বমোট রেট',
    submit_mail_btn: 'মেইল জমা দিন',
    feature_card1_title: '১০০% অটোমেটিক ডেলিভারি',
    feature_card1_desc: 'পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই জিমেইল ক্রেডেন্সিয়াল স্ক্রিনে দেখতে পাবেন।',
    feature_card2_title: 'ইনস্ট্যান্ট ক্যাশআউট',
    feature_card2_desc: 'বিকাশ, নগদ, রকেট অথবা বাইনান্সের মাধ্যমে ৫ মিনিটে পেমেন্ট গ্রহণ করুন।',
    feature_card3_title: 'কড়া কোয়ালিটি কন্ট্রোল',
    feature_card3_desc: 'প্রতিটি মেইল ম্যানুয়ালি এবং স্বয়ংক্রিয়ভাবে যাচাই করে সর্বোচ্চ নিরাপত্তা নিশ্চিত করা হয়।',
    feature_card4_title: '২৪/৭ লাইভ বাংলা সাপোর্ট',
    feature_card4_desc: 'যেকোনো সমস্যায় টেলিগ্রাম অথবা লাইভ চ্যাটের মাধ্যমে তাৎক্ষণিক সমাধান নিন।',

    // Reviews section on Home View
    home_reviews_title: 'গ্রাহক ও সেলারদের বিশ্বস্ত রিভিউ',
    home_reviews_subtitle: 'আমাদের প্ল্যাটফর্ম ব্যবহারকারীদের বাস্তব অভিজ্ঞতা ও মতামত',
    write_review_btn: 'রিভিউ আবেদন করুন',
    review_pending_alert: 'রিভিউটি সফলভাবে জমা হয়েছে! অ্যাডমিনের পর্যালোচনার পর এটি ওয়েবসাইটে প্রদর্শিত হবে।',
    no_approved_reviews: 'এখনও কোনো পাবলিক রিভিউ প্রকাশ করা হয়নি। প্রথম রিভিউটি আপনি দিন!',
    verified_user: 'ভেরিফাইড ইউজার',

    // Marketplace
    market_title: 'জিমেইল মার্কেটপ্লেস ও প্যাকেজ',
    market_desc: 'উচ্চমানের ফ্রেশ, ওল্ড এবং ওয়ান-ক্লিক রিকভারি জিমেইল প্যাকেজ তাৎক্ষণিক ডেলিভারিতে কিনুন।',
    market_cat_all: 'সকল প্যাকেজ',
    market_cat_fresh: 'ফ্রেশ জিমেইল',
    market_cat_recovery: 'রিকভারি জিমেইল',
    market_cat_aged: 'পুরাতন জিমেইল (Aged)',
    market_cat_usa: 'USA জিমেইল',
    market_cat_edu: 'Edu জিমেইল',
    market_buy_now: 'এখনই কিনুন',
    market_stock: 'স্টক অবশিষ্ট',
    market_pcs: 'টি',
    market_unit_price: 'প্রতি পিস রেট',
    market_min_order: 'সর্বনিম্ন অর্ডার',
    market_search_placeholder: 'প্যাকেজের নাম দিয়ে খুঁজুন...',
    market_login_prompt: '🔒 কেনাকাটা ও প্যাকেজ অর্ডার করার জন্য লগ-ইন অথবা রেজিস্ট্রেশন আবশ্যক।',

    // Sellers
    sell_title: 'জিমেইল সেল ফ্যাক্টরি',
    sell_desc: 'আপনার জিমেইল সাবমিট করুন এবং ৫ মিনিটে বিকাশ ও নগদে টাকা গ্রহণ করুন।',
    sell_batch_submit: 'নতুন ব্যাচ সাবমিট করুন',
    sell_mail_type: 'জিমেইলের ধরন',
    sell_mail_data: 'জিমেইল ডেটা (ইমেইল:পাসওয়ার্ড:রিকভারি)',
    sell_payout_account: 'পেমেন্ট গ্রহণের নম্বর (বিকাশ/নগদ)',
    sell_submit_btn: 'ব্যাচ জমা দিন',
    sell_history_title: 'আপনার পূর্ববর্তী ব্যাচ হিস্ট্রি',

    // Wallet
    wallet_title: 'আমার ওয়ালেট ও ফান্ডস',
    wallet_desc: 'টাকা জমা, উত্তোলন ও ব্যালেন্স হিস্ট্রি পরিচালনা করুন।',
    wallet_balance_bdt: 'বর্তমান টাকা ব্যালেন্স',
    wallet_balance_usd: 'বর্তমান ডলার ব্যালেন্স',
    wallet_deposit_btn: 'টাকা ডিপোজিট',
    wallet_withdraw_btn: 'উইথড্র রিকোয়েস্ট',
    wallet_exchange_btn: 'কারেন্সি এক্সচেঞ্জ',
    wallet_transactions_title: 'সাম্প্রতিক ওয়ালেট লেনদেন',

    // Deposit Phone Privacy
    deposit_phone_protected_notice: '🔒 গ্রাহকের গোপনীয়তা সুরক্ষায় ডিপোজিট ফোন নম্বর সর্বোচ্চ সুরক্ষিত থাকে এবং কোনো সাধারণ ব্যক্তি তা দেখতে পারে না।',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_sell: 'Sell Mail',
    nav_buy: 'Marketplace',
    nav_wallet: 'Wallet',
    nav_exchange: 'Exchange',
    nav_leaderboard: 'Leaderboard',
    nav_reviews: 'Reviews',
    nav_admin: 'Admin Panel',
    nav_id_card: 'ID Card',
    nav_settings: 'Settings',
    nav_support: 'Support & Help',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_logout: 'Logout',
    nav_switch_lang: 'বাংলা',
    nav_shift_active: 'Evening Shift Active: ',
    nav_rate_per_mail: 'Rate ৳10.50/mail!',

    // Common / Auth alerts
    auth_required_title: 'Login Required',
    auth_required_desc: 'Please login or create an account before purchasing, selling mails, or depositing money.',
    auth_login_btn: 'Sign In',
    auth_register_btn: 'Register',
    auth_close: 'Close',
    guest_welcome: 'Guest User',
    welcome: 'Welcome',

    // Home View
    hero_badge_rate: 'Current Live Rate: ৳10.50 / Mail',
    hero_title: 'Trusted Gmail Buy-Sell & Micro-Earning Platform',
    hero_desc: 'Safely buy fresh and aged Gmail accounts, or submit your own created Gmails to instantly withdraw cash to bKash and Nagad.',
    hero_cta_sell: 'Sell Factory ↗',
    hero_cta_buy: 'Buy Gmail',
    hero_cta_exchange: 'Exchange',
    recent_proofs_title: 'Recent Live Payment Proofs',
    all_reviews_link: 'View All Reviews',
    shifts_title: "Today's Seller Shifts & Bonuses",
    shifts_desc: 'Submit mails during active shifts to enjoy extra bonus cash on top of the base rate.',
    shift_morning: 'Morning Shift',
    shift_evening: 'Evening Shift',
    shift_night: 'Night Shift',
    shift_base_rate: 'Base Rate',
    shift_bonus: 'Shift Bonus',
    shift_total_rate: 'Total Rate',
    submit_mail_btn: 'Submit Mails',
    feature_card1_title: '100% Instant Delivery',
    feature_card1_desc: 'Get your Gmail credentials on screen immediately upon successful payment.',
    feature_card2_title: 'Instant Cashouts',
    feature_card2_desc: 'Receive payouts via bKash, Nagad, Rocket, or Binance in under 5 minutes.',
    feature_card3_title: 'Strict Quality Control',
    feature_card3_desc: 'Every mail is checked for maximum reliability and security.',
    feature_card4_title: '24/7 Live Support',
    feature_card4_desc: 'Instant assistance in Bengali or English via Telegram or live chat.',

    // Reviews section on Home View
    home_reviews_title: 'Trusted Customer & Seller Reviews',
    home_reviews_subtitle: 'Real experiences and feedback from our platform members',
    write_review_btn: 'Write a Review',
    review_pending_alert: 'Review submitted successfully! It will be publicly displayed after admin approval.',
    no_approved_reviews: 'No approved reviews yet. Be the first to leave a review!',
    verified_user: 'Verified Member',

    // Marketplace
    market_title: 'Gmail Marketplace & Packages',
    market_desc: 'Buy premium fresh, recovery, and aged Gmail packages with instant automated delivery.',
    market_cat_all: 'All Packages',
    market_cat_fresh: 'Fresh Gmail',
    market_cat_recovery: 'Recovery Gmail',
    market_cat_aged: 'Aged Gmail',
    market_cat_usa: 'USA Gmail',
    market_cat_edu: 'Edu Gmail',
    market_buy_now: 'Buy Now',
    market_stock: 'Available Stock',
    market_pcs: 'pcs',
    market_unit_price: 'Unit Price',
    market_min_order: 'Min Order',
    market_search_placeholder: 'Search packages by title...',
    market_login_prompt: '🔒 Login or registration is required to buy packages.',

    // Sellers
    sell_title: 'Gmail Sell Factory',
    sell_desc: 'Submit your Gmail accounts and receive cash within 5 minutes on bKash or Nagad.',
    sell_batch_submit: 'Submit New Batch',
    sell_mail_type: 'Gmail Type',
    sell_mail_data: 'Gmail Data (email:password:recovery)',
    sell_payout_account: 'Payout Account (bKash/Nagad)',
    sell_submit_btn: 'Submit Batch',
    sell_history_title: 'Your Batch Submission History',

    // Wallet
    wallet_title: 'My Wallet & Funds',
    wallet_desc: 'Manage your deposits, withdrawals, and transaction history.',
    wallet_balance_bdt: 'BDT Balance',
    wallet_balance_usd: 'USD Balance',
    wallet_deposit_btn: 'Deposit Funds',
    wallet_withdraw_btn: 'Withdraw Funds',
    wallet_exchange_btn: 'Currency Exchange',
    wallet_transactions_title: 'Recent Wallet Transactions',

    // Deposit Phone Privacy
    deposit_phone_protected_notice: '🔒 For user privacy, depositor phone numbers are strictly protected and never displayed to other users.',
  },
};

export type TranslationKey = keyof typeof translations.bn;

export function getTranslation(key: TranslationKey, lang: Language = 'bn'): string {
  const dictionary = translations[lang] || translations.bn;
  return dictionary[key] || translations.bn[key] || key;
}
