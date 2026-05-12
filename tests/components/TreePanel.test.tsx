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
    expect(screen.getByText('name:')).toBeTruthy()
    expect(screen.getByText('age:')).toBeTruthy()
  })

  it('renders string values with quotes', () => {
    const data = makeData('{"name":"Alice"}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('"Alice"')).toBeTruthy()
  })

  it('renders number values', () => {
    const data = makeData('{"age":30}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('30')).toBeTruthy()
  })

  it('renders boolean values', () => {
    const data = makeData('{"active":true}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('true')).toBeTruthy()
  })

  it('renders null values', () => {
    const data = makeData('{"x":null}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('null')).toBeTruthy()
  })

  it('shows array item count', () => {
    const data = makeData('[1,2,3]')
    render(<TreePanel data={data} />)
    expect(screen.getByText('[3]')).toBeTruthy()
  })

  it('collapses a node on toggle click', async () => {
    const user = userEvent.setup()
    const data = makeData('{"nested":{"a":1,"b":2}}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('nested:')).toBeTruthy()
    const collapseBtn = screen.getAllByLabelText('collapse')[0]
    await user.click(collapseBtn)
    expect(screen.queryByText('nested:')).toBeNull()
  })

  it('expands a collapsed node on toggle click', async () => {
    const user = userEvent.setup()
    const data = makeData('{"a":{"b":{"c":42}}}')
    render(<TreePanel data={data} />)
    expect(screen.queryByText('c:')).toBeNull()
    const expandBtn = screen.getByLabelText('expand')
    await user.click(expandBtn)
    expect(screen.getByText('c:')).toBeTruthy()
  })

  it('renders empty object as {}', () => {
    const data = makeData('{}')
    render(<TreePanel data={data} />)
    expect(screen.getByText('{}')).toBeTruthy()
  })

  it('renders empty array as []', () => {
    const data = makeData('[]')
    render(<TreePanel data={data} />)
    expect(screen.getByText('[]')).toBeTruthy()
  })
})
