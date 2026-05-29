import BaitRecommendations from '@/app/classes/BaitRecommendations'
import Tackle from '@/app/classes/Tackle'

export type AiFishingPayload = {
  location: {
    name?: string
    region?: string
    country?: string
    lat?: number
    lon?: number
  }
  weather: any
  species: string[]
  seasons: string
  waterType: string
  candidates: {
    baitsToUse: any[]
    stylesToUse: any[]
  }
}

export function isAiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_ENABLED === 'true'
}

const AI_REQUEST_TIMEOUT_MS = 8000

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function normalizeConfidence(item: any): any {
  const confidence = typeof item.confidence === 'number' ? item.confidence : 10
  return { ...item, confidence: clamp(confidence, 0, 999) }
}

function sortByConfidenceDesc(items: any[]): any[] {
  return [...items].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
}

function normalizeTackleItem(item: any): Tackle {
  const tackle = new Tackle()
  tackle.name = item?.name || ''
  tackle.confidence = clamp(
    typeof item?.confidence === 'number' ? item.confidence : 10,
    0,
    999
  )
  tackle.species = Array.isArray(item?.species) ? item.species : []
  tackle.waterTemp = Array.isArray(item?.waterTemp) ? item.waterTemp : []
  tackle.type = Array.isArray(item?.type) ? item.type : []
  tackle.depth = Array.isArray(item?.depth) ? item.depth : []
  tackle.tip = item?.tip || ''
  tackle.weather = item?.weather || ''
  return tackle
}

export async function getAiFishingRecommendations(
  payload: AiFishingPayload
): Promise<BaitRecommendations | null> {
  if (!isAiEnabled()) {
    return null
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch('/api/ai-fishing-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!res.ok) {
        return null
      }

      const json = await res.json()
      if (!json || !json.recommendations) {
        return null
      }

      const recommendations = new BaitRecommendations()
      recommendations.baitsToUse = sortByConfidenceDesc(
        (json.recommendations.baitsToUse || []).map(normalizeConfidence)
      )
      recommendations.stylesToUse = sortByConfidenceDesc(
        (json.recommendations.stylesToUse || []).map(normalizeConfidence)
      )
      return recommendations
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    return null
  }
}

export async function getAiGeneratedFishingData(
  payload: AiFishingPayload
): Promise<{
  species: string[]
  activeSpecies: string[]
  seasons: string
  bestFishingTimes: {
    ok: string
    good: string
    great: string
  }
  tips: string[]
  seasonPhases: {
    species: string
    phase: string
    confidence: number
    notes?: string
  }[]
  baitRecommendations: BaitRecommendations
  tackle: Tackle[]
  source: string
} | null> {
  if (!isAiEnabled()) {
    return null
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch('/api/ai-fishing-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          mode: 'generate_all',
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        return null
      }

      const json = await res.json()
      if (!json || !json.generatedData) {
        return null
      }

      const baitRecommendations = new BaitRecommendations()
      baitRecommendations.baitsToUse = sortByConfidenceDesc(
        (json.generatedData?.baitRecommendations?.baitsToUse || []).map(
          normalizeConfidence
        )
      )
      baitRecommendations.stylesToUse = sortByConfidenceDesc(
        (json.generatedData?.baitRecommendations?.stylesToUse || []).map(
          normalizeConfidence
        )
      )

      return {
        species: Array.isArray(json.generatedData.species)
          ? json.generatedData.species
          : [],
        activeSpecies: Array.isArray(json.generatedData.activeSpecies)
          ? json.generatedData.activeSpecies
          : [],
        seasons:
          typeof json.generatedData.seasons === 'string'
            ? json.generatedData.seasons
            : '',
        bestFishingTimes: {
          ok: json.generatedData?.bestFishingTimes?.ok || '',
          good: json.generatedData?.bestFishingTimes?.good || '',
          great: json.generatedData?.bestFishingTimes?.great || '',
        },
        tips: Array.isArray(json.generatedData.tips)
          ? json.generatedData.tips.filter(
              (tip: any) => typeof tip === 'string'
            )
          : [],
        seasonPhases: Array.isArray(json.generatedData.seasonPhases)
          ? json.generatedData.seasonPhases
          : [],
        baitRecommendations,
        tackle: (json.generatedData.tackle || []).map(normalizeTackleItem),
        source: json.source || 'ai',
      }
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    return null
  }
}
