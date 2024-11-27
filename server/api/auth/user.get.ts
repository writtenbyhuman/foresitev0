export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization')
  
  if (!auth?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Mock user data - in production this would fetch from a database
  return {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'athlete'
  }
})