export const MOCK_DATA = {
  user: [
    { id: 1, login: 'jdoe' }
  ],
  transaction: [
    { type: 'xp', amount: 250, createdAt: '2024-09-01T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
    { type: 'xp', amount: 500, createdAt: '2024-09-15T14:30:00Z', path: '/rouen/piscine-go/quest-02' },
    { type: 'xp', amount: 300, createdAt: '2024-10-01T09:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'xp', amount: 1200, createdAt: '2024-10-20T16:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'xp', amount: 800, createdAt: '2024-11-05T11:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'xp', amount: 600, createdAt: '2024-11-25T08:00:00Z', path: '/rouen/div-01/make-your-game' },
    { type: 'xp', amount: 150, createdAt: '2024-12-10T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
    { type: 'xp', amount: 200, createdAt: '2024-12-20T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
    { type: 'xp', amount: 900, createdAt: '2025-01-10T10:00:00Z', path: '/rouen/div-02/banner' },
    { type: 'xp', amount: 1100, createdAt: '2025-02-01T12:00:00Z', path: '/rouen/div-02/portfolio' },
    { type: 'up', amount: 300, createdAt: '2024-10-05T10:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'up', amount: 450, createdAt: '2024-11-10T14:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'up', amount: 200, createdAt: '2025-01-15T09:00:00Z', path: '/rouen/div-02/banner' },
    { type: 'down', amount: 150, createdAt: '2024-10-08T11:00:00Z', path: '/rouen/div-01/graphql' },
    { type: 'down', amount: 100, createdAt: '2024-11-12T16:00:00Z', path: '/rouen/div-01/ascii-art' },
    { type: 'down', amount: 250, createdAt: '2025-01-18T13:00:00Z', path: '/rouen/div-02/banner' },
  ],
  result: [
    { grade: 1, object: { name: 'quest-01', type: 'exercise' }, path: '/rouen/piscine-go/quest-01' },
    { grade: 1, object: { name: 'quest-02', type: 'exercise' }, path: '/rouen/piscine-go/quest-02' },
    { grade: 1, object: { name: 'graphql', type: 'project' }, path: '/rouen/div-01/graphql' },
    { grade: 0, object: { name: 'ascii-art', type: 'project' }, path: '/rouen/div-01/ascii-art' },
    { grade: 1, object: { name: 'make-your-game', type: 'project' }, path: '/rouen/div-01/make-your-game' },
    { grade: 0, object: { name: 'quest-01', type: 'exercise' }, path: '/rouen/piscine-js/quest-01' },
    { grade: 1, object: { name: 'quest-02', type: 'exercise' }, path: '/rouen/piscine-js/quest-02' },
    { grade: 1, object: { name: 'banner', type: 'project' }, path: '/rouen/div-02/banner' },
    { grade: 0, object: { name: 'portfolio', type: 'project' }, path: '/rouen/div-02/portfolio' },
  ],
}

export function getMockData(queryStr) {
  if (queryStr.includes('user {') && !queryStr.includes('transaction') && !queryStr.includes('result')) {
    return { user: MOCK_DATA.user }
  }
  if (queryStr.includes('type: { _eq: \"xp\" }')) {
    return { transaction: MOCK_DATA.transaction.filter(t => t.type === 'xp') }
  }
  if (queryStr.includes('type: { _in: [\"up\", \"down\"] }')) {
    return { transaction: MOCK_DATA.transaction.filter(t => t.type === 'up' || t.type === 'down') }
  }
  if (queryStr.includes('result {') && queryStr.includes('object {')) {
    return { result: MOCK_DATA.result }
  }
  return {}
}
