import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Avatar } from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renders with alt text', () => {
    render(<Avatar alt="John Doe" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="/test.jpg" alt="John Doe" />)
    const img = screen.getByAltText('John Doe')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('renders fallback when src is missing', () => {
    render(<Avatar alt="Jane" />)
    expect(screen.getByText('J')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container } = render(<Avatar alt="Test" size="sm" />)
    const avatar = container.firstChild
    expect(avatar).toHaveClass('w-8', 'h-8')
  })

  it('applies custom className', () => {
    const { container } = render(<Avatar alt="Test" className="custom-class" />)
    const avatar = container.firstChild
    expect(avatar).toHaveClass('custom-class')
  })
})