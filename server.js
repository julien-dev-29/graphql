import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import { ruruHTML } from "ruru/server";
const app = express();

const schema = buildSchema(`type Query { hello: String } `);
const root = {
  hello() {
    return "Hello world!";
  },
};

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
