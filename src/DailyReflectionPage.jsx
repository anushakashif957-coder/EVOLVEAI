import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import Button from '../components/ui/Button.jsx'
import { ArrowRight, Lock, Mic, Sparkles } from '../components/ui/Icons.jsx'
import { saveReflection } from '../lib/storage.js'
import { user } from '../data/mockData.js'

const MAX_CHARS = 1200

const prompts = [
  'What challenged you today?',
  'What are you proud of?',
  'How did you handle something differently than before?',
]

export default function DailyReflectionPage() {
  const [text, setText] = useState('')
  const [voiceHint, setVoiceHint] = useState(false)
  const areaRef = useRef(null)
  const hintTimer = useRef(null)
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const canSubmit = text.trim().length > 0;
  const nearLimit = text.length > MAX_CHARS * 0.9

  const usePrompt = (prompt) => {
    setText(`${prompt} `)
    areaRef.current?.focus()
  }

  const onMic = () => {
    setVoiceHint(true)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setVoiceHint(false), 2600)
  }

  const submit = () => {
    if (!canSubmit) return
    saveReflection(text.trim())
    navigate('/insights')
  }

  return (
    <AppShell>
      <div className="relative mx-auto max-w-3xl">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-200/40 via-transparent to-sage-200/40 blur-3xl" />

        <div className="flex animate-fade-up flex-wrap items-center gap-2.5">
          <span className="rounded-full border border-ink-900/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-ink-500 uppercase shadow-soft backdrop-blur">
            {today}
          </span>
          <span className="rounded-full bg-sage-100 px-3.5 py-1.5 text-[11px] font-semibold text-sage-700">
            {user.streakWeeks}-week streak
          </span>
        </div>

        <h1
          className="mt-6 animate-fade-up text-balance font-display text-4xl tracking-tight text-ink-950 md:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          What's on your mind today?
        </h1>
        <p className="mt-4 animate-fade-up text-lg leading-relaxed text-ink-500" style={{ animationDelay: '150ms' }}>
          Take a moment to reflect. There are no right or wrong answers.
        </p>

        <div className="mt-8 flex animate-fade-up flex-wrap gap-2.5" style={{ animationDelay: '220ms' }}>
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => usePrompt(prompt)}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white/70 px-4 py-2 text-sm text-ink-600 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-iris-500/30 hover:text-iris-700 hover:shadow-lift active:translate-y-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-iris-400 transition-colors duration-300 group-hover:text-iris-600" />
              {prompt}
            </button>
          ))}
        </div>

        <div
          className="mt-6 animate-fade-up rounded-3xl border border-ink-900/5 bg-white/80 p-6 shadow-soft backdrop-blur-sm md:p-8"
          style={{ animationDelay: '300ms' }}
        >
          <div className="relative">
            <textarea
              ref={areaRef}
              value={text}
              maxLength={MAX_CHARS}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell me about something that happened today, how it made you feel, and how you responded..."
              aria-label="Daily reflection"
              className="min-h-[240px] w-full resize-y rounded-2xl border border-ink-900/10 bg-mist-50/70 p-5 pr-16 text-[15px] leading-relaxed text-ink-800 transition-all duration-300 outline-none placeholder:text-ink-300 focus:border-iris-400/60 focus:bg-white focus:ring-4 focus:ring-iris-500/10"
            />
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={onMic}
                aria-label="Voice input (coming soon)"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-400 shadow-soft transition-all duration-300 hover:scale-105 hover:border-iris-500/30 hover:text-iris-600"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
              {voiceHint && (
                <span className="absolute top-12 right-0 z-20 animate-fade-up rounded-xl bg-ink-950 px-3.5 py-2 text-xs whitespace-nowrap text-mist-50 shadow-lift">
                  Voice reflections are coming soon in this prototype.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="flex items-center gap-2 text-xs text-ink-400">
              <Lock className="h-3.5 w-3.5 shrink-0 text-sage-600" />
              Your reflection is private and used only to generate your personal growth insights.
            </p>
            <span
              className={`text-xs tabular-nums transition-colors duration-300 ${nearLimit ? 'font-semibold text-gold-500' : 'text-ink-400'}`}
            >
              {text.length} / {MAX_CHARS}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-ink-900/5 pt-6">
            <Button onClick={submit} disabled={!canSubmit} size="lg">
              Analyze My Reflection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <p
          className="mt-6 animate-fade-up text-center text-xs leading-relaxed text-ink-400"
          style={{ animationDelay: '380ms' }}
        >
          EvolveAI provides self-reflection insights and is not a diagnostic or therapeutic tool.
        </p>
      </div>
    </AppShell>
  )
}
