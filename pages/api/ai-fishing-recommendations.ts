function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function safeNumber(value: any, fallback: number): number {
  return typeof value === 'number' ? value : fallback
}

function sanitizeItems(items: any[]): any[] {
  return (items || []).map((item) => ({
    ...item,
    confidence: clamp(safeNumber(item?.confidence, 10), 0, 999),
  }))
}

function sanitizeTackleItems(items: any[]): any[] {
  return (items || []).map((item) => ({
    name: item?.name || '',
    confidence: clamp(safeNumber(item?.confidence, 10), 0, 999),
    species: Array.isArray(item?.species) ? item.species : [],
    waterTemp: Array.isArray(item?.waterTemp) ? item.waterTemp : [],
    type: Array.isArray(item?.type) ? item.type : [],
    depth: Array.isArray(item?.depth) ? item.depth : [],
    tip: item?.tip || '',
    weather: item?.weather || '',
  }))
}

function sanitizeSeasonPhases(items: any[]): any[] {
  return (items || []).map((item) => ({
    species: item?.species || '',
    phase: item?.phase || '',
    confidence: clamp(safeNumber(item?.confidence, 10), 0, 999),
    notes: item?.notes || '',
  }))
}

function parseModelJson(text: string): any | null {
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.substring(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const payload = req.body || {}
  const mode = payload.mode || 'rerank'
  const candidates = payload.candidates || {}
  const fallback = {
    baitsToUse: sanitizeItems(candidates.baitsToUse || []),
    stylesToUse: sanitizeItems(candidates.stylesToUse || []),
  }

  if (!apiKey) {
    if (mode === 'generate_all') {
      return res.status(200).json({ generatedData: null, source: 'fallback' })
    }
    return res
      .status(200)
      .json({ recommendations: fallback, source: 'fallback' })
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const systemPrompt =
    mode === 'generate_all'
      ? 'You are a fishing recommendation model. Analyze location, weather, water type, seasons, and requested species context. Return valid JSON only in the exact generatedData schema requested, including confidence 0-999.'
      : 'You are a fishing recommendation model. Analyze location, weather, water type, species, and seasons. Return valid JSON only with baitsToUse and stylesToUse arrays. Keep existing item shape and include confidence as an integer 0-999.'

  const userPrompt =
    mode === 'generate_all'
      ? JSON.stringify({
          task: 'Generate fishing species, tackle, and bait/style recommendations.',
          instructions: [
            'Do not include products or affiliate assumptions.',
            'Confidence means how well an item should work for these exact conditions.',
            'Every tackle item must include a type array.',
            'Use practical freshwater/saltwater techniques based on waterType.',
            'Return JSON only.',
          ],
          context: {
            location: payload.location,
            weather: payload.weather,
            species: payload.species,
            seasons: payload.seasons,
            waterType: payload.waterType,
          },
          outputSchema: {
            generatedData: {
              seasons: 'string',
              bestFishingTimes: {
                ok: 'time window text',
                good: 'time window text',
                great: 'time window text',
              },
              seasonPhases: [
                {
                  species: 'string',
                  phase: 'pre-spawn|spawn|post-spawn|transition',
                  confidence: 10,
                  notes: 'optional string',
                },
              ],
              species: ['string'],
              activeSpecies: ['string'],
              baitRecommendations: {
                baitsToUse: [
                  {
                    name: 'string',
                    confidence: 10,
                    species: ['string'],
                    type: ['string'],
                  },
                ],
                stylesToUse: [
                  {
                    name: 'string',
                    confidence: 10,
                    species: ['string'],
                    type: ['string'],
                    waterClarity: 'optional string',
                  },
                ],
              },
              tackle: [
                {
                  name: 'string',
                  confidence: 10,
                  species: ['string'],
                  waterTemp: ['warm|cold'],
                  type: ['reaction|finesse|still|freshwater|saltwater|natural'],
                  depth: ['shallow|deep'],
                  tip: 'string',
                  weather: 'string',
                },
              ],
            },
          },
        })
      : JSON.stringify({
          task: 'Re-score fishing recommendations using provided candidates only.',
          instructions: [
            'Do not invent fields beyond current item keys plus optional aiReason.',
            'Prefer adjusting confidence over replacing items.',
            'Return same arrays with updated confidence values.',
            'If uncertain, keep original confidence.',
          ],
          context: {
            location: payload.location,
            weather: payload.weather,
            species: payload.species,
            seasons: payload.seasons,
            waterType: payload.waterType,
          },
          candidates: fallback,
          outputSchema: {
            baitsToUse: [
              { name: 'string', confidence: 10, aiReason: 'optional' },
            ],
            stylesToUse: [
              { name: 'string', confidence: 10, aiReason: 'optional' },
            ],
          },
        })

  try {
    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        }),
      }
    )

    if (!openaiResponse.ok) {
      if (mode === 'generate_all') {
        return res.status(200).json({ generatedData: null, source: 'fallback' })
      }
      return res
        .status(200)
        .json({ recommendations: fallback, source: 'fallback' })
    }

    const completion = await openaiResponse.json()
    const content = completion?.choices?.[0]?.message?.content || '{}'
    const parsed = parseModelJson(content)

    if (!parsed) {
      if (mode === 'generate_all') {
        return res.status(200).json({ generatedData: null, source: 'fallback' })
      }
      return res
        .status(200)
        .json({ recommendations: fallback, source: 'fallback' })
    }

    if (mode === 'generate_all') {
      const generated = parsed.generatedData || {}
      const generatedData = {
        seasons: typeof generated.seasons === 'string' ? generated.seasons : '',
        bestFishingTimes: {
          ok: generated?.bestFishingTimes?.ok || '',
          good: generated?.bestFishingTimes?.good || '',
          great: generated?.bestFishingTimes?.great || '',
        },
        seasonPhases: sanitizeSeasonPhases(generated.seasonPhases || []),
        species: Array.isArray(generated.species) ? generated.species : [],
        activeSpecies: Array.isArray(generated.activeSpecies)
          ? generated.activeSpecies
          : [],
        baitRecommendations: {
          baitsToUse: sanitizeItems(
            generated?.baitRecommendations?.baitsToUse || []
          ),
          stylesToUse: sanitizeItems(
            generated?.baitRecommendations?.stylesToUse || []
          ),
        },
        tackle: sanitizeTackleItems(generated.tackle || []),
      }
      return res.status(200).json({ generatedData, source: 'openai' })
    }

    const recommendations = {
      baitsToUse: sanitizeItems(parsed.baitsToUse || fallback.baitsToUse),
      stylesToUse: sanitizeItems(parsed.stylesToUse || fallback.stylesToUse),
    }

    return res.status(200).json({ recommendations, source: 'openai' })
  } catch (error) {
    console.error(error)
    if (mode === 'generate_all') {
      return res.status(200).json({ generatedData: null, source: 'fallback' })
    }
    return res
      .status(200)
      .json({ recommendations: fallback, source: 'fallback' })
  }
}
