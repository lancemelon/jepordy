import { useEffect, useState } from 'react'
import Setup from './Setup'
import Board from './Board'
import type { GameState } from './types'

const STORAGE_KEY = 'jeopardy-game'

function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as GameState) : null
  } catch {
    return null
  }
}

export default function App() {
  const [game, setGame] = useState<GameState | null>(loadGame)

  useEffect(() => {
    try {
      if (game) localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // storage unavailable (private mode); the game still works, it just won't survive a reload
    }
  }, [game])

  return game ? (
    <Board game={game} setGame={(update) => setGame((g) => (g ? update(g) : g))} onExit={() => setGame(null)} />
  ) : (
    <Setup onStart={setGame} />
  )
}
