# GraphQL Profile Page — Design Doc

## Tech Stack
- **Vanilla JS** (ES Modules)
- **GitHub Pages** hosting (static, no build step)
- Hash-based SPA routing

## Directory Structure
```
/graphql
├── index.html          (app shell)
├── css/
│   └── style.css       (all styles)
├── js/
│   ├── app.js          (router + app init)
│   ├── auth.js         (login, logout, JWT in localStorage)
│   ├── api.js          (GraphQL client + queries, mock mode support)
│   ├── mock.js         (fake data for local dev, mirrors GraphQL schema)
│   └── graphs.js       (SVG graph rendering)
└── README.md
```

## Routes
- `#/login` — Login form
- `#/dashboard` — Profile page with data + graphs
- Default: redirect to `#/login` if no JWT, else `#/dashboard`

## Auth Flow
1. User submits credentials → POST `/api/auth/signin` with Basic auth
2. On success → store JWT in `localStorage`, redirect to `#/dashboard`
3. On failure → inline error message
4. Logout → clear JWT, redirect to `#/login`
5. All GraphQL requests include `Authorization: Bearer <JWT>`

## Profile Sections (3)
1. **User Info** — login, email, id from `user` table
2. **Total XP** — sum of `transaction.amount` where `type = 'xp'`
3. **Audit Ratio** — audits done / audits received from `transaction` + `user` tables

## SVG Graphs (2)
1. **XP over time** — area/line chart, x=date, y=cumulative XP
2. **Projects PASS/FAIL ratio** — bar chart showing pass vs fail per project/group

## Mock Mode
- `js/mock.js` provides realistic fake data for local development (no backend required)
- `js/api.js` has a `MOCK_MODE` flag (default: `true`)
- Set `MOCK_MODE = false` before deploying to GitHub Pages
- Mock data mirrors the real GraphQL schema shape (user, transaction, result tables)

## GraphQL Queries Used
- **Simple query:** `{ user { id login } }`
- **With arguments:** `{ transaction(where: { type: { _eq: "xp" } }) { amount createdAt path } }`
- **Nested:** `{ result { grade object { name type } } }`

## Styling
- Minimal CSS, clean UI, responsive layout
- CSS custom properties for theming
- No external CSS frameworks

## Error Handling
- Invalid credentials → error message on login
- Network failures → user-friendly messages
- Expired/invalid JWT → redirect to login

## Testing

### Unit Tests (Vitest)
- `tests/unit/auth.test.js` — login flow, JWT storage, logout
- `tests/unit/api.test.js` — GraphQL client, query building, error handling
- `tests/unit/graphs.test.js` — SVG rendering, data transformation
- `tests/unit/app.test.js` — routing logic, navigation guards

### E2E Tests (Playwright)
- `tests/e2e/login.spec.js` — successful login, invalid credentials, error display
- `tests/e2e/dashboard.spec.js` — profile sections render, graphs render, logout
- `tests/e2e/auth.spec.js` — redirect to login when unauthenticated, JWT expiry

### Directory Structure
```
tests/
├── unit/
│   ├── auth.test.js
│   ├── api.test.js
│   ├── graphs.test.js
│   └── app.test.js
└── e2e/
    ├── login.spec.js
    ├── dashboard.spec.js
    └── auth.spec.js
```
