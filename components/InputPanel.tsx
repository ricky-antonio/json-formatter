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
    <div className="flex flex-col gap-2">
      <textarea
        className="h-64 w-full resize-none rounded-md border border-input bg-background p-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Paste JSON or CSV here…"
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
      />
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
          onClick={() => onChange(JSON_SAMPLE)}
        >
          Sample JSON
        </button>
        <button
          className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
          onClick={() => onChange(CSV_SAMPLE)}
        >
          Sample CSV
        </button>
        <button
          className="ml-auto rounded-md bg-primary px-4 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={onFormat}
        >
          Format
        </button>
      </div>
    </div>
  )
}
