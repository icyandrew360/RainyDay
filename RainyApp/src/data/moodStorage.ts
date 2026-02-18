import seedData from './moodJournalSeed.json'
import type { MoodJournal } from '../types/calendar'

const STORAGE_KEY = 'moodymap.moodJournal.v1'

function cloneSeed(): MoodJournal {
  return {
    version: seedData.version,
    lastUpdated: seedData.lastUpdated,
    entries: { ...seedData.entries },
  }
}

export function loadMoodJournal(): MoodJournal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return cloneSeed()
    }

    const parsed = JSON.parse(raw) as MoodJournal
    if (!parsed || parsed.version !== 1 || typeof parsed.entries !== 'object') {
      return cloneSeed()
    }

    return {
      version: 1,
      lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : '',
      entries: parsed.entries,
    }
  } catch {
    return cloneSeed()
  }
}

export function saveMoodJournal(journal: MoodJournal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal, null, 2))
}
