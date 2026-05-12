import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TreePanel from '../../components/TreePanel'
import type { ParsedData } from '../../lib/types'

function makeData(raw: string): ParsedData {
  const parsed = JSON.parse(raw)
  const rows = Array.isArray(parsed) ? parsed : [parsed]
  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  return { format: 'json', columns, rows, raw }
}

describe('TreePanel', () => {
  it('renders object keys at depth 0 (expanded by default)', () => {
    const data = makeData('{"name":"Alice","age":30}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('name:')).toBeInTheDocument()
    expect(screen.getByText('age:')).toBeInTheDocument()
  })

  it('renders string values with quotes', () => {
    const data = makeData('{"name":"Alice"}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('"Alice"')).toBeInTheDocument()
  })

  it('renders number values', () => {
    const data = makeData('{"age":30}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('renders boolean values', () => {
    const data = makeData('{"active":true}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('true')).toBeInTheDocument()
  })

  it('renders null values', () => {
    const data = makeData('{"x":null}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('shows array item count', () => {
    const data = makeData('[1,2,3]')
    render(<TreePanel data={data} />)
    expect(screen.getByText('[3]')).toBeInTheDocument()
  })

  it('collapses a node on toggle click', async () => {
    const user = userEvent.setup()
    const data = makeData('{"nested":{"a":1,"b":2}}')
    render(<TreePanel data={data} />)
    // nested object is at depth 1, starts expanded; its children at depth 2 start collapsed
    // 'nested:' key should be visible (depth 0 expanded)
    expect(screen.getByText('nested:')).toBeInTheDocument()
    // collapse the root by clicking its toggle
    const collapseBtn = screen.getAllByLabelText('collapse')[0]
    await user.click(collapseBtn)
    expect(screen.queryByText('nested:')).not.toBeInTheDocument()
  })

  it('expands a collapsed node on toggle click', async () => {
    const user = userEvent.setup()
    // depth 2 nodes start collapsed — use a deeply nested structure
    const data = makeData('{"a":{"b":{"c":42}}}')
    render(<TreePanel data={data} />)
    // 'b:' is at depth 1 (visible), 'c:' at depth 2 (collapsed by default)
    expect(screen.queryByText('c:')).not.toBeInTheDocument()
    const expandBtn = screen.getByLabelText('expand')
    await user.click(expandBtn)
    expect(screen.getByText('c:')).toBeInTheDocument()
  })

  it('renders empty object as {}', () => {
    const data = makeData('{}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('{}')).toBeInTheDocument()
  })

  it('renders empty array as []', () => {
    const data = makeData('[]')
    render(<TreePanel data={data} />)
    expect(screen.getByText('[]')).toBeInTheDocument()
  })
})
