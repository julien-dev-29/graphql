export const users = [
  { id: 1, login: 'jdoe' },
]

export const objects = [
  { id: 1, name: 'quest-01', type: 'exercise', attrs: {} },
  { id: 2, name: 'quest-02', type: 'exercise', attrs: {} },
  { id: 3, name: 'graphql', type: 'project', attrs: {} },
  { id: 4, name: 'ascii-art', type: 'project', attrs: {} },
  { id: 5, name: 'make-your-game', type: 'project', attrs: {} },
  { id: 6, name: 'banner', type: 'project', attrs: {} },
  { id: 7, name: 'portfolio', type: 'project', attrs: {} },
]

export const transactions = [
  { id: 1, type: 'xp', amount: 250, objectId: 1, userId: 1, createdAt: '2024-09-01T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
  { id: 2, type: 'xp', amount: 500, objectId: 2, userId: 1, createdAt: '2024-09-15T14:30:00Z', path: '/rouen/piscine-go/quest-02' },
  { id: 3, type: 'xp', amount: 300, objectId: 3, userId: 1, createdAt: '2024-10-01T09:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 4, type: 'xp', amount: 1200, objectId: 3, userId: 1, createdAt: '2024-10-20T16:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 5, type: 'xp', amount: 800, objectId: 4, userId: 1, createdAt: '2024-11-05T11:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 6, type: 'xp', amount: 600, objectId: 5, userId: 1, createdAt: '2024-11-25T08:00:00Z', path: '/rouen/div-01/make-your-game' },
  { id: 7, type: 'xp', amount: 150, objectId: 1, userId: 1, createdAt: '2024-12-10T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
  { id: 8, type: 'xp', amount: 200, objectId: 2, userId: 1, createdAt: '2024-12-20T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
  { id: 9, type: 'xp', amount: 900, objectId: 6, userId: 1, createdAt: '2025-01-10T10:00:00Z', path: '/rouen/div-02/banner' },
  { id: 10, type: 'xp', amount: 1100, objectId: 7, userId: 1, createdAt: '2025-02-01T12:00:00Z', path: '/rouen/div-02/portfolio' },
  { id: 11, type: 'up', amount: 300, objectId: 3, userId: 1, createdAt: '2024-10-05T10:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 12, type: 'up', amount: 450, objectId: 4, userId: 1, createdAt: '2024-11-10T14:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 13, type: 'up', amount: 200, objectId: 6, userId: 1, createdAt: '2025-01-15T09:00:00Z', path: '/rouen/div-02/banner' },
  { id: 14, type: 'down', amount: 150, objectId: 3, userId: 1, createdAt: '2024-10-08T11:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 15, type: 'down', amount: 100, objectId: 4, userId: 1, createdAt: '2024-11-12T16:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 16, type: 'down', amount: 250, objectId: 6, userId: 1, createdAt: '2025-01-18T13:00:00Z', path: '/rouen/div-02/banner' },
]

export const results = [
  { id: 1, objectId: 1, userId: 1, grade: 1, type: '', createdAt: '2024-09-02T10:00:00Z', updatedAt: '2024-09-02T10:00:00Z', path: '/rouen/piscine-go/quest-01' },
  { id: 2, objectId: 2, userId: 1, grade: 1, type: '', createdAt: '2024-09-16T14:00:00Z', updatedAt: '2024-09-16T14:00:00Z', path: '/rouen/piscine-go/quest-02' },
  { id: 3, objectId: 3, userId: 1, grade: 1, type: '', createdAt: '2024-10-21T16:00:00Z', updatedAt: '2024-10-21T16:00:00Z', path: '/rouen/div-01/graphql' },
  { id: 4, objectId: 4, userId: 1, grade: 0, type: '', createdAt: '2024-11-06T11:00:00Z', updatedAt: '2024-11-06T11:00:00Z', path: '/rouen/div-01/ascii-art' },
  { id: 5, objectId: 5, userId: 1, grade: 1, type: '', createdAt: '2024-11-26T08:00:00Z', updatedAt: '2024-11-26T08:00:00Z', path: '/rouen/div-01/make-your-game' },
  { id: 6, objectId: 1, userId: 1, grade: 0, type: '', createdAt: '2024-12-11T13:00:00Z', updatedAt: '2024-12-11T13:00:00Z', path: '/rouen/piscine-js/quest-01' },
  { id: 7, objectId: 2, userId: 1, grade: 1, type: '', createdAt: '2024-12-21T15:00:00Z', updatedAt: '2024-12-21T15:00:00Z', path: '/rouen/piscine-js/quest-02' },
  { id: 8, objectId: 6, userId: 1, grade: 1, type: '', createdAt: '2025-01-11T10:00:00Z', updatedAt: '2025-01-11T10:00:00Z', path: '/rouen/div-02/banner' },
  { id: 9, objectId: 7, userId: 1, grade: 0, type: '', createdAt: '2025-02-02T12:00:00Z', updatedAt: '2025-02-02T12:00:00Z', path: '/rouen/div-02/portfolio' },
]
