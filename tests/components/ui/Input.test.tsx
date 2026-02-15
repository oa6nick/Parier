import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '@/components/ui/Input'
import React from 'react'

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Username" />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input error="Invalid input" />)
    expect(screen.getByText('Invalid input')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders icon when provided', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Input icon={icon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})