import { Comment } from "@/types";
import { users } from "./users";

export const comments: Record<string, Comment[]> = {
  "1": [
    {
      id: "101",
      author: users[2],
      content: "Bitcoin to the moon! 🚀",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likesCount: 15,
      likedByMe: true,
    }
  ],
  "3": [
    {
      id: "301",
      author: users[4],
      content: "I think the market will correct soon.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likesCount: 3,
      likedByMe: false,
    },
    {
      id: "302",
      author: users[1],
      content: "Agreed, too much volatility lately.",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likesCount: 1,
      likedByMe: false,
    },
    {
      id: "303",
      author: users[5],
      content: "DCA is the way.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likesCount: 5,
      likedByMe: false,
    }
  ],
  "4": [
    {
      id: "401",
      author: users[6],
      content: "Russia has a strong team this year.",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likesCount: 8,
      likedByMe: false,
    },
    {
      id: "402",
      author: users[7],
      content: "Depends on the group stage draw.",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      likesCount: 2,
      likedByMe: false,
    },
    {
      id: "403",
      author: users[8],
      content: "Any predictions on the top scorer?",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likesCount: 0,
      likedByMe: false,
    },
    {
      id: "404",
      author: users[0],
      content: "I'm betting on Brazil.",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likesCount: 1,
      likedByMe: false,
    },
    {
      id: "405",
      author: users[9],
      content: "Let's see!",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likesCount: 0,
      likedByMe: false,
    }
  ],
  "5": [
    {
      id: "501",
      author: users[3],
      content: "ETH 2.0 is a game changer.",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likesCount: 12,
      likedByMe: true,
    },
    {
      id: "502",
      author: users[2],
      content: "Gas fees are still high though.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likesCount: 5,
      likedByMe: false,
    }
  ],
  "6": [
    {
      id: "601",
      author: users[10],
      content: "Apple Vision Pro is incredible technology.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likesCount: 20,
      likedByMe: false,
    },
    {
      id: "602",
      author: users[11],
      content: "Too expensive for mass adoption currently.",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      likesCount: 8,
      likedByMe: true,
    },
    {
      id: "603",
      author: users[12],
      content: "Wait for the lighter version.",
      createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
      likesCount: 4,
      likedByMe: false,
    },
    {
      id: "604",
      author: users[1],
      content: "I tried it, it's heavy.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likesCount: 2,
      likedByMe: false,
    }
  ]
};

export const getComments = (betId: string): Comment[] => {
  return comments[betId] || [];
};
