import type { ParsedData } from './types'

export function detectFormat(input: string): 'json' | 'csv' {
  const trimmed = input.trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[') ? 'json' : 'csv'
}

function coerce(value: string): unknown {
  if (value === '' || value === 'null' || value === 'NULL') return null
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false
  const num = Number(value)
  if (!isNaN(num) && value !== '') return num
  return value
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

export function parseCSV(input: string): ParsedData {
  const lines = input.split('\n').filter(l => l.trim() !== '')
  if (lines.length === 0) throw new Error('Empty CSV input')

  const columns = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row: Record<string, unknown> = {}
    columns.forEach((col, i) => {
      row[col] = coerce(i < values.length ? values[i] : '')
    })
    return row
  })

  return { format: 'csv', columns, rows, raw: input }
}

export function parseJSON(input: string): ParsedData {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    throw new Error((e as Error).message)
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return { format: 'json', columns: [], rows: [], raw: input }
    }

    const firstNonObj = parsed.find(
      item => typeof item !== 'object' || item === null || Array.isArray(item)
    )
    if (firstNonObj !== undefined || parsed.every(item => typeof item !== 'object' || item === null)) {
      return { format: 'json', columns: [], rows: [], raw: input, tableDisabled: true }
    }

    const columns = Array.from(
      new Set(parsed.flatMap(item => Object.keys(item as Record<string, unknown>)))
    )
    const rows = (parsed as Record<string, unknown>[]).map(item => {
      const row: Record<string, unknown> = {}
      columns.forEach(col => {
        row[col] = col in item ? item[col] : null
      })
      return row
    })
    return { format: 'json', columns, rows, raw: input }
  }

  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>
    const columns = Object.keys(obj)
    return { format: 'json', columns, rows: [obj], raw: input }
  }

  return { format: 'json', columns: [], rows: [], raw: input, tableDisabled: true }
}

export function parse(input: string): ParsedData {
  const format = detectFormat(input)
  return format === 'json' ? parseJSON(input) : parseCSV(input)
}
