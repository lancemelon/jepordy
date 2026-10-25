import { useEffect, useState } from 'react'
import type { FinalClue, Team } from './types'
import { formatMoney } from './game'

interface Props {
  final: FinalClue
  teams: Team[]
  onCancel: () => void
  onDone: (deltas: Record<number, number>) => void
}

export default function FinalModal({ final, teams, onCancel, onDone }: Props) {
  // As in the real game, only teams with a positive score take part.
  const players = teams.map((t, i) => ({ ...t, i })).filter((t) => t.score > 0)
  const [stage, setStage] = useState<'wager' | 'clue'>('wager')
  const [wagers, setWagers] = useState<Record<number, string>>({})
  const [results, setResults] = useState<Record<number, 1 | -1>>({})
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const wagerOf = (i: number) => Number(wagers[i] || 0)
  const wagersValid = players.every((p) => Number.isInteger(wagerOf(p.i)) && wagerOf(p.i) >= 0 && wagerOf(p.i) <= p.score)

  return (
    <div className="modal">
      <div className="clue-card">
        <div className="dd-banner">Final Jeopardy!</div>
        <div className="clue-meta">{final.category}</div>

        {players.length === 0 && (
          <>
            <p>No team has a positive score, so nobody plays Final Jeopardy.</p>
            <div className="modal-actions">
              <button className="primary" onClick={() => onDone({})}>Finish game</button>
            </div>
          </>
        )}

        {players.length > 0 && stage === 'wager' && (
          <>
            <p>Each team wagers up to their score.</p>
            <div className="award-list">
              {players.map((p) => (
                <label className="award" key={p.i}>
                  <span>{p.name} ({formatMoney(p.score)})</span>
                  <input
                    type="number"
                    min={0}
                    max={p.score}
                    placeholder="0"
                    value={wagers[p.i] ?? ''}
                    onChange={(e) => setWagers({ ...wagers, [p.i]: e.target.value })}
                  />
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={onCancel}>Back to board</button>
              <button className="primary" disabled={!wagersValid} onClick={() => setStage('clue')}>Show clue</button>
            </div>
          </>
        )}

        {players.length > 0 && stage === 'clue' && (
          <>
            <div className="clue-text">{final.clue}</div>
            {revealed ? <div className="answer">{final.answer}</div> : <button onClick={() => setRevealed(true)}>Reveal answer</button>}
            <div className="award-list">
              {players.map((p) => (
                <div className="award" key={p.i}>
                  <span>{p.name}</span>
                  <button
                    className={results[p.i] === 1 ? 'right on' : 'right'}
                    onClick={() => setResults({ ...results, [p.i]: 1 })}
                  >
                    +{formatMoney(wagerOf(p.i))}
                  </button>
                  <button
                    className={results[p.i] === -1 ? 'wrong on' : 'wrong'}
                    onClick={() => setResults({ ...results, [p.i]: -1 })}
                  >
                    -{formatMoney(wagerOf(p.i))}
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={onCancel}>Back to board</button>
              <button
                className="primary"
                disabled={players.some((p) => results[p.i] === undefined)}
                onClick={() => onDone(Object.fromEntries(players.map((p) => [p.i, results[p.i] * wagerOf(p.i)])))}
              >
                Finish game
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
