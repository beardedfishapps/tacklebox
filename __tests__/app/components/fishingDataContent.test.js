import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from '@jest/globals'
import FishingDataContent from '@/app/components/fishingDataContent'
import '@testing-library/jest-dom'
import fishingDataJSON from '../../mockData/fishingData.json'

const data = fishingDataJSON

describe('FishingDataContent', () => {
  it('renders component', () => {
    render(<FishingDataContent data={data} />)

    const titles = screen.getAllByText('Lures & Rigs')
    expect(titles.length).toBeGreaterThan(0)
  })

  it('shows AI-generated marker when data is AI generated', () => {
    render(
      <FishingDataContent
        data={{
          ...data,
          aiGenerated: true,
          aiSource: 'openai',
        }}
      />
    )

    const marker = screen.getByText('AI-generated recommendations (openai)')
    expect(marker).toBeInTheDocument()
  })

  it('shows AI best times and season phases in seasonal tab', async () => {
    const user = userEvent.setup()
    render(
      <FishingDataContent
        data={{
          ...data,
          bestFishingTimes: {
            ok: '6:30-8:00 AM',
            good: '8:00-10:00 AM',
            great: '5:00-7:30 PM',
          },
          seasonPhases: [
            {
              species: 'largemouth bass',
              phase: 'pre-spawn',
              confidence: 9,
              notes: 'warming shallow flats',
            },
          ],
        }}
      />
    )

    await user.click(screen.getByTitle('Season Info Tab Button'))
    expect(screen.getByText('OK: 6:30-8:00 AM')).toBeInTheDocument()
    expect(screen.getByText('largemouth bass: pre-spawn')).toBeInTheDocument()
  })
})
