import { db } from "./db.js";

export function getTransactions() {
  return db.prepare("SELECT * FROM transactions").all();
}

export function getTransactionById(id) {
  const query = db.prepare("SELECT * FROM transactions WHERE id = ?");
  return query.get(id);
}

export function getTransactionByUserId(userId) {
  const query = db.prepare("SELECT * FROM transactions WHERE user_id = ?");
  return query.all(userId);
}
