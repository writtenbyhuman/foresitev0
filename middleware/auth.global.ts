export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for API routes
  if (to.path.startsWith('/api')) {
    return
  }

  const auth = useAuthStore()
  
  // Initialize auth on first load
  if (!auth.initialized) {
    auth.initializeAuth()
  }

  // Always allow access to home page
  if (to.path === '/') {
    return
  }

  // Protect all other routes
  if (!auth.isAuthenticated) {
    return navigateTo('/')
  }
})