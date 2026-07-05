import { describe, it, expect, beforeEach } from 'vitest'

function setToken(token) {
  localStorage.setItem('jwt', token)
}

function getToken() {
  return localStorage.getItem('jwt')
}

function clearToken() {
  localStorage.removeItem('jwt')
}

function isAuthenticated() {
  return !!getToken()
}

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store and retrieve JWT', () => {
    setToken('test-token')
    expect(getToken()).toBe('test-token')
  })

  it('should clear JWT on logout', () => {
    setToken('test-token')
    clearToken()
    expect(getToken()).toBeNull()
  })

  it('should return false when no token', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('should return true when token exists', () => {
    setToken('some-token')
    expect(isAuthenticated()).toBe(true)
  })
})
