import { getUserById, getUsers } from "./database/users.js";
import { getObjectById, getObjects } from "./database/objects.js";
import {
  getTransactions,
  getTransactionById,
} from "./database/transactions.js";
import {
  getProgresses,
  getProgressById,
  getProgressesByUserId,
} from "./database/progresses.js";
import { getResults, getResultById } from "./database/results.js";

export const resolvers = {
  Query: {
    users() {
      return getUsers();
    },
    user(_, { id }) {
      return getUserById(id);
    },
    objects() {
      return getObjects();
    },
    object(_, { id }) {
      return getObjectById(id);
    },
    transactions() {
      return getTransactions();
    },
    transaction(_, { id }) {
      return getTransactionById(id);
    },
    progresses() {
      return getProgresses();
    },
    progress(_, { id }) {
      return getProgressById(id);
    },
    results() {
      return getResults();
    },
    result(_, { id }) {
      return getResultById(id);
    },
  },
  User: {
    progresses(parent) {
      return getProgressesByUserId(parent.id);
    },
  },
};
