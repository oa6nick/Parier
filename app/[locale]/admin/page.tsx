"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Shield, Coins, User, Users, Sparkles, Wallet, Zap } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { users } from "@/lib/mockData/users";
import { getTokenBalance } from "@/lib/mockData/wallet";
import { CreditRuleType } from "@/types";

const RULES: { id: CreditRuleType; icon: React.ElementType }[] = [
  { id: "all", icon: Users },
  { id: "new_users", icon: Sparkles },
  { id: "low_balance", icon: Wallet },
  { id: "active", icon: Zap },
];

export default function AdminPage() {
  const t = useTranslations("Admin");
  const format = useFormatter();
  const [rule, setRule] = useState<CreditRuleType>("all");
  const [ruleParams, setRuleParams] = useState<Record<string, string>>({
    days: "30",
    maxBalance: "5000",
    minBets: "5",
  });
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [balanceOverrides, setBalanceOverrides] = useState<Record<string, number>>({});
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPreview = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("rule", rule);
    if (rule === "new_users") params.set("days", ruleParams.days || "30");
    if (rule === "low_balance") params.set("maxBalance", ruleParams.maxBalance || "5000");
    if (rule === "active") params.set("minBets", ruleParams.minBets || "5");

    try {
      const res = await fetch(`/api/admin/credit-tokens?${params}`);
      const data = await res.json();
      if (res.ok) setPreviewCount(data.count);
      else setPreviewCount(0);
    } catch {
      setPreviewCount(0);
    }
  }, [rule, ruleParams]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  const filteredUsers = searchQuery.trim()
    ? users.filter(
        (u) =>
          u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const userBalances = filteredUsers.map((u) => {
    const tokenBalance = getTokenBalance(u.id);
    const displayBalance = balanceOverrides[u.id] ?? tokenBalance.balance;
    return { user: u, balance: { ...tokenBalance, balance: displayBalance } };
  });

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10) || 0;

    if (numAmount < 1) {
      setErrorMessage(t("errors.minAmount"));
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const params: Record<string, number> = {};
      if (rule === "new_users") params.days = parseInt(ruleParams.days || "30", 10);
      if (rule === "low_balance") params.maxBalance = parseInt(ruleParams.maxBalance || "5000", 10);
      if (rule === "active") params.minBets = parseInt(ruleParams.minBets || "5", 10);

      const res = await fetch("/api/admin/credit-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          description: description.trim() || undefined,
          rule,
          ruleParams: params,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || t("errors.failed"));
        return;
      }

      setSuccessMessage(t("successAll", { amount: numAmount, count: data.creditedCount }));
      setAmount("");
      setDescription("");
      if (data.newBalances) {
        setBalanceOverrides((prev) => ({ ...prev, ...data.newBalances }));
      }
      fetchPreview();
    } catch {
      setErrorMessage(t("errors.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            {t("creditForm")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rule selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                {t("ruleLabel")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RULES.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRule(id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      rule === id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{t(`rules.${id}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rule params */}
            {rule === "new_users" && (
              <Input
                label={t("ruleParams.days")}
                type="number"
                value={ruleParams.days}
                onChange={(e) => setRuleParams((p) => ({ ...p, days: e.target.value }))}
                min={1}
                max={365}
              />
            )}
            {rule === "low_balance" && (
              <Input
                label={t("ruleParams.maxBalance")}
                type="number"
                value={ruleParams.maxBalance}
                onChange={(e) => setRuleParams((p) => ({ ...p, maxBalance: e.target.value }))}
                min={0}
              />
            )}
            {rule === "active" && (
              <Input
                label={t("ruleParams.minBets")}
                type="number"
                value={ruleParams.minBets}
                onChange={(e) => setRuleParams((p) => ({ ...p, minBets: e.target.value }))}
                min={0}
              />
            )}

            {/* Preview */}
            {previewCount !== null && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm font-medium text-gray-700">
                  {t("preview", { count: previewCount })}
                </p>
              </div>
            )}

            <Input
              label={t("amount")}
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="1000"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                {t("description")} ({t("optional")})
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={2}
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all resize-none"
              />
            </div>

            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              disabled={isSubmitting || (previewCount !== null && previewCount === 0)}
            >
              {isSubmitting ? t("crediting") : t("credit")}
            </Button>
          </form>
        </div>

        {/* User list */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {t("usersList")}
          </h2>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all mb-4"
          />

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {userBalances.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">{t("noUsersFound")}</p>
            ) : (
              userBalances.map(({ user, balance }) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {format.number(balance.balance)} PRR
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
