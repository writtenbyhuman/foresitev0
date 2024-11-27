<template>
  <Menu as="div" class="relative z-50">
    <MenuButton class="flex items-center">
      <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
        <img 
          :src="profileImage" 
          :alt="auth.user?.name"
          class="h-full w-full object-cover"
        />
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute left-0 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div class="p-4">
          <div class="flex items-center space-x-3 mb-4">
            <div class="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
              <img 
                :src="profileImage" 
                :alt="auth.user?.name"
                class="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{ auth.user?.name }}</h3>
              <p class="text-sm text-gray-500">{{ auth.user?.email }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Timezone</span>
              <span class="text-sm font-medium">{{ timezone }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Member Since</span>
              <span class="text-sm font-medium">{{ memberSince }}</span>
            </div>
            <button 
              @click="openProfileModal"
              class="w-full mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </MenuItems>
    </transition>

    <ProfileModal
      v-if="isProfileModalOpen"
      :is-open="isProfileModalOpen"
      @close="isProfileModalOpen = false"
    />
  </Menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const isProfileModalOpen = ref(false)

// In a real app, this would come from the user's profile
const profileImage = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || '')}&background=random`
})

const timezone = computed(() => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
})

const memberSince = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric'
  })
})

const openProfileModal = () => {
  isProfileModalOpen.value = true
}
</script>

<style>
.fixed {
  z-index: 50;
}

.relative {
  position: relative;
  z-index: 50;
}
</style>