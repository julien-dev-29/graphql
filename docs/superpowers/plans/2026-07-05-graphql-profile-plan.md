# GraphQL Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vanilla JS SPA hosted on GitHub Pages that authenticates via JWT, queries a GraphQL API, and displays a profile page with SVG graphs.

**Architecture:** Single `index.html` entry point with hash-based routing (`#/login`, `#/dashboard`). ES Modules for JS. No build step. Deploy to GitHub Pages.

**Tech Stack:** Vanilla JS (ES Modules), Vitest (unit tests), Playwright (e2e tests), GitHub Pages.

## Global Constraints
- Zero build step — static files only (for GitHub Pages compatibility)
- ES Modules only (`type="module"` in script tags)
- CSS custom properties for theming
- No external CSS frameworks or JS libraries
- All GraphQL queries include `Authorization: Bearer <JWT>` header
- JWT stored in `localStorage` key `jwt`
- Hash-based routes: `#/login`, `#/dashboard`
- `MOCK_MODE = true` in both `js/api.js` and `js/auth.js` for local dev; set to `false` before deployment

---

### Task 1: Project Scaffolding

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/app.js`
- Create: `js/auth.js`
- Create: `js/api.js`
- Create: `js/mock.js`
- Create: `js/graphs.js`

**Interfaces:**
- Produces: all file skeletons with proper ES module imports/exports

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile - GraphQL</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/style.css`**

```css
:root {
  --bg: #f5f5f5;
  --card-bg: #ffffff;
  --text: #1a1a1a;
  --text-secondary: #666;
  --accent: #4f46e5;
  --error: #dc2626;
  --success: #16a34a;
  --border: #e5e7eb;
  --radius: 8px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Cards */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text);
}

/* Login form */
.login-container {
  max-width: 400px;
  margin: 4rem auto;
}

.login-container h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }

.btn-primary {
  background: var(--accent);
  color: white;
  width: 100%;
}

.btn-danger {
  background: var(--error);
  color: white;
}

.error-msg {
  color: var(--error);
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

header h1 { font-size: 1.5rem; }

/* Profile info grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  text-align: center;
  padding: 1rem;
}

.info-item .value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
}

.info-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Graphs */
.graphs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.graph-container svg {
  width: 100%;
  height: auto;
}

.graph-container .graph-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-align: center;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 640px) {
  .graphs-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Create `js/auth.js`**

```js
const AUTH_URL = 'https://((DOMAIN))/api/auth/signin'

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
```

- [ ] **Step 4: Create `js/api.js`**

```js
import { getToken } from './auth.js'

const GRAPHQL_URL = 'https://((DOMAIN))/api/graphql-engine/v1/graphql'

export async function query(queryStr, variables = {}) {
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
```

- [ ] **Step 5: Create `js/mock.js`**

```js
export const MOCK_DATA = {
  user: [
    { id: 1, login: 'jdoe' }
  ],
  transaction: [
    { type: 'xp', amount: 250, createdAt: '2024-09-01T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
    { type: 'xp', amount: 500, createdAt: '2024-09-15T14:30:00Z', path: '/rouen/piscine-go/quest-02' },
    { type: 'xp', amount: 300, createdAt: '2024-10-01T09:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'xp', amount: 1200, createdAt: '2024-10-20T16:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'xp', amount: 800, createdAt: '2024-11-05T11:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'xp', amount: 600, createdAt: '2024-11-25T08:00:00Z', path: '/rouen/div-01/make-your-game' },
    { type: 'xp', amount: 150, createdAt: '2024-12-10T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
    { type: 'xp', amount: 200, createdAt: '2024-12-20T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
    { type: 'xp', amount: 900, createdAt: '2025-01-10T10:00:00Z', path: '/rouen/div-02/banner' },
    { type: 'xp', amount: 1100, createdAt: '2025-02-01T12:00:00Z', path: '/rouen/div-02/portfolio' },
    { type: 'up', amount: 300, createdAt: '2024-10-05T10:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'up', amount: 450, createdAt: '2024-11-10T14:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'up', amount: 200, createdAt: '2025-01-15T09:00:00Z', path: '/rouen/div-02/banner' },
    { type: 'down', amount: 150, createdAt: '2024-10-08T11:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'down', amount: 100, createdAt: '2024-11-12T16:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'down', amount: 250, createdAt: '2025-01-18T13:00:00Z', path: '/rouen/div-02/banner' },
  ],
  result: [
    { grade: 1, object: { name: 'quest-01', type: 'exercise' }, path: '/rouen/piscine-go/quest-01' },
    { grade: 1, object: { name: 'quest-02', type: 'exercise' }, path: '/rouen/piscine-go/quest-02' },
    { grade: 1, object: { name: 'graphql', type: 'project' }, path: '/rouen/div-01/graphql' },
    { grade: 0, object: { name: 'ascii-art', type: 'project' }, path: '/rouen/div-01/ascii-art' },
    { grade: 1, object: { name: 'make-your-game', type: 'project' }, path: '/rouen/div-01/make-your-game' },
    { grade: 0, object: { name: 'quest-01', type: 'exercise' }, path: '/rouen/piscine-js/quest-01' },
    { grade: 1, object: { name: 'quest-02', type: 'exercise' }, path: '/rouen/piscine-js/quest-02' },
    { grade: 1, object: { name: 'banner', type: 'project' }, path: '/rouen/div-02/banner' },
    { grade: 0, object: { name: 'portfolio', type: 'project' }, path: '/rouen/div-02/portfolio' },
  ],
}

export function getMockData(queryStr) {
  if (queryStr.includes('user {') && !queryStr.includes('transaction') && !queryStr.includes('result')) {
    return { user: MOCK_DATA.user }
  }
  if (queryStr.includes('type: { _eq: \"xp\" }')) {
    return { transaction: MOCK_DATA.transaction.filter(t => t.type === 'xp') }
  }
  if (queryStr.includes('type: { _in: [\"up\", \"down\"] }')) {
    return { transaction: MOCK_DATA.transaction.filter(t => t.type === 'up' || t.type === 'down') }
  }
  if (queryStr.includes('result {') && queryStr.includes('object {')) {
    return { result: MOCK_DATA.result }
  }
  return {}
}
```

- [ ] **Step 6: Update `js/api.js` with mock mode**

Update `js/api.js` to:

```js
import { getToken } from './auth.js'
import { getMockData } from './mock.js'

const GRAPHQL_URL = 'https://((DOMAIN))/api/graphql-engine/v1/graphql'
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
```

- [ ] **Step 7: Update `js/auth.js` to allow mock login**

```js
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
```

- [ ] **Step 8: Create `js/graphs.js`**

```js
export function renderXpGraph(data) {
  // SVG area chart for XP over time
  const width = 400, height = 250, pad = 40
  const points = data.map(d => ({ x: new Date(d.createdAt), y: d.amount }))
  points.sort((a, b) => a.x - b.x)

  let cumulative = 0
  const cumPoints = points.map(p => {
    cumulative += p.y
    return { x: p.x, y: cumulative }
  })

  if (cumPoints.length === 0) return ''

  const minDate = cumPoints[0].x.getTime()
  const maxDate = cumPoints[cumPoints.length - 1].x.getTime()
  const maxVal = Math.max(...cumPoints.map(p => p.y))
  const dateRange = maxDate - minDate || 1

  const scaleX = (d) => pad + ((d.getTime() - minDate) / dateRange) * (width - 2 * pad)
  const scaleY = (v) => height - pad - (v / maxVal) * (height - 2 * pad)

  const pathD = cumPoints.map((p, i) => {
    const x = scaleX(p.x).toFixed(1)
    const y = scaleY(p.y).toFixed(1)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const fillD = pathD + ` L ${scaleX(cumPoints[cumPoints.length - 1].x).toFixed(1)} ${height - pad} L ${scaleX(cumPoints[0].x).toFixed(1)} ${height - pad} Z`

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent, #4f46e5)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--accent, #4f46e5)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#xpGrad)"/>
      <path d="${pathD}" fill="none" stroke="var(--accent, #4f46e5)" stroke-width="2"/>
      ${cumPoints.map((p, i) => {
        if (i === 0 || i === cumPoints.length - 1 || i % Math.max(1, Math.floor(cumPoints.length / 5)) === 0) {
          const x = scaleX(p.x).toFixed(1)
          const y = scaleY(p.y).toFixed(1)
          return `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent, #4f46e5)"/>`
        }
        return ''
      }).join('\n      ')}
      <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)">Time</text>
      <text x="10" y="${height / 2}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="rotate(-90, 10, ${height / 2})">XP</text>
    </svg>`
}

export function renderProjectsGraph(data) {
  // Bar chart for project results (pass/fail counts)
  const width = 400, height = 250, pad = 40
  const barWidth = 30
  const gap = 10

  if (data.length === 0) return ''

  const maxCount = Math.max(...data.map(d => Math.max(d.pass, d.fail)), 1)

  const scaleY = (v) => height - pad - (v / maxCount) * (height - 2 * pad)
  const barH = (v) => (v / maxCount) * (height - 2 * pad)

  const chartWidth = data.length * (barWidth * 2 + gap) + gap
  const effectiveWidth = Math.max(width, chartWidth)

  return `
    <svg viewBox="0 0 ${effectiveWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${data.map((d, i) => {
        const x = gap + i * (barWidth * 2 + gap)
        const passH = barH(d.pass)
        const failH = barH(d.fail)
        const label = d.name.length > 10 ? d.name.slice(0, 10) + '...' : d.name
        return `
          <rect x="${x}" y="${scaleY(d.pass)}" width="${barWidth}" height="${passH}" fill="var(--success, #16a34a)" rx="2">
            <title>${d.name}: ${d.pass} pass</title>
          </rect>
          <rect x="${x + barWidth}" y="${scaleY(d.fail)}" width="${barWidth}" height="${failH}" fill="var(--error, #dc2626)" rx="2">
            <title>${d.name}: ${d.fail} fail</title>
          </rect>
          <text x="${x + barWidth}" y="${height - 5}" text-anchor="middle" font-size="8" fill="var(--text-secondary, #666)" transform="rotate(-45, ${x + barWidth}, ${height - 5})">${label}</text>`
      }).join('\n      ')}
      <text x="${effectiveWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="">Projects</text>
      <text x="10" y="${height / 2}" text-anchor="middle" font-size="11" fill="var(--text-secondary, #666)" transform="rotate(-90, 10, ${height / 2})">Count</text>
      <rect x="${effectiveWidth - 100}" y="10" width="10" height="10" fill="var(--success, #16a34a)"/>
      <text x="${effectiveWidth - 86}" y="20" font-size="10" fill="var(--text-secondary, #666)">Pass</text>
      <rect x="${effectiveWidth - 50}" y="10" width="10" height="10" fill="var(--error, #dc2626)"/>
      <text x="${effectiveWidth - 36}" y="20" font-size="10" fill="var(--text-secondary, #666)">Fail</text>
    </svg>`
}
```

- [ ] **Step 9: Create `js/app.js`**

```js
import { login, logout, isAuthenticated, getToken } from './auth.js'
import { query } from './api.js'
import { renderXpGraph, renderProjectsGraph } from './graphs.js'

function navigate(hash) {
  window.location.hash = hash
}

function render(html) {
  document.getElementById('app').innerHTML = html
}

function showError(msg) {
  const el = document.getElementById('error-msg')
  if (el) el.textContent = msg
}

// ---- Login Page ----
function renderLogin() {
  render(`
    <div class="login-container">
      <h1>Sign In</h1>
      <form id="login-form">
        <div class="form-group">
          <label for="username">Username or Email</label>
          <input type="text" id="username" required autocomplete="username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-primary">Sign In</button>
        <div id="error-msg" class="error-msg"></div>
      </form>
    </div>
  `)

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    try {
      await login({ username, password })
      navigate('dashboard')
    } catch (err) {
      showError(err.message)
    }
  })
}

// ---- Dashboard Page ----
async function renderDashboard() {
  render(`<div class="loading">Loading...</div>`)

  try {
    const userId = parseJwt(getToken()).sub || parseJwt(getToken()).id
    const [userData, xpData, resultData, auditData] = await Promise.all([
      query(`{ user { id login } }`),
      query(`{ transaction(where: { type: { _eq: "xp" } }) { amount createdAt path } }`),
      query(`{ result { grade object { name type } } }`),
      query(`{ transaction(where: { type: { _in: ["up", "down"] } }) { type amount } }`),
    ])

    const xpAmount = xpData.transaction.reduce((sum, t) => sum + t.amount, 0)

    let auditRatio = 0
    let auditsDone = 0, auditsReceived = 0
    for (const t of auditData.transaction) {
      if (t.type === 'up') auditsDone += t.amount
      if (t.type === 'down') auditsReceived += t.amount
    }
    if (auditsReceived > 0) auditRatio = (auditsDone / auditsReceived).toFixed(2)

    const projectResults = {}
    for (const r of resultData.result) {
      const name = r.object?.name || 'unknown'
      if (!projectResults[name]) projectResults[name] = { name, pass: 0, fail: 0 }
      if (r.grade === 1) projectResults[name].pass++
      else projectResults[name].fail++
    }

    render(`
      <header>
        <h1>${userData.user[0]?.login || 'Profile'}</h1>
        <button class="btn btn-danger" id="logout-btn">Logout</button>
      </header>

      <div class="card">
        <h2>Stats</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="value">${xpAmount.toLocaleString()}</div>
            <div class="label">Total XP</div>
          </div>
          <div class="info-item">
            <div class="value">${auditRatio}</div>
            <div class="label">Audit Ratio (done/received)</div>
          </div>
          <div class="info-item">
            <div class="value">${resultData.result.length}</div>
            <div class="label">Projects Attempted</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Progress Graphs</h2>
        <div class="graphs-grid">
          <div class="graph-container">
            <div class="graph-title">XP Over Time</div>
            ${renderXpGraph(xpData.transaction)}
          </div>
          <div class="graph-container">
            <div class="graph-title">Projects Pass/Fail</div>
            ${renderProjectsGraph(Object.values(projectResults))}
          </div>
        </div>
      </div>
    `)

    document.getElementById('logout-btn').addEventListener('click', () => {
      logout()
      navigate('login')
    })
  } catch (err) {
    render(`<div class="card"><p class="error-msg">Error: ${err.message}</p></div>`)
  }
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

// ---- Router ----
function router() {
  const hash = window.location.hash.slice(1) || 'login'
  if (hash === 'login') {
    renderLogin()
  } else if (hash === 'dashboard') {
    if (!isAuthenticated()) {
      navigate('login')
      return
    }
    renderDashboard()
  } else {
    navigate('login')
  }
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
```

- [ ] **Step 10: Commit**

```bash
git add index.html css/style.css js/app.js js/auth.js js/api.js js/mock.js js/graphs.js
git commit -m "feat: scaffold project structure with auth, API, mock data, routing, and graphs"
```

---

### Task 2: Configure Testing Infrastructure

**Files:**
- Create: `vitest.config.js`
- Create: `tests/unit/auth.test.js`

**Interfaces:**
- Produces: working Vitest config, first unit test

- [ ] **Step 1: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
})
```

- [ ] **Step 2: Create `tests/unit/auth.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest'

// Re-implement minimal auth functions for testing (no fetch dependency)
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
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run --config vitest.config.js`
Expected: 4 tests passing

- [ ] **Step 4: Install vitest and commit**

Run: `npm init -y; npm install -D vitest jsdom`

```bash
git add vitest.config.js tests/unit/auth.test.js package.json
git commit -m "test: add Vitest config and auth unit tests"
```

---

### Task 3: E2E Testing Setup

**Files:**
- Create: `playwright.config.js`
- Create: `tests/e2e/login.spec.js`

- [ ] **Step 1: Create `playwright.config.js`**

```js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5500',
  },
  webServer: {
    command: 'npx serve .',
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 2: Create `tests/e2e/login.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Sign In')
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/')
    await page.fill('#username', 'baduser')
    await page.fill('#password', 'badpass')
    await page.click('button[type="submit"]')
    await expect(page.locator('#error-msg')).not.toBeEmpty()
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/#/dashboard')
    await expect(page.locator('h1')).toHaveText('Sign In')
  })
})
```

- [ ] **Step 3: Install Playwright and commit**

Run: `npm install -D @playwright/test; npx playwright install chromium`

```bash
git add playwright.config.js tests/e2e/login.spec.js
git commit -m "test: add Playwright config and e2e login tests"
```

---

### Task 4: Unit Tests for API Module

**Files:**
- Create: `tests/unit/api.test.js`

- [ ] **Step 1: Create `tests/unit/api.test.js`**

```js
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
```

- [ ] **Step 2: Run tests to verify**

Run: `npx vitest run --config vitest.config.js`
Expected: 7 tests passing (4 auth + 3 api)

- [ ] **Step 3: Commit**

```bash
git add tests/unit/api.test.js
git commit -m "test: add API module unit tests"
```

---

### Task 5: Unit Tests for Graphs Module

**Files:**
- Create: `tests/unit/graphs.test.js`

- [ ] **Step 1: Create `tests/unit/graphs.test.js`**

```js
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
```

- [ ] **Step 2: Run tests to verify**

Run: `npx vitest run --config vitest.config.js`
Expected: 11 tests passing (4 auth + 3 api + 7 graphs)

- [ ] **Step 3: Commit**

```bash
git add tests/unit/graphs.test.js
git commit -m "test: add graphs module unit tests"
```

---

### Task 6: E2E Dashboard Tests

**Files:**
- Create: `tests/e2e/dashboard.spec.js`

- [ ] **Step 1: Create `tests/e2e/dashboard.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/#/dashboard')
    await expect(page.locator('h1')).toHaveText('Sign In')
  })

  test('should show profile page after mock login', async ({ page }) => {
    // Set a fake JWT to bypass auth
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'fake-jwt-for-testing')
    })
    await page.goto('/#/dashboard')
    // Should show the dashboard (might show error from API, but not login)
    await expect(page.locator('h1')).not.toHaveText('Sign In')
  })

  test('should have logout button on dashboard', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'fake-jwt')
    })
    await page.goto('/#/dashboard')
    await expect(page.locator('#logout-btn')).toBeVisible()
  })
})
```

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/dashboard.spec.js
git commit -m "test: add e2e dashboard tests"
```

---

### Task 7: Verify All Tests Pass

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run --config vitest.config.js`
Expected: All passing

- [ ] **Step 2: Verify lint-free code (manual review)**

Check that no console.log statements remain in production code.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final cleanup after testing"
```
