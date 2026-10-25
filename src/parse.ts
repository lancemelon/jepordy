import { readSheet } from 'read-excel-file/browser'
import type { Clue } from './types'

const HEADERS = ['round', 'category', 'value', 'clue', 'answer'] as const

export interface ParseResult {
  clues: Clue[]
  errors: string[]
}

export async function parseQuestionFile(file: Blob): Promise<ParseResult> {
  return parseRows(await readSheet(file))
}

export function parseRows(rows: unknown[][]): ParseResult {
  const errors: string[] = []
  const [header = [], ...body] = rows
  const cols = header.map((h) => String(h ?? '').trim().toLowerCase())
  const idx = Object.fromEntries(HEADERS.map((h) => [h, cols.indexOf(h)]))
  const missing = HEADERS.filter((h) => idx[h] === -1)
  if (missing.length) {
    return { clues: [], errors: [`Missing column(s): ${missing.join(', ')}. First row must be: ${HEADERS.join(', ')}`] }
  }

  const clues: Clue[] = []
  const seen = new Set<string>()
  body.forEach((row, i) => {
    const line = i + 2
    const cell = (h: (typeof HEADERS)[number]) => String(row[idx[h]] ?? '').trim()
    if (HEADERS.every((h) => !cell(h))) return // blank row

    const round = Number(cell('round'))
    const value = Number(cell('value'))
    const category = cell('category')
    if (!Number.isInteger(round) || round < 1) return void errors.push(`Row ${line}: round must be a whole number (1, 2, ...)`)
    if (!Number.isFinite(value) || value <= 0) return void errors.push(`Row ${line}: value must be a positive number`)
    if (!category) return void errors.push(`Row ${line}: category is empty`)
    if (!cell('clue')) return void errors.push(`Row ${line}: clue is empty`)

    const id = `${round}|${category}|${value}`
    if (seen.has(id)) return void errors.push(`Row ${line}: duplicate round/category/value (${round}, ${category}, ${value})`)
    seen.add(id)
    clues.push({ id, round, category, value, clue: cell('clue'), answer: cell('answer') })
  })

  if (!errors.length && !clues.length) errors.push('No questions found in the first sheet.')
  return { clues, errors }
}
