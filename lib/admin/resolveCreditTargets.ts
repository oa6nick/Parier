import { User } from "@/types";
import { getTokenBalance } from "@/lib/mockData/wallet";
import { users } from "@/lib/mockData/users";
import { CreditRuleType } from "@/types";

export function resolveCreditTargets(
  rule: CreditRuleType,
  params: Record<string, number> = {}
): User[] {

  switch (rule) {
    case "all":
      return users;

    case "new_users": {
      const days = params.days ?? 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return users.filter((u) => new Date(u.joinedDate) >= cutoff);
    }

    case "low_balance": {
      const maxBalance = params.maxBalance ?? 5000;
      return users.filter((u) => {
        const balance = getTokenBalance(u.id);
        return balance.balance < maxBalance;
      });
    }

    case "active": {
      const minBets = params.minBets ?? 1;
      return users.filter((u) => u.totalBets >= minBets);
    }

    default:
      return [];
  }
}
