export type Category = {
  id: string;
  name: string;
  icon?: string;
  color: string;
};

export type User = {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  winRate: number;
  verified: boolean;
  joinedDate: Date;
  location?: string;
  totalBets: number;
  interests?: string[];
  engagementLevel?: "active" | "casual" | "observer";
  earnings?: number;
  rank?: number;
  tokenBalance?: number;
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
};

export type BetStatus = "open" | "closed" | "completed" | "cancelled";

export type Bet = {
  id: string;
  author: User;
  title: string;
  shortDescription: string;
  fullDescription: string;
  outcome: string;
  category: Category;
  betAmount: number;
  coefficient: number;
  potentialWinnings: number;
  status: BetStatus;
  deadline: Date;
  eventDate?: Date;
  location?: string;
  verificationSource?: string;
  createdAt: Date;
  tags: string[];
  commentsCount: number;
  betsCount: number;
  likesCount: number;
  likedByMe: boolean;
};

export type Comment = {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likesCount: number;
  likedByMe: boolean;
};

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  status?: MessageStatus;
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
};

export type PlatformStats = {
  totalPlayers: number;
  totalBets: number;
  totalPrizePool: number;
};

export type UserStats = {
  activeBets: number;
  wonBets: number;
  totalWinnings: number;
  rating: number;
};

export type TransactionType = "deposit" | "withdrawal" | "bet" | "win" | "referral_bonus" | "referral_earnings";

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
  relatedBetId?: string;
  relatedUserId?: string;
};

export type TokenBalance = {
  userId: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalWon: number;
  totalSpent: number;
};

export type Referral = {
  id: string;
  referrerId: string;
  referredId: string;
  createdAt: Date;
  totalEarnings: number;
};
