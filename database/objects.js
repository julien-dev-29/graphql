import { db } from "./db.js";

export function getObjects() {
  return db.prepare("SELECT * FROM objects").all();
}

export function getObjectById(id) {
  const query = db.prepare("SELECT * FROM objects WHERE id = ?");
  return query.get(id);
}

export function getObjectsByUserId(userId) {
  const query = db.prepare("SELECT * FROM objects WHERE user_id = ?");
  return query.all(userId);
}