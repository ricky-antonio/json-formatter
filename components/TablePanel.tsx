'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { ParsedData } from '@/lib/types'

type SortDir = 'asc' | 'desc' | null

interface TablePanelProps {
  data: ParsedData
}

function cellClass(value: unknown): string {
  if (value === null || value === undefined) return 'text-muted-foreground italic'
  if (typeof value === 'number') return 'text-blue-600 dark:text-blue-400'
  if (typeof value === 'boolean') return 'text-green-600 dark:text-green-400'
  return ''
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function TablePanel({ data }: TablePanelProps) {
  const [filter, setFilter] = useState('')
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const filtered = useMemo(() => {
    const q = filter.toLowerCase()
    if (!q) return data.rows
    return data.rows.filter(row =>
      data.columns.some(col => cellText(row[col]).toLowerCase().includes(q))
    )
  }, [data, filter])

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const av = cellText(a[sortCol])
      const bv = cellText(b[sortCol])
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortCol, sortDir])

  function handleSort(col: string) {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('asc')
    } else if (sortDir === 'asc') {
      setSortDir('desc')
    } else {
      setSortCol(null)
      setSortDir(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Filter all columns…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Badge variant="secondary">
          {sorted.length} / {data.rows.length} rows
        </Badge>
      </div>

      <div className="overflow-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted shadow-sm">
            <tr>
              {data.columns.map(col => (
                <th
                  key={col}
                  className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort(col)}
                >
                  {col}
                  {sortCol === col && sortDir === 'asc' && ' ↑'}
                  {sortCol === col && sortDir === 'desc' && ' ↓'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/40">
                {data.columns.map(col => (
                  <td key={col} className={`px-3 py-2 font-mono ${cellClass(row[col])}`}>
                    {cellText(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
