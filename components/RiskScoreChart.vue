<template>
  <div class="bg-white p-4 rounded-lg shadow mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Risk Score</h3>
      <div class="flex space-x-2">
        <button 
          v-for="period in periods"
          :key="period"
          @click="currentPeriod = period"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPeriod === period 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    <div class="h-[200px]">
      <Bar 
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { format, eachDayOfInterval, parseISO, subDays, subMonths, subYears, startOfYear, endOfYear } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  selectedDate: string
}>()

const periods = ['Day', 'Week', 'Month', 'Year']
const currentPeriod = ref('Week')

const generateRiskScore = (date: Date) => {
  const baseScore = 30
  const dayVariance = Math.sin(date.getTime() / (1000 * 60 * 60 * 24)) * 10
  const randomVariance = Math.random() * 10
  return Math.round(baseScore + dayVariance + randomVariance)
}

const chartData = computed(() => {
  const selectedDate = parseISO(props.selectedDate)
  let dates: Date[] = []
  let labelFormat = ''

  switch (currentPeriod.value) {
    case 'Day':
      dates = Array.from({ length: 24 }, (_, i) => {
        const date = new Date(selectedDate)
        date.setHours(i)
        return date
      })
      labelFormat = 'HH:mm'
      break
    case 'Week':
      dates = Array.from({ length: 7 }, (_, i) => subDays(selectedDate, 6 - i))
      labelFormat = 'EEE'
      break
    case 'Month':
      dates = Array.from({ length: 30 }, (_, i) => subDays(selectedDate, 29 - i))
      labelFormat = 'MMM d'
      break
    case 'Year':
      dates = eachDayOfInterval({
        start: startOfYear(selectedDate),
        end: endOfYear(selectedDate)
      })
      labelFormat = 'MMM'
      break
  }

  const labels = dates.map(date => format(date, labelFormat))
  const data = dates.map(date => generateRiskScore(date))

  if (currentPeriod.value === 'Year') {
    const monthlyData: { [key: string]: number[] } = {}
    dates.forEach((date, i) => {
      const month = format(date, 'MMM')
      if (!monthlyData[month]) monthlyData[month] = []
      monthlyData[month].push(data[i])
    })

    return {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Risk Score',
        data: Object.values(monthlyData).map(scores => 
          Math.round(scores.reduce((a, b) => a + b) / scores.length)
        ),
        backgroundColor: '#D35D3F',
        borderRadius: 4
      }]
    }
  }

  return {
    labels,
    datasets: [{
      label: 'Risk Score',
      data,
      backgroundColor: '#D35D3F',
      borderRadius: 4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `Risk Score: ${context.raw}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Risk Score'
      }
    }
  }
}
</script>