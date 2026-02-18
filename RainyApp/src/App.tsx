import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CalendarSection } from './components/calendar/CalendarSection'
import { MoodEntryModal } from './components/calendar/MoodEntryModal'
import { loadMoodJournal, saveMoodJournal } from './data/moodStorage'
import type { EntryModalMode, MoodEntry, MoodJournal } from './types/calendar'
import { moodToColor } from './utils/moodColor'

function currentMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

function monthLabel(monthKey: string): string {
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

function App() {
  const [journal, setJournal] = useState<MoodJournal>(() => loadMoodJournal())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<EntryModalMode | null>(null)
  const [visibleMonthKey, setVisibleMonthKey] = useState<string>(() => currentMonthKey(new Date()))

  useEffect(() => {
    const body = document.body
    if (modalMode) {
      body.classList.add('modal-open')
    } else {
      body.classList.remove('modal-open')
    }

    return () => {
      body.classList.remove('modal-open')
    }
  }, [modalMode])

  const selectedEntry = useMemo(() => {
    if (!selectedDate) {
      return undefined
    }

    return journal.entries[selectedDate]
  }, [journal.entries, selectedDate])

  const summary = useMemo(() => {
    const monthPrefix = `${visibleMonthKey}-`
    const monthEntries = Object.values(journal.entries).filter((entry) => entry.date.startsWith(monthPrefix))
    const totalDays = monthEntries.length
    const averageMood =
      totalDays === 0
        ? null
        : Math.round(monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalDays)

    return { totalDays, averageMood }
  }, [journal.entries, visibleMonthKey])

  const handleDaySelected = (date: string) => {
    setSelectedDate(date)
    setModalMode(journal.entries[date] ? 'view' : 'create')
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedDate(null)
  }

  const startEditing = () => {
    setModalMode('edit')
  }

  const handleSaveEntry = (payload: { mood: number; note: string }) => {
    if (!selectedDate) {
      return
    }

    const now = new Date().toISOString()
    const existingEntry = journal.entries[selectedDate]

    const nextEntry: MoodEntry = {
      date: selectedDate,
      mood: payload.mood,
      note: payload.note,
      createdAt: existingEntry?.createdAt ?? now,
      updatedAt: now,
    }

    const nextJournal: MoodJournal = {
      ...journal,
      lastUpdated: now,
      entries: {
        ...journal.entries,
        [selectedDate]: nextEntry,
      },
    }

    setJournal(nextJournal)
    saveMoodJournal(nextJournal)
    closeModal()
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">Mood Journal</p>
        <h1 className="app-title">MoodyMap</h1>
        <p className="app-subtitle">Track your days with color and reflection, then spot emotional trends over time.</p>
        <div className="app-metrics" aria-label="mood summary">
          <p className="app-metric">
            <span className="app-metric-label">Days this month</span>
            <strong>{summary.totalDays}</strong>
          </p>
          <p className="app-metric">
            <span className="app-metric-label">Average this month</span>
            <strong
              className={`app-mood-chip ${summary.averageMood === null ? 'app-mood-chip-empty' : ''}`}
              style={summary.averageMood === null ? undefined : { backgroundColor: moodToColor(summary.averageMood) }}
            >
              {summary.averageMood ?? '--'}
            </strong>
          </p>
          <p className="app-metric">
            <span className="app-metric-label">Analyzing month</span>
            <strong>{monthLabel(visibleMonthKey)}</strong>
          </p>
        </div>
      </header>
      <main className="app-main">
        <CalendarSection entries={journal.entries} onDaySelected={handleDaySelected} onMonthChange={setVisibleMonthKey} />
      </main>

      {modalMode && selectedDate ? (
        <MoodEntryModal
          key={`${modalMode}-${selectedDate}-${selectedEntry?.updatedAt ?? 'new'}`}
          mode={modalMode}
          date={selectedDate}
          entry={selectedEntry}
          onClose={closeModal}
          onStartEdit={startEditing}
          onSave={handleSaveEntry}
        />
      ) : null}
    </div>
  )
}

export default App
