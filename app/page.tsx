'use client'

import { useState } from 'react'
import Toolbar, { type ViewMode } from '@/components/Toolbar'
import InputPanel from '@/components/InputPanel'
import PrettyPanel from '@/components/PrettyPanel'
import TablePanel from '@/components/TablePanel'
import TreePanel from '@/components/TreePanel'
import ErrorBanner from '@/components/ErrorBanner'
import ThemeToggle from '@/components/ThemeToggle'
import { parse } from '@/lib/parse'
import type { ParsedData } from '@/lib/types'

export default function Home() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<ViewMode>('input')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFormat() {
    if (!input.trim()) return
    try {
      const data = parse(input)
      setParsedData(data)
      setError(null)
      setMode('pretty')
    } catch (e) {
      setError((e as Error).message)
      setParsedData(null)
    }
  }

  function handleClear() {
    setInput('')
    setParsedData(null)
    setError(null)
    setMode('input')
  }

  const tableDisabled = !parsedData || !!parsedData.tableDisabled

  return (
    <>
      {/* Gradient accent strip */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      <div className="min-h-screen px-4 pb-12 pt-10">
        <main className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="text-blue-600 dark:text-blue-400">un</span>
                <span className="text-indigo-500 dark:text-indigo-400">fold</span>
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                Paste JSON or CSV — format, explore, and export in seconds.
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Floating content card */}
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background/95 p-6 shadow-2xl shadow-blue-100/60 backdrop-blur-sm dark:shadow-blue-950/40">
            <Toolbar
              mode={mode}
              onModeChange={setMode}
              parsedData={parsedData}
              tableDisabled={tableDisabled}
              onClear={handleClear}
            />

            <ErrorBanner message={error} />

            <div className="transition-opacity duration-100">
              {mode === 'input' && (
                <InputPanel value={input} onChange={setInput} onFormat={handleFormat} />
              )}
              {mode === 'pretty' && parsedData && <PrettyPanel data={parsedData} />}
              {mode === 'table' && parsedData && !parsedData.tableDisabled && (
                <TablePanel data={parsedData} />
              )}
              {mode === 'tree' && parsedData && <TreePanel data={parsedData} />}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
