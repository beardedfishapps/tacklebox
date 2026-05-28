import Tackle from '../classes/Tackle'
import WeatherData from '../classes/WeatherData'
import WeatherDataChild from '../classes/WeatherDataChild'
import AstroData from '../classes/AstroData'
import FishingConditions from '../classes/FishingConditions'
import FishingData from '../classes/FishingData'
import Species from '../classes/Species'

const warmWaterMax = 78.5
const warmWaterMin = 51.5

export async function getSpecies(
  waterTemp: number,
  waterType: string
): Promise<string[]> {
  let activeSpecies: string[] = []
  let species: Species[] = []
  let wiggle = 2.5

  if (waterTemp < 30) {
    return ['Not ideal fishing weather for any species']
  }

  try {
    await fetch('/api/species')
      .then((res) => res.json())
      .then((json) => {
        species = json.species
      })
  } catch (error) {
    console.error(error)
  }

  species.forEach((s) => {
    if (!s.min_water_temp || !s.max_water_temp) {
      return
    }

    if (
      waterTemp >= s.min_water_temp - wiggle &&
      waterTemp <= s.max_water_temp + wiggle &&
      waterType.includes(s.water_type)
    ) {
      activeSpecies.push(s.name)
    }
  })

  return activeSpecies.length > 0
    ? activeSpecies
    : ['Not ideal fishing weather for any species']
}

export function getFishingConditions(
  weather: any,
  fishingData: FishingData,
  weatherForecastToUse: string
) {
  let fishingConditionsText: string = ''
  let positiveConditionsNotes: string[] = []
  let negativeConditionsNotes: string[] = []
  let starRating = 0
  let fishingConditions = new FishingConditions()
  const activeSpecies = fishingData.activeSpecies
  const species = fishingData.species
  const seasons = fishingData.seasons

  if (
    activeSpecies.length >= 9 ||
    (activeSpecies.length == 0 && species.length >= 9)
  ) {
    starRating += 3
  } else if (
    activeSpecies.length >= 6 ||
    (activeSpecies.length == 0 && species.length >= 6)
  ) {
    starRating += 2
  } else if (
    activeSpecies.length >= 3 ||
    (activeSpecies.length == 0 && species.length >= 3)
  ) {
    starRating++
  } else if (
    (activeSpecies[0] && activeSpecies[0].includes('Not ideal')) ||
    species[0] == '' ||
    species[0].includes('Not ideal')
  ) {
    starRating -= 3
  }

  let isFishingForActiveSpecies = false
  species.forEach((s) => {
    if (activeSpecies.includes(s)) {
      isFishingForActiveSpecies = true
    }
  })

  if (isFishingForActiveSpecies) {
    starRating++
  } else if (activeSpecies.length > 0 && !isFishingForActiveSpecies) {
    starRating -= 2
  }

  if (fishingData.tackle.length >= 5) {
    starRating += 2
  } else if (fishingData.tackle.length >= 1) {
    starRating++
  } else {
    starRating -= 2
  }

  if (weatherForecastToUse == 'current') {
    const now = new Date()
    let sunrise = new Date()
    sunrise.setHours(
      parseInt(weather.forecast.forecastday[0].astro.sunrise.substring(0, 2))
    )
    sunrise.setMinutes(
      weather.forecast.forecastday[0].astro.sunrise.substring(3, 5)
    )
    let sunset = new Date()
    sunset.setHours(
      parseInt(weather.forecast.forecastday[0].astro.sunset.substring(0, 2)) +
        12
    )
    sunset.setMinutes(
      weather.forecast.forecastday[0].astro.sunset.substring(3, 5)
    )

    if (
      sunset.getHours() - now.getHours() <= 3 &&
      sunset.getHours() - now.getHours() > 0
    ) {
      starRating += 2
    } else if (
      (seasons.includes('summer') || seasons.includes('winter')) &&
      now.getHours() - sunrise.getHours() <= 3 &&
      now.getHours() - sunrise.getHours() > 0
    ) {
      starRating++
    } else if (
      !seasons.includes('summer') &&
      !seasons.includes('winter') &&
      now.getHours() - sunrise.getHours() > 3 &&
      sunset.getHours() - now.getHours() > 0
    ) {
      starRating++
    }

    if (weather.current.wind_mph < 6) {
      starRating += 3
      positiveConditionsNotes.push('not too windy')
    } else if (weather.current.wind_mph < 10) {
      starRating += 2
      positiveConditionsNotes.push('fairly windy')
    } else if (weather.current.wind_mph < 13) {
      starRating++
      positiveConditionsNotes.push('pretty windy')
    } else {
      starRating--
      negativeConditionsNotes.push('very windy')
    }

    if (weather.current.pressure_in < 29.7) {
      starRating++
      positiveConditionsNotes.push('very good barometric pressure')
    } else if (
      weather.current.pressure_in >= 29.7 &&
      weather.current.pressure_in <= 30.4
    ) {
      starRating += 2
      positiveConditionsNotes.push('ideal barometric pressure')
    } else {
      starRating -= 2
      negativeConditionsNotes.push('not good barometric pressure')
    }

    for (
      let hourIndex = now.getHours();
      hourIndex < now.getHours() + 4;
      hourIndex++
    ) {
      const forecastHour =
        hourIndex < weather.forecast.forecastday[0].hour.length
          ? weather.forecast.forecastday[0].hour[hourIndex]
          : undefined
      const isEndOfDay =
        hourIndex == weather.forecast.forecastday[0].hour.length - 1

      // if forecast hour is out of bounds or we reached the end of the hours array
      if (!forecastHour || isEndOfDay) {
        break
      }

      // if it will rain within the next two hours, no good
      if (forecastHour.will_it_rain == 1 && hourIndex < now.getHours() + 2) {
        starRating--
        break
      }

      // if it will rain in exactly three hours, good
      if (forecastHour.will_it_rain == 1 && hourIndex == now.getHours() + 3) {
        starRating++
        break
      }
    }

    if (weather.current.cloud == 100) {
      starRating += 3
      positiveConditionsNotes.push('very cloudy')
    } else if (weather.current.cloud >= 75) {
      starRating += 2
      positiveConditionsNotes.push('mostly cloudy')
    } else if (weather.current.cloud >= 50) {
      starRating++
      positiveConditionsNotes.push('partly cloudy')
    }
  } else {
    let forecastDayIndex = weatherForecastToUse == 'today' ? 0 : 1
    if (weather.forecast.forecastday[forecastDayIndex].day.maxwind_mph < 6) {
      starRating += 3
      positiveConditionsNotes.push('not too windy')
    } else if (
      weather.forecast.forecastday[forecastDayIndex].day.maxwind_mph < 10
    ) {
      starRating += 2
      positiveConditionsNotes.push('fairly windy')
    } else if (
      weather.forecast.forecastday[forecastDayIndex].day.maxwind_mph < 13
    ) {
      starRating++
      positiveConditionsNotes.push('pretty windy')
    } else {
      starRating--
      negativeConditionsNotes.push('very windy')
    }

    if (
      weather.forecast.forecastday[forecastDayIndex].day.daily_chance_of_rain <
      70
    ) {
      starRating++
      positiveConditionsNotes.push('low to no chance of rain')
    } else {
      starRating--
      negativeConditionsNotes.push('high chance of rain')
    }
  }

  if (
    weather.forecast.forecastday[0].astro.moon_illumination >= 98 ||
    weather.forecast.forecastday[0].astro.moon_illumination <= 2 ||
    weather.forecast.forecastday[0].astro.moon_phase.includes('Quarter')
  ) {
    starRating += 2
    positiveConditionsNotes.push('optimal moon phase')
  }

  const excellentStarRating = weatherForecastToUse ? 14 : 6
  const reallyGoodStarRating = weatherForecastToUse ? 11 : 4
  const goodStarRating = weatherForecastToUse ? 8 : 2
  const okStarRating = weatherForecastToUse ? 5 : 1

  if (starRating > excellentStarRating) {
    fishingConditionsText += 'Excellent'
  } else if (starRating > reallyGoodStarRating) {
    fishingConditionsText += 'Really Good'
  } else if (starRating > goodStarRating) {
    fishingConditionsText += 'Good'
  } else if (starRating >= okStarRating) {
    fishingConditionsText += 'OK'
  } else {
    fishingConditionsText += 'Not Ideal'
  }

  fishingConditions.conditionsText = fishingConditionsText
  fishingConditions.positiveConditionsNotes = positiveConditionsNotes
  fishingConditions.negativeConditionsNotes = negativeConditionsNotes

  return fishingConditions
}

export async function getWeather(
  zip: string,
  cityState: string,
  geolocation: string
) {
  let query = ''

  if (geolocation == '' && cityState == '' && (!zip || zip.length !== 5)) {
    return
  }

  if (geolocation !== '') {
    query = geolocation
  } else if (cityState !== '') {
    query = cityState
  } else {
    query = zip
  }

  if (query !== '') {
    const res = await fetch('/api/weather?q=' + query, { cache: 'no-store' })

    return res.json()
  }

  return
}

export function pickTackle(
  tackleList: Tackle[],
  fishingData: FishingData,
  waterTemp: number,
  waterType: string
): Tackle[] {
  let tackleToUse: Tackle[] = []

  tackleList.forEach(function (tackle: Tackle) {
    let isTackleForWaterType = false
    const seasonsArray: string[] = fishingData.seasons
      .split(',')
      .map((s) => s.trim())
    let isTackleForSeason = false
    let isTackleForSpawnSeason = false
    let isTackleForBaitStyle = false

    for (let typeIndex = 0; typeIndex < tackle.type.length; typeIndex++) {
      if (waterType.includes(tackle.type[typeIndex])) {
        isTackleForWaterType = true
      }

      isTackleForBaitStyle = true
    }

    seasonsArray.forEach((season) => {
      if (
        season.includes('pre-spawn') &&
        tackle.species.includes(season.split(' ')[0]) &&
        tackle.type.includes('reaction')
      ) {
        isTackleForSpawnSeason = true
      }

      if (tackle.type.includes(season)) {
        isTackleForSeason = true
      }
    })

    // extras
    if (isTackleForSpawnSeason) {
      tackle.confidence += 2
    }

    if (isTackleForWeather(tackle, waterTemp)) {
      tackle.confidence += 2
    }

    fishingData.baitRecommendations.stylesToUse.forEach((s) => {
      if (tackle.type.includes(s.name)) {
        tackle.confidence++
      }
    })

    if (isTackleForWaterType && isTackleForBaitStyle && isTackleForSeason) {
      tackleToUse.push(tackle)
    }
  })

  return tackleToUse
}

export function isTackleForWeather(tackle: Tackle, waterTemp: number): boolean {
  let isTackleForWeather = true
  const tackleType = Array.isArray(tackle.type) ? tackle.type : []
  const tackleWaterTemp = Array.isArray(tackle.waterTemp)
    ? tackle.waterTemp
    : []
  const tackleDepth = Array.isArray(tackle.depth) ? tackle.depth : []

  if (!tackleType.includes('still')) {
    if (waterTemp > warmWaterMin) {
      if (!tackleWaterTemp.includes('warm')) {
        isTackleForWeather = false
      }

      if (waterTemp > warmWaterMax) {
        if (!tackleDepth.includes('deep')) {
          isTackleForWeather = false
        }
      } else if (!tackleDepth.includes('shallow')) {
        isTackleForWeather = false
      }
    } else {
      if (!tackleWaterTemp.includes('cold')) {
        isTackleForWeather = false
      }

      if (!tackleType.includes('finesse')) {
        isTackleForWeather = false
      }

      if (!tackleDepth.includes('deep')) {
        isTackleForWeather = false
      }
    }
  }

  return isTackleForWeather
}

export function getWeatherValues(weather: any, seasons: string): WeatherData {
  let weatherData = new WeatherData()
  let current = new WeatherDataChild()
  let forecast: WeatherDataChild[] = []
  let forecastDayOne = new WeatherDataChild()
  let forecastDayTwo = new WeatherDataChild()
  let astro = new AstroData()
  const mainSeasons = []
  seasons.split(',').forEach((season) => {
    if (
      season.trim() == 'spring' ||
      season.trim() == 'summer' ||
      season.trim() == 'fall' ||
      season.trim() == 'winter'
    ) {
      mainSeasons.push(season.trim())
    }
  })
  const waterTempMultiplier = mainSeasons.length > 1 ? 0.875 : 0.95

  current.outdoorTemp = weather.current.temp_f + 'F'
  current.waterTemp =
    (weather.current.feelslike_f * waterTempMultiplier).toFixed(0) + 'F'
  current.conditions = weather.current.condition.text
  current.wind = weather.current.wind_mph + 'mph'

  forecastDayOne.outdoorTemp =
    weather.forecast.forecastday[0].day.maxtemp_f + 'F'
  forecastDayOne.waterTemp =
    (
      weather.forecast.forecastday[0].day.maxtemp_f * waterTempMultiplier
    ).toFixed(0) + 'F'
  forecastDayOne.conditions = weather.forecast.forecastday[0].day.condition.text
  forecastDayOne.wind = weather.forecast.forecastday[0].day.maxwind_mph + 'mph'

  forecastDayTwo.outdoorTemp =
    weather.forecast.forecastday[1].day.maxtemp_f + 'F'
  forecastDayTwo.waterTemp =
    (
      weather.forecast.forecastday[1].day.maxtemp_f * waterTempMultiplier
    ).toFixed(0) + 'F'
  forecastDayTwo.conditions = weather.forecast.forecastday[1].day.condition.text
  forecastDayTwo.wind = weather.forecast.forecastday[1].day.maxwind_mph + 'mph'

  astro.sunrise = weather.forecast.forecastday[0].astro.sunrise
  astro.sunset = weather.forecast.forecastday[0].astro.sunset
  astro.moonrise = weather.forecast.forecastday[0].astro.moonrise
  astro.moonset = weather.forecast.forecastday[0].astro.moonset

  let moonPhase = ''
  if (weather.forecast.forecastday[0].astro.moon_illumination >= 98) {
    moonPhase = 'Full Moon'
  } else if (weather.forecast.forecastday[0].astro.moon_illumination <= 2) {
    moonPhase = 'New Moon'
  } else {
    moonPhase = weather.forecast.forecastday[0].astro.moon_phase
  }
  astro.moon_phase = moonPhase

  weatherData.current = current
  forecast.push(forecastDayOne, forecastDayTwo)
  weatherData.forecast = forecast
  weatherData.location = weather.location.name + ', ' + weather.location.region
  weatherData.pressure = weather.current.pressure_in
  weatherData.astro = astro

  return weatherData
}
