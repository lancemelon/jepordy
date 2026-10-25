import { useMemo, useState } from 'react'
import type { Clue, GameState } from './types'
import ClueModal from './ClueModal'

interface Props {
  game: GameState
  setGame: (update: (g: GameState) => GameState) => void
  onExit: () => void
}

export default function Board({ game, setGame, onExit }: Props) {
  const [active, setActive] = useState<Clue | null>(null)

  const rounds = useMemo(() => [...new Set(game.clues.map((c) => c.round))].sort((a, b) => a - b), [game.clues])
  const roundClues = game.clues.filter((c) => c.round === game.round)
  const categories = [...new Set(roundClues.map((c) => c.category))]
  const values = [...new Set(roundClues.map((c) => c.value))].sort((a, b) => a - b)
  const byCell = new Map(roundClues.map((c) => [`${c.category}|${c.value}`, c]))
  const used = new Set(game.used)

  function finish(clue: Clue, awards: Record<number, 1 | -1>) {
    setGame((g) => ({
      ...g,
      used: [...g.used, clue.id],
      teams: g.teams.map((t, i) => ({ ...t, score: t.score + (awards[i] ?? 0) * clue.value })),
    }))
    setActive(null)
  }

  function adjust(team: number, delta: number) {
    setGame((g) => ({ ...g, teams: g.teams.map((t, i) => (i === team ? { ...t, score: t.score + delta } : t)) }))
  }

  function resetGame() {
    if (confirm('Reset all scores and bring back every clue?')) {
      setGame((g) => ({ ...g, used: [], round: rounds[0], teams: g.teams.map((t) => ({ ...t, score: 0 })) }))
    }
  }

  const remaining = roundClues.filter((c) => !used.has(c.id)).length
  const nextRound = rounds[rounds.indexOf(game.round) + 1]

  return (
    <main className="game">
      <header>
        <nav className="rounds">
          {rounds.map((r) => (
            <button key={r} className={r === game.round ? 'active' : ''} onClick={() => setGame((g) => ({ ...g, round: r }))}>
              Round {r}
            </button>
          ))}
        </nav>
        <div>
          <button onClick={resetGame}>Reset</button>
          <button onClick={() => confirm('Leave this game and load new questions?') && onExit()}>New game</button>
        </div>
      </header>

      <div className="board" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
        {categories.map((cat) => <div className="category" key={cat}>{cat}</div>)}
        {values.flatMap((value) =>
          categories.map((cat) => {
            const clue = byCell.get(`${cat}|${value}`)
            if (!clue) return <div className="tile empty" key={`${cat}|${value}`} />
            const done = used.has(clue.id)
            return (
              <button className="tile" key={clue.id} disabled={done} onClick={() => setActive(clue)}>
                {done ? '' : `$${value}`}
              </button>
            )
          }),
        )}
      </div>

      {remaining === 0 && nextRound !== undefined && (
        <p className="next">
          Round {game.round} complete. <button className="primary" onClick={() => setGame((g) => ({ ...g, round: nextRound }))}>Start Round {nextRound}</button>
        </p>
      )}
      {remaining === 0 && nextRound === undefined && <p className="next">That's the last clue. Final scores are below!</p>}

      <footer className="scores">
        {game.teams.map((t, i) => (
          <div className="score" key={i}>
            <div className="team-name">{t.name}</div>
            <div className={`points ${t.score < 0 ? 'neg' : ''}`}>{t.score < 0 ? '-' : ''}${Math.abs(t.score)}</div>
            <div className="adjust">
              <button onClick={() => adjust(i, -100)}>-100</button>
              <button onClick={() => adjust(i, 100)}>+100</button>
            </div>
          </div>
        ))}
      </footer>

      {active && <ClueModal clue={active} teams={game.teams} onCancel={() => setActive(null)} onDone={(a) => finish(active, a)} />}
    </main>
  )
}
