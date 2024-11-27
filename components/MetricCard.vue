<template>
  <div 
    class="bg-white p-4 rounded-lg shadow cursor-pointer transform transition-all duration-200"
    :class="[
      isExpanded ? 'scale-[1.02] ring-2 ring-blue-500' : 'hover:scale-[1.02]'
    ]"
    @click="$emit('click')"
  >
    <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
    <p class="text-3xl font-bold mt-2">{{ value }}</p>
    <p class="text-sm text-gray-500 mt-1">{{ change }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  change: string
  isExpanded: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>