import { describe, it, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import BaitRecommendations from '@/app/classes/BaitRecommendations'

describe('BaitRecommendations', () => {
  it('initializes with empty values', () => {
    const baitRecommendations = new BaitRecommendations()

    expect(baitRecommendations.stylesToUse).toEqual([])
    expect(baitRecommendations.baitsToUse).toEqual([])
  })
})
