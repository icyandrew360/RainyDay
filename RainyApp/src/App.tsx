import './App.css'
import { CalendarSection } from './components/calendar/CalendarSection'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">My Calendar</h1>
        <p className="app-subtitle">A simple view of your month at a glance.</p>
      </header>
      <main className="app-main">
        <CalendarSection />
      </main>
    </div>
  )
}

export default App
