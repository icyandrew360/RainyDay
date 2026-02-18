import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { calendarEvents } from '../../data/calendarEvents'
import './CalendarSection.css'

export function CalendarSection() {
  return (
    <section className="calendar-section">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={calendarEvents}
        height="auto"
        fixedWeekCount={false}
      />
    </section>
  )
}
