import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// Optional: Type definition for an event if you decide to add more later
interface CalendarEvent {
  title: string;
  date: string;
}

function App() {
  // Basic event data to show something on the calendar
  const events: CalendarEvent[] = [
    { title: 'Project Start', date: new Date().toISOString().split('T')[0] }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        // FullCalendar v6+ handles CSS automatically via the plugin imports
      />
    </div>
  )
}

export default App