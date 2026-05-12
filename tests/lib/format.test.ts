import { describe, it, expect } from 'vitest'
import { prettyPrint, toCSV } from '../../lib/format'
import { parseJSON, parseCSV } from '../../lib/parse'
import type { ParsedData } from '../../lib/types'

describe('prettyPrint', () => {
  it('produces indented JSON for json format', () => {
    const data = parseJSON('[{"id":1,"name":"Alice"}]')
    const result = prettyPrint(data)
    expect(result).toBe(JSON.stringify([{ id: 1, name: 'Alice' }], null, 2))
  })

  it('produces valid parseable JSON', () => {
    const data = parseJSON('{"x":1}')
    const result = prettyPrint(data)
    expect(() => JSON.parse(result)).not.toThrow()
  })
})

describe('toCSV', () => {
  it('round-trips basic CSV data', () => {
    const original = 'name,age\nAlice,30\nBob,25'
    const data = parseCSV(original)
    const result = toCSV(data)
    expect(result).toBe('name,age\nAlice,30\nBob,25')
  })

  it('wraps values containing commas in quotes', () => {
    const data: ParsedData = {
      format: 'csv',
      columns: ['product', 'price'],
      rows: [{ product: 'Widget, Deluxe', price: 9.99 }],
      raw: '',
    }
    const result = toCSV(data)
    expect(result).toContain('"Widget, Deluxe"')
  })

  it('outputs empty string for null values', () => {
    const data: ParsedData = {
      format: 'csv',
      columns: ['a', 'b'],
      rows: [{ a: null, b: 1 }],
      raw: '',
    }
    const result = toCSV(data)
    expect(result).toBe('a,b\n,1')
  })
})
