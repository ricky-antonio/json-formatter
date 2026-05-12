import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBanner from '../../components/ErrorBanner'

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Unexpected token at position 5" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Unexpected token at position 5')
  })

  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorBanner message={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when message is undefined', () => {
    const { container } = render(<ErrorBanner message={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when message is empty string', () => {
    const { container } = render(<ErrorBanner message="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
