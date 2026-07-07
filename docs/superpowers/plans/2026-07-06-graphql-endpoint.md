# GraphQL Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real GraphQL endpoint at `/api/graphql` on the Express server.

**Architecture:** Single schema file with resolvers querying in-memory data from `data.js`, mounted on existing Express app with auth middleware.

**Tech Stack:** express-graphql, graphql (both already deps)

## Global Constraints

- Schema uses standard GraphQL argument style (not Hasura `where` syntax)
- Endpoint protected by existing `authMiddleware` (JWT Bearer)
- Client API URL updated to `http://localhost:3000/api/graphql`
- Mock mode stays toggleable on client for development

---

### Task 1: Create GraphQL schema and resolvers

**Files:**
- Create: `server/schema.js`
- Test: N/A (verified by server start + curl)

**Interfaces:**
- Consumes: `./data.js` (users, transactions, objects, results), `req.user` from authMiddleware
- Produces: `schema` (GraphQLSchema), `root` (resolver object)

- [ ] **Step 1: Write server/schema.js**

```js
import { buildSchema } from 'graphql'
import { users, transactions, objects, results } from './data.js'

export const schema = buildSchema(`
  type User {
    id: Int
    login: String
  }

  type Transaction {
    type: String
    amount: Int
    createdAt: String
    path: String
  }

  type Object {
    name: String
    type: String
  }

  type Result {
    grade: Int
    object: Object
    path: String
  }

  type Query {
    user: [User]
    transaction(type: String): [Transaction]
    result: [Result]
  }
`)

export const root = {
  user(args, req) {
    return users.filter(u => u.id === req.user?.id)
  },
  transaction({ type }, req) {
    let rows = transactions.filter(t => t.userId === req.user?.id)
    if (type) rows = rows.filter(t => t.type === type)
    return rows.map(({ userId, objectId, ...rest }) => ({ ...rest }))
  },
  result(args, req) {
    return results
      .filter(r => r.userId === req.user?.id)
      .map(({ userId, objectId, ...rest }) => ({
        ...rest,
        object: objects.find(o => o.id === objectId) || null,
      }))
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add server/schema.js
git commit -m "feat(server): add GraphQL schema with user, transaction, result queries"
```

### Task 2: Mount GraphQL endpoint on Express

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Update server/index.js**

Import schema and root, add GraphQL endpoint with authMiddleware:

```js
import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { loginHandler, authMiddleware } from './auth.js'
import { schema, root } from './schema.js'

const app = express()
const PORT = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }))
app.use(express.json())

app.post('/api/auth/signin', loginHandler)

app.use('/api/graphql', authMiddleware, graphqlHTTP((req) => ({
  schema,
  rootValue: root,
  context: req,
  graphiql: true,
})))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 2: Verify server starts**

```bash
cd server && node index.js
```

Expected: `Server running on http://localhost:3000`

- [ ] **Step 3: Test GraphQL endpoint**

In another terminal:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/signin -H "Authorization: Basic $(echo -n jdoe:password123 | base64)")

# Query user
curl -s -X POST http://localhost:3000/api/graphql -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"query":"{ user { id login } }"}'

# Query XP transactions
curl -s -X POST http://localhost:3000/api/graphql -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"query":"{ transaction(type: \"xp\") { amount createdAt path } }"}'

# Query results
curl -s -X POST http://localhost:3000/api/graphql -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"query":"{ result { grade object { name type } } }"}'
```

- [ ] **Step 4: Commit**

```bash
git add server/index.js
git commit -m "feat(server): mount GraphQL endpoint at /api/graphql"
```

### Task 3: Update client API URL

**Files:**
- Modify: `js/api.js`

- [ ] **Step 1: Update js/api.js**

Change the GraphQL URL placeholder to point to local server:

```js
const GRAPHQL_URL = 'http://localhost:3000/api/graphql'
```

- [ ] **Step 2: Run existing tests to ensure nothing broke**

```bash
npx vitest run
```

Expected: All existing tests pass (mock mode still works)

- [ ] **Step 3: Commit**

```bash
git add js/api.js
git commit -m "feat(client): point API to local GraphQL endpoint"
```
