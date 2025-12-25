// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Zap } from 'lucide-react'

// export type UserInput = {
//   name: string
//   age: number
//   gender: string
//   heightCm: number
//   weightKg: number
//   goal: string
//   level: string
//   location: string
//   diet: string
//   medical?: string
//   stress?: string
// }

// const goals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Mobility', 'General Fitness']
// const levels = ['Beginner', 'Intermediate', 'Advanced']
// const locations = ['Home', 'Gym', 'Outdoor']
// const diets = ['Veg', 'Non-Veg', 'Vegan', 'Keto']
// const genders = ['Male', 'Female', 'Other']

// export function IntakeForm({ onGenerate, loading }: { onGenerate: (u: UserInput) => Promise<void>; loading: boolean }) {
//   const [form, setForm] = useState<UserInput>({
//     name: '',
//     age: 25,
//     gender: 'Male',
//     heightCm: 170,
//     weightKg: 70,
//     goal: 'Weight Loss',
//     level: 'Beginner',
//     location: 'Home',
//     diet: 'Non-Veg',
//     medical: '',
//     stress: '',
//   })

//   const update = (k: keyof UserInput, v: any) => setForm(prev => ({ ...prev, [k]: v }))

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!form.name.trim()) {
//       alert('Please enter your name')
//       return
//     }
//     await onGenerate(form)
//   }

//   return (
//     <motion.form onSubmit={submit} className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <h2 className="text-lg font-bold flex items-center gap-2">
//         <Zap className="w-5 h-5 text-brand" />
//         Tell Us About You
//       </h2>

//       <div className="space-y-2">
//         <div>
//           <label className="block text-sm font-medium mb-1">Name *</label>
//           <input className="input w-full" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} />
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <div>
//             <label className="block text-xs font-medium mb-1">Age</label>
//             <input className="input w-full text-sm" type="number" placeholder="25" value={form.age} onChange={e => update('age', Number(e.target.value))} min="15" max="100" />
//           </div>
//           <div>
//             <label className="block text-xs font-medium mb-1">Height (cm)</label>
//             <input className="input w-full text-sm" type="number" placeholder="170" value={form.heightCm} onChange={e => update('heightCm', Number(e.target.value))} min="100" max="250" />
//           </div>
//           <div>
//             <label className="block text-xs font-medium mb-1">Weight (kg)</label>
//             <input className="input w-full text-sm" type="number" placeholder="70" value={form.weightKg} onChange={e => update('weightKg', Number(e.target.value))} min="30" max="300" />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <label className="block text-xs font-medium mb-1">Gender</label>
//             <select className="input w-full text-sm" value={form.gender} onChange={e => update('gender', e.target.value)}>
//               {genders.map(g => (
//                 <option key={g} value={g}>{g}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-medium mb-1">Goal</label>
//             <select className="input w-full text-sm" value={form.goal} onChange={e => update('goal', e.target.value)}>
//               {goals.map(g => (
//                 <option key={g} value={g}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <div>
//             <label className="block text-xs font-medium mb-1">Level</label>
//             <select className="input w-full text-sm" value={form.level} onChange={e => update('level', e.target.value)}>
//               {levels.map(l => (
//                 <option key={l} value={l}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-medium mb-1">Location</label>
//             <select className="input w-full text-sm" value={form.location} onChange={e => update('location', e.target.value)}>
//               {locations.map(l => (
//                 <option key={l} value={l}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-medium mb-1">Diet</label>
//             <select className="input w-full text-sm" value={form.diet} onChange={e => update('diet', e.target.value)}>
//               {diets.map(d => (
//                 <option key={d} value={d}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-xs font-medium mb-1">Medical History (Optional)</label>
//           <input className="input w-full text-sm" placeholder="Any injuries, conditions..." value={form.medical} onChange={e => update('medical', e.target.value)} />
//         </div>

//         <div>
//           <label className="block text-xs font-medium mb-1">Stress Level (Optional)</label>
//           <select className="input w-full text-sm" value={form.stress} onChange={e => update('stress', e.target.value)}>
//             <option value="">Not specified</option>
//             <option value="Low">Low</option>
//             <option value="Moderate">Moderate</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//       </div>

//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         type="submit"
//         className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-brand to-emerald-600 text-white font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
//         disabled={loading}
//       >
//         {loading ? 'Generating Plan...' : 'Generate My Plan'}
//       </motion.button>
//     </motion.form>
//   )
// }


import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export type UserInput = {
  name: string
  age: number
  gender: string
  heightCm: number
  weightKg: number
  goal: string
  level: string
  location: string
  diet: string
  medical?: string
  stress?: string
}

const goals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Mobility', 'General Fitness']
const levels = ['Beginner', 'Intermediate', 'Advanced']
const locations = ['Home', 'Gym', 'Outdoor']
const diets = ['Veg', 'Non-Veg', 'Vegan', 'Keto']
const genders = ['Male', 'Female', 'Other']

type Props = {
  onGenerate: (u: UserInput) => Promise<void>
  loading: boolean
}

export function IntakeForm({ onGenerate, loading }: Props) {
  const [form, setForm] = useState<UserInput>({
    name: '',
    age: 25,
    gender: 'Male',
    heightCm: 170,
    weightKg: 70,
    goal: 'Weight Loss',
    level: 'Beginner',
    location: 'Home',
    diet: 'Non-Veg',
    medical: '',
    stress: '',
  })

  const update = <K extends keyof UserInput>(key: K, value: UserInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('Please enter your name')
      return
    }

    await onGenerate(form)
  }

  return (
    <motion.form
      onSubmit={submit}
      className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Zap className="w-5 h-5 text-brand" />
        Tell Us About You
      </h2>

      <div className="space-y-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="input w-full"
            placeholder="Your name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />
        </div>

        {/* Age / Height / Weight */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Age</label>
            <input
              className="input w-full text-sm"
              type="number"
              min={15}
              max={100}
              value={form.age}
              onChange={e => update('age', Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Height (cm)</label>
            <input
              className="input w-full text-sm"
              type="number"
              min={100}
              max={250}
              value={form.heightCm}
              onChange={e => update('heightCm', Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Weight (kg)</label>
            <input
              className="input w-full text-sm"
              type="number"
              min={30}
              max={300}
              value={form.weightKg}
              onChange={e => update('weightKg', Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Gender / Goal */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Gender</label>
            <select
              className="input w-full text-sm"
              value={form.gender}
              onChange={e => update('gender', e.target.value)}
            >
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Goal</label>
            <select
              className="input w-full text-sm"
              value={form.goal}
              onChange={e => update('goal', e.target.value)}
            >
              {goals.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Level / Location / Diet */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Level</label>
            <select
              className="input w-full text-sm"
              value={form.level}
              onChange={e => update('level', e.target.value)}
            >
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Location</label>
            <select
              className="input w-full text-sm"
              value={form.location}
              onChange={e => update('location', e.target.value)}
            >
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Diet</label>
            <select
              className="input w-full text-sm"
              value={form.diet}
              onChange={e => update('diet', e.target.value)}
            >
              {diets.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Medical */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Medical History (Optional)
          </label>
          <input
            className="input w-full text-sm"
            placeholder="Any injuries, conditions..."
            value={form.medical}
            onChange={e => update('medical', e.target.value)}
          />
        </div>

        {/* Stress */}
        <div>
          <label className="block text-xs font-medium mb-1">Stress Level</label>
          <select
            className="input w-full text-sm"
            value={form.stress}
            onChange={e => update('stress', e.target.value)}
          >
            <option value="">Not specified</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-brand to-emerald-600 text-white font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
      >
        {loading ? 'Generating Plan...' : 'Generate My Plan'}
      </motion.button>
    </motion.form>
  )
}
