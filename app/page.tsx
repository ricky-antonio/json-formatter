'use client'

import { useState } from 'react'
import Toolbar, { type ViewMode } from '@/components/Toolbar'
import InputPanel from '@/components/InputPanel'
import PrettyPanel from '@/components/PrettyPanel'
import TablePanel from '@/components/TablePanel'
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">JSON / CSV Formatter</h1>

      <div className="flex flex-col gap-4">
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
        </div>
      </div>
    </main>
  )
}
