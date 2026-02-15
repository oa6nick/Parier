import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BetCard } from '@/components/features/BetCard'
import { Bet } from '@/types'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

// Mock the Auth Context
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: '1',
      username: 'TestUser',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      rating: 4.5,
      winRate: 75,
      isPro: true,
      verified: true
    }
  })
}))

// Mock Navigation
vi.mock('@/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  Link: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>
}))

// Mock mockData
vi.mock('@/lib/mockData/comments', () => ({
  getComments: () => []
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

describe('BetCard', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    )
  }

  it('renders bet information correctly', () => {
    renderWithProviders(<BetCard bet={mockBet} />)
    
    const elements = screen.getAllByText('Test Bet Title')
    expect(elements.length).toBeGreaterThan(0)
    expect(elements[0]).toBeInTheDocument()
    expect(screen.getByText('AuthorUser')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    const oddsElements = screen.getAllByText('2.5x')
    expect(oddsElements.length).toBeGreaterThan(0)
    expect(oddsElements[0]).toBeInTheDocument()
  })

  it('flips card on "Bet Now" click', async () => {
    renderWithProviders(<BetCard bet={mockBet} />)
    
    const betButton = screen.getByText('Bet Now')
    fireEvent.click(betButton)
    
    // Check if the back side content is visible/rendered
    expect(screen.getByText('Place Your Bet')).toBeInTheDocument()
  })

  it('handles like interaction', () => {
    renderWithProviders(<BetCard bet={mockBet} />)
    
    const likeCount = screen.getByText('20')
    const likeButton = likeCount.closest('button')
    
    fireEvent.click(likeButton!)
    expect(screen.getByText('21')).toBeInTheDocument()
  })
})
