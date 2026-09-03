import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import PageHeading from '../components/ui/PageHeading.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { ArrowRight, Check, PathRoute, PenLine, Sparkles } from '../components/ui/Icons.jsx'
import { getLatestReflection } from '../lib/storage.js'
import { analyzeReflection } from '../lib/mockAnalysis.js'

const STEPS = [
  'Reading your reflection',
  'Understanding emotional response',
  'Comparing with your growth history',
  'Identifying possible growth patterns',
]

const STATUS_STYLES = {
  Emerging: 'bg-iris-100 text-iris-700',
  Strengthening: 'bg-sage-100 text-sage-700',
  Consistent: 'bg-gold-100 text-gold-500',
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">{children}</p>
}

export default function AIInsightPage() {
  const location = useLocation()
  const reflection = useMemo(() => getLatestReflection(), [location])
  const analysis = useMemo(() => (reflection ? analyzeReflection(reflection) : null), [reflection])
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!reflection) return
    setStep(0)
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), 700 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [reflection])

  const done = step >= STEPS.length

  return (
    <AppShell>
      <div className="relative mx-auto max-w-4xl">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-200/40 via-transparent to-sage-200/40 blur-3xl" />

        <PageHeading
          eyebrow="Module 02 · Longitudinal intelligence"
          title="AI Insights"
          description="How have you changed over time — and what may have contributed to that change?"
        />

        {!reflection ? (
          <Card className="mt-10 flex flex-col items-center gap-5 p-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500/12 to-sage-500/12 text-iris-600 ring-1 ring-ink-900/5">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl text-ink-950">No reflections yet</h2>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-500">
                Your insights will appear here after your first reflection. It takes about two minutes.
              </p>
            </div>
            <Button to="/reflect">
              Write your first reflection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Card>
        ) : (
          <div className="mt-10 space-y-10">
            {/* 1 · Analysis ritual */}
            <Card className="animate-fade-up p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-iris-600 text-white shadow-soft">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="font-display text-xl text-ink-950">
                  {done ? 'Analysis complete' : 'EvolveAI is reading…'}
                </h2>
              </div>
              <ul className="mt-6 space-y-4">
                {STEPS.map((label, i) => {
                  const complete = step > i
                  const active = step === i
                  return (
                    <li key={label} className="flex items-center gap-3 text-sm">
                      {complete ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : active ? (
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-iris-500/25 border-t-iris-600" />
                      ) : (
                        <span className="h-6 w-6 rounded-full border border-ink-900/10" />
                      )}
                      <span className={complete ? 'text-ink-800' : active ? 'text-ink-600' : 'text-ink-400'}>
                        {label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Card>

            {done && (
              <>
                {/* 2 · Today's reflection */}
                <section className="animate-fade-up">
                  <SectionLabel>Today's reflection</SectionLabel>
                  <Card className="mt-3 p-7 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">
                        {new Date(reflection.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <span className="rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-ink-500">
                        {analysis.wordCount} words
                      </span>
                    </div>
                    <p className="mt-4 font-display text-lg leading-relaxed text-ink-700 italic">“{analysis.today}”</p>
                  </Card>
                </section>

                {/* 3 · What EvolveAI understood */}
                <section className="animate-fade-up" style={{ animationDelay: '80ms' }}>
                  <SectionLabel>What EvolveAI understood</SectionLabel>
                  <Card className="mt-3 grid gap-7 p-7 md:grid-cols-2 md:p-8">
                    {[
                      ['Emotion', analysis.understanding.emotion],
                      ['Situation', analysis.understanding.situation],
                      ['Response', analysis.understanding.response],
                      ['Coping approach', analysis.understanding.coping],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs font-semibold text-iris-600">{label}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{value}</p>
                      </div>
                    ))}
                  </Card>
                </section>

                {/* 4 · Past → Present centerpiece */}
                <section className="relative animate-fade-up" style={{ animationDelay: '160ms' }}>
                  <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-iris-300/25 via-transparent to-sage-300/25 blur-2xl" />
                  <SectionLabel>Past → Present</SectionLabel>
                  <div className="mt-3 rounded-[2rem] border border-iris-500/15 bg-white p-7 shadow-lift md:p-10">
                    <div className="relative grid gap-5 md:grid-cols-2 md:gap-10">
                      <div className="rounded-2xl bg-mist-100/80 p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Past</span>
                        </div>
                        <p className="mt-3 font-display text-lg leading-relaxed text-ink-500 italic">
                          “{analysis.past.quote}”
                        </p>
                        <p className="mt-4">
                          <span className="inline-flex rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-ink-600">
                            {analysis.past.summary}
                          </span>
                        </p>
                        <p className="mt-3 text-xs text-ink-400">{analysis.past.meta}</p>
                      </div>

                      <div className="z-10 -my-2 flex justify-center md:hidden">
                        <span className="flex h-10 w-10 rotate-90 items-center justify-center rounded-full bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-lift">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-br from-iris-50 to-sage-50 p-6 ring-1 ring-iris-500/15">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold tracking-[0.18em] text-iris-600 uppercase">
                            Present
                          </span>
                          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-ink-500">
                            Today
                          </span>
                        </div>
                        <p className="mt-3 font-display text-lg leading-relaxed text-ink-900 italic">
                          “{analysis.present.quote}”
                        </p>
                        <p className="mt-4">
                          <span className="inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-ink-800">
                            {analysis.present.summary}
                          </span>
                        </p>
                        <p className="mt-3 text-xs text-ink-400">Your reflection · Today</p>
                      </div>

                      <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-lift md:flex">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-8 flex items-start gap-4 rounded-2xl bg-gradient-to-r from-iris-500/10 to-sage-500/10 p-5 md:p-6">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-soft">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-iris-700 uppercase">
                          Change detected
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-800 md:text-[15px]">{analysis.change}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5 · Possible growth areas */}
                <section className="animate-fade-up" style={{ animationDelay: '240ms' }}>
                  <SectionLabel>Possible growth areas</SectionLabel>
                  <Card className="mt-3 p-7 md:p-8">
                    <div className="space-y-3">
                      {analysis.growthAreas.map((g) => (
                        <div
                          key={g.label}
                          className="flex items-center justify-between rounded-2xl bg-mist-100/80 px-5 py-4"
                        >
                          <span className="text-sm font-medium text-ink-700">{g.label}</span>
                          <span
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${STATUS_STYLES[g.status]}`}
                          >
                            {g.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-ink-400">
                      Descriptors of a possible pattern — not scores, not a diagnosis.
                    </p>
                  </Card>
                </section>

                {/* 6 · Possible turning point */}
                <section className="animate-fade-up" style={{ animationDelay: '320ms' }}>
                  <SectionLabel>Possible turning point</SectionLabel>
                  <Card className="mt-3 p-7 md:p-8">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                        <PathRoute className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h2 className="font-display text-xl text-ink-950">What may be shaping this change?</h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-ink-600 md:text-[15px]">
                          {analysis.turningPoint}
                        </p>
                        <p className="mt-4 inline-flex rounded-full border border-ink-900/10 bg-mist-100/80 px-3.5 py-1.5 text-[11px] font-medium text-ink-500">
                          A possible association — not proven causation.
                        </p>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* 7 · AI growth insight */}
                <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
                  <SectionLabel>AI growth insight</SectionLabel>
                  <div className="relative mt-3 overflow-hidden rounded-[2rem] bg-ink-950 p-8 md:p-10">
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <div className="bg-grid-light absolute inset-0 opacity-60" />
                      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-iris-600/30 blur-3xl" />
                      <div className="absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-sage-500/20 blur-3xl" />
                    </div>
                    <div className="relative flex items-start gap-4">
                      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-glow">
                        <Sparkles className="h-4.5 w-4.5" />
                      </span>
                      <p className="font-display text-lg leading-relaxed text-mist-50 italic md:text-xl">
                        {analysis.insight}
                      </p>
                    </div>
                  </div>
                </section>

                {/* 8 · A question to carry forward */}
                <section className="animate-fade-up" style={{ animationDelay: '480ms' }}>
                  <SectionLabel>A question to carry forward</SectionLabel>
                  <div className="mt-3 rounded-3xl border border-iris-500/10 bg-gradient-to-br from-iris-50 to-sage-50 p-7 shadow-soft md:p-8">
                    <p className="font-display text-lg leading-relaxed text-ink-700 italic">{analysis.followUp}</p>
                    <Button to="/reflect" variant="secondary" size="sm" className="mt-6">
                      <PenLine className="h-3.5 w-3.5" />
                      Reflect on this
                    </Button>
                  </div>
                </section>

                {/* 9 · Timeline CTA */}
                <div className="flex animate-fade-up justify-center pt-2" style={{ animationDelay: '560ms' }}>
                  <Button to="/timeline" variant="gradient" size="lg">
                    See My Growth Timeline
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>

                <p className="animate-fade-up text-center text-xs text-ink-400" style={{ animationDelay: '620ms' }}>
                  Prototype mock analysis — everything runs locally in your browser.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
