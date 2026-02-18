import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CalendarSection } from './components/calendar/CalendarSection'
import { MoodEntryModal } from './components/calendar/MoodEntryModal'
import { loadMoodJournal, saveMoodJournal } from './data/moodStorage'
import type { EntryModalMode, MoodEntry, MoodJournal } from './types/calendar'

function App() {
  const [journal, setJournal] = useState<MoodJournal>(() => loadMoodJournal())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<EntryModalMode | null>(null)

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
        <h1 className="app-title">MoodyMap</h1>
        <p className="app-subtitle">Track your day from 0 to 100 and spot patterns at a glance.</p>
      </header>
      <main className="app-main">
        <CalendarSection entries={journal.entries} onDaySelected={handleDaySelected} />
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
