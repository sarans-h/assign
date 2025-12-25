import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, AlertCircle, CheckCircle2, RefreshCw, Download, HardDrive } from 'lucide-react'
import { ThemeToggle } from './components/ThemeToggle'
import { IntakeForm, UserInput } from './components/IntakeForm'
import { PlanViewer } from './components/PlanViewer'
import { SectionTTS } from './components/SectionTTS'
import { exportPlanPdf } from './services/pdfExport'
import { Storage } from './services/storage'
import { AIProviderFactory } from './services/aiProvider'

export default function App() {
  const [user, setUser] = useState<UserInput | null>(null)
  const [workout, setWorkout] = useState<string>('')
  const [diet, setDiet] = useState<string>('')
  const [tips, setTips] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [highlightWord, setHighlightWord] = useState<string>('')
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const [ttsSection, setTtsSection] = useState<'workout' | 'diet' | 'tips'>('workout')
  const [loadedFromStorage, setLoadedFromStorage] = useState<boolean>(false)

  const ai = useMemo(() => AIProviderFactory(), [])

  useEffect(() => {
    const saved = Storage.load()
    if (saved) {
      setUser(saved.user)
      setWorkout(saved.workout)
      setDiet(saved.diet)
      setTips(saved.tips)
      setLoadedFromStorage(true)
    }
  }, [])

  const generate = async (input: UserInput) => {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const plan = await ai.generatePlan(input)
      setUser(input)
      setWorkout(plan.workout)
      setDiet(plan.diet)
      setTips(plan.tips)
      Storage.save({ user: input, workout: plan.workout, diet: plan.diet, tips: plan.tips })
      setSuccess(true)
      setLoadedFromStorage(false) // New plan generated, not loaded from storage
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const regenerate = async () => {
    if (!user) return
    await generate(user)
  }

  const exportPdf = async () => {
    await exportPlanPdf({
      workout,
      diet,
      tips
    }, `${user?.name || 'My'}-Fitness-Plan.pdf`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand to-emerald-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </h1>
          </motion.div>
          <div className="ml-auto flex items-center gap-2">
            {workout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg bg-brand text-white font-medium disabled:opacity-50 transition-all hover:shadow-lg flex items-center gap-2"
                onClick={regenerate}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loadedFromStorage ? 'Regenerate' : 'Generate New'}
              </motion.button>
            )}
            {workout && loadedFromStorage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-1"
              >
                <HardDrive className="w-3 h-3" />
                Backed Up
              </motion.div>
            )}
            {workout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 font-medium transition-all hover:shadow-lg flex items-center gap-2"
                onClick={exportPdf}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </motion.button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-80px)] flex flex-col">

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-sm text-green-700 dark:text-green-300">Plan generated successfully!</div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="grid md:grid-cols-3 gap-6 flex-1"
        >
          <div className="md:col-span-1 h-full">
            <IntakeForm onGenerate={generate} loading={loading} />
          </div>
          <div id="plan-root" className="md:col-span-2 space-y-4 h-full overflow-y-auto">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Loader2 className="w-8 h-8 text-brand animate-spin mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Generating your personalized plan...</p>
              </motion.div>
            )}
            {!loading && !workout && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 text-center  flex items-center"
              >
                <div className="max-w-md mx-auto h-[460px]">
                  <div className="text-6xl mb-4">💪</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Start Your Fitness Journey?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Fill out the form on the left to generate your personalized workout plan, diet recommendations, and fitness tips.
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Your AI-powered fitness coach is waiting to create the perfect plan for you!
                  </div>
                </div>
              </motion.div>
            )}
            {!loading && workout && (
              <SectionTTS
                workout={workout}
                diet={diet}
                tips={tips}
                onWordChange={(w, idx) => {
                  setHighlightWord(w)
                  setHighlightIndex(idx)
                }}
                onSectionChange={(sec) => {
                  setTtsSection(sec)
                  setHighlightIndex(-1)
                  setHighlightWord('')
                }}
              />
            )}
            {!loading && (
              <PlanViewer workout={workout} diet={diet} tips={tips} highlightWord={highlightWord} highlightIndex={highlightIndex} section={ttsSection} />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
