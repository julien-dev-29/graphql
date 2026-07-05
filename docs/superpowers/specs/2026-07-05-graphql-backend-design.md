# GraphQL Profile Backend — Design Doc

## Stack
- **Node.js + Express** with `express-graphql` and `graphql` (no build step)
- `jsonwebtoken` for JWT auth
- `cors` for cross-origin from frontend
- Static mock data (same shape as real Hasura GraphQL schema)

## Directory Structure
```
/server
├── index.js          (Express app, CORS, route mounting, listen)
├── schema.js         (GraphQL schema: User, Transaction, Result, Object types)
├── resolvers.js      (Resolveurs: user, transaction, result queries)
├── auth.js           (Basic auth → JWT login, JWT verify middleware)
├── data.js           (Mock data same as js/mock.js)
└── package.json
```

## Endpoints
- `POST /api/auth/signin` — Basic auth → returns JWT
- `POST /api/graphql-engine/v1/graphql` — GraphQL queries with Bearer JWT auth

## Auth Flow
1. Accept Basic auth header at `/api/auth/signin`
2. Accept any non-empty username:password (mock mode), return signed JWT
3. All GraphQL requests require `Authorization: Bearer <JWT>` header
4. JWT middleware verifies token, attaches user info to request

## GraphQL Schema
- **User:** id, login
- **Transaction:** id, type, amount, objectId, userId, createdAt, path
- **Result:** id, objectId, userId, grade, type, createdAt, updatedAt, path
- **Object:** id, name, type, attrs
- **Queries:** user, transaction, result, object (with `where` argument support)

## Data
- Static mock data matching `js/mock.js` structure
- Extended with more variety for richer testing

## Frontend Changes
- `js/api.js` and `js/auth.js`: make `BASE_URL` configurable
- When `MOCK_MODE=false`, use `http://localhost:3000` as base
- The `((DOMAIN))` placeholder becomes `http://localhost:3000` in dev

## Running
```bash
cd server
npm install
npm start  # → http://localhost:3000
```
