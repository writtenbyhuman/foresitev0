<template>
  <div class="min-h-screen bg-gray-50">
    <ClientOnly>
      <NavBar v-if="showNavBar" />
    </ClientOnly>
    <main :class="{ 'container mx-auto px-4 py-8': showNavBar }">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()

const showNavBar = computed(() => {
  return route.path !== '/'
})

onMounted(() => {
  auth.initializeAuth()
})
</script>