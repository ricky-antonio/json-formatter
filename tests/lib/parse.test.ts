import { describe, it, expect } from 'vitest'
import { detectFormat, parseJSON, parseCSV, parse } from '../../lib/parse'

describe('detectFormat', () => {
  it('detects JSON object', () => expect(detectFormat('{"a":1}')).toBe('json'))
  it('detects JSON array', () => expect(detectFormat('[1,2]')).toBe('json'))
  it('detects CSV for everything else', () => expect(detectFormat('a,b\n1,2')).toBe('csv'))
  it('trims whitespace before detecting', () => expect(detectFormat('  [1]')).toBe('json'))
})

describe('parseJSON', () => {
  it('parses array of objects', () => {
    const result = parseJSON('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]')
    expect(result.columns).toEqual(['id', 'name'])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]).toEqual({ id: 1, name: 'Alice' })
  })

  it('parses single object as one-row table', () => {
    const result = parseJSON('{"x":1,"y":2}')
    expect(result.columns).toEqual(['x', 'y'])
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toEqual({ x: 1, y: 2 })
  })

  it('returns empty rows and columns for empty array', () => {
    const result = parseJSON('[]')
    expect(result.columns).toEqual([])
    expect(result.rows).toEqual([])
    expect(result.tableDisabled).toBeFalsy()
  })

  it('disables table for array of primitives', () => {
    const result = parseJSON('[1,2,3]')
    expect(result.tableDisabled).toBe(true)
  })

  it('disables table for a primitive value', () => {
    const result = parseJSON('"hello"')
    expect(result.tableDisabled).toBe(true)
  })

  it('throws with message on malformed JSON', () => {
    expect(() => parseJSON('{bad}')).toThrow()
  })

  it('pads missing columns with null for sparse objects', () => {
    const result = parseJSON('[{"a":1},{"a":2,"b":3}]')
    expect(result.columns).toContain('b')
    expect(result.rows[0]['b']).toBeNull()
  })
})

describe('parseCSV', () => {
  it('parses basic CSV', () => {
    const result = parseCSV('name,age\nAlice,30\nBob,25')
    expect(result.columns).toEqual(['name', 'age'])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]).toEqual({ name: 'Alice', age: 30 })
  })

  it('handles quoted fields with commas', () => {
    const result = parseCSV('product,price\n"Widget, Deluxe",9.99')
    expect(result.rows[0]['product']).toBe('Widget, Deluxe')
  })

  it('skips blank lines', () => {
    const result = parseCSV('a,b\n1,2\n\n3,4')
    expect(result.rows).toHaveLength(2)
  })

  it('pads short rows with null', () => {
    const result = parseCSV('a,b,c\n1,2')
    expect(result.rows[0]['c']).toBeNull()
  })

  it('throws on empty input', () => {
    expect(() => parseCSV('')).toThrow()
    expect(() => parseCSV('   \n  ')).toThrow()
  })
})

describe('coerce (via parseCSV)', () => {
  const parseCell = (val: string) => parseCSV(`x,_y\n${val},placeholder`).rows[0]['x']

  it('coerces empty string to null', () => expect(parseCell('')).toBeNull())
  it('coerces "null" to null', () => expect(parseCell('null')).toBeNull())
  it('coerces "NULL" to null', () => expect(parseCell('NULL')).toBeNull())
  it('coerces "true" to boolean', () => expect(parseCell('true')).toBe(true))
  it('coerces "TRUE" to boolean', () => expect(parseCell('TRUE')).toBe(true))
  it('coerces "false" to boolean', () => expect(parseCell('false')).toBe(false))
  it('coerces numeric string to number', () => expect(parseCell('42')).toBe(42))
  it('coerces decimal string to number', () => expect(parseCell('3.14')).toBe(3.14))
  it('keeps non-numeric string as string', () => expect(parseCell('hello')).toBe('hello'))
})

describe('parse (auto-detect)', () => {
  it('routes JSON to parseJSON', () => {
    const result = parse('[{"a":1}]')
    expect(result.format).toBe('json')
  })

  it('routes CSV to parseCSV', () => {
    const result = parse('a,b\n1,2')
    expect(result.format).toBe('csv')
  })
})
