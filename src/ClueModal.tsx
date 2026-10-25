import { useEffect, useState } from 'react'
import type { Clue, Team } from './types'
import { MIN_WAGER, formatMoney, maxDailyDoubleWager } from './game'

interface Props {
  clue: Clue
  teams: Team[]
  roundMaxValue: number
  onCancel: () => void
  /** Points to add per team index. */
  onDone: (deltas: Record<number, number>) => void
}

export default function ClueModal({ clue, teams, roundMaxValue, onCancel, onDone }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [awards, setAwards] = useState<Record<number, 1 | -1>>({})
  // Daily Double: the team that found it and what they wagered, set before the clue is shown.
  const [ddTeam, setDdTeam] = useState<number | null>(null)
  const [wager, setWager] = useState('')
  const [ddStarted, setDdStarted] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  function toggle(team: number, result: 1 | -1) {
    setAwards((a) => {
      const next = { ...a }
      if (next[team] === result) delete next[team]
      else next[team] = result
      return next
    })
  }

  if (clue.dailyDouble && !ddStarted) {
    const max = ddTeam === null ? 0 : maxDailyDoubleWager(teams[ddTeam].score, roundMaxValue)
    const amount = Number(wager)
    const valid = ddTeam !== null && Number.isInteger(amount) && amount >= MIN_WAGER && amount <= max

    return (
      <div className="modal">
        <div className="clue-card">
          <div className="dd-banner">Daily Double!</div>
          <div className="clue-meta">{clue.category}</div>
          <p>Which team found it?</p>
          <div className="team-pick">
            {teams.map((t, i) => (
              <button key={i} className={ddTeam === i ? 'picked' : ''} onClick={() => { setDdTeam(i); setWager('') }}>
                {t.name}
              </button>
            ))}
          </div>
          {ddTeam !== null && (
            <label className="wager">
              Wager (${MIN_WAGER} – {formatMoney(max)})
              <input type="number" autoFocus min={MIN_WAGER} max={max} value={wager} onChange={(e) => setWager(e.target.value)} />
            </label>
          )}
          <div className="modal-actions">
            <button onClick={onCancel}>Back to board</button>
            <button className="primary" disabled={!valid} onClick={() => setDdStarted(true)}>Show clue</button>
          </div>
        </div>
      </div>
    )
  }

  const stake = clue.dailyDouble ? Number(wager) : clue.value
  const scoredTeams = clue.dailyDouble ? [ddTeam as number] : teams.map((_, i) => i)

  return (
    <div className="modal">
      <div className="clue-card">
        <div className="clue-meta">
          {clue.dailyDouble && 'Daily Double · '}{clue.category} · {formatMoney(clue.value)}
        </div>
        <div className="clue-text">{clue.clue}</div>

        {revealed ? <div className="answer">{clue.answer}</div> : <button onClick={() => setRevealed(true)}>Reveal answer</button>}

        <div className="award-list">
          {scoredTeams.map((i) => (
            <div className="award" key={i}>
              <span>{teams[i].name}</span>
              <button className={awards[i] === 1 ? 'right on' : 'right'} onClick={() => toggle(i, 1)}>+{formatMoney(stake)}</button>
              <button className={awards[i] === -1 ? 'wrong on' : 'wrong'} onClick={() => toggle(i, -1)}>-{formatMoney(stake)}</button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onCancel}>Back to board</button>
          <button
            className="primary"
            onClick={() => onDone(Object.fromEntries(Object.entries(awards).map(([i, r]) => [i, r * stake])))}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
