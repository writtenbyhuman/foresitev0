<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Heart Rate</h3>
    <div class="h-[200px]">
      <Line v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
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

const loaded = ref(false)

onMounted(() => {
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
  loaded.value = true
})

const chartData = {
  labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
  datasets: [
    {
      label: 'BPM',
      data: [72, 85, 90, 78, 88, 75],
      borderColor: '#5D3FD3',
      backgroundColor: 'rgba(93, 63, 211, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}

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
      min: 50,
      max: 120
    }
  }
}
</script>