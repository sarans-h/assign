import type { UserInput } from '../components/IntakeForm'

export const Storage = {
  save(data: { user: UserInput; workout: string; diet: string; tips: string }) {
    localStorage.setItem('fitness-plan', JSON.stringify(data))
  },
  load(): { user: UserInput; workout: string; diet: string; tips: string } | null {
    const raw = localStorage.getItem('fitness-plan')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
}
