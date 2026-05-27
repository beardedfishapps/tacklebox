import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
} from '@jest/globals'
import WhatToFish from '@/app/fishing/what-to-fish/page'
import '@testing-library/jest-dom'
import weatherJSON from '../../../mockData/weather.json'
import cityStateJSON from '../../../mockData/cityStates.json'
import speciesJSON from '../../../mockData/species.json'

const server = setupServer(
  rest.get('/api/weather', (req, res, ctx) => {
    return res(ctx.json(weatherJSON))
  }),
  rest.get('/api/tackle', (req, res, ctx) => {
    return res(
      ctx.json({
        tackle: [
          {
            name: 'Texas Rig',
            confidence: 8,
            species: ['largemouth bass'],
            waterTemp: ['warm', 'cold'],
            type: ['finesse', 'reaction', 'freshwater', 'bank', 'boat'],
            depth: ['shallow', 'deep'],
            tip: '',
            weather: 'Cloud',
          },
        ],
      })
    )
  }),
  rest.get('/api/cityStates', (req, res, ctx) => {
    return res(ctx.json({ cityStates: cityStateJSON.cityStates }))
  }),
  rest.get('/api/species', (req, res, ctx) => {
    return res(ctx.json({ species: speciesJSON.species }))
  }),
  rest.get('/api/baits', (req, res, ctx) => {
    return res(
      ctx.json({ baits: [{ name: 'nightcrawler', confidence: 1, type: [] }] })
    )
  }),
  rest.get('/api/colors', (req, res, ctx) => {
    return res(
      ctx.json({
        colors: [
          { name: 'green pumpkin', confidence: 1, type: [], weather: '' },
        ],
      })
    )
  }),
  rest.get('/api/styles', (req, res, ctx) => {
    return res(
      ctx.json({
        styles: [{ name: 'natural', confidence: 1, type: [], species: [] }],
      })
    )
  })
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  process.env.NEXT_PUBLIC_AI_ENABLED = 'false'
  server.resetHandlers()
})
afterAll(() => server.close())

describe('WhatToFish', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_AI_ENABLED = 'false'
  })

  it('renders a heading', () => {
    render(<WhatToFish />)

    const heading = screen.getByRole('heading', {
      name: /What to Fish/i,
    })

    const tipOfTheDay = screen.getByText(/Tip of the Day/i)

    expect(heading).toBeInTheDocument()
    expect(tipOfTheDay).toBeInTheDocument()
  })

  it('renders different tip of the day if date greater than tips length', () => {
    let date = new Date()
    date.setDate('30')
    // eslint-disable-next-line
    jest.useFakeTimers().setSystemTime(date)

    render(<WhatToFish />)

    const tipOfTheDay = screen.getByText(/Tip of the Day/i)

    expect(tipOfTheDay).toBeInTheDocument()

    // eslint-disable-next-line
    jest.useRealTimers()
  })

  it('loads tackle when zip is entered', async () => {
    const user = userEvent.setup()

    render(<WhatToFish />)

    const input = await screen.findByLabelText('ZIP Code')

    await user.type(input, '01516')
    expect(input).toHaveValue('01516')
  })

  it('loads tackle when state is selected', async () => {
    const user = userEvent.setup()

    render(<WhatToFish />)

    const combobox = await screen.findByLabelText('State')

    await user.selectOptions(combobox, 'Boston,Massachusetts')

    const message = await screen.findByText(/location: Boston,Massachusetts/i)

    expect(message).toBeInTheDocument()
  })

  it('loads tackle when geolocation is used', async () => {
    const user = userEvent.setup()

    render(<WhatToFish />)

    const button = await screen.findByText('Use Current Location')

    await user.click(button)

    const message = await screen.findByText(/location: 51.1,45.3/i)

    expect(message).toBeInTheDocument()
  })

  it('loads tackle when freshwater is selected', async () => {
    render(<WhatToFish />)

    const heading = await screen.findByLabelText('ZIP Code')

    expect(heading).toBeInTheDocument()
  })

  it('resets to initial display when Clear is clicked', async () => {
    render(<WhatToFish />)
    const starterText = await screen.findByText(
      "Enter a US ZIP code or use your current location to start. You can also choose a state instead to see general information based on the state's capital."
    )

    expect(starterText).toBeInTheDocument()
  })
})
