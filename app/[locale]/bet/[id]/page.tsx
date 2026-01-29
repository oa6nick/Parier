import React from 'react';
import { notFound } from 'next/navigation';
import { getBets } from '@/lib/mockData/bets';
import { BetDetailView } from '@/components/features/bet-dashboard/BetDetailView';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function BetPage({ params }: PageProps) {
  const { id, locale } = await params;
  const bets = getBets(locale);
  const bet = bets.find((b) => b.id === id);

  if (!bet) {
    notFound();
  }

  return <BetDetailView bet={bet} />;
}
