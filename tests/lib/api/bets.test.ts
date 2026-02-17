import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBet, getBets, mapBetResponseToBet, joinBet } from "@/lib/api/bets";
import type { BetResponse } from "@/lib/api/bets";
import type { Category } from "@/types";

vi.mock("@/lib/api/client", () => ({
  apiPost: vi.fn(),
  apiPut: vi.fn(),
}));

const { apiPost, apiPut } = await import("@/lib/api/client");

describe("bets API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mapBetResponseToBet maps API response to Bet type", () => {
    const response: BetResponse = {
      id: "bet-1",
      category_id: "tech",
      category_name: "Technology",
      status_id: "open",
      title: "Test Bet",
      description: "Short",
      amount: 500,
      coefficient: 2,
      deadline: "2025-12-31T23:59:59Z",
      author: {
        id: "u1",
        username: "Alice",
        win_rate: 75,
        verified: true,
      },
    };
    const category: Category = {
      id: "tech",
      name: "Technology",
      color: "#3b82f6",
    };
    const bet = mapBetResponseToBet(response, category, { open: "open" });
    expect(bet.id).toBe("bet-1");
    expect(bet.title).toBe("Test Bet");
    expect(bet.shortDescription).toBe("Short");
    expect(bet.author.username).toBe("Alice");
    expect(bet.betAmount).toBe(500);
    expect(bet.coefficient).toBe(2);
    expect(bet.potentialWinnings).toBe(1000);
  });

  it("createBet calls apiPut with correct payload", async () => {
    vi.mocked(apiPut).mockResolvedValue({
      success: true,
      data: { id: "new-bet-id" },
    } as never);

    const result = await createBet({
      category_id: "tech",
      verification_source_id: ["vs1"],
      status_id: "open",
      type_id: "binary",
      title: "New Bet",
      coefficient: "2",
      amount: "100",
      deadline: "2025-12-31T23:59:59Z",
    });

    expect(apiPut).toHaveBeenCalledWith(
      "/api/v1/parier/bet",
      expect.objectContaining({
        title: "New Bet",
        category_id: "tech",
      })
    );
    expect(result.id).toBe("new-bet-id");
  });

  it("joinBet calls apiPost with bet id and amount", async () => {
    vi.mocked(apiPost).mockResolvedValue({ success: true } as never);

    await joinBet("bet-123", 50);

    expect(apiPost).toHaveBeenCalledWith("/api/v1/parier/bet/bet-123/join", {
      amount: 50,
    });
  });
});
