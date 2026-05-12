import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TablePanel from '../../components/TablePanel'
import type { ParsedData } from '../../lib/types'

const data: ParsedData = {
  format: 'json',
  columns: ['name', 'age', 'active', 'score'],
  rows: [
    { name: 'Alice', age: 30, active: true, score: null },
    { name: 'Bob', age: 25, active: false, score: 88 },
    { name: 'Carol', age: 35, active: true, score: 92 },
  ],
  raw: '',
}

describe('TablePanel', () => {
  it('renders all column headers', () => {
    render(<TablePanel data={data} />)
    expect(screen.getByText('name')).toBeTruthy()
    expect(screen.getByText('age')).toBeTruthy()
    expect(screen.getByText('active')).toBeTruthy()
    expect(screen.getByText('score')).toBeTruthy()
  })

  it('renders all rows', () => {
    render(<TablePanel data={data} />)
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('Bob')).toBeTruthy()
    expect(screen.getByText('Carol')).toBeTruthy()
  })

  it('shows row count badge', () => {
    render(<TablePanel data={data} />)
    expect(screen.getByText('3 / 3 rows')).toBeTruthy()
  })

  it('renders null cells with text "null"', () => {
    render(<TablePanel data={data} />)
    const nullCells = screen.getAllByText('null')
    expect(nullCells.length).toBeGreaterThan(0)
  })

  it('renders boolean cells as true/false text', () => {
    render(<TablePanel data={data} />)
    expect(screen.getAllByText('true').length).toBeGreaterThan(0)
    expect(screen.getAllByText('false').length).toBeGreaterThan(0)
  })

  it('number cells have blue color class', () => {
    render(<TablePanel data={data} />)
    const cell = screen.getByText('88')
    expect(cell.className).toMatch(/blue/)
  })

  it('boolean cells have green color class', () => {
    render(<TablePanel data={data} />)
    const trueCell = screen.getAllByText('true')[0]
    expect(trueCell.className).toMatch(/green/)
  })

  it('null cells have muted italic class', () => {
    render(<TablePanel data={data} />)
    const nullCell = screen.getAllByText('null')[0]
    expect(nullCell.className).toMatch(/italic/)
  })

  it('filters rows on filter input', async () => {
    const user = userEvent.setup()
    render(<TablePanel data={data} />)
    await user.type(screen.getByPlaceholderText('Filter all columns…'), 'alice')
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.queryByText('Bob')).toBeNull()
    expect(screen.getByText('1 / 3 rows')).toBeTruthy()
  })

  it('sorts ascending on first header click', async () => {
    const user = userEvent.setup()
    render(<TablePanel data={data} />)
    await user.click(screen.getByText('name'))
    const cells = screen.getAllByRole('cell')
    const names = cells
      .filter(c => ['Alice', 'Bob', 'Carol'].includes(c.textContent ?? ''))
      .map(c => c.textContent)
    expect(names).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('sorts descending on second header click', async () => {
    const user = userEvent.setup()
    render(<TablePanel data={data} />)
    await user.click(screen.getByText('name'))
    await user.click(screen.getByText('name ↑'))
    const cells = screen.getAllByRole('cell')
    const names = cells
      .filter(c => ['Alice', 'Bob', 'Carol'].includes(c.textContent ?? ''))
      .map(c => c.textContent)
    expect(names).toEqual(['Carol', 'Bob', 'Alice'])
  })
})
