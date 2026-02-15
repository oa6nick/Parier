import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveCreditTargets } from "@/lib/admin/resolveCreditTargets";

vi.mock("@/lib/mockData/users", () => ({
  users: [
    {
      id: "1",
      username: "User1",
      joinedDate: new Date("2025-01-15"),
      totalBets: 10,
    },
    {
      id: "2",
      username: "User2",
      joinedDate: new Date("2024-06-01"),
      totalBets: 0,
    },
    {
      id: "3",
      username: "User3",
      joinedDate: new Date("2025-02-01"),
      totalBets: 5,
    },
  ],
}));

vi.mock("@/lib/mockData/wallet", () => ({
  getTokenBalance: (userId: string) => {
    const balances: Record<string, number> = { "1": 10000, "2": 500, "3": 3000 };
    return { balance: balances[userId] ?? 0 };
  },
}));

describe("resolveCreditTargets", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-15"));
  });

  it("returns all users for rule 'all'", () => {
    const targets = resolveCreditTargets("all");
    expect(targets).toHaveLength(3);
  });

  it("returns only new users for rule 'new_users' with days param", () => {
    const targets = resolveCreditTargets("new_users", { days: 60 });
    expect(targets.length).toBeGreaterThanOrEqual(1);
    targets.forEach((u) => {
      const joined = new Date(u.joinedDate);
      const cutoff = new Date("2025-02-15");
      cutoff.setDate(cutoff.getDate() - 60);
      expect(joined >= cutoff).toBe(true);
    });
  });

  it("returns users with low balance for rule 'low_balance'", () => {
    const targets = resolveCreditTargets("low_balance", { maxBalance: 2000 });
    expect(targets).toHaveLength(1); // User2 (500), User1 (10000) and User3 (3000) excluded
    expect(targets[0].id).toBe("2");
  });

  it("returns active users for rule 'active' with minBets", () => {
    const targets = resolveCreditTargets("active", { minBets: 5 });
    expect(targets).toHaveLength(2); // User1 (10), User3 (5)
    expect(targets.map((u) => u.id)).toContain("1");
    expect(targets.map((u) => u.id)).toContain("3");
    expect(targets.map((u) => u.id)).not.toContain("2");
  });

  it("returns empty array for invalid rule", () => {
    const targets = resolveCreditTargets("invalid" as never);
    expect(targets).toHaveLength(0);
  });
});
