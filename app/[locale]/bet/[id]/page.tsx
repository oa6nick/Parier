import React from 'react';
import { notFound } from 'next/navigation';
import { getBets, getBetById } from '@/lib/mockData/betsServer';
import { BetDetailView } from '@/components/features/bet-dashboard/BetDetailView';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const bets = await getBets(locale);
  const bet = bets.find((b) => b.id === id);

  if (!bet) {
    return {
      title: 'Bet Not Found - Pariall',
    };
  }

  return {
    title: `${bet.title} - Pariall`,
    description: bet.shortDescription,
    openGraph: {
      title: bet.title,
      description: bet.shortDescription,
      type: 'website',
    },
  };
}

export default async function BetPage({ params }: PageProps) {
  const { id, locale } = await params;
  const bets = await getBets(locale);
  const bet = bets.find((b) => b.id === id);

  if (!bet) {
    notFound();
  }

  return <BetDetailView bet={bet} />;
}
