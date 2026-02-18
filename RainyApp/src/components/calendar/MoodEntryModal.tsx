import { useMemo, useState, type FormEvent } from 'react'
import type { EntryModalMode, MoodEntry } from '../../types/calendar'
import { normalizeMood, moodToColor } from '../../utils/moodColor'

interface MoodEntryModalProps {
  mode: EntryModalMode
  date: string
  entry?: MoodEntry
  onClose: () => void
  onStartEdit: () => void
  onSave: (payload: { mood: number; note: string }) => void
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  return parsed.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function MoodEntryModal({ mode, date, entry, onClose, onStartEdit, onSave }: MoodEntryModalProps) {
  const [mood, setMood] = useState(entry?.mood ?? 50)
  const [note, setNote] = useState(entry?.note ?? '')

  const isFormMode = mode === 'create' || mode === 'edit'
  const actionLabel = mode === 'edit' ? 'Save Changes' : 'Save Day'
  const moodColor = useMemo(() => moodToColor(mood), [mood])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({ mood: normalizeMood(mood), note: note.trim() })
  }

  return (
    <div className="mood-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="mood-modal-title">
      <div className="mood-modal-panel">
        <header className="mood-modal-header">
          <p className="mood-modal-date">{formatDate(date)}</p>
          <h2 id="mood-modal-title" className="mood-modal-title">
            {mode === 'view' ? 'Daily Reflection' : 'How are you feeling today?'}
          </h2>
        </header>

        {isFormMode ? (
          <form className="mood-form" onSubmit={handleSubmit}>
            <label className="mood-field-label" htmlFor="mood-slider">
              Mood Score: <span style={{ color: moodColor }}>{mood}</span>
            </label>
            <input
              id="mood-slider"
              className="mood-slider"
              type="range"
              min={0}
              max={100}
              value={mood}
              onChange={(event) => setMood(Number(event.target.value))}
            />

            <label className="mood-field-label" htmlFor="mood-note">
              What happened today?
            </label>
            <textarea
              id="mood-note"
              className="mood-note"
              placeholder="Write a short reflection about your day..."
              rows={7}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />

            <div className="mood-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {actionLabel}
              </button>
            </div>
          </form>
        ) : (
          <section className="mood-readonly">
            <p className="mood-score-row">
              Mood Score:
              <strong style={{ color: moodColor }}>{entry?.mood ?? 0}</strong>
            </p>
            <div className="mood-note-display">
              <p>{entry?.note ? entry.note : 'No details saved for this day yet.'}</p>
            </div>
            <div className="mood-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={onStartEdit}>
                Edit Entry
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
