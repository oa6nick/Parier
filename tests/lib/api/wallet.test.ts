import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBalance, deposit } from "@/lib/api/wallet";

vi.mock("@/lib/api/client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

const { apiGet, apiPost } = await import("@/lib/api/client");

describe("wallet API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getBalance returns TokenBalance from API", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      success: true,
      data: {
        userId: "u1",
        balance: 1000,
        totalDeposited: 1500,
        totalWithdrawn: 200,
        totalWon: 300,
        totalSpent: 600,
      },
    } as never);

    const result = await getBalance();

    expect(apiGet).toHaveBeenCalledWith("/api/v1/wallet/balance");
    expect(result.balance).toBe(1000);
    expect(result.totalDeposited).toBe(1500);
    expect(result.totalWon).toBe(300);
  });

  it("deposit calls apiPost and returns new balance", async () => {
    vi.mocked(apiPost).mockResolvedValue({
      success: true,
      data: {
        userId: "u1",
        balance: 1100,
        totalDeposited: 1600,
        totalWithdrawn: 200,
        totalWon: 300,
        totalSpent: 600,
      },
    } as never);

    const result = await deposit(100, "Card deposit");

    expect(apiPost).toHaveBeenCalledWith("/api/v1/wallet/deposit", {
      amount: 100,
      description: "Card deposit",
    });
    expect(result.balance).toBe(1100);
  });
});
