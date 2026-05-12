'use client'

import { useState } from 'react'
import type { ParsedData } from '@/lib/types'

interface TreeNodeProps {
  value: unknown
  depth: number
}

function getType(value: unknown): 'null' | 'boolean' | 'number' | 'string' | 'array' | 'object' {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return 'array'
  return 'object'
}

function PrimitiveValue({ value }: { value: unknown }) {
  const type = getType(value)
  if (type === 'null') return <span className="text-muted-foreground italic">null</span>
  if (type === 'boolean') return <span className="text-green-600 dark:text-green-400">{String(value)}</span>
  if (type === 'number') return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
  return <span className="text-amber-600 dark:text-amber-400">&quot;{String(value)}&quot;</span>
}

function TreeNode({ value, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const type = getType(value)

  if (type === 'array') {
    const arr = value as unknown[]
    if (arr.length === 0) return <span className="text-muted-foreground">[]</span>
    return (
      <span>
        <button
          onClick={() => setExpanded(e => !e)}
          className="mr-1 font-mono text-muted-foreground hover:text-foreground"
          aria-label={expanded ? 'collapse' : 'expand'}
        >
          {expanded ? '▾' : '▸'}
        </button>
        <span className="text-muted-foreground">[{arr.length}]</span>
        {expanded && (
          <div className="ml-5 border-l border-border pl-3">
            {arr.map((item, i) => (
              <div key={i} className="py-0.5">
                <span className="mr-2 text-muted-foreground font-mono text-xs">{i}</span>
                <TreeNode value={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    )
  }

  if (type === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return <span className="text-muted-foreground">{'{}'}</span>
    return (
      <span>
        <button
          onClick={() => setExpanded(e => !e)}
          className="mr-1 font-mono text-muted-foreground hover:text-foreground"
          aria-label={expanded ? 'collapse' : 'expand'}
        >
          {expanded ? '▾' : '▸'}
        </button>
        <span className="text-muted-foreground">{'{' + keys.length + '}'}</span>
        {expanded && (
          <div className="ml-5 border-l border-border pl-3">
            {keys.map(key => (
              <div key={key} className="py-0.5">
                <span className="mr-2 font-mono text-sm font-medium">{key}:</span>
                <TreeNode value={obj[key]} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    )
  }

  return <PrimitiveValue value={value} />
}

interface TreePanelProps {
  data: ParsedData
}

export default function TreePanel({ data }: TreePanelProps) {
  const root: unknown = data.format === 'json' ? JSON.parse(data.raw) : data.rows

  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-inner">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-1 text-xs text-muted-foreground">tree explorer</span>
      </div>
      <div className="overflow-auto bg-muted/20 p-5 font-mono text-sm leading-relaxed">
        <TreeNode value={root} depth={0} />
      </div>
    </div>
  )
}
