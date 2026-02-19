import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CalendarSection } from './components/calendar/CalendarSection'
import { MoodEntryModal } from './components/calendar/MoodEntryModal'
import { loadMoodJournal, saveMoodJournal } from './data/moodStorage'
import { formatMonthKey, isFutureDateKey, summarizeMonth, toMonthKey } from './domain/moodJournal'
import type { EntryModalMode, MoodEntry, MoodJournal } from './types/calendar'
import { moodToColor } from './utils/moodColor'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'moodymap.themeMode'

function initialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [journal, setJournal] = useState<MoodJournal>(() => loadMoodJournal())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<EntryModalMode | null>(null)
  const [visibleMonthKey, setVisibleMonthKey] = useState<string>(() => toMonthKey(new Date()))
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => initialThemeMode())

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

  useEffect(() => {
    const body = document.body
    body.classList.toggle('theme-dark', themeMode === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  const selectedEntry = useMemo(() => {
    if (!selectedDate) {
      return undefined
    }

    return journal.entries[selectedDate]
  }, [journal.entries, selectedDate])

  const summary = useMemo(() => summarizeMonth(journal.entries, visibleMonthKey), [journal.entries, visibleMonthKey])

  const handleDaySelected = (date: string) => {
    if (isFutureDateKey(date)) {
      return
    }

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

  const toggleThemeMode = () => {
    setThemeMode((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">Mood Journal</p>
        <button type="button" className="theme-toggle" onClick={toggleThemeMode} aria-pressed={themeMode === 'dark'}>
          {themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
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
            <strong>{formatMonthKey(visibleMonthKey)}</strong>
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
