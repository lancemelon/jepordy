import { useState } from 'react'
import { parseQuestionFile } from './parse'
import type { Clue, GameState } from './types'

interface Props {
  onStart: (game: GameState) => void
}

export default function Setup({ onStart }: Props) {
  const [clues, setClues] = useState<Clue[]>([])
  const [source, setSource] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [names, setNames] = useState(['Team 1', 'Team 2', 'Team 3'])

  const rounds = [...new Set(clues.map((c) => c.round))].sort((a, b) => a - b)

  function accept(result: { clues: Clue[]; errors: string[] }, name: string) {
    setErrors(result.errors)
    setClues(result.errors.length ? [] : result.clues)
    setSource(result.errors.length ? '' : name)
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    try {
      accept(await parseQuestionFile(file), file.name)
    } catch {
      accept({ clues: [], errors: ['Could not read that file. Make sure it is an .xlsx file.'] }, '')
    }
  }

  async function useSample() {
    const blob = await (await fetch('/sample-questions.xlsx')).blob()
    accept(await parseQuestionFile(blob), 'sample-questions.xlsx')
  }

  function start() {
    const teams = names.map((n) => n.trim()).filter(Boolean).map((name) => ({ name, score: 0 }))
    onStart({ clues, teams, used: [], round: rounds[0] })
  }

  const canStart = clues.length > 0 && names.some((n) => n.trim())

  return (
    <main className="setup">
      <h1>Jeopardy!</h1>

      <section>
        <h2>1. Questions</h2>
        <p>
          Upload an Excel file (.xlsx) with the columns <code>Round, Category, Value, Clue, Answer</code>.{' '}
          <a href="/sample-questions.xlsx" download>Download the template</a> or{' '}
          <button className="link" onClick={useSample}>use the sample game</button>.
        </p>
        <input type="file" accept=".xlsx" onChange={(e) => onFile(e.target.files?.[0])} />
        {errors.length > 0 && (
          <ul className="errors">
            {errors.slice(0, 10).map((e) => <li key={e}>{e}</li>)}
            {errors.length > 10 && <li>…and {errors.length - 10} more</li>}
          </ul>
        )}
        {clues.length > 0 && (
          <p className="ok">
            Loaded {clues.length} questions from {source} across {rounds.length} round{rounds.length === 1 ? '' : 's'}.
          </p>
        )}
      </section>

      <section>
        <h2>2. Teams</h2>
        {names.map((name, i) => (
          <div className="team-row" key={i}>
            <input value={name} onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))} />
            {names.length > 1 && <button onClick={() => setNames(names.filter((_, j) => j !== i))}>Remove</button>}
          </div>
        ))}
        {names.length < 8 && <button onClick={() => setNames([...names, `Team ${names.length + 1}`])}>Add team</button>}
      </section>

      <button className="primary" disabled={!canStart} onClick={start}>Start game</button>
    </main>
  )
}
