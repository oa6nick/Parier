import React from "react";
import { BetPageClient } from "@/components/features/bet-dashboard/BetPageClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  return {
    title: "Bet - Pariall",
    description: "View bet details on Pariall",
  };
}

export default async function BetPage({ params }: PageProps) {
  await params;
  return <BetPageClient />;
}
