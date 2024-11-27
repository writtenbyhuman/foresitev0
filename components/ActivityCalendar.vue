<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Activity Calendar</h3>
      <div class="flex items-center space-x-4">
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
        <select 
          v-model="selectedYear"
          class="rounded-md border-gray-300 text-sm"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid gap-4">
      <template v-if="currentPeriod === 'Year'">
        <div class="grid grid-cols-12 gap-2">
          <div v-for="month in yearView" :key="month.name" class="space-y-1">
            <div class="text-xs text-gray-500 text-center h-6">{{ month.name }}</div>
            <div class="grid grid-cols-7 gap-[2px]">
              <template v-for="(day, index) in month.days" :key="index">
                <div 
                  v-if="day"
                  @click="handleDayClick(day)"
                  :title="formatDate(day.date)"
                  :class="[
                    'aspect-square rounded-sm cursor-pointer transition-all duration-200',
                    getDayClasses(day)
                  ]"
                />
                <div v-else class="aspect-square" />
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-7 gap-[2px]">
          <template v-for="(day, index) in calendarDays" :key="index">
            <div 
              v-if="day"
              @click="handleDayClick(day)"
              :title="formatDate(day.date)"
              :class="[
                'aspect-square rounded-sm cursor-pointer transition-all duration-200',
                getDayClasses(day)
              ]"
            />
            <div v-else class="aspect-square" />
          </template>
        </div>
      </template>
    </div>

    <div class="mt-4 flex items-center justify-end space-x-2">
      <span class="text-xs text-gray-500">Activity Level:</span>
      <div class="flex space-x-1">
        <div 
          v-for="(color, level) in activityLevels" 
          :key="level"
          :style="{ backgroundColor: color }"
          class="w-4 h-4 rounded-sm"
          :title="level.charAt(0).toUpperCase() + level.slice(1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  startOfWeek,
  endOfWeek,
  parseISO,
  getDay,
  setYear,
  startOfYear,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns'
import { useActivityStore } from '~/stores/activity'

const props = defineProps<{
  selectedDate: string
}>()

const emit = defineEmits<{
  (e: 'date-selected', date: string): void
  (e: 'period-changed', period: { type: 'day' | 'week' | 'month' | 'year', start: string, end: string }): void
}>()

const activityStore = useActivityStore()
const periods = ['Week', 'Month', 'Year']
const currentPeriod = ref('Month')

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const availableYears = computed(() => {
  const years = []
  for (let year = currentYear - 5; year <= currentYear; year++) {
    years.push(year)
  }
  return years
})

const activityLevels = {
  none: '#f3f4f6',
  low: '#c5f6c8',
  medium: '#86e18c',
  high: '#3FD35D'
}

const yearView = computed(() => {
  if (currentPeriod.value !== 'Year') return []

  const year = selectedYear.value
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1))
  })

  return months.map(month => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const days = eachDayOfInterval({ start, end })
    
    const firstDay = days[0]
    const emptyDays = getDay(firstDay)
    const calendar = Array(emptyDays).fill(null)
    
    days.forEach(date => {
      calendar.push({
        date: format(date, 'yyyy-MM-dd'),
        activity: activityStore.getActivityForDate(format(date, 'yyyy-MM-dd'))
      })
    })

    return {
      name: format(month, 'MMM'),
      days: calendar
    }
  })
})

const calendarDays = computed(() => {
  if (currentPeriod.value === 'Year') return []

  const baseDate = setYear(new Date(props.selectedDate), selectedYear.value)
  
  const start = currentPeriod.value === 'Month' 
    ? startOfMonth(baseDate)
    : startOfWeek(baseDate)
  
  const end = currentPeriod.value === 'Month'
    ? endOfMonth(baseDate)
    : endOfWeek(baseDate)

  emit('period-changed', {
    type: currentPeriod.value.toLowerCase() as 'day' | 'week' | 'month' | 'year',
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd')
  })

  const days = eachDayOfInterval({ start, end })
  
  const firstDay = days[0]
  const emptyDays = getDay(firstDay)
  const calendar = Array(emptyDays).fill(null)
  
  days.forEach(date => {
    calendar.push({
      date: format(date, 'yyyy-MM-dd'),
      activity: activityStore.getActivityForDate(format(date, 'yyyy-MM-dd'))
    })
  })

  return calendar
})

watch([currentPeriod, selectedYear], () => {
  const today = setYear(new Date(), selectedYear.value)
  emit('date-selected', format(today, 'yyyy-MM-dd'))

  if (currentPeriod.value === 'Year') {
    const start = startOfYear(today)
    const end = endOfYear(today)
    emit('period-changed', {
      type: 'year',
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    })
  }
})

function formatDate(dateStr: string) {
  return format(parseISO(dateStr), 'MMMM d, yyyy')
}

function getActivityLevel(steps: number): keyof typeof activityLevels {
  if (steps >= 10000) return 'high'
  if (steps >= 7500) return 'medium'
  if (steps >= 5000) return 'low'
  return 'none'
}

function getDayClasses(day: { date: string, activity?: any }) {
  const isSelected = day.date === props.selectedDate
  const level = day.activity ? getActivityLevel(day.activity.steps) : 'none'
  
  return {
    'bg-gray-100': !day.activity,
    [`bg-${level}`]: true,
    'hover:ring-1 hover:ring-primary': true,
    'ring-1 ring-primary': isSelected
  }
}

function handleDayClick(day: { date: string }) {
  emit('date-selected', day.date)
}
</script>

<style scoped>
.bg-none { background-color: #f3f4f6; }
.bg-low { background-color: #c5f6c8; }
.bg-medium { background-color: #86e18c; }
.bg-high { background-color: #3FD35D; }
</style>