export const typeDefs = `#graphql
    type User {
        id: ID!,
        username: String!,
        email: String!,
        progresses: [Progress!],
        
    }
    type Object {
        id: ID!,
        name: String!
        type: String!,
    }
    type Progress {
        id: ID!,
        grade: Int!,
        createdAt: String!,
        updatedAt: String!,
        path: String!,
        user: User!,
        object: Object!
    }
    type Transaction {
        id: ID!,
        type: String!,
        amount: Int!,
        createdAt: String!,
        updatedAt: String!,
    }
    type Result {
        id: ID!,
        grade: Int!,
        type: String!,
        createdAt: String!,
        updatedAt: String!,
        path: String!
    }
    type Query {
        users: [User],
        user(id: ID!): User,
        objects: [Object],
        object(id: ID!): Object,
        transactions: [Transaction],
        transaction(id: ID!): Transaction,
        progresses: [Progress],
        progress(id: ID!): Progress,
        results: [Result],
        result(id: ID!): Result
    }
`;
