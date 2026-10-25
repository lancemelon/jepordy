import { readSheet } from 'read-excel-file/browser'
import type { Clue, FinalClue } from './types'

const REQUIRED = ['round', 'category', 'value', 'clue', 'answer'] as const
const DAILY_DOUBLE = 'daily double'

export interface ParseResult {
  clues: Clue[]
  final: FinalClue | null
  hasDailyDoubleColumn: boolean
  errors: string[]
}

export async function parseQuestionFile(file: Blob): Promise<ParseResult> {
  return parseRows(await readSheet(file))
}

export function parseRows(rows: unknown[][]): ParseResult {
  const fail = (...errors: string[]): ParseResult => ({ clues: [], final: null, hasDailyDoubleColumn: false, errors })

  const errors: string[] = []
  const [header = [], ...body] = rows
  const cols = header.map((h) => String(h ?? '').trim().toLowerCase())
  const idx = Object.fromEntries([...REQUIRED, DAILY_DOUBLE].map((h) => [h, cols.indexOf(h)]))
  const missing = REQUIRED.filter((h) => idx[h] === -1)
  if (missing.length) {
    return fail(`Missing column(s): ${missing.join(', ')}. First row must be: ${REQUIRED.join(', ')} (and optionally "Daily Double")`)
  }
  const hasDailyDoubleColumn = idx[DAILY_DOUBLE] !== -1

  const clues: Clue[] = []
  let final: FinalClue | null = null
  const seen = new Set<string>()
  body.forEach((row, i) => {
    const line = i + 2
    const cell = (h: string) => (idx[h] === -1 ? '' : String(row[idx[h]] ?? '').trim())
    if (REQUIRED.every((h) => !cell(h))) return // blank row

    const category = cell('category')
    if (!category) return void errors.push(`Row ${line}: category is empty`)
    if (!cell('clue')) return void errors.push(`Row ${line}: clue is empty`)

    if (cell('round').toLowerCase().startsWith('final')) {
      if (final) return void errors.push(`Row ${line}: only one Final Jeopardy row is allowed`)
      final = { category, clue: cell('clue'), answer: cell('answer') }
      return
    }

    const round = Number(cell('round'))
    const value = Number(cell('value'))
    if (!Number.isInteger(round) || round < 1) return void errors.push(`Row ${line}: round must be a whole number (1, 2, ...) or "Final"`)
    if (!Number.isFinite(value) || value <= 0) return void errors.push(`Row ${line}: value must be a positive number`)

    const id = `${round}|${category}|${value}`
    if (seen.has(id)) return void errors.push(`Row ${line}: duplicate round/category/value (${round}, ${category}, ${value})`)
    seen.add(id)
    const dailyDouble = /^(y|yes|true|1|x|dd)$/i.test(cell(DAILY_DOUBLE))
    clues.push({ id, round, category, value, clue: cell('clue'), answer: cell('answer'), dailyDouble })
  })

  if (!errors.length && !clues.length) errors.push('No questions found in the first sheet.')
  return { clues, final, hasDailyDoubleColumn, errors }
}
