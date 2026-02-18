export interface MoodEntry {
  date: string
  mood: number
  note: string
  createdAt: string
  updatedAt: string
}

export interface MoodJournal {
  version: number
  lastUpdated: string
  entries: Record<string, MoodEntry>
}

export type EntryModalMode = 'create' | 'view' | 'edit'
