import { describe, it, expect, beforeEach, vi } from 'vitest'

const GRAPHQL_URL = 'https://((DOMAIN))/api/graphql-engine/v1/graphql'

function getToken() {
  return localStorage.getItem('jwt')
}

async function query(queryStr, variables = {}) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: queryStr, variables }),
  })

  const data = await res.json()
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data
}

describe('api', () => {
  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn()
  })

  it('should throw if not authenticated', async () => {
    await expect(query('{ user { id } }')).rejects.toThrow('Not authenticated')
  })

  it('should make a GraphQL request with auth header', async () => {
    localStorage.setItem('jwt', 'test-jwt')
    fetch.mockResolvedValue({
      json: async () => ({ data: { user: [{ id: 1 }] } }),
    })
    const result = await query('{ user { id } }')
    expect(result.user[0].id).toBe(1)
    expect(fetch).toHaveBeenCalledWith(GRAPHQL_URL, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer test-jwt',
      }),
    }))
  })

  it('should throw on GraphQL errors', async () => {
    localStorage.setItem('jwt', 'test-jwt')
    fetch.mockResolvedValue({
      json: async () => ({ errors: [{ message: 'Unauthorized' }] }),
    })
    await expect(query('{ user { id } }')).rejects.toThrow('Unauthorized')
  })
})
