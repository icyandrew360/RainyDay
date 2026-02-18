import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { DatesSetArg, DayCellMountArg } from '@fullcalendar/core'
import type { MoodEntry } from '../../types/calendar'
import { moodToColor, moodToTint } from '../../utils/moodColor'
import './CalendarSection.css'

interface CalendarSectionProps {
  entries: Record<string, MoodEntry>
  onDaySelected: (date: string) => void
  onMonthChange: (monthKey: string) => void
}

type DayCellElement = HTMLElement & {
  __moodClickHandler?: EventListener
}

function dateToKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function monthKeyFromDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

function applyMoodDecorations(dayCell: DayCellElement, dateKey: string, entry: MoodEntry | undefined, onDaySelected: (date: string) => void) {
  dayCell.classList.add('mood-day-cell')

  const existingMarker = dayCell.querySelector('.mood-thumbnail')
  if (existingMarker) {
    existingMarker.remove()
  }

  if (dayCell.__moodClickHandler) {
    dayCell.removeEventListener('click', dayCell.__moodClickHandler)
  }

  const clickHandler: EventListener = () => onDaySelected(dateKey)
  dayCell.__moodClickHandler = clickHandler
  dayCell.addEventListener('click', clickHandler)

  if (!entry) {
    dayCell.classList.remove('has-mood-entry')
    dayCell.style.removeProperty('--mood-color')
    dayCell.style.removeProperty('--mood-tint')
    return
  }

  const moodColor = moodToColor(entry.mood)
  dayCell.classList.add('has-mood-entry')
  dayCell.style.setProperty('--mood-color', moodColor)
  dayCell.style.setProperty('--mood-tint', moodToTint(entry.mood))

  const markerHost = dayCell.querySelector('.fc-daygrid-day-top')
  if (!markerHost) {
    return
  }

  const marker = document.createElement('span')
  marker.className = 'mood-thumbnail'
  marker.textContent = `${entry.mood}`
  marker.style.backgroundColor = moodColor
  markerHost.appendChild(marker)
}

export function CalendarSection({ entries, onDaySelected, onMonthChange }: CalendarSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }

    const dayCells = section.querySelectorAll<DayCellElement>('.fc-daygrid-day[data-date]')
    dayCells.forEach((dayCell) => {
      const dateKey = dayCell.getAttribute('data-date')
      if (!dateKey) {
        return
      }

      applyMoodDecorations(dayCell, dateKey, entries[dateKey], onDaySelected)
    })
  }, [entries, onDaySelected])

  const renderMoodPreview = (arg: DayCellMountArg) => {
    const dayCell = arg.el as DayCellElement
    const dateKey = dateToKey(arg.date)
    applyMoodDecorations(dayCell, dateKey, entries[dateKey], onDaySelected)
  }

  const cleanupDayCell = (arg: DayCellMountArg) => {
    const dayCell = arg.el as DayCellElement
    if (dayCell.__moodClickHandler) {
      dayCell.removeEventListener('click', dayCell.__moodClickHandler)
      delete dayCell.__moodClickHandler
    }
  }

  const handleDatesSet = (arg: DatesSetArg) => {
    onMonthChange(monthKeyFromDate(arg.view.currentStart))
  }

  return (
    <section className="calendar-section" ref={sectionRef}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={[]}
        height="auto"
        fixedWeekCount={false}
        datesSet={handleDatesSet}
        dayCellDidMount={renderMoodPreview}
        dayCellWillUnmount={cleanupDayCell}
      />
    </section>
  )
}
