'use client'

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
  return (
    <div className="flex flex-col gap-3">
      <textarea
        className="h-72 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 transition-colors"
        placeholder="Paste JSON or CSV here…"
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          onClick={() => onChange(JSON_SAMPLE)}
        >
          Sample JSON
        </button>
        <button
          className="rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60"
          onClick={() => onChange(CSV_SAMPLE)}
        >
          Sample CSV
        </button>
        <button
          className="ml-auto rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-300 hover:brightness-110 active:scale-95 dark:shadow-indigo-900/50"
          onClick={onFormat}
        >
          Format →
        </button>
      </div>
    </div>
  )
}
