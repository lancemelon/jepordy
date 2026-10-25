export interface Clue {
  id: string
  round: number
  category: string
  value: number
  clue: string
  answer: string
  dailyDouble: boolean
}

export interface FinalClue {
  category: string
  clue: string
  answer: string
}

export interface Team {
  name: string
  score: number
}

export interface GameState {
  clues: Clue[]
  final: FinalClue | null
  finalDone: boolean
  teams: Team[]
  used: string[]
  round: number
}
