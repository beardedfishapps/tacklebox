import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals'
import TackleBySpecies from '@/app/fishing/tackle-by-species/page'
import '@testing-library/jest-dom'
import tackleJSON from '../../../mockData/tackle.json'
import speciesJSON from '../../../mockData/species.json'

const server = setupServer(
  rest.get('/api/species', (req, res, ctx) => {
    return res(
      ctx.json({
        species: speciesJSON.species,
      })
    )
  }),
  rest.get('/api/tackle', (req, res, ctx) => {
    return res(ctx.json({ tackle: tackleJSON.tackle }))
  })
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('TackleBySpecies', () => {
  it('renders a heading', () => {
    render(<TackleBySpecies />)

    const heading = screen.getByRole('heading', {
      name: /Tackle by Species/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders after choosing a species', async () => {
    render(<TackleBySpecies />)

    const speciesCombobox = await screen.findByRole('combobox')
    fireEvent.change(speciesCombobox, {
      target: { value: 'largemouth bass' },
    })

    const heading = await screen.findAllByText('lures and rigs', {
      exact: false,
    })

    expect(heading[0]).toBeInTheDocument()
  })

  it('opens tip modals when clicked', async () => {
    const user = userEvent.setup()

    render(<TackleBySpecies />)

    const speciesCombobox = await screen.findByRole('combobox')
    fireEvent.change(speciesCombobox, {
      target: { value: 'largemouth bass' },
    })

    const heading = await screen.findAllByText('lures and rigs', {
      exact: false,
    })

    expect(heading[0]).toBeInTheDocument()

    const tipButton = await screen.findAllByTitle(
      'Click to learn how to use this'
    )

    user.click(tipButton[0])

    const modalTitle = await screen.findByLabelText('Tackle Modal')

    expect(modalTitle).toBeInTheDocument()
  })

  it('closes tip modal when clicking close button', async () => {
    const user = userEvent.setup()

    render(<TackleBySpecies />)

    const speciesCombobox = await screen.findByRole('combobox')
    fireEvent.change(speciesCombobox, {
      target: { value: 'largemouth bass' },
    })

    const heading = await screen.findAllByText('lures and rigs', {
      exact: false,
    })

    expect(heading[0]).toBeInTheDocument()

    const tipButton = await screen.findAllByTitle(
      'Click to learn how to use this'
    )

    user.click(tipButton[0])

    const modalTitle = await screen.findByLabelText('Tackle Modal')

    expect(modalTitle).toBeInTheDocument()

    const closeButton = screen.getByText('Close')

    await user.click(closeButton)

    expect(modalTitle).not.toBeInTheDocument()
  })

  it('all tip modals open and close', async () => {
    const user = userEvent.setup()

    render(<TackleBySpecies />)

    const speciesCombobox = await screen.findByRole('combobox')
    fireEvent.change(speciesCombobox, {
      target: { value: 'largemouth bass' },
    })

    const heading = await screen.findAllByText('lures and rigs', {
      exact: false,
    })

    expect(heading[0]).toBeInTheDocument()

    const tipButtons = await screen.findAllByTitle(
      'Click to learn how to use this'
    )

    for (let buttonCount = 0; buttonCount < tipButtons.length; buttonCount++) {
      user.click(tipButtons[buttonCount])

      const modalTitle = await screen.findByLabelText('Tackle Modal')

      expect(modalTitle).toBeInTheDocument()

      const closeButton = screen.getByText('Close')

      await user.click(closeButton)

      expect(modalTitle).not.toBeInTheDocument()
    }
  })

  it('lucky tackle button works', async () => {
    const user = userEvent.setup()

    render(<TackleBySpecies />)

    const speciesCombobox = await screen.findByRole('combobox')
    fireEvent.change(speciesCombobox, {
      target: { value: 'largemouth bass' },
    })

    const heading = await screen.findAllByText('lures and rigs', {
      exact: false,
    })

    expect(heading[0]).toBeInTheDocument()

    const button = await screen.getByText('Help me pick!')

    await user.click(button)

    const luckyHeading = await screen.findByText('You should use...')

    expect(luckyHeading).toBeInTheDocument()
  })
})
