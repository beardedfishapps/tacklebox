import BaitRecommendations from './BaitRecommendations'
import FishingConditions from './FishingConditions'
import Tackle from './Tackle'
import WeatherData from './WeatherData'

export default class FishingData {
  public baitRecommendations: BaitRecommendations
  public seasons: string
  public tackle: Tackle[]
  public weather: WeatherData
  public species: string[]
  public fishingConditions: FishingConditions
  public activeSpecies: string[]
  public aiGenerated: boolean
  public aiSource: string
  public bestFishingTimes: {
    ok: string
    good: string
    great: string
  }
  public seasonPhases: {
    species: string
    phase: string
    confidence: number
    notes?: string
  }[]

  constructor() {
    this.baitRecommendations = new BaitRecommendations()
    this.seasons = ''
    this.tackle = []
    this.weather = new WeatherData()
    this.species = []
    this.fishingConditions = new FishingConditions()
    this.activeSpecies = []
    this.aiGenerated = false
    this.aiSource = ''
    this.bestFishingTimes = {
      ok: '',
      good: '',
      great: '',
    }
    this.seasonPhases = []
  }
}
