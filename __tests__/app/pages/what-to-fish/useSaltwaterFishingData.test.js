import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals'
import '@testing-library/jest-dom'
import { getSaltwaterFishingData } from '@/app/fishing/what-to-fish/useSaltwaterFishingData'
import tackleJSON from '../../../mockData/tackle.json'
import cityStateJSON from '../../../mockData/cityStates.json'
import weatherJSON from '../../../mockData/weather.json'
import speciesJSON from '../../../mockData/species.json'

let tackleList = []
let cityStatesList = []
let date = new Date()
let weatherData = {}
const originalAiEnabled = process.env.NEXT_PUBLIC_AI_ENABLED

const server = setupServer(
  rest.get('/api/weather', (req, res, ctx) => {
    return res(ctx.json(weatherData))
  }),
  rest.get('/api/species', (req, res, ctx) => {
    return res(ctx.json({ species: speciesJSON.species }))
  }),
  rest.get('/api/tackle', (req, res, ctx) => {
    return res(ctx.json({ tackle: tackleList }))
  })
)

beforeAll(() => {
  process.env.NEXT_PUBLIC_AI_ENABLED = 'false'
  resetTestData()
  server.listen()
})
afterEach(() => {
  resetTestData()
  server.resetHandlers()
})
afterAll(() => {
  process.env.NEXT_PUBLIC_AI_ENABLED = originalAiEnabled
  server.close()
})

function resetTestData() {
  // eslint-disable-next-line
  jest.useRealTimers()

  tackleList = tackleJSON.tackle
  cityStatesList = cityStateJSON.cityStates
  weatherData = weatherJSON
}

describe('useFishingData', () => {
  it('loads recommendations for current weather', async () => {
    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBeGreaterThan(0)
  })

  it("loads recommendations for today's weather", async () => {
    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'today',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBeGreaterThan(0)
  })

  it("loads recommendations for tomorrow's weather", async () => {
    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'tomorrow',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBeGreaterThan(0)
  })

  it('loads recommendations for spring:3', async () => {
    date.setMonth('2')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('spring')).toBeTruthy()
  })

  it('loads recommendations for spring:4', async () => {
    date.setMonth('3')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('spring')).toBeTruthy()
  })

  it('loads recommendations for spring:5', async () => {
    date.setMonth('4')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('spring')).toBeTruthy()
  })

  it('loads recommendations for spring:6', async () => {
    date.setMonth('5')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('spring')).toBeTruthy()
  })

  it('loads recommendations for summer:6', async () => {
    date.setMonth('5')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('summer')).toBeTruthy()
  })

  it('loads recommendations for summer:7', async () => {
    date.setMonth('6')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('summer')).toBeTruthy()
  })

  it('loads recommendations for summer:8', async () => {
    date.setMonth('7')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('summer')).toBeTruthy()
  })

  it('loads recommendations for summer:9', async () => {
    date.setMonth('8')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('summer')).toBeTruthy()
  })

  it('loads recommendations for fall:9', async () => {
    date.setMonth('8')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('fall')).toBeTruthy()
  })

  it('loads recommendations for fall:10', async () => {
    date.setMonth('9')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('fall')).toBeTruthy()
  })

  it('loads recommendations for fall:11', async () => {
    date.setMonth('10')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('fall')).toBeTruthy()
  })

  it('loads recommendations for fall:12', async () => {
    date.setMonth('11')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('fall')).toBeTruthy()
  })

  it('loads recommendations for winter:12', async () => {
    date.setMonth('11')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('winter')).toBeTruthy()
  })

  it('loads recommendations for winter:1', async () => {
    date.setMonth('0')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('winter')).toBeTruthy()
  })

  it('loads recommendations for winter:2', async () => {
    date.setMonth('1')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('winter')).toBeTruthy()
  })

  it('loads recommendations for winter:3', async () => {
    date.setMonth('2')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.seasons.includes('winter')).toBeTruthy()
  })

  it('warning for warm water', async () => {
    weatherData.current.feelslike_f = 100

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.species[0]).toBe('Not ideal fishing weather for any species')
  })

  it('warning for cold water', async () => {
    weatherData.current.feelslike_f = 30

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.species[0]).toBe('Not ideal fishing weather for any species')
  })

  it("doesn't load when state not selected and zip length < 5", async () => {
    try {
      await getSaltwaterFishingData(
        '015',
        '',
        true,
        tackleList,
        cityStatesList,
        ''
      )
    } catch (error) {
      expect(error).not.toBeUndefined()
    }
  })

  it('shows no tackle when water is really warm and tackleList has no warm tackle', async () => {
    date.setMonth('7')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold'],
        type: ['finesse'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 100

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is really warm and tackleList has no deep tackle', async () => {
    date.setMonth('7')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold', 'warm'],
        type: ['finesse'],
        depth: ['shallow'],
      },
    ]
    weatherData.current.feelslike_f = 100

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is cold and tackleList has no cold tackle', async () => {
    date.setMonth('1')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['warm'],
        type: ['finesse'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 50

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is cold and tackleList has no deep tackle', async () => {
    date.setMonth('1')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold'],
        type: ['finesse'],
        depth: ['shallow'],
      },
    ]
    weatherData.current.feelslike_f = 50

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is cold and tackleList has no still tackle', async () => {
    date.setMonth('1')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold'],
        type: ['reaction'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 50

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is cold and tackleList has no finesse tackle', async () => {
    date.setMonth('1')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold'],
        type: ['reaction'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 50

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is warm and tackleList has no warm tackle', async () => {
    date.setMonth('7')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold'],
        type: ['finesse'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 80

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })

  it('shows no tackle when water is warm and tackleList has no shallow tackle', async () => {
    date.setMonth('7')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    tackleList = [
      {
        name: 'Dropshot Rig',
        species: ['largemouth bass', 'sunfish', 'trout'],
        waterTemp: ['cold', 'warm'],
        type: ['finesse'],
        depth: ['deep'],
      },
    ]
    weatherData.current.feelslike_f = 80

    const result = await getSaltwaterFishingData(
      '01516',
      '',
      'current',
      tackleList,
      cityStatesList,
      '',
      'saltwater bank'
    )

    expect(result.tackle.length).toBe(0)
  })
})
