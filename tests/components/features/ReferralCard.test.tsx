import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReferralCard } from "@/components/features/ReferralCard";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

describe("ReferralCard", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  const renderWithProviders = (props: {
    referralCode: string;
    totalReferrals: number;
    totalEarnings: number;
  }) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ReferralCard {...props} />
      </NextIntlClientProvider>
    );
  };

  it("displays referral code", () => {
    renderWithProviders({
      referralCode: "ABC123",
      totalReferrals: 5,
      totalEarnings: 250,
    });
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it("displays total referrals and earnings", () => {
    renderWithProviders({
      referralCode: "XYZ",
      totalReferrals: 10,
      totalEarnings: 500,
    });
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("copies referral link to clipboard on copy button click", async () => {
    renderWithProviders({
      referralCode: "REF1",
      totalReferrals: 0,
      totalEarnings: 0,
    });
    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);
    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining("REF1")
      );
    });
  });
});
