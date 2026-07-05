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
