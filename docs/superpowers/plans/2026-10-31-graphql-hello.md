# GraphQL Hello World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve a minimal GraphQL `hello` query and a browser page that runs it and displays the result.

**Architecture:** A schema module exposes the query and root resolver. An Express app factory wires GraphQL, static client files, and the Ruru IDE. A thin `server.js` starts the app on port 4000.

**Tech Stack:** Node.js (ESM), Express 5, graphql 16, graphql-http 1.23, ruru 2, `node:test`.

## Global Constraints

- Keep `"type": "module"` in `package.json`; use ESM imports only.
- Do not add dependencies; use only `express`, `graphql`, `graphql-http`, and `ruru` already in `package.json`.
- Default port is `4000`; allow override via `process.env.PORT`.
- GraphQL endpoint is `POST /graphql`; Ruru IDE is `GET /playground`.
- Query is exactly `{ hello }` and returns exactly `"Hello world!"`.

---

### Task 1: Extract schema and test the hello query

**Files:**
- Modify: `package.json:7-9`
- Create: `src/schema.js`
- Create: `test/schema.test.js`
- Modify: `server.js:1-12`

**Interfaces:**
- Consumes: `buildSchema` from `graphql`.
- Produces: `src/schema.js` exports `schema` (GraphQLSchema) and `root` (resolver object with `hello()` returning `"Hello world!"`).

- [ ] **Step 1: Update the test script**

Replace the `scripts` block in `package.json` with:

```json
  "scripts": {
    "start": "node server.js",
    "test": "node --test"
  },
```

- [ ] **Step 2: Write the failing test**

Create `test/schema.test.js`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { graphql } from "graphql";
import { schema, root } from "../src/schema.js";

test("hello query returns greeting", async () => {
  const result = await graphql({
    schema,
    source: "{ hello }",
    rootValue: root,
  });

  assert.deepEqual(result, { data: { hello: "Hello world!" } });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/schema.js`.

- [ ] **Step 4: Create the schema module**

Create `src/schema.js`:

```js
import { buildSchema } from "graphql";

export const schema = buildSchema(`type Query { hello: String } `);

export const root = {
  hello() {
    return "Hello world!";
  },
};
```

- [ ] **Step 5: Point the server at the schema module**

Replace the top of `server.js` (the `buildSchema` import, `schema`, and `root` definitions) with:

```js
import { schema, root } from "./src/schema.js";
import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import { ruruHTML } from "ruru/server";
const app = express();
```

Keep the existing `app.all("/graphql", ...)` handler, Ruru route, and `app.listen(4000)` unchanged for now.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 1 test, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add package.json src/schema.js test/schema.test.js server.js
git commit -m "feat: extract GraphQL schema and add hello query test"
```

---

### Task 2: Serve the client page and Ruru IDE via an app factory

**Files:**
- Create: `src/app.js`
- Create: `public/index.html`
- Create: `public/script.js`
- Create: `test/app.test.js`
- Modify: `server.js` (full rewrite)
- Delete: `index.html`, `script.js` (moved into `public/`)

**Interfaces:**
- Consumes: `schema` and `root` from `src/schema.js`.
- Produces: `createApp()` from `src/app.js` returns a configured Express app without listening.

- [ ] **Step 1: Write the failing HTTP test**

Create `test/app.test.js`:

```js
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("GET / serves the client page", async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /GraphQL Hello/);
});

test("POST /graphql returns the hello greeting", async () => {
  const response = await fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "{ hello }" }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    data: { hello: "Hello world!" },
  });
});

test("GET /playground serves the Ruru IDE", async () => {
  const response = await fetch(`${baseUrl}/playground`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/app.js`.

- [ ] **Step 3: Move the client files into public/**

Run:

```bash
mkdir public
git mv index.html public/index.html
git mv script.js public/script.js
```

- [ ] **Step 4: Write the client page**

Replace `public/index.html` with:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GraphQL Hello</title>
</head>

<body>
  <main>
    <h1>GraphQL Hello</h1>
    <p id="result">Loading...</p>
  </main>
  <script type="module" src="script.js"></script>
</body>

</html>
```

- [ ] **Step 5: Write the client script**

Replace `public/script.js` with:

```js
const result = document.querySelector("#result");

async function runQuery() {
  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: "{ hello }" }),
    });

    const payload = await response.json();

    if (!response.ok || payload.errors) {
      const message = payload.errors?.[0]?.message ?? `HTTP ${response.status}`;
      throw new Error(message);
    }

    result.textContent = payload.data.hello;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
}

runQuery();
```

- [ ] **Step 6: Create the Express app factory**

Create `src/app.js`:

```js
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { fileURLToPath } from "node:url";
import { schema, root } from "./schema.js";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.static(publicDir));

  app.all(
    "/graphql",
    createHandler({
      schema,
      rootValue: root,
    }),
  );

  app.get("/playground", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });

  return app;
}
```

- [ ] **Step 7: Rewrite the server entry point**

Replace `server.js` with:

```js
import { createApp } from "./src/app.js";

const port = process.env.PORT || 4000;

createApp().listen(port);

console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
console.log(`GraphQL IDE at http://localhost:${port}/playground`);
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 4 tests, 0 failures.

- [ ] **Step 9: Verify manually**

Run: `npm start`
Expected: logs the GraphQL endpoint and IDE URLs.

Open `http://localhost:4000` and confirm the page shows `Hello world!`.
Open `http://localhost:4000/playground` and run `{ hello }`; expect `"Hello world!"`.
Stop the server with `Ctrl+C`.

- [ ] **Step 10: Commit**

```bash
git add public src/app.js server.js test/app.test.js
git commit -m "feat: serve GraphQL client page and Ruru playground"
```
