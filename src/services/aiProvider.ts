import axios from 'axios'
import type { UserInput } from '../components/IntakeForm'

export type GeneratedPlan = { workout: string; diet: string; tips: string }

export interface AIProvider {
  generatePlan(input: UserInput): Promise<GeneratedPlan>
  generateQuote(): Promise<string>
}


class GeminiProvider implements AIProvider {
  async generatePlan(input: UserInput): Promise<GeneratedPlan> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) throw new Error('Gemini API key not configured. Get free key from https://aistudio.google.com')
    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp'
    const prompt = buildPrompt(input)
    try {
      const r = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 10000 } }
      )
      const text: string = r.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (!text) throw new Error('No response from Gemini')
      return splitSections(text)
    } catch (error: any) {
      throw new Error(`Gemini error: ${error.response?.data?.error?.message || error.message}`)
    }
  }
  async generateQuote(): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) throw new Error('Gemini API key not configured')
    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp'
    try {
      const r = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: 'Give one short motivational fitness quote (max 15 words).' }] }], generationConfig: { maxOutputTokens: 50 } }
      )
      return r.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Train hard, stay focused!'
    } catch {
      return 'Your strength grows with every workout!'
    }
  }
}


function buildPrompt(u: UserInput): string {
  return `Generate a COMPLETE 7-day fitness plan. IMPORTANT: Include ALL 7 days (Monday through Sunday) with full details for each day.

User Profile:
- Name: ${u.name}, Age: ${u.age}, Gender: ${u.gender}
- Height: ${u.heightCm}cm, Weight: ${u.weightKg}kg
- Goal: ${u.goal}, Level: ${u.level}
- Location: ${u.location}, Diet: ${u.diet}
- Medical: ${u.medical || 'None'}, Stress: ${u.stress || 'Normal'}

### Workout Plan
MUST include all 7 days (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday). Format each day:

**Monday - [Workout Focus]**
- Exercise 1: 3 sets × 12 reps (60s rest)
- Exercise 2: 3 sets × 10 reps (60s rest)
- Exercise 3: 3 sets × 12 reps (60s rest)
*Warm up 5 min before, cool down 5 min after*

**Tuesday - [Workout Focus]**
[Continue for all 7 days with 3-4 exercises each]

Make exercises suitable for ${u.location}. Include rest days with active recovery activities.

### Diet Plan
Provide a DAILY meal structure (not per day, but a template for every day):

**Breakfast (7:00-8:00 AM):** [Food items] - ~400-500 cal
**Mid-Morning Snack (10:30 AM):** [Snack] - ~150 cal
**Lunch (12:30-1:30 PM):** [Food items] - ~500-600 cal
**Evening Snack (4:00-5:00 PM):** [Snack] - ~150 cal
**Dinner (7:00-8:00 PM):** [Food items] - ~400-500 cal

Match ${u.diet} preference. Total daily calories for ${u.goal}.

**Hydration:** 3-4 liters water daily

### Tips & Motivation
**Lifestyle Tips:**
- Tip 1: [Specific to their goal]
- Tip 2: [Related to ${u.location} workouts]
- Tip 3: [Sleep/recovery advice]
- Tip 4: [Stress management]

**Motivation:**
- Inspiring quote or encouragement specific to ${u.goal}

Use **bold** for day names and meal times. Use *italic* for notes.
Dont Include words like template which make it generated from AI`
}

function splitSections(text: string): GeneratedPlan {
  const workoutMatch = text.match(/#{1,3}\s*workout plan[^\#]*/i)
  const dietMatch = text.match(/#{1,3}\s*diet plan[^\#]*/i)
  const tipsMatch = text.match(/#{1,3}\s*tips[^\#]*/i)
  
  const workout = workoutMatch?.[0]?.replace(/#{1,3}\s*workout plan/i, '').trim() || text
  const diet = dietMatch?.[0]?.replace(/#{1,3}\s*diet plan/i, '').trim() || ''
  const tips = tipsMatch?.[0]?.replace(/#{1,3}\s*tips/i, '').trim() || ''
  
  return { workout, diet, tips }
}

export function AIProviderFactory(): AIProvider {
  const p = (import.meta.env.VITE_AI_PROVIDER || 'gemini').toLowerCase()
  return new GeminiProvider() // Default to Gemini (free tier)
}
