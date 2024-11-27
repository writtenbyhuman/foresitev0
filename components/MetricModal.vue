<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
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
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle as="h3" class="text-2xl font-bold mb-4">{{ metricTitle }}</DialogTitle>
              <div class="h-[400px]">
                <Line 
                  v-if="chartData"
                  :data="chartData"
                  :options="chartOptions"
                />
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Line } from 'vue-chartjs'
import { format, subDays } from 'date-fns'
import { useActivityStore } from '~/stores/activity'

const props = defineProps<{
  isOpen: boolean
  metricType: string
  activity: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activityStore = useActivityStore()

const metricTitle = computed(() => {
  switch (props.metricType) {
    case 'steps': return 'Daily Steps'
    case 'activeMinutes': return 'Active Minutes'
    case 'distance': return 'Distance (km)'
    case 'calories': return 'Calories Burned'
    default: return ''
  }
})

const chartData = computed(() => {
  if (!props.activity) return null

  const labels = []
  const data = []
  const date = new Date(props.activity.date)

  for (let i = 6; i >= 0; i--) {
    const currentDate = subDays(date, i)
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const activity = activityStore.activities.get(dateStr)

    labels.push(format(currentDate, 'EEE'))
    data.push(activity?.[props.metricType] || 0)
  }

  return {
    labels,
    datasets: [
      {
        label: metricTitle.value,
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const closeModal = () => {
  emit('close')
}
</script>