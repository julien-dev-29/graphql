# GraphQL Endpoint — Design

## Objectif
Ajouter un endpoint GraphQL réel sur le serveur Express pour remplacer les données mock côté client.

## Schema GraphQL

```graphql
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
```

## Endpoint
- `POST /api/graphql` — protégé par `authMiddleware` (JWT Bearer)
- Utilise `express-graphql` (déjà dépendance)

## Résolveurs
- **user** → filtre `users` par `userId` extrait du JWT
- **transaction(type)** → filtre `transactions` par `userId` + optionnellement par `type`
- **result** → filtre `results` par `userId`, jointure avec `objects` pour le champ `object`

## Changements client
- `js/api.js` : URL → `http://localhost:3000/api/graphql`

## Non couvert
- Pagination, mutations, subscriptions
- Pas de déploiement (le placeholder `((DOMAIN))` reste pour la prod)
