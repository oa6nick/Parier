import { Conversation, Message } from "@/types";
import { users } from "./users";

const currentUser = users[0]; // "Вы"

export const conversations: Conversation[] = [
  {
    id: "c1",
    participants: [currentUser, users[1]], // You and CryptoWhale
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    lastMessage: {
      id: "m1-3",
      senderId: users[1].id,
      content: "What do you think about the new ETH ETF?",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
    }
  },
  {
    id: "c2",
    participants: [currentUser, users[2]], // You and TraderAlex
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastMessage: {
      id: "m2-2",
      senderId: currentUser.id,
      content: "Thanks for the tip!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    }
  },
  {
    id: "c3",
    participants: [currentUser, users[3]], // You and СпортГуру
    unreadCount: 5,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastMessage: {
      id: "m3-5",
      senderId: users[3].id,
      content: "Did you see that match yesterday?",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
    }
  },
  {
    id: "c4",
    participants: [currentUser, users[5]], // You and AuctionMaster
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastMessage: {
      id: "m4-1",
      senderId: currentUser.id,
      content: "Is that item still available?",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
    }
  }
];

export const messages: Record<string, Message[]> = {
  "c1": [
    {
      id: "m1-1",
      senderId: currentUser.id,
      content: "Hey, are you holding BTC?",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      status: "read",
    },
    {
      id: "m1-2",
      senderId: users[1].id,
      content: "Yes, holding strong until 100k.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "m1-3",
      senderId: users[1].id,
      content: "What do you think about the new ETH ETF?",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
    }
  ],
  "c2": [
    {
      id: "m2-1",
      senderId: users[2].id,
      content: "Check out NVDA, it's rallying.",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "m2-2",
      senderId: currentUser.id,
      content: "Thanks for the tip!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      status: "read",
    }
  ],
  "c3": [
    {
      id: "m3-1",
      senderId: users[3].id,
      content: "Yo!",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "m3-2",
      senderId: users[3].id,
      content: "Betting on Lakers?",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "m3-3",
      senderId: currentUser.id,
      content: "Nah, they are weak this season.",
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      read: true,
      status: "read",
    },
    {
      id: "m3-4",
      senderId: users[3].id,
      content: "You'll regret that!",
      createdAt: new Date(Date.now() - 29 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "m3-5",
      senderId: users[3].id,
      content: "Did you see that match yesterday?",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
    }
  ],
  "c4": [
    {
      id: "m4-1",
      senderId: currentUser.id,
      content: "Is that item still available?",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      status: "delivered",
    }
  ]
};

export const getConversations = (): Conversation[] => {
  return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const getMessages = (conversationId: string): Message[] => {
  return messages[conversationId] || [];
};

export const findOrCreateConversation = (userId: string): Conversation => {
  const existingConversation = conversations.find(conv => 
    conv.participants.some(p => p.id === userId) && 
    conv.participants.some(p => p.id === currentUser.id) &&
    conv.participants.length === 2
  );

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation
  const otherUser = users.find(u => u.id === userId);
  if (!otherUser) {
    throw new Error(`User with id ${userId} not found`);
  }

  const newConversation: Conversation = {
    id: `c${Date.now()}`,
    participants: [currentUser, otherUser],
    unreadCount: 0,
    updatedAt: new Date(),
  };

  conversations.push(newConversation);
  messages[newConversation.id] = [];

  return newConversation;
};
