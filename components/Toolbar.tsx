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

const activeTab =
  'data-active:bg-gradient-to-r data-active:from-blue-600 data-active:to-indigo-500 data-active:text-white data-active:border-transparent data-active:shadow-sm dark:data-active:from-blue-500 dark:data-active:to-indigo-400'

const gradientBtn =
  'h-auto rounded-xl border-0 bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/60 hover:brightness-110 hover:shadow-lg hover:shadow-blue-300/50 active:scale-95 dark:shadow-blue-900/40'

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
          <TabsTrigger value="input" className={`px-3 text-xs font-medium ${activeTab}`}>
            Input
          </TabsTrigger>
          <TabsTrigger value="pretty" className={`px-3 text-xs font-medium ${activeTab}`}>
            Pretty
          </TabsTrigger>
          <TabsTrigger
            value="table"
            disabled={tableDisabled}
            className={`px-3 text-xs font-medium ${activeTab}`}
          >
            Table
          </TabsTrigger>
          <TabsTrigger
            value="tree"
            disabled={!parsedData}
            className={`px-3 text-xs font-medium ${activeTab}`}
          >
            Tree
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {parsedData && (
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {parsedData.rows.length} row{parsedData.rows.length !== 1 ? 's' : ''}
          </span>
          <Button size="sm" className={gradientBtn} onClick={handleCopy}>
            {copied ? 'Copied ✓' : 'Copy'}
          </Button>
          <Button size="sm" className={gradientBtn} onClick={handleDownload}>
            Download
          </Button>
          <Button
            variant="ghost"
            className="h-auto rounded-xl px-5 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
