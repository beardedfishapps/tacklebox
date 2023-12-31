import { describe, it, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import Recipe from '@/app/classes/Recipe'

describe('Recipe', () => {
  it('initializes with empty values', () => {
    const recipe = new Recipe()

    expect(recipe.name).toBe('')
    expect(recipe.seasons.length).toBe(0)
    expect(recipe.frequency).toBe(0)
    expect(recipe.ingredients.length).toBe(0)
  })
})
