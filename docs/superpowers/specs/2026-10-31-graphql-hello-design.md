# GraphQL Hello World Server and Client

## Purpose

Provide a minimal GraphQL example: an Express server exposing a `hello` query and a browser client that runs the query and displays the result.

## Scope

- Keep the existing `{ hello }` query returning `"Hello world!"`.
- No database, authentication, or additional queries/mutations.

## Architecture

- `server.js`
  - Express app.
  - Serves static files from `public/`.
  - Exposes the `graphql-http` handler at `POST /graphql` using the existing schema and root value.
  - Serves Ruru GraphQL IDE at `GET /playground` with endpoint `/graphql`.
- `public/index.html`
  - Loads the client module and shows the query result.
- `public/script.js`
  - Sends `{ hello }` to `/graphql` with `fetch`, then renders the returned value in the page.
- `package.json`
  - Adds `"start": "node server.js"`.
- `.gitignore`
  - Ignores `node_modules`.

## Data Flow

1. Browser loads `/` from the Express static middleware.
2. `script.js` sends `POST /graphql` with `{ "query": "{ hello }" }`.
3. `graphql-http` resolves `hello` to `"Hello world!"`.
4. The client renders the value in a result element.

## Error Handling

- Client checks `response.ok` and GraphQL `errors`, displaying a readable error message in the result element.
- Server logs the listening URL on startup.

## Testing

Manual verification:

1. Run `npm start`.
2. Open `http://localhost:4000` and confirm `Hello world!` is displayed.
3. Open `http://localhost:4000/playground` and confirm Ruru loads and can execute `{ hello }`.
