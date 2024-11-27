<template>
  <Line 
    v-if="chartData"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { format, eachDayOfInterval, parseISO } from 'date-fns'
import { useActivityStore } from '~/stores/activity'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  metric: string
  selectedDate: string
  period: {
    type: 'week' | 'month'
    start: string
    end: string
  }
}>()

const activityStore = useActivityStore()

const chartData = computed(() => {
  const start = parseISO(props.period.start)
  const end = parseISO(props.period.end)
  const days = eachDayOfInterval({ start, end })

  const labels = days.map(date => 
    format(date, props.period.type === 'week' ? 'EEE' : 'MMM d')
  )
  
  const data = days.map(date => {
    const activity = activityStore.getActivityForDate(format(date, 'yyyy-MM-dd'))
    return activity?.[props.metric] || 0
  })

  return {
    labels,
    datasets: [{
      label: props.metric,
      data,
      borderColor: '#5D3FD3',
      backgroundColor: 'rgba(93, 63, 211, 0.1)',
      fill: true,
      tension: 0.4
    }]
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
</script>