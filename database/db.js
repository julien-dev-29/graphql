import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./graphql.db");

export { db };
