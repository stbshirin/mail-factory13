export type UserRole = 'admin' | 'moderator' | 'user';
export type MemberTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
export type MailType = 'fresh' | 'recovery' | 'old' | 'edu' | 'usa' | 'aged';
export type MailBatchStatus = 'pending' | 'checking' | 'approved' | 'rejected' | 'paid';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Binance' | 'System';
export type TransactionType = 'deposit' | 'withdraw' | 'mail_sale' | 'marketplace_buy' | 'referral_bonus' | 'exchange' | 'bonus' | 'adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'rejected';
export type Currency = 'BDT' | 'USD';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  balanceBdt: number;
  balanceUsd: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  memberTier: MemberTier;
  joinedAt: string;
  avatarUrl?: string;
  isBanned?: boolean;
  totalSubmittedMails: number;
  totalApprovedMails: number;
  totalEarnings: number;
  totalBoughtMails: number;
  bKashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
}

export interface MailItem {
  id: string;
  email: string;
  password?: string;
  recoveryEmail?: string;
  status: 'valid' | 'invalid' | 'duplicate' | 'pending';
}

export interface MailBatch {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  batchName: string;
  mailType: MailType;
  mails: MailItem[];
  rawText: string;
  pricePerMail: number;
  totalMails: number;
  validMailsCount: number;
  totalAmount: number;
  status: MailBatchStatus;
  shiftName: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
  paymentMethod?: PaymentMethod;
  payoutAccount?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: MailType;
  pricePerUnit: number; // in BDT
  stockAvailable: number;
  minOrder: number;
  features: string[];
  badge?: string;
  iconName?: string;
  isActive: boolean;
  credentialsPool?: string[]; // stored mail lines email:password:recovery for auto delivery
}

export interface BuyerOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  itemId: string;
  itemTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  deliveredMails: string[];
  createdAt: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  accountNumber?: string;
  trxId?: string;
  senderNumber?: string;
  status: TransactionStatus;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface PlatformSettings {
  mailBuyingRateFresh: number;
  mailBuyingRateRecovery: number;
  mailBuyingRateAged: number;
  mailBuyingRateUsa: number;
  mailBuyingRateEdu: number;
  isBuyingOpen: boolean;
  minMailSubmission: number;
  minWithdrawalBdt: number;
  minDepositBdt: number;
  usdToBdtRate: number;
  bKashNumber: string;
  bKashType: 'Personal' | 'Agent' | 'Merchant';
  nagadNumber: string;
  nagadType: 'Personal' | 'Agent' | 'Merchant';
  rocketNumber: string;
  rocketType: 'Personal' | 'Agent';
  binancePayId: string;
  binanceUsdtAddress: string;
  activeShift: string;
  shiftHours: string;
  announcement: string;
  announcementActive: boolean;
  popupNotice: string;
  popupActive: boolean;
  supportTelegram: string;
  supportWhatsapp: string;
  supportEmail: string;
  adminEmails: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  shift: string;
  date: string;
  verifiedSale: boolean;
  likes: number;
  status: 'approved' | 'pending';
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  email: string;
  totalMailsSold: number;
  totalEarnings: number;
  tier: MemberTier;
  isCurrent?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'payment' | 'order' | 'system' | 'review';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface LiveChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  senderName: string;
  message: string;
  timestamp: string;
}
