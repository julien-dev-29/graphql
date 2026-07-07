import { getToken } from './auth.js'
import { getMockData } from './mock.js'

const GRAPHQL_URL = 'http://localhost:3000/api/graphql'
const MOCK_MODE = true // Set to false before deploying to production

export async function query(queryStr, variables = {}) {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 300))
    const data = getMockData(queryStr)
    return data
  }

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

  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}
