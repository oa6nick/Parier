import { apiPost, apiPut } from "./client";
import type { Bet, Category, User } from "@/types";

export type BetCreatePayload = {
  category_id: string;
  verification_source_id: string[];
  status_id: string;
  type_id: string;
  title: string;
  description?: string;
  coefficient: string;
  amount: string;
  deadline: string; // ISO 8601
  media_ids?: string[];
};

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export async function createBet(payload: BetCreatePayload): Promise<{ id: string }> {
  const res = await apiPut<ApiResponse<{ id: string }>>("/api/v1/parier/bet", payload);
  const data = res.data as { id?: string } | undefined;
  return { id: data?.id ?? "" };
}

export async function joinBet(betId: string, amount: number): Promise<void> {
  await apiPost<ApiResponse<unknown>>(`/api/v1/parier/bet/${betId}/join`, { amount });
}

export async function likeBet(betId: string): Promise<void> {
  await apiPost<ApiResponse<unknown>>(`/api/v1/parier/bet/${betId}/like`, {});
}

export async function unlikeBet(betId: string): Promise<void> {
  await apiPost<ApiResponse<unknown>>(`/api/v1/parier/bet/${betId}/unlike`, {});
}

export type CommentAuthorResponse = {
  id: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  win_rate?: number;
  created_at?: string;
};

export type CommentResponse = {
  id: string;
  content: string;
  created_at: string;
  author: CommentAuthorResponse;
  likes: number;
  is_liked_by_me: boolean;
};

type CommentPaginatedResponse = { success: boolean; data: CommentResponse[]; count?: number; total?: number };

export async function getBetComments(
  betId: string,
  offset = 0,
  limit = 50,
  language = "en"
): Promise<{ comments: CommentResponse[]; total: number }> {
  const res = await apiPost<CommentPaginatedResponse>(`/api/v1/parier/bet/${betId}/comments`, {
    offset,
    limit,
    language: language === "ru" ? "ru" : "en",
  });
  const data = res.data ?? [];
  const total = res.total ?? res.count ?? data.length;
  return { comments: data, total };
}

export async function createBetComment(betId: string, content: string, parentId?: string): Promise<void> {
  await apiPut<ApiResponse<unknown>>(`/api/v1/parier/bet/${betId}/comment`, {
    content,
    ...(parentId && { parent_id: parentId }),
  });
}

/** Map API CommentResponse to frontend Comment type */
export function mapCommentResponseToComment(r: CommentResponse): import("@/types").Comment {
  const author: import("@/types").User = {
    id: r.author.id,
    username: r.author.username ?? "User",
    avatar: undefined,
    rating: 0,
    winRate: r.author.win_rate ?? 0,
    verified: r.author.verified ?? false,
    joinedDate: r.author.created_at ? new Date(r.author.created_at) : new Date(),
    totalBets: 0,
  };
  return {
    id: r.id,
    author,
    content: r.content,
    createdAt: new Date(r.created_at),
    likesCount: r.likes,
    likedByMe: r.is_liked_by_me,
  };
}

export type BetRequestPayload = {
  language?: string;
  id?: string;
  category_id?: string;
  status_id?: string;
  offset?: number;
  limit?: number;
};

export type AuthorResponse = {
  id: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  win_rate?: number;
  created_at?: string;
};

export type VerificationSourceResponse = {
  id: string;
  name: string;
};

export type BetResponse = {
  id: string;
  category_id: string;
  category_name: string;
  verification_sources?: VerificationSourceResponse[];
  status_id: string;
  status_name?: string;
  title: string;
  description?: string;
  amount: number;
  coefficient: number;
  deadline: string;
  created_at?: string;
  author: AuthorResponse;
  is_liked_by_me?: boolean;
  likes?: number;
  comments?: number;
  bets_count?: number;
};

type PaginatedResponse<T> = { success: boolean; data: T[]; count?: number; total?: number };

export async function getBets(payload: BetRequestPayload): Promise<BetResponse[]> {
  const res = await apiPost<PaginatedResponse<BetResponse>>("/api/v1/parier/bet", payload);
  return res.data ?? [];
}

export async function getBetById(id: string, language: string = "en"): Promise<BetResponse | null> {
  const list = await getBets({ id, language, limit: 1 });
  return list[0] ?? null;
}

/** Map API BetResponse to frontend Bet type */
export function mapBetResponseToBet(
  r: BetResponse,
  category: Category,
  statusMap: Record<string, "open" | "closed" | "completed" | "cancelled"> = {}
): Bet {
  const status = (statusMap[r.status_id] ?? "open") as Bet["status"];
  const desc = r.description ?? "";
  const [shortDesc, rest] = desc.includes("\n\n") ? desc.split("\n\n", 2) : [desc, ""];
  const [fullDesc, outcome] = rest.includes("\n\n") ? rest.split("\n\n", 2) : [rest, ""];

  const author: User = {
    id: r.author.id,
    username: r.author.username ?? "User",
    avatar: undefined,
    rating: 0,
    winRate: r.author.win_rate ?? 0,
    verified: r.author.verified ?? false,
    joinedDate: r.author.created_at ? new Date(r.author.created_at) : new Date(),
    totalBets: 0,
  };

  return {
    id: r.id,
    author,
    title: r.title,
    shortDescription: shortDesc || r.title,
    fullDescription: fullDesc || shortDesc || r.title,
    outcome: outcome || "",
    category,
    betAmount: r.amount,
    coefficient: r.coefficient,
    potentialWinnings: r.amount * r.coefficient,
    status,
    deadline: new Date(r.deadline),
    verificationSource: r.verification_sources?.map((v) => v.name).join(", "),
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
    tags: [],
    commentsCount: r.comments ?? 0,
    betsCount: r.bets_count ?? 0,
    likesCount: r.likes ?? 0,
    likedByMe: r.is_liked_by_me ?? false,
  };
}
