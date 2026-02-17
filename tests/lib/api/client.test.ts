import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, apiPost } from "@/lib/api/client";

vi.mock("next-auth/react", () => ({
  getSession: vi.fn(),
}));

const { getSession } = await import("next-auth/react");

describe("API client", () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(null);
    global.fetch = vi.fn();
  });

  it("includes Authorization header when session has accessToken", async () => {
    vi.mocked(getSession).mockResolvedValue({
      accessToken: "test-token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await apiGet("/api/v1/test");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("uses relative path for API calls", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await apiGet("/api/v1/wallet/balance");

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/wallet/balance",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("throws on non-ok response with error message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: "Bad Request",
      json: () => Promise.resolve({ error: "Insufficient balance" }),
    } as Response);

    await expect(apiPost("/api/v1/wallet/withdraw", { amount: 100 })).rejects.toThrow(
      "Insufficient balance"
    );
  });
});
