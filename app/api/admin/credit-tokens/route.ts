import { NextResponse } from "next/server";
import { creditTokens } from "@/lib/mockData/wallet";
import { resolveCreditTargets } from "@/lib/admin/resolveCreditTargets";
import { CreditRuleType } from "@/types";

const RULE_TYPES: CreditRuleType[] = ["all", "new_users", "low_balance", "active"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rule = searchParams.get("rule") as CreditRuleType | null;
    const days = searchParams.get("days");
    const maxBalance = searchParams.get("maxBalance");
    const minBets = searchParams.get("minBets");

    if (!rule || !RULE_TYPES.includes(rule)) {
      return NextResponse.json({ error: "Invalid rule" }, { status: 400 });
    }

    const params: Record<string, number> = {};
    if (days) params.days = Number(days);
    if (maxBalance) params.maxBalance = Number(maxBalance);
    if (minBets) params.minBets = Number(minBets);

    const targets = resolveCreditTargets(rule, params);
    return NextResponse.json({ count: targets.length });
  } catch (error) {
    console.error("Admin credit-tokens preview error:", error);
    return NextResponse.json({ error: "Failed to get preview" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, rule, ruleParams } = body;

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount < 1) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const r = (rule ?? "all") as CreditRuleType;
    if (!RULE_TYPES.includes(r)) {
      return NextResponse.json({ error: "Invalid rule" }, { status: 400 });
    }

    const params = ruleParams ?? {};
    const targets = resolveCreditTargets(r, params);

    if (targets.length === 0) {
      return NextResponse.json(
        { error: "No users match the selected rule" },
        { status: 400 }
      );
    }

    const desc = description || "Admin credit";
    const results: Record<string, number> = {};

    for (const u of targets) {
      results[u.id] = creditTokens(u.id, numAmount, desc);
    }

    return NextResponse.json({
      success: true,
      amount: numAmount,
      creditedCount: targets.length,
      newBalances: results,
    });
  } catch (error) {
    console.error("Admin credit-tokens error:", error);
    return NextResponse.json(
      { error: "Failed to credit tokens" },
      { status: 500 }
    );
  }
}
