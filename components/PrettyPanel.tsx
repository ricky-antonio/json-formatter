'use client'

import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import type { ParsedData } from '@/lib/types'
import { prettyPrint } from '@/lib/format'

hljs.registerLanguage('json', json)

interface PrettyPanelProps {
  data: ParsedData
}

export default function PrettyPanel({ data }: PrettyPanelProps) {
  const ref = useRef<HTMLElement>(null)
  const pretty = prettyPrint(data)

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted')
      ref.current.textContent = pretty
      hljs.highlightElement(ref.current)
    }
  }, [pretty])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/20 shadow-inner">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-1 text-xs text-muted-foreground">
          {data.format === 'json' ? 'output.json' : 'output.json'}
        </span>
      </div>
      <pre className="overflow-auto p-5 text-sm leading-relaxed">
        <code ref={ref} className="language-json font-mono" />
      </pre>
    </div>
  )
}
