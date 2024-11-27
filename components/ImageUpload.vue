<template>
  <div class="relative group">
    <div 
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
      @click="triggerFileInput"
    >
      <span class="text-white text-sm">Change Photo</span>
    </div>
    <img 
      :src="imageUrl" 
      :alt="alt"
      class="h-full w-full object-cover rounded-full"
    />
    <input 
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  imageUrl: string
  alt: string
}>()

const emit = defineEmits<{
  (e: 'update:image', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    emit('update:image', input.files[0])
  }
}
</script>