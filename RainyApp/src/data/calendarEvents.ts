import type { CalendarEvent } from '../types/calendar'

const today = new Date().toISOString().split('T')[0]

export const calendarEvents: CalendarEvent[] = [{ title: 'Project Start', date: today }]
