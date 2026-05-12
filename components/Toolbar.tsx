'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ParsedData } from '@/lib/types'
import { prettyPrint, toCSV } from '@/lib/format'

export type ViewMode = 'input' | 'pretty' | 'table' | 'tree'

interface ToolbarProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
  parsedData: ParsedData | null
  tableDisabled: boolean
  onClear: () => void
}

export default function Toolbar({
  mode,
  onModeChange,
  parsedData,
  tableDisabled,
  onClear,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!parsedData) return
    navigator.clipboard.writeText(prettyPrint(parsedData)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDownload() {
    if (!parsedData) return
    const isJSON = parsedData.format === 'json'
    const content = isJSON ? prettyPrint(parsedData) : toCSV(parsedData)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = isJSON ? 'data.json' : 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
      <Tabs value={mode} onValueChange={v => onModeChange(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="pretty">Pretty</TabsTrigger>
          <TabsTrigger value="table" disabled={tableDisabled}>
            Table
          </TabsTrigger>
          <TabsTrigger value="tree" disabled={!parsedData}>
            Tree
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {parsedData && (
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">
            {parsedData.rows.length} row{parsedData.rows.length !== 1 ? 's' : ''}
          </Badge>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? 'Copied ✓' : 'Copy'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={onClear}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
