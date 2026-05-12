'use client'

import { useState } from 'react'
import Toolbar, { type ViewMode } from '@/components/Toolbar'
import InputPanel from '@/components/InputPanel'
import PrettyPanel from '@/components/PrettyPanel'
import TablePanel from '@/components/TablePanel'
import TreePanel from '@/components/TreePanel'
import ErrorBanner from '@/components/ErrorBanner'
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
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />

      <div className="min-h-screen px-4 pb-12 pt-10">
        <main className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
              JSON / CSV Formatter
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Paste data — format, explore, and export in seconds.
            </p>
          </div>

          {/* Floating content card */}
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background/95 p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur-sm dark:shadow-indigo-950/40">
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
