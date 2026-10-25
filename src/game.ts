import type { Clue } from './types'

/**
 * Real-game layout: one Daily Double in the first round, two in the second,
 * alternating for any further rounds. They're placed away from the cheapest
 * row, and two in one round never share a category.
 */
export function assignDailyDoubles(clues: Clue[]): Clue[] {
  const chosen = new Set<string>()
  const rounds = [...new Set(clues.map((c) => c.round))].sort((a, b) => a - b)

  rounds.forEach((round, i) => {
    const inRound = clues.filter((c) => c.round === round)
    const cheapest = Math.min(...inRound.map((c) => c.value))
    const pool = inRound.filter((c) => c.value > cheapest).sort(() => Math.random() - 0.5)
    const count = i % 2 === 0 ? 1 : 2
    const categories = new Set<string>()
    for (const clue of pool) {
      if (categories.size >= count) break
      if (categories.has(clue.category)) continue
      categories.add(clue.category)
      chosen.add(clue.id)
    }
  })

  return clues.map((c) => ({ ...c, dailyDouble: chosen.has(c.id) }))
}

/** A Daily Double wager is capped by the team's score, or the round's top clue value if that's higher. */
export function maxDailyDoubleWager(score: number, roundMaxValue: number) {
  return Math.max(score, roundMaxValue)
}

export const MIN_WAGER = 5

export function formatMoney(n: number) {
  return `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString()}`
}
