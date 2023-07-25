import Tackle from '../classes/Tackle'
import WeatherData from '../classes/WeatherData'
import WeatherDataChild from '../classes/WeatherDataChild'
import AstroData from '../classes/AstroData'
import FishingConditions from '../classes/FishingConditions'

const warmWaterMax = 82.5
const warmWaterMin = 57.5

export function getFishingConditions(
  weather: any,
  species: string,
  seasons: string,
  useCurrentWeather: boolean
) {
  let fishingConditionsText: string = ''
  let positiveConditionsNotes: string[] = []
  let negativeConditionsNotes: string[] = []
  let starRating = 0
  const speciesArray = species.split(',').map((s) => s.trim())
  let fishingConditions = new FishingConditions()

  if (speciesArray.length >= 8) {
    starRating += 3
    positiveConditionsNotes.push('at least 8 active species')
  } else if (speciesArray.length > 6) {
    starRating += 2
    positiveConditionsNotes.push('several active species')
  } else if (speciesArray.length > 3) {
    starRating++
    positiveConditionsNotes.push('more than 3 active species')
  } else if (speciesArray.length == 1) {
    starRating--
    negativeConditionsNotes.push('no active species')
  } else {
    positiveConditionsNotes.push('a few active species')
  }

  if (useCurrentWeather) {
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
      positiveConditionsNotes.push('within the last three hours until sunset')
    } else if (
      (seasons.includes('summer') || seasons.includes('winter')) &&
      now.getHours() - sunrise.getHours() <= 3 &&
      now.getHours() - sunrise.getHours() > 0
    ) {
      starRating++
      positiveConditionsNotes.push('within the first three hours after sunrise')
    } else if (
      !seasons.includes('summer') &&
      !seasons.includes('winter') &&
      now.getHours() - sunrise.getHours() > 3
    ) {
      starRating++
      positiveConditionsNotes.push('at least three hours after sunrise')
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

    if (weather.current.pressure_in < 29.8) {
      starRating += 2
      positiveConditionsNotes.push('very good barometric pressure')
    } else if (
      weather.current.pressure_in >= 29.8 &&
      weather.current.pressure_in <= 30.2
    ) {
      starRating++
      positiveConditionsNotes.push('ideal barometric pressure')
    } else {
      starRating--
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
        negativeConditionsNotes.push('will rain within the next two hours')
        break
      }

      // if it will rain in exactly three hours, good
      if (forecastHour.will_it_rain == 1 && hourIndex == now.getHours() + 3) {
        starRating++
        positiveConditionsNotes.push('will rain in three hours but not before')
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
    if (weather.forecast.forecastday[0].day.maxwind_mph < 6) {
      starRating += 3
      positiveConditionsNotes.push('not too windy')
    } else if (weather.forecast.forecastday[0].day.maxwind_mph < 10) {
      starRating += 2
      positiveConditionsNotes.push('fairly windy')
    } else if (weather.forecast.forecastday[0].day.maxwind_mph < 13) {
      starRating++
      positiveConditionsNotes.push('pretty windy')
    } else {
      starRating--
      negativeConditionsNotes.push('very windy')
    }

    if (weather.forecast.forecastday[0].day.daily_chance_of_rain < 70) {
      starRating++
      positiveConditionsNotes.push('low to no chance of rain')
    } else {
      starRating--
      negativeConditionsNotes.push('high chance of rain')
    }
  }

  const excellentStarRating = useCurrentWeather ? 11 : 5
  const reallyGoodStarRating = useCurrentWeather ? 8 : 3
  const goodStarRating = useCurrentWeather ? 5 : 1
  const okStarRating = useCurrentWeather ? 2 : 1

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
  seasons: string,
  species: string,
  waterTemp: number
): Tackle[] {
  let tackleToUse: Tackle[] = []

  tackleList.forEach(function (tackle: Tackle) {
    let isTackleForSpecies = false

    for (
      let speciesIndex = 0;
      speciesIndex < tackle.species.length;
      speciesIndex++
    ) {
      if (species.includes(tackle.species[speciesIndex])) {
        isTackleForSpecies = true
        break
      }
    }

    if (isTackleForSpecies && isTackleForWeather(tackle, seasons, waterTemp)) {
      tackleToUse.push(tackle)
    }
  })

  return tackleToUse
}

export function isTackleForWeather(
  tackle: Tackle,
  seasons: string,
  waterTemp: number
): boolean {
  if (
    seasons.includes('bass pre-spawn') ||
    seasons.includes('bass spawn') ||
    seasons.includes('fall')
  ) {
    if (tackle.type.includes('reaction') && tackle.depth.includes('shallow')) {
      return true
    }
  }

  if (tackle.type.includes('still')) {
    return true
  }

  if (waterTemp > warmWaterMax) {
    if (!tackle.waterTemp.includes('warm')) {
      return false
    }

    if (!tackle.depth.includes('deep')) {
      return false
    }
  } else if (waterTemp > warmWaterMin) {
    if (!tackle.waterTemp.includes('warm')) {
      return false
    }

    if (!tackle.depth.includes('shallow')) {
      return false
    }
  } else {
    if (!tackle.waterTemp.includes('cold')) {
      return false
    }

    if (!tackle.type.includes('finesse')) {
      return false
    }

    if (!tackle.depth.includes('deep')) {
      return false
    }
  }

  return true
}

export function getWeatherValues(weather: any, seasons: string): WeatherData {
  let weatherData = new WeatherData()
  let current = new WeatherDataChild()
  let forecast = new WeatherDataChild()
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

  forecast.outdoorTemp = weather.forecast.forecastday[0].day.maxtemp_f + 'F'
  forecast.waterTemp =
    (
      weather.forecast.forecastday[0].day.maxtemp_f * waterTempMultiplier
    ).toFixed(0) + 'F'
  forecast.conditions = weather.forecast.forecastday[0].day.condition.text
  forecast.wind = weather.forecast.forecastday[0].day.maxwind_mph + 'mph'

  astro.sunrise = weather.forecast.forecastday[0].astro.sunrise
  astro.sunset = weather.forecast.forecastday[0].astro.sunset
  astro.moonrise = weather.forecast.forecastday[0].astro.moonrise
  astro.moonset = weather.forecast.forecastday[0].astro.moonset
  astro.moon_phase = weather.forecast.forecastday[0].astro.moon_phase

  weatherData.current = current
  weatherData.forecast = forecast
  weatherData.location = weather.location.name + ', ' + weather.location.region
  weatherData.pressure = weather.current.pressure_in
  weatherData.astro = astro

  return weatherData
}
