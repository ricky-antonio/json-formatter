'use client'

import { useRef } from 'react'

const JSON_SAMPLE = `[
  {"id":1,"name":"Alice Chen","role":"Engineer","salary":142000,"active":true},
  {"id":2,"name":"Bob Martinez","role":"Designer","salary":118000,"active":true},
  {"id":3,"name":"Carol Kim","role":"Manager","salary":165000,"active":false},
  {"id":4,"name":"David Osei","role":"Engineer","salary":138000,"active":true},
  {"id":5,"name":"Eva Torres","role":"Analyst","salary":95000,"active":true}
]`

const CSV_SAMPLE = `product,category,price,stock,rating
"Wireless Headphones",Electronics,89.99,243,4.5
"Standing Desk",Furniture,549.00,18,4.8
"USB-C Hub",Electronics,34.99,891,4.2
"Ergonomic Chair",Furniture,399.00,45,4.7
"Mechanical Keyboard",Electronics,129.99,167,4.6
"Monitor Stand",Furniture,59.99,312,4.3`

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  onFormat: () => void
}

export default function InputPanel({ value, onChange, onFormat }: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      onChange(evt.target?.result as string)
      onFormat()
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,application/json,text/csv"
        className="hidden"
        onChange={handleFile}
      />
      <textarea
        className="h-72 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 transition-colors"
        placeholder="Paste JSON or CSV here…"
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
      />
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <button
          className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60"
          onClick={() => onChange(JSON_SAMPLE)}
        >
          Sample JSON
        </button>
        <button
          className="rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          onClick={() => onChange(CSV_SAMPLE)}
        >
          Sample CSV
        </button>
        <button
          className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-blue-300 hover:text-blue-600 active:scale-95 dark:hover:border-blue-700 dark:hover:text-blue-400"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload file
        </button>
        <button
          className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300 hover:brightness-110 active:scale-95 dark:shadow-blue-900/50 sm:ml-auto sm:mt-0"
          onClick={onFormat}
        >
          Format →
        </button>
      </div>
    </div>
  )
}
