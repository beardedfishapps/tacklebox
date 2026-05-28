import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import Loader from '@/app/components/loader'
import '@testing-library/jest-dom'

describe('Loader', () => {
  it('renders Loader', () => {
    render(<Loader />)

    const loaderText = screen.getByText('Loading...')

    expect(loaderText).toBeInTheDocument()
  })
})
