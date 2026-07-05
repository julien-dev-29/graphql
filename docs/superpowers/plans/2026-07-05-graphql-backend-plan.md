# GraphQL Profile Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Node.js/Express backend that serves GraphQL and auth endpoints with mock data, replacing the frontend mock mode.

**Architecture:** Express app with `express-graphql` middleware. Two endpoints: `/api/auth/signin` (Basic auth → JWT) and `/api/graphql-engine/v1/graphql` (GraphQL queries with Bearer JWT). Static mock data.

**Tech Stack:** Node.js, Express, express-graphql, graphql, jsonwebtoken, cors

## Global Constraints
- Express server on port 3000
- CORS enabled for frontend dev server (localhost:5500)
- JWT secret: `graphql-profile-secret`
- Endpoint paths must match frontend expectations exactly
- Mock data must mirror frontend `js/mock.js` structure
- No database — all data in memory from static JS object

---

### Task 1: Server Scaffold

**Files:**
- Create: `server/package.json`
- Create: `server/data.js`
- Create: `server/index.js` (skeleton)

**Interfaces:**
- Produces: `server/package.json` with dependencies, `server/data.js` with mock data

- [ ] **Step 1: Create `server/package.json`**

```json
{
  "name": "graphql-profile-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-graphql": "^0.12.0",
    "graphql": "^16.8.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

- [ ] **Step 2: Create `server/data.js`**

```js
export const users = [
  { id: 1, login: 'jdoe' },
]

export const objects = [
  { id: 1, name: 'quest-01', type: 'exercise', attrs: {} },
  { id: 2, name: 'quest-02', type: 'exercise', attrs: {} },
  { id: 3, name: 'graphql', type: 'project', attrs: {} },
  { id: 4, name: 'ascii-art', type: 'project', attrs: {} },
  { id: 5, name: 'make-your-game', type: 'project', attrs: {} },
  { id: 6, name: 'banner', type: 'project', attrs: {} },
  { id: 7, name: 'portfolio', type: 'project', attrs: {} },
]

export const transactions = [
  { id: 1, type: 'xp', amount: 250, objectId: 1, userId: 1, createdAt: '2024-09-01T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
  { id: 2, type: 'xp', amount: 500, objectId: 2, userId: 1, createdAt: '2024-09-15T14:30:00Z', path: '/rouen/piscine-go/quest-02' },
  { id: 3, type: 'xp', amount: 300, objectId: 3, userId: 1, createdAt: '2024-10-01T09:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 4, type: 'xp', amount: 1200, objectId: 3, userId: 1, createdAt: '2024-10-20T16:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 5, type: 'xp', amount: 800, objectId: 4, userId: 1, createdAt: '2024-11-05T11:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 6, type: 'xp', amount: 600, objectId: 5, userId: 1, createdAt: '2024-11-25T08:00:00Z', path: '/rouen/div-01/make-your-game' },
  { id: 7, type: 'xp', amount: 150, objectId: 1, userId: 1, createdAt: '2024-12-10T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
  { id: 8, type: 'xp', amount: 200, objectId: 2, userId: 1, createdAt: '2024-12-20T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
  { id: 9, type: 'xp', amount: 900, objectId: 6, userId: 1, createdAt: '2025-01-10T10:00:00Z', path: '/rouen/div-02/banner' },
  { id: 10, type: 'xp', amount: 1100, objectId: 7, userId: 1, createdAt: '2025-02-01T12:00:00Z', path: '/rouen/div-02/portfolio' },
  { id: 11, type: 'up', amount: 300, objectId: 3, userId: 1, createdAt: '2024-10-05T10:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 12, type: 'up', amount: 450, objectId: 4, userId: 1, createdAt: '2024-11-10T14:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 13, type: 'up', amount: 200, objectId: 6, userId: 1, createdAt: '2025-01-15T09:00:00Z', path: '/rouen/div-02/banner' },
  { id: 14, type: 'down', amount: 150, objectId: 3, userId: 1, createdAt: '2024-10-08T11:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 15, type: 'down', amount: 100, objectId: 4, userId: 1, createdAt: '2024-11-12T16:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 16, type: 'down', amount: 250, objectId: 6, userId: 1, createdAt: '2025-01-18T13:00:00Z', path: '/rouen/div-02/banner' },
]

export const results = [
  { id: 1, objectId: 1, userId: 1, grade: 1, type: '', createdAt: '2024-09-02T10:00:00Z', updatedAt: '2024-09-02T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
  { id: 2, objectId: 2, userId: 1, grade: 1, type: '', createdAt: '2024-09-16T14:00:00Z', updatedAt: '2024-09-16T14:00:00Z', path: '/rouen/piscine-go/quest-02' },
  { id: 3, objectId: 3, userId: 1, grade: 1, type: '', createdAt: '2024-10-21T16:00:00Z', updatedAt: '2024-10-21T16:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 4, objectId: 4, userId: 1, grade: 0, type: '', createdAt: '2024-11-06T11:00:00Z', updatedAt: '2024-11-06T11:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 5, objectId: 5, userId: 1, grade: 1, type: '', createdAt: '2024-11-26T08:00:00Z', updatedAt: '2024-11-26T08:00:00Z', path: '/rouen/div-01/make-your-game' },
  { id: 6, objectId: 1, userId: 1, grade: 0, type: '', createdAt: '2024-12-11T13:00:00Z', updatedAt: '2024-12-11T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
  { id: 7, objectId: 2, userId: 1, grade: 1, type: '', createdAt: '2024-12-21T15:00:00Z', updatedAt: '2024-12-21T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
  { id: 8, objectId: 6, userId: 1, grade: 1, type: '', createdAt: '2025-01-11T10:00:00Z', updatedAt: '2025-01-11T10:00:00Z', path: '/rouen/div-02/banner' },
  { id: 9, objectId: 7, userId: 1, grade: 0, type: '', createdAt: '2025-02-02T12:00:00Z', updatedAt: '2025-02-02T12:00:00Z', path: '/rouen/div-02/portfolio' },
]
```

- [ ] **Step 3: Create `server/index.js` skeleton**

```js
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }))
app.use(express.json())

// Routes will be mounted here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 4: Install dependencies and test**

Run: `cd server; npm install`

Verify the server starts: `node index.js` → should print "Server running on http://localhost:3000"

- [ ] **Step 5: Commit**

```bash
git add server/package.json server/data.js server/index.js
git commit -m "feat(server): scaffold Express server with mock data"
```

---

### Task 2: Auth Module

**Files:**
- Create: `server/auth.js`
- Modify: `server/index.js`

**Interfaces:**
- Produces: `POST /api/auth/signin` endpoint that returns JWT

- [ ] **Step 1: Create `server/auth.js`**

```js
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'graphql-profile-secret'
const VALID_USER = { username: 'jdoe', password: 'password123' }

export function loginHandler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).send('Invalid credentials')
  }

  try {
    const base64 = authHeader.split(' ')[1]
    const decoded = atob(base64)
    const [username, password] = decoded.split(':')

    if (username !== VALID_USER.username || password !== VALID_USER.password) {
      return res.status(401).send('Invalid credentials')
    }

    const token = jwt.sign({ id: 1, login: username }, JWT_SECRET)
    res.send(token)
  } catch {
    res.status(401).send('Invalid credentials')
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: [{ message: 'Not authenticated' }] })
  }

  try {
    const token = authHeader.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ errors: [{ message: 'Invalid token' }] })
  }
}
```

- [ ] **Step 2: Mount auth route in `server/index.js`**

```js
import { loginHandler } from './auth.js'

// Routes
app.post('/api/auth/signin', loginHandler)
```

- [ ] **Step 3: Test auth endpoint**

Run server and test with curl:
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Authorization: Basic $(echo -n 'jdoe:password123' | base64)"
```
Expected: returns a JWT string

- [ ] **Step 4: Commit**

```bash
git add server/auth.js server/index.js
git commit -m "feat(server): add auth endpoint with JWT"
```

---

### Task 3: GraphQL Schema + Resolvers

**Files:**
- Create: `server/schema.js`
- Create: `server/resolvers.js`

**Interfaces:**
- Produces: GraphQL schema types + resolvers for user, transaction, result, object
- Consumes: `server/data.js` exports (users, transactions, results, objects)

- [ ] **Step 1: Create `server/schema.js`**

```js
import { buildSchema } from 'graphql'

export const schema = buildSchema(`
  type User {
    id: Int
    login: String
  }

  type Transaction {
    id: Int
    type: String
    amount: Int
    objectId: Int
    userId: Int
    createdAt: String
    path: String
  }

  type Result {
    id: Int
    objectId: Int
    userId: Int
    grade: Int
    type: String
    createdAt: String
    updatedAt: String
    path: String
    object: Object
  }

  type Object {
    id: Int
    name: String
    type: String
    attrs: String
  }

  input TransactionWhere {
    type: TransactionWhereType
  }

  input TransactionWhereType {
    _eq: String
    _in: [String]
  }

  type Query {
    user: [User]
    transaction(where: TransactionWhere): [Transaction]
    result: [Result]
    object(where: ObjectWhere): [Object]
  }

  input ObjectWhere {
    id: ObjectWhereId
  }

  input ObjectWhereId {
    _eq: Int
  }
`)
```

- [ ] **Step 2: Create `server/resolvers.js`**

```js
import { users, transactions, results, objects } from './data.js'

export const root = {
  user: () => users,
  transaction: (args) => {
    if (!args.where) return transactions
    if (args.where.type?._eq) {
      return transactions.filter(t => t.type === args.where.type._eq)
    }
    if (args.where.type?._in) {
      return transactions.filter(t => args.where.type._in.includes(t.type))
    }
    return transactions
  },
  result: () => results.map(r => ({
    ...r,
    object: objects.find(o => o.id === r.objectId) || null,
  })),
  object: (args) => {
    if (!args.where) return objects
    if (args.where.id?._eq) {
      return objects.filter(o => o.id === args.where.id._eq)
    }
    return objects
  },
}
```

- [ ] **Step 3: Commit**

```bash
git add server/schema.js server/resolvers.js
git commit -m "feat(server): add GraphQL schema and resolvers"
```

---

### Task 4: Mount GraphQL Endpoint

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Update `server/index.js` with GraphQL**

Final `server/index.js`:

```js
import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema.js'
import { root } from './resolvers.js'
import { loginHandler, authMiddleware } from './auth.js'

const app = express()
const PORT = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }))
app.use(express.json())

// Auth
app.post('/api/auth/signin', loginHandler)

// GraphQL (protected)
app.use('/api/graphql-engine/v1/graphql', authMiddleware, (req, res) => {
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    context: { user: req.user },
  })(req, res)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 2: Test GraphQL endpoint**

Run server and test:
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/signin \
  -H "Authorization: Basic $(echo -n 'jdoe:password123' | base64)")

# Query user
curl -X POST http://localhost:3000/api/graphql-engine/v1/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user { id login } }"}'
```
Expected: Returns `{"data":{"user":[{"id":1,"login":"jdoe"}]}}`

Test XP query:
```bash
curl -X POST http://localhost:3000/api/graphql-engine/v1/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ transaction(where: { type: { _eq: \"xp\" } }) { amount createdAt } }"}'
```

Test nested query:
```bash
curl -X POST http://localhost:3000/api/graphql-engine/v1/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ result { grade object { name type } } }"}'
```

- [ ] **Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat(server): mount GraphQL endpoint with auth middleware"
```

---

### Task 5: Frontend Config Updates

**Files:**
- Modify: `js/api.js`
- Modify: `js/auth.js`

- [ ] **Step 1: Update `js/api.js` to support local backend**

```js
import { getToken } from './auth.js'

const GRAPHQL_URL = 'http://localhost:3000/api/graphql-engine/v1/graphql'
const MOCK_MODE = false // Now pointing to local backend

export async function query(queryStr, variables = {}) {
  if (MOCK_MODE) {
    const { getMockData } = await import('./mock.js')
    await new Promise(r => setTimeout(r, 300))
    return getMockData(queryStr)
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

- [ ] **Step 2: Update `js/auth.js` to point to local backend**

```js
const AUTH_URL = 'http://localhost:3000/api/auth/signin'

const MOCK_MODE = false // Now pointing to local backend

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

- [ ] **Step 3: Verify frontend can reach backend**

1. Start server: `cd server; node index.js`
2. Start frontend: `npx serve . -p 5500`
3. Open browser to `http://localhost:5500`
4. Login with `jdoe` / `password123`
5. Verify dashboard loads with real data from backend

- [ ] **Step 4: Update unit tests to reflect new URLs**

Update `tests/unit/api.test.js` to use `http://localhost:3000` instead of `https://((DOMAIN))`:

```js
const GRAPHQL_URL = 'http://localhost:3000/api/graphql-engine/v1/graphql'
```

- [ ] **Step 5: Run all tests**

Run: `cd ..; npx vitest run`
Expected: All 14 tests pass

- [ ] **Step 6: Commit**

```bash
git add js/api.js js/auth.js tests/unit/api.test.js
git commit -m "feat: point frontend to local backend, disable mock mode"
```

---

### Task 6: Full Stack Verification

- [ ] **Step 1: Start backend**

```bash
cd server; node index.js
```

- [ ] **Step 2: Run frontend tests**

```bash
npx vitest run
```
Expected: 14/14 passing

- [ ] **Step 3: Run a manual E2E test**

Ensure server is running, then:
```bash
npx playwright test
```
Expected: 6/6 passing

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final adjustments for full stack integration"
```
