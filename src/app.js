import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { fileURLToPath } from "node:url";
import { schema } from "./schema.js";
import { root } from "./root.js";

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
