import type { ParsedData } from './types'

export function prettyPrint(data: ParsedData): string {
  if (data.format === 'json') {
    return JSON.stringify(JSON.parse(data.raw), null, 2)
  }
  return JSON.stringify(data.rows.length === 1 ? data.rows[0] : data.rows, null, 2)
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export function toCSV(data: ParsedData): string {
  const header = data.columns.join(',')
  const body = data.rows.map(row =>
    data.columns.map(col => csvEscape(row[col])).join(',')
  )
  return [header, ...body].join('\n')
}
