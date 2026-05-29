import handler from '@/pages/api/ai-fishing-recommendations'
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
}

describe('ai-fishing-recommendations api', () => {
  const originalApiKey = process.env.OPENAI_API_KEY
  const originalAiEnabled = process.env.NEXT_PUBLIC_AI_ENABLED

  beforeEach(() => {
    fetch.resetMocks()
    process.env.OPENAI_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_AI_ENABLED = 'true'
  })

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey
    process.env.NEXT_PUBLIC_AI_ENABLED = originalAiEnabled
  })

  it('fills out pre-spawn, spawn, and post-spawn phases for each requested species', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                generatedData: {
                  seasons: 'spring',
                  bestFishingTimes: {
                    ok: '7:00-9:00 AM',
                    good: '9:00-11:00 AM',
                    great: '5:00-7:00 PM',
                  },
                  seasonPhases: [
                    {
                      species: 'striped bass',
                      phase: 'pre-spawn',
                      confidence: 9,
                      notes: 'staging on structure',
                    },
                  ],
                  species: ['striped bass', 'bluefish'],
                  activeSpecies: ['striped bass'],
                  baitRecommendations: {
                    baitsToUse: [],
                    stylesToUse: [],
                  },
                  tackle: [],
                },
              }),
            },
          },
        ],
      })
    )

    const res = createMockRes()

    await handler(
      {
        method: 'POST',
        body: {
          mode: 'generate_all',
          location: { name: 'Narragansett', region: 'RI' },
          weather: { current: { cloud: 80 } },
          species: ['striped bass', 'bluefish'],
          seasons: 'spring',
          waterType: 'saltwater shore',
          candidates: { baitsToUse: [], stylesToUse: [] },
        },
      },
      res
    )

    expect(res.statusCode).toBe(200)
    expect(res.body.source).toBe('openai')
    expect(res.body.generatedData.seasonPhases).toHaveLength(6)
    expect(
      res.body.generatedData.seasonPhases.filter(
        (phase) => phase.species === 'striped bass'
      )
    ).toHaveLength(3)
    expect(
      res.body.generatedData.seasonPhases.filter(
        (phase) => phase.species === 'bluefish'
      )
    ).toHaveLength(3)
    expect(
      res.body.generatedData.seasonPhases.some(
        (phase) => phase.species === 'bluefish' && phase.phase === 'post-spawn'
      )
    ).toBeTruthy()
  })

  it('fills out all best fishing times when the model omits some fields', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                generatedData: {
                  seasons: 'summer',
                  bestFishingTimes: {
                    great: '5:00-7:00 PM',
                  },
                  seasonPhases: [],
                  species: ['striped bass'],
                  activeSpecies: ['striped bass'],
                  baitRecommendations: {
                    baitsToUse: [],
                    stylesToUse: [],
                  },
                  tackle: [],
                },
              }),
            },
          },
        ],
      })
    )

    const res = createMockRes()

    await handler(
      {
        method: 'POST',
        body: {
          mode: 'generate_all',
          location: { name: 'Narragansett', region: 'RI' },
          weather: { current: { cloud: 20 } },
          species: ['striped bass'],
          seasons: 'summer',
          waterType: 'saltwater shore',
          candidates: { baitsToUse: [], stylesToUse: [] },
        },
      },
      res
    )

    expect(res.statusCode).toBe(200)
    expect(res.body.generatedData.bestFishingTimes.ok).toContain(
      'Early morning'
    )
    expect(res.body.generatedData.bestFishingTimes.good).toContain(
      'Mid-morning'
    )
    expect(res.body.generatedData.bestFishingTimes.great).toBe('5:00-7:00 PM')
  })
})
