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
  earnings?: number;
  rank?: number;
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
