import { db } from "./db.js";

export function getUsers() {
  return db.prepare("SELECT * FROM users").all();
}

export function getUserById(id) {
  const query = db.prepare("SELECT * FROM users WHERE id = ?");
  return query.get(id);
}
