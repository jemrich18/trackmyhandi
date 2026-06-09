import type { Round } from '../types'

export function scoreDifferential(score: number, courseRating: number, slopeRating: number): number {
  return (score - courseRating) * 113 / slopeRating
}

// WHS table: number of rounds → number of best differentials to use
const WHS_TABLE: Record<number, number> = {
  3: 1, 4: 1, 5: 1,
  6: 2, 7: 2, 8: 2,
  9: 3, 10: 3,
  11: 4, 12: 4,
  13: 5, 14: 5,
  15: 6, 16: 6,
  17: 7, 18: 8, 19: 9, 20: 10,
}

export function computeHandicapIndex(rounds: Round[]): number | null {
  const recent = rounds.slice(0, 20)
  const count = recent.length
  if (count < 3) return null

  const numBest = WHS_TABLE[count] ?? 10

  const differentials = recent
    .map(r => scoreDifferential(r.score, r.course_rating, r.slope_rating))
    .sort((a, b) => a - b)
    .slice(0, numBest)

  const avg = differentials.reduce((sum, d) => sum + d, 0) / differentials.length
  const index = avg * 0.96

  // WHS spec: truncate (not round) to one decimal place
  return Math.trunc(index * 10) / 10
}

export function formatHandicap(index: number): string {
  if (index < 0) return `+${Math.abs(index).toFixed(1)}`
  return index.toFixed(1)
}
