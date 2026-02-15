import { Bet } from "@/types";
import { users } from "./users";
import { getCategories } from "./categories";
import { promises as fs } from "fs";
import path from "path";

type BetData = Omit<Bet, "title" | "shortDescription" | "fullDescription" | "outcome" | "category"> & {
  categoryId: string;
};

type Translation = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  outcome: string;
};

type StoredBet = {
  id: string;
  categoryId: string;
  authorId: string;
  betAmount: number;
  coefficient: number;
  potentialWinnings: number;
  status: string;
  deadline: string;
  eventDate?: string;
  verificationSource: string;
  createdAt: string;
  tags: string[];
  commentsCount: number;
  betsCount: number;
  likesCount: number;
  likedByMe: boolean;
};

type StoredData = {
  bets: StoredBet[];
  translations: Record<string, { en: Translation; ru: Translation }>;
};

const STORE_PATH = path.join(process.cwd(), "data", "created-bets.json");

async function readStore(): Promise<StoredData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { bets: [], translations: {} };
  }
}

async function writeStore(data: StoredData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export interface CreateBetInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  outcome: string;
  categoryId: string;
  betAmount: number;
  coefficient: number;
  deadline: string;
  eventDate?: string;
  verificationSource: string;
  authorId: string;
}

export async function addCreatedBet(input: CreateBetInput): Promise<string> {
  const newId = `new-${Date.now()}`;
  const author = users.find((u) => u.id === input.authorId) || users[0];
  const betAmount = input.betAmount;
  const potentialWinnings = Math.round(betAmount * input.coefficient);

  const storedBet: StoredBet = {
    id: newId,
    categoryId: input.categoryId,
    authorId: input.authorId,
    betAmount,
    coefficient: input.coefficient,
    potentialWinnings,
    status: "open",
    deadline: input.deadline,
    eventDate: input.eventDate,
    verificationSource: input.verificationSource,
    createdAt: new Date().toISOString(),
    tags: [],
    commentsCount: 0,
    betsCount: 0,
    likesCount: 0,
    likedByMe: false,
  };

  const translation: Translation = {
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    outcome: input.outcome,
  };

  const store = await readStore();
  store.bets.unshift(storedBet);
  store.translations[newId] = { en: translation, ru: translation };
  await writeStore(store);

  return newId;
}

export async function getCreatedBetsData(): Promise<BetData[]> {
  const store = await readStore();
  return store.bets.map((stored) => {
    const author = users.find((u) => u.id === stored.authorId) || users[0];
    return {
      id: stored.id,
      author,
      categoryId: stored.categoryId,
      betAmount: stored.betAmount,
      coefficient: stored.coefficient,
      potentialWinnings: stored.potentialWinnings,
      status: stored.status as Bet["status"],
      deadline: new Date(stored.deadline),
      eventDate: stored.eventDate ? new Date(stored.eventDate) : undefined,
      verificationSource: stored.verificationSource,
      createdAt: new Date(stored.createdAt),
      tags: stored.tags,
      commentsCount: stored.commentsCount,
      betsCount: stored.betsCount,
      likesCount: stored.likesCount,
      likedByMe: stored.likedByMe,
    };
  });
}

export async function getCreatedTranslations(): Promise<
  Record<string, { en: Translation; ru: Translation }>
> {
  const store = await readStore();
  return store.translations;
}
