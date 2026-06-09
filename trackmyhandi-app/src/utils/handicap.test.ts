import { describe, it, expect } from 'vitest'
import { scoreDifferential, computeHandicapIndex, formatHandicap } from './handicap'
import type { Round } from '../types'

function makeRound(score: number, courseRating: number, slopeRating: number): Round {
  return {
    id: Math.random(),
    score,
    course_name: 'Test Course',
    course_rating: courseRating,
    slope_rating: slopeRating,
    date_played: '2026-01-01',
    weather: null,
    wind_strength: null,
    green_speed: null,
    green_firmness: null,
    fairway_conditions: null,
    miss_category: null,
    notes: null,
    score_differential: scoreDifferential(score, courseRating, slopeRating),
    created_at: '2026-01-01T00:00:00Z',
  }
}

describe('scoreDifferential', () => {
  it('returns 0 when score equals course rating on a 113-slope course', () => {
    expect(scoreDifferential(72, 72.0, 113)).toBeCloseTo(0, 1)
  })

  it('calculates correctly on standard slope', () => {
    // (90 - 72) * 113 / 113 = 18.0
    expect(scoreDifferential(90, 72.0, 113)).toBeCloseTo(18.0, 1)
  })

  it('calculates correctly on high-slope course', () => {
    // (85 - 71.5) * 113 / 130 ≈ 11.73
    expect(scoreDifferential(85, 71.5, 130)).toBeCloseTo(11.73, 1)
  })

  it('returns negative differential for under-par score', () => {
    // (68 - 72) * 113 / 113 = -4.0
    expect(scoreDifferential(68, 72.0, 113)).toBeCloseTo(-4.0, 1)
  })
})

describe('computeHandicapIndex', () => {
  it('returns null for fewer than 3 rounds', () => {
    expect(computeHandicapIndex([])).toBeNull()
    expect(computeHandicapIndex([makeRound(90, 72, 113)])).toBeNull()
    expect(computeHandicapIndex([makeRound(90, 72, 113), makeRound(88, 72, 113)])).toBeNull()
  })

  it('uses the single best of 3 rounds', () => {
    const rounds = [
      makeRound(95, 72.0, 113), // diff = 23.0
      makeRound(85, 72.0, 113), // diff = 13.0 ← best
      makeRound(90, 72.0, 113), // diff = 18.0
    ]
    // best 1 diff = 13.0 → 13.0 * 0.96 = 12.48 → truncate = 12.4
    const result = computeHandicapIndex(rounds)
    expect(result).toBe(12.4)
  })

  it('uses best 2 of 6 rounds', () => {
    const rounds = [
      makeRound(95, 72.0, 113), // 23.0
      makeRound(90, 72.0, 113), // 18.0
      makeRound(88, 72.0, 113), // 16.0
      makeRound(86, 72.0, 113), // 14.0
      makeRound(84, 72.0, 113), // 12.0 ← best 2
      makeRound(82, 72.0, 113), // 10.0 ← best 1
    ]
    // avg of 10.0 and 12.0 = 11.0 → * 0.96 = 10.56 → truncate = 10.5
    const result = computeHandicapIndex(rounds)
    expect(result).toBe(10.5)
  })

  it('uses best 10 of 20 rounds', () => {
    // 20 rounds with differentials 1..20, best 10 = 1..10
    const rounds = Array.from({ length: 20 }, (_, i) => {
      const score = 73 + i  // diffs 1..20 on 113-slope par-72
      return makeRound(score, 72.0, 113)
    })
    // best 10 diffs: 1,2,...,10 → avg = 5.5 → * 0.96 = 5.28 → truncate = 5.2
    const result = computeHandicapIndex(rounds)
    expect(result).toBe(5.2)
  })

  it('truncates rather than rounds', () => {
    // craft a scenario where rounding would give different result
    const rounds = [
      makeRound(82, 72.0, 113), // 10.0
      makeRound(82, 72.0, 113), // 10.0
      makeRound(82, 72.0, 113), // 10.0
    ]
    // avg = 10.0, * 0.96 = 9.6 → truncate = 9.6
    const result = computeHandicapIndex(rounds)
    expect(result).toBe(9.6)
  })
})

describe('formatHandicap', () => {
  it('formats positive handicap normally', () => {
    expect(formatHandicap(14.2)).toBe('14.2')
  })

  it('formats scratch as 0.0', () => {
    expect(formatHandicap(0.0)).toBe('0.0')
  })

  it('formats negative handicap (plus handicap) with + prefix', () => {
    expect(formatHandicap(-2.3)).toBe('+2.3')
  })
})
