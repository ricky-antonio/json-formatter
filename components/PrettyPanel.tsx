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
    <div className="overflow-auto rounded-md border border-border bg-muted/30 p-1">
      <pre className="overflow-auto p-3 text-sm">
        <code ref={ref} className="language-json font-mono" />
      </pre>
    </div>
  )
}
