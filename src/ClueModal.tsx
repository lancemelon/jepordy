import { useEffect, useState } from 'react'
import type { Clue, Team } from './types'

interface Props {
  clue: Clue
  teams: Team[]
  onCancel: () => void
  onDone: (awards: Record<number, 1 | -1>) => void
}

export default function ClueModal({ clue, teams, onCancel, onDone }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [awards, setAwards] = useState<Record<number, 1 | -1>>({})

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

  return (
    <div className="modal">
      <div className="clue-card">
        <div className="clue-meta">{clue.category} · ${clue.value}</div>
        <div className="clue-text">{clue.clue}</div>

        {revealed ? <div className="answer">{clue.answer}</div> : <button onClick={() => setRevealed(true)}>Reveal answer</button>}

        <div className="award-list">
          {teams.map((t, i) => (
            <div className="award" key={i}>
              <span>{t.name}</span>
              <button className={awards[i] === 1 ? 'right on' : 'right'} onClick={() => toggle(i, 1)}>+${clue.value}</button>
              <button className={awards[i] === -1 ? 'wrong on' : 'wrong'} onClick={() => toggle(i, -1)}>-${clue.value}</button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onCancel}>Back to board</button>
          <button className="primary" onClick={() => onDone(awards)}>Done</button>
        </div>
      </div>
    </div>
  )
}
