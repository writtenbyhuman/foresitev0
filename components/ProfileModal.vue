<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-2xl font-bold mb-6">Edit Profile</DialogTitle>
              
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="flex justify-center mb-6">
                  <div class="h-24 w-24">
                    <ImageUpload
                      :image-url="profileImage"
                      :alt="form.name"
                      @update:image="handleImageUpdate"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    v-model="form.name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    v-model="form.email"
                    type="email"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Age</label>
                    <input 
                      v-model="form.age"
                      type="number"
                      min="0"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input 
                      v-model="form.height"
                      type="number"
                      min="0"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input 
                      v-model="form.weight"
                      type="number"
                      min="0"
                      step="0.1"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">New Password</label>
                  <input 
                    v-model="form.password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Timezone</label>
                  <select 
                    v-model="form.timezone"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
                  </select>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    :disabled="loading"
                  >
                    {{ loading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const auth = useAuthStore()
const loading = ref(false)
const timezones = ref([
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney'
])

const form = ref({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  password: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  age: auth.user?.age || '',
  height: auth.user?.height || '',
  weight: auth.user?.weight || ''
})

const profileImage = computed(() => {
  return auth.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || '')}&background=5D3FD3&color=fff`
})

const handleImageUpdate = async (file: File) => {
  try {
    // In a real app, you would upload the file to a server
    const imageUrl = URL.createObjectURL(file)
    auth.updateUser({
      ...auth.user!,
      profileImage: imageUrl
    })
  } catch (error) {
    console.error('Failed to update profile image:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // In a real app, you would make an API call here
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update the user in the auth store
    auth.updateUser({
      ...auth.user!,
      name: form.value.name,
      email: form.value.email,
      age: form.value.age,
      height: form.value.height,
      weight: form.value.weight
    })
    
    closeModal()
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>