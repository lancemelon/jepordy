export interface Clue {
  id: string
  round: number
  category: string
  value: number
  clue: string
  answer: string
}

export interface Team {
  name: string
  score: number
}

export interface GameState {
  clues: Clue[]
  teams: Team[]
  used: string[]
  round: number
}
