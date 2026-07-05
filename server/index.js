import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }))
app.use(express.json())

// Routes will be mounted here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
