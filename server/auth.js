import jwt from 'jsonwebtoken'

const JWT_SECRET = 'graphql-profile-secret'
const VALID_USER = { username: 'jdoe', password: 'password123' }

export function loginHandler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).send('Invalid credentials')
  }

  try {
    const base64 = authHeader.split(' ')[1]
    const decoded = atob(base64)
    const [username, password] = decoded.split(':')

    if (username !== VALID_USER.username || password !== VALID_USER.password) {
      return res.status(401).send('Invalid credentials')
    }

    const token = jwt.sign({ id: 1, login: username }, JWT_SECRET)
    res.send(token)
  } catch {
    res.status(401).send('Invalid credentials')
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: [{ message: 'Not authenticated' }] })
  }

  try {
    const token = authHeader.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ errors: [{ message: 'Invalid token' }] })
  }
}
