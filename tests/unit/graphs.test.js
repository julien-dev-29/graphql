import { describe, it, expect } from 'vitest'
import { renderXpGraph, renderProjectsGraph } from '../../js/graphs.js'

describe('renderXpGraph', () => {
  it('should return empty string for empty data', () => {
    expect(renderXpGraph([])).toBe('')
  })

  it('should return an SVG string for valid data', () => {
    const data = [
      { amount: 100, createdAt: '2024-01-01T00:00:00Z' },
      { amount: 200, createdAt: '2024-02-01T00:00:00Z' },
    ]
    const result = renderXpGraph(data)
    expect(result).toContain('<svg')
    expect(result).toContain('</svg>')
    expect(result).toContain('var(--accent')
  })

  it('should handle single data point', () => {
    const data = [{ amount: 500, createdAt: '2024-06-01T00:00:00Z' }]
    const result = renderXpGraph(data)
    expect(result).toContain('<svg')
    expect(result).toContain('</svg>')
  })

  it('should produce cumulative values', () => {
    const data = [
      { amount: 100, createdAt: '2024-01-01T00:00:00Z' },
      { amount: 50, createdAt: '2024-02-01T00:00:00Z' },
    ]
    const result = renderXpGraph(data)
    expect(result).toContain('<svg')
  })
})

describe('renderProjectsGraph', () => {
  it('should return empty string for empty data', () => {
    expect(renderProjectsGraph([])).toBe('')
  })

  it('should return an SVG string for valid data', () => {
    const data = [
      { name: 'Project A', pass: 5, fail: 2 },
      { name: 'Project B', pass: 3, fail: 4 },
    ]
    const result = renderProjectsGraph(data)
    expect(result).toContain('<svg')
    expect(result).toContain('</svg>')
  })

  it('should render pass and fail bars for each project', () => {
    const data = [{ name: 'Test', pass: 10, fail: 1 }]
    const result = renderProjectsGraph(data)
    expect(result).toContain('var(--success')
    expect(result).toContain('var(--error')
  })
})
