export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()
  
  // Initialize auth state from localStorage only on client side
  if (process.client) {
    auth.initializeAuth()
  }

  // Add auth state to nuxt payload for SSR
  if (process.server) {
    nuxtApp.payload.auth = {
      user: auth.user,
      token: auth.token,
      initialized: auth.initialized
    }
  }
})