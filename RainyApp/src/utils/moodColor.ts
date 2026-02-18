const MIN_MOOD = 0
const MAX_MOOD = 100

function clampMood(value: number): number {
  return Math.min(MAX_MOOD, Math.max(MIN_MOOD, Math.round(value)))
}

export function moodToColor(value: number): string {
  const mood = clampMood(value)
  const hue = (mood / MAX_MOOD) * 120
  return `hsl(${hue} 74% 43%)`
}

export function moodToTint(value: number): string {
  const mood = clampMood(value)
  const hue = (mood / MAX_MOOD) * 120
  return `hsl(${hue} 82% 90%)`
}

export function normalizeMood(value: number): number {
  return clampMood(value)
}
