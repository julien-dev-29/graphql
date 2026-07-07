import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { loginHandler, authMiddleware } from './auth.js'
import { schema, root } from './schema.js'

const app = express()
const PORT = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }))
app.use(express.json())

app.post('/api/auth/signin', loginHandler)

app.use('/api/graphql', authMiddleware, graphqlHTTP((req) => ({
  schema,
  rootValue: root,
  context: req,
  graphiql: true,
})))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
