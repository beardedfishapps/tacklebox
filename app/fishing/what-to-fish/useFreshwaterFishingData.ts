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

export async function pickBaitRecommendations(
  weather: any,
  species: string[],
  seasons: string,
  waterType: string
): Promise<BaitRecommendations> {
  let baitRecommendations = new BaitRecommendations()
  let stylesToUse: string[] = []
  let baitsToUse: string[] = []

  const baits = await fetch('/api/baits').then((res) => res.json())
  const colors = await fetch('/api/colors').then((res) => res.json())
  const styles = await fetch('/api/styles').then((res) => res.json())

  baits.baits.forEach((bait: any) => {
    bait.type?.forEach((t: any) => {
      if (seasons.includes(t)) {
        bait.confidence++
      }
      if (t.includes('product')) {
        bait.confidence++
      }
      if (t.includes('ambassador')) {
        bait.confidence++
      }
    })

    if (!bait.species) {
      bait.confidence++
      baitsToUse.push(bait)
    } else {
      const baitConfidence = bait.confidence
      bait.species.forEach((s: any) => {
        if (species.includes(s)) {
          bait.confidence++
        }
      })

      if (baitConfidence < bait.confidence && !baitsToUse.includes(bait)) {
        baitsToUse.push(bait)
      }
    }
  })

  colors.colors.forEach((color: any) => {
    color.type?.forEach((t: any) => {
      if (seasons.includes(t)) {
        color.confidence++
      }
    })

    if (weather.current.cloud >= 75 && color.weather == 'cloudy') {
      color.confidence++
    }

    stylesToUse.push(color)
  })

  styles.styles.forEach((style: any) => {
    style.type?.forEach((t: any) => {
      if (seasons.includes(t)) {
        style.confidence++
      }
    })

    style.species.forEach((s: any) => {
      if (species.includes(s) && !stylesToUse.includes(style)) {
        stylesToUse.push(style)
      }
    })
  })

  stylesToUse.sort((a: any, b: any) => {
    if (a.confidence < b.confidence) {
      return 1
    }
    if (a.confidence > b.confidence) {
      return -1
    }
    // a must be equal to b
    return 0
  })

  baitsToUse.sort((a: any, b: any) => {
    if (a.confidence < b.confidence) {
      return 1
    }
    if (a.confidence > b.confidence) {
      return -1
    }
    // a must be equal to b
    return 0
  })

  baitsToUse = baitsToUse.map((bait: any) => normalizeConfidence(bait))
  stylesToUse = stylesToUse.map((style: any) => normalizeConfidence(style))

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
    baitRecommendations.stylesToUse = aiRecommendations.stylesToUse
    baitRecommendations.baitsToUse = aiRecommendations.baitsToUse
    return baitRecommendations
  }

  baitRecommendations.stylesToUse = stylesToUse
  baitRecommendations.baitsToUse = baitsToUse

  return baitRecommendations
}

function getFishingSeasons(
  weather: any,
  cityStateString: string,
  cityStateList: CityState[]
): string {
  let today = new Date()
  let todayMonth = today.getMonth() + 1
  let seasons: string[] = getSeasons()
  let state = ''
  let cityState: CityState | undefined = new CityState()
  const waterTempMultiplier = seasons.length > 1 ? 0.875 : 0.95
  const waterTemp =
    waterTempMultiplier * weather.forecast.forecastday[0].day.maxtemp_f

  if (cityStateString && cityStateString !== '') {
    state = cityStateString.split(',')[1]
  } else {
    state = weather.location.region
  }

  cityState = cityStateList.find((cs) => {
    return cs.state == state
  })

  if (cityState && cityState.location.includes('north')) {
    switch (todayMonth) {
      case 3:
        seasons.push('trout stocking')
        seasons.push('spring transition')
        break
      case 4:
        seasons.push('trout stocking')
        seasons.push('walleye pre-spawn')
        seasons.push('perch pre-spawn')
        seasons.push('pike pre-spawn')
        seasons.push('pickerel pre-spawn')
        seasons.push('muskie pre-spawn')
        break
      case 5:
        if (waterTemp >= 42.5 || today.getDate() > 15) {
          seasons.push('walleye spawn')
          seasons.push('perch spawn')
          seasons.push('pike spawn')
        } else {
          seasons.push('walleye pre-spawn')
          seasons.push('perch pre-spawn')
          seasons.push('pike pre-spawn')
        }
        if (waterTemp >= 47.5 || today.getDate() > 15) {
          seasons.push('pickerel spawn')
        } else {
          seasons.push('pickerel pre-spawn')
        }
        if (waterTemp >= 52.5 || today.getDate() > 15) {
          seasons.push('muskie spawn')
        } else {
          seasons.push('muskie pre-spawn')
        }
        seasons.push('sunfish pre-spawn')
        seasons.push('crappie pre-spawn')
        seasons.push('bass pre-spawn')
        break
      case 6:
        if (waterTemp >= 58.5 || today.getDate() > 15) {
          seasons.push('smallmouth bass spawn')
          seasons.push('crappie spawn')
        } else {
          seasons.push('bass pre-spawn')
          seasons.push('crappie pre-spawn')
        }
        if (waterTemp >= 62.5 || today.getDate() > 15) {
          seasons.push('largemouth bass spawn')
        } else if (!seasons.includes('bass pre-spawn')) {
          seasons.push('bass pre-spawn')
        }
        seasons.push('sunfish spawn')
        seasons.push('catfish pre-spawn')
        seasons.push('carp pre-spawn')
        seasons.push('summer transition')
        break
      case 7:
        if (waterTemp >= 68.5 || today.getDate() > 15) {
          seasons.push('catfish spawn')
        } else {
          seasons.push('catfish pre-spawn')
        }
        seasons.push('carp spawn')
        break
      case 9:
        seasons.push('trout stocking')
        seasons.push('fall transition')
        break
      case 10:
        seasons.push('trout stocking')
        break
      case 12:
        seasons.push('winter transition')
        break
      default:
        break
    }
  }
  if (cityState && cityState.location.includes('mid')) {
    switch (todayMonth) {
      case 3:
        seasons.push('walleye pre-spawn')
        seasons.push('perch pre-spawn')
        seasons.push('pike pre-spawn')
        seasons.push('pickerel pre-spawn')
        seasons.push('muskie pre-spawn')
        break
      case 4:
        if (waterTemp >= 42.5 || today.getDate() > 15) {
          seasons.push('walleye spawn')
          seasons.push('perch spawn')
          seasons.push('pike spawn')
        } else {
          seasons.push('walleye pre-spawn')
          seasons.push('perch pre-spawn')
          seasons.push('pike pre-spawn')
        }
        if (waterTemp >= 47.5 || today.getDate() > 15) {
          seasons.push('pickerel spawn')
        } else {
          seasons.push('pickerel pre-spawn')
        }
        if (waterTemp >= 52.5 || today.getDate() > 15) {
          seasons.push('muskie spawn')
        } else {
          seasons.push('muskie pre-spawn')
        }
        seasons.push('sunfish pre-spawn')
        seasons.push('crappie pre-spawn')
        seasons.push('bass pre-spawn')
        break
      case 5:
        if (waterTemp >= 58.5 || today.getDate() > 15) {
          seasons.push('smallmouth bass spawn')
          seasons.push('crappie spawn')
        } else {
          seasons.push('bass pre-spawn')
          seasons.push('crappie pre-spawn')
        }
        if (waterTemp >= 62.5 || today.getDate() > 15) {
          seasons.push('largemouth bass spawn')
        } else if (!seasons.includes('bass pre-spawn')) {
          seasons.push('bass pre-spawn')
        }
        seasons.push('sunfish spawn')
        seasons.push('catfish pre-spawn')
        seasons.push('carp pre-spawn')
        break
      case 6:
        if (waterTemp >= 68.5 || today.getDate() > 15) {
          seasons.push('catfish spawn')
        } else {
          seasons.push('catfish pre-spawn')
        }
        seasons.push('carp spawn')
        break
      default:
        break
    }
  }
  if (cityState && cityState.location.includes('south')) {
    switch (todayMonth) {
      case 2:
        seasons.push('walleye pre-spawn')
        seasons.push('perch pre-spawn')
        seasons.push('pike pre-spawn')
        seasons.push('pickerel pre-spawn')
        seasons.push('muskie pre-spawn')
        break
      case 3:
        if (waterTemp >= 42.5 || today.getDate() > 15) {
          seasons.push('walleye spawn')
          seasons.push('pike spawn')
        } else {
          seasons.push('walleye pre-spawn')
          seasons.push('pike pre-spawn')
        }
        if (waterTemp >= 47.5 || today.getDate() > 15) {
          seasons.push('pickerel spawn')
        } else {
          seasons.push('pickerel pre-spawn')
        }
        if (waterTemp >= 52.5 || today.getDate() > 15) {
          seasons.push('muskie spawn')
          seasons.push('perch spawn')
        } else {
          seasons.push('muskie pre-spawn')
          seasons.push('perch pre-spawn')
        }
        seasons.push('sunfish pre-spawn')
        seasons.push('crappie pre-spawn')
        seasons.push('bass pre-spawn')
        break
      case 4:
        if (waterTemp >= 58.5 || today.getDate() > 15) {
          seasons.push('smallmouth bass spawn')
          seasons.push('crappie spawn')
        } else {
          seasons.push('bass pre-spawn')
          seasons.push('crappie pre-spawn')
        }
        if (waterTemp >= 62.5 || today.getDate() > 15) {
          seasons.push('largemouth bass spawn')
        } else if (!seasons.includes('bass pre-spawn')) {
          seasons.push('bass pre-spawn')
        }
        seasons.push('sunfish spawn')
        seasons.push('catfish pre-spawn')
        seasons.push('carp pre-spawn')
        break
      case 5:
        if (waterTemp >= 68.5 || today.getDate() > 15) {
          seasons.push('catfish spawn')
        } else {
          seasons.push('catfish pre-spawn')
        }
        seasons.push('carp spawn')
        break
      default:
        break
    }
  }

  let seasonString = convertArrayToCommaSeparatedString(seasons)

  return seasonString
}

export async function getFreshwaterFishingData(
  zip: string,
  cityState: string,
  weatherForecastToUse: string,
  cityStateList: CityState[],
  geolocation: string,
  waterType: string,
  setLoadingText: Function = () => {},
  species?: string[]
): Promise<FishingData> {
  let normalizedCityStateList = cityStateList
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
    fishingData.seasons = getFishingSeasons(
      weather,
      cityState,
      normalizedCityStateList
    )
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
          fishingData.tips = aiData.tips
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
    let tackleList: Tackle[] = []
    normalizedSetLoadingText('Loading tackle...')
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

    normalizedSetLoadingText('Adjusting tackle confidence...')
    fishingData.tackle.forEach((tackle: Tackle) => {
      const conditions =
        weatherForecastToUse == 'current'
          ? fishingData.weather.current.conditions
          : fishingData.weather.forecast[
              weatherForecastToUse == 'today' ? 0 : 1
            ].conditions
      if (
        tackle.weather &&
        conditions.toUpperCase().includes(tackle.weather.toUpperCase())
      ) {
        tackle.confidence++
      }
    })

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
