'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
      <Tabs value={mode} onValueChange={v => onModeChange(v as ViewMode)}>
        <TabsList className="h-9 gap-0.5 p-1">
          <TabsTrigger value="input" className="px-3 text-xs font-medium">Input</TabsTrigger>
          <TabsTrigger value="pretty" className="px-3 text-xs font-medium">Pretty</TabsTrigger>
          <TabsTrigger value="table" disabled={tableDisabled} className="px-3 text-xs font-medium">
            Table
          </TabsTrigger>
          <TabsTrigger value="tree" disabled={!parsedData} className="px-3 text-xs font-medium">
            Tree
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {parsedData && (
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {parsedData.rows.length} row{parsedData.rows.length !== 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950"
            onClick={handleCopy}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950"
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
