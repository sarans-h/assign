import { useSpeech } from 'react-text-to-speech'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Apple, Dumbbell, Lightbulb } from 'lucide-react'

export function SectionTTS({ workout, diet, tips, onWordChange, onSectionChange }: { workout: string; diet: string; tips: string; onWordChange?: (word: string, index: number) => void; onSectionChange?: (section: 'workout' | 'diet' | 'tips') => void }) {
  const [section, setSection] = useState<'workout' | 'diet' | 'tips'>('workout')
  const [volume, setVolumeState] = useState(1.0)
  const [rate, setRateState] = useState(1.0)
  
  const wordIndexRef = useRef(0)
  const prevSectionRef = useRef(section)

  const text = section === 'workout' ? workout : section === 'diet' ? diet : tips
  
  // Extract words from text (excluding markdown)
  const words = text
    .replace(/\*\*/g, ' ')
    .replace(/[_`#>*]/g, ' ')
    .replace(/[•\-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)

  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text,
    highlightText: true,
    highlightMode: 'word',
    onBoundary: (event) => {
      // Fire callback for each word boundary
      if (wordIndexRef.current < words.length) {
        const word = words[wordIndexRef.current]
        onWordChange?.(word, wordIndexRef.current)
        console.log(`Word ${wordIndexRef.current}: ${word}`)
        wordIndexRef.current++
      }
    },
    onStart: () => {
      console.log('Speech started, resetting word index')
      wordIndexRef.current = 0
    },
    onStop: () => {
      console.log('Speech stopped')
      wordIndexRef.current = 0
      onWordChange?.('', -1)
    },
    onPause: () => {
      console.log('Speech paused')
    },
    onResume: () => {
      console.log('Speech resumed')
    },
    highlightProps: {
      style: {
        backgroundColor: '#fbbf24',
        fontWeight: 'bold',
        padding: '0 2px',
        borderRadius: '2px',
        animation: 'pulse 0.5s ease-in-out'
      }
    }
  })

  // Reset word index when section changes
  useEffect(() => {
    if (section !== prevSectionRef.current) {
      wordIndexRef.current = 0
      prevSectionRef.current = section
      onWordChange?.('', -1)
    }
  }, [section, onWordChange])



  const handleSectionChange = (newSection: 'workout' | 'diet' | 'tips') => {
    stop()
    setSection(newSection)
    onSectionChange?.(newSection)
  }

  const isPlaying = speechStatus === 'started'
  const isPaused = speechStatus === 'paused'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow"
    >
      {isPlaying && (
        <div className="bg-gradient-to-r from-brand to-emerald-600 text-white text-center py-1 px-3 text-sm font-semibold animate-pulse">
           Reading: {section === 'workout' ? 'Workout Plan' : section === 'diet' ? 'Diet Plan' : 'Tips & Motivation'}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 flex-wrap">
        <select
          className="input flex-1 min-w-[200px]"
          value={section}
          onChange={e => handleSectionChange(e.target.value as any)}
          disabled={isPlaying}
        >
          <option value="workout"> Workout Plan</option>
          <option value="diet"> Diet Plan</option>
          <option value="tips"> Tips & Motivation</option>
        </select>  

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand to-emerald-600 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg"
          onClick={isPlaying ? (isPaused ? start : pause) : start}
          disabled={!text}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : isPlaying && isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Read Aloud
            </>
          )}
        </motion.button>

        {isPlaying && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 rounded-lg bg-red-600 text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg"
            onClick={stop}
          >
            <VolumeX className="w-4 h-4" />
            Stop
          </motion.button>
        )}

        
      </div>

      
    </motion.div>
  )
}
