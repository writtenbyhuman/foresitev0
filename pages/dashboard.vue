<template>
  <ClientOnly>
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <div class="text-gray-600">
          {{ formatDate(selectedDate) }}
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          v-for="metric in metrics"
          :key="metric.id"
          :title="metric.title"
          :value="formatMetricValue(metric)"
          :change="getMetricChange(metric)"
          :is-expanded="expandedMetric === metric.id"
          @click="toggleMetric(metric.id)"
        />
      </div>

      <!-- Risk Score Chart -->
      <RiskScoreChart 
        :selected-date="selectedDate"
      />

      <!-- Activity Calendar -->
      <div class="bg-white rounded-lg shadow mb-8">
        <ActivityCalendar 
          :selected-date="selectedDate"
          @date-selected="handleDateSelect"
          @period-changed="handlePeriodChange"
        />
      </div>

      <!-- Expanded Metric View -->
      <div v-if="expandedMetric" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-lg w-full max-w-4xl p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">{{ getMetricTitle(expandedMetric) }}</h2>
            <button @click="expandedMetric = null" class="text-gray-500 hover:text-gray-700">
              <span class="sr-only">Close</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-[400px]">
            <DetailChart 
              :metric="expandedMetric"
              :selected-date="selectedDate"
              :period="currentPeriod"
            />
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { useActivityStore } from '~/stores/activity'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const activityStore = useActivityStore()
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
const expandedMetric = ref<string | null>(null)
const currentPeriod = ref({
  type: 'month' as const,
  start: '',
  end: ''
})

const metrics = [
  { id: 'steps', title: 'Daily Steps', format: (v: number) => v.toLocaleString() },
  { id: 'activeMinutes', title: 'Active Minutes', format: (v: number) => `${v}m` },
  { id: 'distance', title: 'Distance', format: (v: number) => `${v}km` },
  { id: 'calories', title: 'Calories', format: (v: number) => v.toLocaleString() }
]

onMounted(() => {
  activityStore.getActivityForDate(selectedDate.value)
})

function formatDate(date: string) {
  return format(new Date(date), 'MMMM d, yyyy')
}

function formatMetricValue(metric: typeof metrics[0]) {
  const activity = activityStore.getActivityForDate(selectedDate.value)
  if (!activity) return '0'
  return metric.format(activity[metric.id as keyof typeof activity])
}

function getMetricChange(metric: typeof metrics[0]) {
  const change = activityStore.getMetricChange(selectedDate.value, metric.id)
  return `${change}% from yesterday`
}

function getMetricTitle(metricId: string) {
  return metrics.find(m => m.id === metricId)?.title || ''
}

function toggleMetric(metricId: string) {
  expandedMetric.value = expandedMetric.value === metricId ? null : metricId
}

function handleDateSelect(date: string) {
  selectedDate.value = date
  expandedMetric.value = null
  activityStore.getActivityForDate(date)
}

function handlePeriodChange(period: { type: 'day' | 'week' | 'month' | 'year', start: string, end: string }) {
  currentPeriod.value = period
}
</script>