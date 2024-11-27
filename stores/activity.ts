import { defineStore } from 'pinia'
import { format, subDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface DailyActivity {
  date: string
  steps: number
  activeMinutes: number
  distance: number
  calories: number
  heartRate: {
    average: number
    data: { time: string; value: number }[]
  }
}

export const useActivityStore = defineStore('activity', {
  state: () => ({
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
    activities: new Map<string, DailyActivity>()
  }),

  getters: {
    selectedActivity: (state) => state.activities.get(state.selectedDate),
  },

  actions: {
    getActivityForDate(date: string) {
      if (!this.activities.has(date)) {
        this.activities.set(date, generateActivityData(date))
      }
      return this.activities.get(date)
    },

    getMetricChange(date: string, metricId: keyof DailyActivity) {
      const currentActivity = this.getActivityForDate(date)
      const previousDate = format(subDays(parseISO(date), 1), 'yyyy-MM-dd')
      const previousActivity = this.getActivityForDate(previousDate)

      if (!currentActivity || !previousActivity) return '0'

      const current = currentActivity[metricId]
      const previous = previousActivity[metricId]

      if (typeof current === 'number' && typeof previous === 'number') {
        const change = ((current - previous) / previous) * 100
        return change.toFixed(1)
      }

      return '0'
    },

    getMonthlyActivities() {
      const today = new Date()
      const start = startOfMonth(today)
      const end = endOfMonth(today)
      const days = eachDayOfInterval({ start, end })
      
      return days.map(day => {
        const date = format(day, 'yyyy-MM-dd')
        return this.getActivityForDate(date)!
      })
    },

    setSelectedDate(date: string) {
      this.selectedDate = date
      this.getActivityForDate(date)
    }
  }
})

function generateActivityData(date: string): DailyActivity {
  const dayOfWeek = parseISO(date).getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  
  const baseSteps = isWeekend ? 6000 : 8000
  const variance = isWeekend ? 2000 : 4000
  
  const steps = Math.floor(Math.random() * variance + baseSteps)
  const activeMinutes = Math.floor(steps / 100)
  const distance = +(steps * 0.0007).toFixed(1)
  const calories = Math.floor(steps * 0.04)
  
  const heartRateData = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    let baseRate = 70
    
    if (hour >= 6 && hour <= 22) {
      if (hour >= 7 && hour <= 9) baseRate = 90
      else if (hour >= 17 && hour <= 19) baseRate = 85
      else baseRate = 75
    }
    
    const variance = 10
    const value = Math.floor(Math.random() * variance + baseRate)
    
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      value
    }
  })

  return {
    date,
    steps,
    activeMinutes,
    distance,
    calories,
    heartRate: {
      average: Math.floor(heartRateData.reduce((acc, curr) => acc + curr.value, 0) / heartRateData.length),
      data: heartRateData
    }
  }
}