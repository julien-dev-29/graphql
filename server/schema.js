import { buildSchema } from 'graphql'
import { users, transactions, objects, results } from './data.js'

export const schema = buildSchema(`
  type User {
    id: Int
    login: String
  }

  type Transaction {
    type: String
    amount: Int
    createdAt: String
    path: String
  }

  type Object {
    name: String
    type: String
  }

  type Result {
    grade: Int
    object: Object
    path: String
  }

  type Query {
    user: [User]
    transaction(type: String): [Transaction]
    result: [Result]
  }
`)

export const root = {
  user(args, req) {
    return users.filter(u => u.id === req.user?.id)
  },
  transaction({ type }, req) {
    let rows = transactions.filter(t => t.userId === req.user?.id)
    if (type) rows = rows.filter(t => t.type === type)
    return rows.map(({ userId, objectId, ...rest }) => ({ ...rest }))
  },
  result(args, req) {
    return results
      .filter(r => r.userId === req.user?.id)
      .map(({ userId, objectId, ...rest }) => ({
        ...rest,
        object: objects.find(o => o.id === objectId) || null,
      }))
  },
}
