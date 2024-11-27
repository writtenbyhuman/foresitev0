export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Mock authentication - in production this would validate against a database
  if (body.email === 'thale@gartland.dev' && body.password === 'demo') {
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'athlete'
      }
    }
  }
  
  throw createError({
    statusCode: 401,
    message: 'Invalid credentials'
  })
})