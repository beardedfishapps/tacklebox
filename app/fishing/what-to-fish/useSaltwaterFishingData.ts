import Tackle from '@/app/classes/Tackle'
import CityState from '@/app/classes/CityState'
import BaitRecommendations from '@/app/classes/BaitRecommendations'
import FishingData from '@/app/classes/FishingData'
import { getSeasons } from '@/app/helpers/date'
import {
  getFishingConditions,
  getWeather,
  pickTackle,
  getWeatherValues,
  getSpecies,
} from '@/app/helpers/whattofish'
import {
  getAiFishingRecommendations,
  getAiGeneratedFishingData,
  isAiEnabled,
  normalizeConfidence,
} from '@/app/helpers/aiFishingAssist'
import { convertArrayToCommaSeparatedString } from '@/app/helpers/string'

async function pickBaitRecommendations(
  weather: any,
  species: string[],
  seasons: string,
  waterType: string
): Promise<BaitRecommendations> {
  let baitRecommendations = new BaitRecommendations()
  let stylesToUse: any[] = []
  let baitsToUse: any[] = []

  baitsToUse.push(
    { name: 'live sand worms', confidence: 10 },
    { name: 'shrimp', confidence: 10 },
    { name: 'squid', confidence: 10 },
    { name: 'crab', confidence: 10 },
    { name: 'clams', confidence: 10 }
  )
  stylesToUse.push(
    { name: 'natural', confidence: 10 },
    { name: 'white', confidence: 10 },
    { name: 'silver', confidence: 10 },
    { name: 'pink', confidence: 10 },
    { name: 'chartreuse', confidence: 10 }
  )

  baitsToUse = baitsToUse.map((bait) => normalizeConfidence(bait))
  stylesToUse = stylesToUse.map((style) => normalizeConfidence(style))

  baitsToUse.sort((a, b) => b.confidence - a.confidence)
  stylesToUse.sort((a, b) => b.confidence - a.confidence)

  const aiRecommendations = await getAiFishingRecommendations({
    location: weather.location,
    weather,
    species,
    seasons,
    waterType,
    candidates: {
      baitsToUse,
      stylesToUse,
    },
  })

  if (aiRecommendations) {
    return aiRecommendations
  }

  baitRecommendations.stylesToUse = stylesToUse
  baitRecommendations.baitsToUse = baitsToUse

  return baitRecommendations
}

function getFishingSeasons(): string {
  let seasons: string[] = getSeasons()

  let seasonString = convertArrayToCommaSeparatedString(seasons)

  return seasonString
}

export async function getSaltwaterFishingData(
  zip: string,
  cityState: string,
  weatherForecastToUse: string,
  cityStateList: CityState[],
  geolocation: string,
  waterType: string,
  setLoadingText: Function = () => {},
  species?: string[]
): Promise<FishingData> {
  let normalizedGeolocation = geolocation
  let normalizedWaterType = waterType
  let normalizedSetLoadingText = setLoadingText
  let normalizedSpecies = species

  if (typeof normalizedSetLoadingText !== 'function') {
    normalizedWaterType = setLoadingText as unknown as string
    normalizedSetLoadingText = () => {}
  }

  let fishingData = new FishingData()

  normalizedSetLoadingText('Loading weather...')
  const weather = await getWeather(zip, cityState, normalizedGeolocation)

  const location =
    normalizedGeolocation !== ''
      ? normalizedGeolocation
      : cityState !== ''
      ? cityState
      : zip

  if (location == '') {
    return fishingData
  }

  if (weather && weather.location) {
    normalizedSetLoadingText('Getting fishing seasons...')
    fishingData.seasons = getFishingSeasons()
    normalizedSetLoadingText('Getting weather values...')
    fishingData.weather = getWeatherValues(weather, fishingData.seasons)

    if (isAiEnabled()) {
      try {
        normalizedSetLoadingText('AI is analyzing fishing conditions...')
        const aiData = await getAiGeneratedFishingData({
          location: weather.location,
          weather,
          species: normalizedSpecies || [],
          seasons: fishingData.seasons,
          waterType: normalizedWaterType,
          candidates: { baitsToUse: [], stylesToUse: [] },
        })
        if (aiData) {
          fishingData.activeSpecies = aiData.activeSpecies
          fishingData.species =
            normalizedSpecies !== undefined && normalizedSpecies.length > 0
              ? normalizedSpecies
              : aiData.species
          if (aiData.seasons && aiData.seasons.trim() !== '') {
            fishingData.seasons = aiData.seasons
          }
          fishingData.bestFishingTimes = aiData.bestFishingTimes
          fishingData.seasonPhases = aiData.seasonPhases
          fishingData.baitRecommendations = aiData.baitRecommendations
          fishingData.tackle = aiData.tackle
          fishingData.aiGenerated = true
          fishingData.aiSource = aiData.source
          normalizedSetLoadingText('Determining fishing conditions...')
          fishingData.fishingConditions = getFishingConditions(
            weather,
            fishingData,
            weatherForecastToUse
          )
          normalizedSetLoadingText('Loading...')
          return fishingData
        }
      } catch (error) {
        console.error(error)
      }
    }

    const waterTemp =
      weatherForecastToUse == 'current'
        ? parseFloat(fishingData.weather.current.waterTemp)
        : parseFloat(
            fishingData.weather.forecast[
              weatherForecastToUse == 'today' ? 0 : 1
            ].waterTemp
          )

    normalizedSetLoadingText('Getting active species...')
    fishingData.activeSpecies = await getSpecies(waterTemp, normalizedWaterType)

    fishingData.species =
      normalizedSpecies !== undefined
        ? normalizedSpecies
        : fishingData.activeSpecies

    normalizedSetLoadingText('Picking bait...')
    fishingData.baitRecommendations = await pickBaitRecommendations(
      weather,
      fishingData.species,
      fishingData.seasons,
      normalizedWaterType
    )

    normalizedSetLoadingText('Loading tackle...')
    let tackleList: Tackle[] = []
    await fetch('/api/tackle')
      .then((res) => res.json())
      .then((json) => {
        tackleList = json.tackle
      })

    normalizedSetLoadingText('Picking tackle...')
    fishingData.tackle = await pickTackle(
      tackleList,
      fishingData,
      waterTemp,
      normalizedWaterType
    )

    normalizedSetLoadingText('Determining fishing conditions...')
    fishingData.fishingConditions = getFishingConditions(
      weather,
      fishingData,
      weatherForecastToUse
    )

    normalizedSetLoadingText('Loading...')
  } else if (
    normalizedGeolocation !== '' ||
    cityState !== '' ||
    (zip !== '' && zip.length == 5)
  ) {
    throw 'Unable to load weather for location: ' + location
  }

  return fishingData
}
