import { db } from "./db.js";

export function getProgresses() {
  return db.prepare("SELECT * FROM progresses").all();
}

export function getProgressById(id) {
  const query = db.prepare("SELECT * FROM progresses WHERE id = ?");
  return query.get(id);
}

export function getProgressesByUserId(userId) {
  const query = db.prepare("SELECT * FROM progresses WHERE user_id = ?");
  return query.all(userId);
}
