import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletBalance } from "@/components/features/WalletBalance";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

const mockBalance = {
  userId: "u1",
  balance: 1500,
  totalDeposited: 2000,
  totalWithdrawn: 300,
  totalWon: 500,
  totalSpent: 700,
};

describe("WalletBalance", () => {
  const renderWithProviders = (balance: typeof mockBalance) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WalletBalance balance={balance} />
      </NextIntlClientProvider>
    );
  };

  it("displays balance correctly", () => {
    renderWithProviders(mockBalance);
    expect(screen.getByText("1,500")).toBeInTheDocument();
  });

  it("displays total deposited", () => {
    renderWithProviders(mockBalance);
    expect(screen.getByText("2,000")).toBeInTheDocument();
  });

  it("displays total won", () => {
    renderWithProviders(mockBalance);
    expect(screen.getByText("500")).toBeInTheDocument();
  });
});
