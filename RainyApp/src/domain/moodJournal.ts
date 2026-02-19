import type { MoodEntry } from '../types/calendar'

export interface MoodMonthSummary {
  totalDays: number
  averageMood: number | null
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function formatMonthKey(monthKey: string): string {
  const [yearPart, monthPart] = monthKey.split('-')
  const year = Number(yearPart)
  const monthIndex = Number(monthPart) - 1
  if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return monthKey
  }

  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export function isFutureDateKey(dateString: string, now: Date = new Date()): boolean {
  return dateString > toDateKey(now)
}

export function monthEntries(entries: Record<string, MoodEntry>, monthKey: string): MoodEntry[] {
  const monthPrefix = `${monthKey}-`
  return Object.values(entries).filter((entry) => entry.date.startsWith(monthPrefix))
}

export function summarizeMonth(entries: Record<string, MoodEntry>, monthKey: string): MoodMonthSummary {
  const currentMonthEntries = monthEntries(entries, monthKey)
  const totalDays = currentMonthEntries.length
  const averageMood =
    totalDays === 0
      ? null
      : Math.round(currentMonthEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalDays)

  return { totalDays, averageMood }
}
