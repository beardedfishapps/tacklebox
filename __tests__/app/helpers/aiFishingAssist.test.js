import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import {
  getAiFishingRecommendations,
  getAiGeneratedFishingData,
} from '@/app/helpers/aiFishingAssist'

describe('aiFishingAssist', () => {
  const originalEnv = process.env.NEXT_PUBLIC_AI_ENABLED

  beforeEach(() => {
    fetch.resetMocks()
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_AI_ENABLED = originalEnv
  })

  it('returns null when AI is disabled', async () => {
    process.env.NEXT_PUBLIC_AI_ENABLED = 'false'

    const result = await getAiFishingRecommendations({
      location: {},
      weather: {},
      species: [],
      seasons: '',
      waterType: 'freshwater bank',
      candidates: { baitsToUse: [], stylesToUse: [] },
    })

    expect(result).toBeNull()
  })

  it('normalizes and sorts AI recommendation confidence', async () => {
    process.env.NEXT_PUBLIC_AI_ENABLED = 'true'

    fetch.mockResponseOnce(
      JSON.stringify({
        recommendations: {
          baitsToUse: [
            { name: 'bait a', confidence: 2 },
            { name: 'bait b', confidence: 11 },
          ],
          stylesToUse: [
            { name: 'style a', confidence: 1 },
            { name: 'style b', confidence: 5 },
          ],
        },
      })
    )

    const result = await getAiFishingRecommendations({
      location: { name: 'Boston' },
      weather: { current: { cloud: 20 } },
      species: ['largemouth bass'],
      seasons: 'spring',
      waterType: 'freshwater bank',
      candidates: { baitsToUse: [], stylesToUse: [] },
    })

    expect(result).not.toBeNull()
    expect(result.baitsToUse[0].name).toBe('bait b')
    expect(result.stylesToUse[0].name).toBe('style b')
  })

  it('maps AI generated full fishing data', async () => {
    process.env.NEXT_PUBLIC_AI_ENABLED = 'true'

    fetch.mockResponseOnce(
      JSON.stringify({
        source: 'openai',
        generatedData: {
          seasons: 'spring, bass pre-spawn',
          bestFishingTimes: {
            ok: '6:00-8:00 AM',
            good: '8:00-10:00 AM',
            great: '5:00-7:00 PM',
          },
          seasonPhases: [
            {
              species: 'striped bass',
              phase: 'pre-spawn',
              confidence: 9,
              notes: 'staging near current breaks',
            },
          ],
          species: ['striped bass'],
          activeSpecies: ['striped bass'],
          baitRecommendations: {
            baitsToUse: [{ name: 'sand eel', confidence: 9 }],
            stylesToUse: [{ name: 'white', confidence: 8 }],
          },
          tackle: [
            {
              name: 'Bucktail Jig',
              confidence: 10,
              species: ['striped bass'],
              waterTemp: ['cold'],
              type: ['reaction', 'saltwater'],
              depth: ['deep'],
              tip: 'Bounce near bottom.',
              weather: 'Cloudy',
            },
          ],
        },
      })
    )

    const result = await getAiGeneratedFishingData({
      location: { name: 'Narragansett' },
      weather: { current: { cloud: 85 } },
      species: [],
      seasons: 'fall',
      waterType: 'saltwater shore',
      candidates: { baitsToUse: [], stylesToUse: [] },
    })

    expect(result).not.toBeNull()
    expect(result.source).toBe('openai')
    expect(result.species[0]).toBe('striped bass')
    expect(result.seasons).toContain('spring')
    expect(result.bestFishingTimes.great).toBe('5:00-7:00 PM')
    expect(result.seasonPhases[0].phase).toBe('pre-spawn')
    expect(result.tackle[0].name).toBe('Bucktail Jig')
    expect(result.tackle[0].type.includes('saltwater')).toBeTruthy()
  })
})
