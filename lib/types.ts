export type ColumnType = 'string' | 'number' | 'boolean' | 'null' | 'mixed'

export interface ParsedData {
  format: 'json' | 'csv'
  columns: string[]
  rows: Record<string, unknown>[]
  raw: string
  tableDisabled?: boolean
}
