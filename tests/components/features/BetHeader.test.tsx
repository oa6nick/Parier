import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BetHeader } from '@/components/features/bet-dashboard/BetHeader'
import { Bet } from '@/types'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

// Mock formatDistanceToNow
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns')
  return {
    ...actual,
    formatDistanceToNow: () => '2 days ago',
    format: () => 'Jan 1, 2026'
  }
})

// Mock Navigation
vi.mock('@/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  Link: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>
}))

const mockBet: Bet = {
  id: '1',
  title: 'Test Bet Title',
  shortDescription: 'Short description',
  fullDescription: 'Full description',
  outcome: 'Yes',
  category: { id: 'tech', name: 'Technology', icon: 'tech' },
  betAmount: 1000,
  coefficient: 2.5,
  potentialWinnings: 2500,
  status: 'open',
  deadline: new Date(),
  eventDate: new Date(Date.now() + 86400000), // tomorrow
  verificationSource: 'Source',
  createdAt: new Date(),
  tags: ['Tag1'],
  commentsCount: 5,
  betsCount: 10,
  likesCount: 20,
  likedByMe: false,
  author: {
    id: '2',
    username: 'AuthorUser',
    avatar: 'avatar.png',
    rating: 4.8,
    winRate: 80,
    isPro: true,
    verified: true
  }
}

describe('BetHeader', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    )
  }

  it('renders bet header information correctly', () => {
    renderWithProviders(<BetHeader bet={mockBet} />)
    
    expect(screen.getByText('Test Bet Title')).toBeInTheDocument()
    expect(screen.getByText('AuthorUser')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument() // Outcome
    expect(screen.getByText('2.5x')).toBeInTheDocument() // Odds
  })

  it('displays PRR currency symbol', () => {
    renderWithProviders(<BetHeader bet={mockBet} />)
    
    expect(screen.getByText('PRR')).toBeInTheDocument()
  })

  it('displays bet status', () => {
    renderWithProviders(<BetHeader bet={mockBet} />)
    
    // Status is rendered via Tag component, checking for text content
    // Note: status text might be capitalized or translated, checking basic presence
    const statusElements = screen.getAllByText('open')
    expect(statusElements.length).toBeGreaterThan(0)
    expect(statusElements[0]).toBeInTheDocument() 
  })
})
