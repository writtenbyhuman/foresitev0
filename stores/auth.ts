import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  role: 'athlete' | 'coach'
  name: string
  profileImage?: string
  age?: number
  height?: number
  weight?: number
}

interface AuthState {
  user: User | null
  token: string | null
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => state.initialized && !!state.token,
    isCoach: (state) => state.user?.role === 'coach',
    isAthlete: (state) => state.user?.role === 'athlete'
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error('Invalid credentials')
        }

        const data = await response.json()
        this.setAuth(data.token, data.user)
        return data
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Authentication failed')
      }
    },

    setAuth(token: string, user: User) {
      this.token = token
      this.user = user
      this.initialized = true
      
      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    updateUser(user: User) {
      this.user = user
      
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    logout() {
      this.token = null
      this.user = null
      
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      
      navigateTo('/')
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            this.token = token
            this.user = user
          } catch {
            this.logout()
          }
        }
      }
      this.initialized = true
    }
  }
})