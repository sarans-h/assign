import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Apple, Lightbulb, Loader2, ChevronDown, ChevronRight, X, Image } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { generateImage } from '../services/imageProvider'

interface SectionProps {
  title: string
  icon: React.ReactNode
  text: string
  onGenerateImage: (prompt: string) => void
  highlightWord?: string
  highlightIndex?: number
  isExpanded: boolean
  onToggle: () => void
  allowImageGeneration?: boolean
}

function Section({ title, icon, text, onGenerateImage, highlightWord = '', highlightIndex = -1, isExpanded, onToggle, allowImageGeneration = false }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow"
    >
      <button
        onClick={onToggle}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {icon}
          {title}
          {allowImageGeneration && (
            <div className="relative group">
              <Image className="w-4 h-4 text-blue-500 ml-1 transition-all duration-200 group-hover:scale-110 group-hover:text-blue-600" title="Click text to generate images" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Click text to generate images
              </div>
            </div>
          )}
        </h2>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 max-h-96 overflow-y-auto">
              <div 
                className={`prose prose-sm dark:prose-invert max-w-none
                  prose-headings:text-brand dark:prose-headings:text-emerald-400 
                  prose-headings:font-bold prose-headings:mb-2
                  prose-strong:text-brand dark:prose-strong:text-emerald-400 prose-strong:font-semibold
                  prose-p:my-1 prose-p:leading-relaxed
                  prose-ul:my-2 prose-li:my-0.5
                  prose-em:text-gray-600 dark:prose-em:text-gray-400
                  [&_strong:has(em)]:text-brand [&_strong:has(em)]:dark:text-emerald-400
                  ${allowImageGeneration ? 'cursor-pointer' : ''}`}
                onClick={(e) => {
                  if (!allowImageGeneration) return
                  
                  // Get selected text if any, otherwise get clicked element text
                  const selection = window.getSelection()
                  let clickedText = ''
                  
                  if (selection && selection.toString().trim()) {
                    clickedText = selection.toString().trim()
                  } else {
                    const target = e.target as HTMLElement
                    clickedText = target.textContent || ''
                  }
                  
                  if (clickedText.trim()) onGenerateImage(clickedText)
                }}
              >
                <HighlightedMarkdown text={text} highlightWord={highlightWord} highlightIndex={highlightIndex} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function HighlightedMarkdown({ text, highlightWord, highlightIndex }: { text: string; highlightWord: string; highlightIndex: number }) {
  if (!highlightWord || highlightIndex < 0) {
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-brand dark:text-emerald-400 mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-brand dark:text-emerald-400 mt-3 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-brand dark:text-emerald-400 mt-2 mb-1" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-brand dark:text-emerald-400" {...props} />,
          em: ({ node, ...props }) => <em className="text-gray-600 dark:text-gray-400 not-italic" {...props} />,
          p: ({ node, ...props }) => <p className="my-1 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="my-2 space-y-0.5" {...props} />,
          li: ({ node, ...props }) => <li className="my-0.5" {...props} />
        }}
      >
        {text}
      </ReactMarkdown>
    )
  }

  // Highlight by word position to avoid matching all duplicates.
  // Tokenize while preserving spaces so we can reconstruct text intact.
  let matchCounter = 0
  const tokens = text.split(/(\s+)/)
  const highlightedText = tokens.map(token => {
    const clean = token.replace(/[^\p{L}\p{N}]/gu, '') // keep letters/numbers only
    const isWord = clean.length > 0
    if (isWord) {
      if (matchCounter === highlightIndex) {
        matchCounter++
        return `<mark>${token}</mark>`
      }
      matchCounter++
    }
    return token
  }).join('')

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-brand dark:text-emerald-400 mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-brand dark:text-emerald-400 mt-3 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-brand dark:text-emerald-400 mt-2 mb-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-brand dark:text-emerald-400" {...props} />,
        em: ({ node, ...props }) => <em className="text-gray-600 dark:text-gray-400 not-italic" {...props} />,
        p: ({ node, ...props }) => <p className="my-1 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="my-2 space-y-0.5" {...props} />,
        li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
        mark: ({ node, ...props }) => <mark className="bg-yellow-300 dark:bg-yellow-500 font-semibold px-1 rounded animate-pulse" {...props} />
      }}
    >
      {highlightedText}
    </ReactMarkdown>
  )
}

export function PlanViewer({ workout, diet, tips, highlightWord, highlightIndex = -1, section }: { workout: string; diet: string; tips: string; highlightWord?: string; highlightIndex?: number; section?: string }) {
  const [imgUrl, setImgUrl] = useState<string>('')
  const [imgLoading, setImgLoading] = useState(false)
  const [imgPrompt, setImgPrompt] = useState<string>('')
  const [clickedText, setClickedText] = useState<string>('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<'workout' | 'diet' | 'tips' | null>(null)

  const onGenerateImage = useCallback(async (clickedText: string) => {
    if (!clickedText.trim()) return
    setImgLoading(true)
    setClickedText(clickedText)
    setImgPrompt(clickedText)
    try {
      const url = await generateImage(clickedText)
      setImgUrl(url)
      setShowImageModal(true)
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setImgLoading(false)
    }
  }, [])

  const toggleSection = (sectionName: 'workout' | 'diet' | 'tips') => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {workout && (!expandedSection || expandedSection === 'workout') && (
          <Section
            key="workout"
            title="Workout Plan"
            icon={<Dumbbell className="w-5 h-5 text-brand" />}
            text={workout}
            onGenerateImage={onGenerateImage}
            highlightWord={section === 'workout' ? highlightWord || '' : ''}
            highlightIndex={section === 'workout' ? highlightIndex : -1}
            isExpanded={expandedSection === 'workout'}
            onToggle={() => toggleSection('workout')}
            allowImageGeneration={false}
          />
        )}
        {diet && (!expandedSection || expandedSection === 'diet') && (
          <Section
            key="diet"
            title="Diet Plan"
            icon={<Apple className="w-5 h-5 text-orange-500" />}
            text={diet}
            onGenerateImage={onGenerateImage}
            highlightWord={section === 'diet' ? highlightWord || '' : ''}
            highlightIndex={section === 'diet' ? highlightIndex : -1}
            isExpanded={expandedSection === 'diet'}
            onToggle={() => toggleSection('diet')}
            allowImageGeneration={true}
          />
        )}
        {tips && (!expandedSection || expandedSection === 'tips') && (
          <Section
            key="tips"
            title="AI Tips & Motivation"
            icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
            text={tips}
            onGenerateImage={onGenerateImage}
            highlightWord={section === 'tips' ? highlightWord || '' : ''}
            highlightIndex={section === 'tips' ? highlightIndex : -1}
            isExpanded={expandedSection === 'tips'}
            onToggle={() => toggleSection('tips')}
            allowImageGeneration={false}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {imgLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 p-12 bg-white dark:bg-gray-800/50 flex flex-col items-center justify-center"
          >
            <Loader2 className="w-6 h-6 text-brand animate-spin mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Generating image...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && imgUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Generated Image</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clicked text:</p>
                  <p className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    "{clickedText}"
                  </p>
                </div>
                <img
                  src={imgUrl}
                  alt="Generated"
                  className="w-full h-auto rounded-lg object-contain max-h-[60vh]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
