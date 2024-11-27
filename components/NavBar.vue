<template>
  <nav class="bg-primary shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center space-x-4">
          <ClientOnly>
            <template v-if="auth.isAuthenticated">
              <ProfileDropdown />
            </template>
            <template v-else>
              <NuxtLink to="/" class="text-xl font-bold text-white">Foresite</NuxtLink>
            </template>
          </ClientOnly>
        </div>
        
        <div class="hidden md:flex space-x-4">
          <template v-if="auth.isAuthenticated">
            <NuxtLink 
              v-if="auth.isCoach" 
              to="/athletes" 
              class="text-white/80 hover:text-white transition-colors"
            >
              Athletes
            </NuxtLink>
            <button 
              @click="auth.logout" 
              class="text-white/80 hover:text-white transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink 
              to="/" 
              class="text-white/80 hover:text-white transition-colors"
            >
              Login
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button 
          @click="isOpen = !isOpen"
          class="md:hidden text-white"
        >
          <span class="sr-only">Open menu</span>
          <svg 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div 
      v-show="isOpen" 
      class="md:hidden bg-white"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <template v-if="auth.isAuthenticated">
          <NuxtLink 
            v-if="auth.isCoach" 
            to="/athletes" 
            class="block px-3 py-2 text-gray-700 hover:text-primary"
          >
            Athletes
          </NuxtLink>
          <button 
            @click="auth.logout" 
            class="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 text-gray-700 hover:text-primary"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const isOpen = ref(false)
</script>