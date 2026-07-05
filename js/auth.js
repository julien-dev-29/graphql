const AUTH_URL = 'https://((DOMAIN))/api/auth/signin'

const MOCK_MODE = true // Must match api.js

export function getToken() {
  return localStorage.getItem('jwt')
}

export function setToken(token) {
  localStorage.setItem('jwt', token)
}

export function clearToken() {
  localStorage.removeItem('jwt')
}

export function isAuthenticated() {
  return !!getToken()
}

export async function login(credentials) {
  if (MOCK_MODE) {
    // Accept any non-empty credentials in mock mode
    if (!credentials.username || !credentials.password) {
      throw new Error('Invalid credentials')
    }
    setToken('mock-jwt-token')
    return 'mock-jwt-token'
  }

  const encoded = btoa(`${credentials.username}:${credentials.password}`)
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${encoded}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Invalid credentials')
  }
  const token = await res.text()
  setToken(token)
  return token
}

export function logout() {
  clearToken()
}
