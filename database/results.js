import { db } from "./db.js";

export function getResults() {
  return db.prepare("SELECT * FROM results").all();
}

export function getResultById(id) {
  const query = db.prepare("SELECT * FROM results WHERE id = ?");
  return query.get(id);
}

export function getResultsByUserId(userId) {
  const query = db.prepare("SELECT * FROM results WHERE user_id = ?");
  return query.all(userId);
}
