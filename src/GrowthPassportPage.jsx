import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { ArrowRight, Compass, PathRoute, PenLine, Shield, Sparkles } from '../components/ui/Icons.jsx'
import { buildTimeline, GROWTH_STAGES } from '../lib/timeline.js'
import { analyzeReflection, shorten } from '../lib/mockAnalysis.js'
import { user } from '../data/mockData.js'

const STATUS_STYLES = {
  Emerging: 'bg-iris-100 text-iris-700',
  Strengthening: 'bg-sage-100 text-sage-700',
  Consistent: 'bg-gold-100 text-gold-500',
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">{children}</p>
}

function getCurrentStage(events) {
  const facing = events.filter((event) => event.facing)
  const coping = facing.filter((event) => event.copingFound.length > 0)
  if (coping.length >= 2) return 'Adapting'
  if (coping.length === 1) return 'Coping'
  if (facing.length >= 1) return 'Experimenting'
  return 'Awareness'
}

export default function GrowthPassportPage() {
  const location = useLocation()
  const t = useMemo(() => buildTimeline(), [location])
  const realEvents = useMemo(() => t.events.filter((event) => event.source === 'real'), [t])
  const earliestReal = realEvents[0]
  const latestReal = realEvents.at(-1)
  const analysis = useMemo(() => (latestReal ? analyzeReflection(latestReal) : null), [latestReal])
  const patterns = useMemo(() => {
    const signals = {}
    const situations = {}
    for (const event of realEvents) {
      signals[event.signal] = (signals[event.signal] ?? 0) + 1
      situations[event.situationLabel] = (situations[event.situationLabel] ?? 0) + 1
    }
    const top = (items) =>
      Object.entries(items)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    return { signals: top(signals), situations: top(situations) }
  }, [realEvents])
  const currentStage = useMemo(() => getCurrentStage(realEvents), [realEvents])

  const stageBlurb = GROWTH_STAGES.find((stage) => stage.id === currentStage)?.blurb ?? ''
  const issuedOn = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <AppShell>
      <div className="relative mx-auto max-w-4xl">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-200/40 via-transparent to-sage-200/40 blur-3xl" />

        <div className="max-w-2xl animate-fade-up">
          <span className="text-[11px] font-semibold tracking-[0.22em] text-iris-600 uppercase">
            Module 05 · Portable you
          </span>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink-950 md:text-5xl">Growth Passport</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            A shareable portrait of how you have grown — in your own words.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {t.realCount > 0 && (
              <span className="rounded-full bg-iris-100 px-3.5 py-1.5 text-[11px] font-semibold text-iris-700">
                {t.realCount} of your reflection{t.realCount === 1 ? '' : 's'}
              </span>
            )}
            {t.sampleCount > 0 && (
              <span className="rounded-full border border-ink-900/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold text-ink-500 shadow-soft">
                Labeled demo history included
              </span>
            )}
          </div>
        </div>

        {t.realCount === 0 ? (
          <Card className="mt-10 flex flex-col items-center gap-5 p-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500/12 to-sage-500/12 text-iris-600 ring-1 ring-ink-900/5">
              <Compass className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl text-ink-950">Your passport is waiting for its first stamp</h2>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-500">
                The passport summarizes your own reflections. Write one to begin — it takes about two minutes.
              </p>
            </div>
            <Button to="/reflect">
              Write your first reflection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Card>
        ) : (
          <div className="mt-10 space-y-10">
            {/* Passport document */}
            <section className="relative animate-fade-up">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-iris-300/25 via-transparent to-sage-300/25 blur-2xl" />
              <div className="rounded-[2rem] border border-iris-500/20 bg-white p-8 shadow-lift md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-glow">
                      <Compass className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">
                        EvolveAI · Growth Passport
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-ink-800">Holder · {user.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-400">Issued {issuedOn}</p>
                </div>

                <p className="mt-7 text-balance font-display text-lg leading-relaxed text-ink-800 md:text-xl">
                  Across {t.realCount} of your reflection{t.realCount === 1 ? '' : 's'}, your earliest recorded response
                  reads as “{earliestReal.signal}”, while your most recent reads as “{latestReal.signal}”. Your responses
                  appear to be shifting over time.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-mist-100/80 p-5">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Recorded</p>
                    <p className="mt-1.5 font-display text-2xl text-ink-950">{t.realCount}</p>
                    <p className="mt-1 text-xs text-ink-500">of your reflections</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-iris-50 to-sage-50 p-5 ring-1 ring-iris-500/15">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-iris-600 uppercase">Current stage</p>
                    <p className="mt-1.5 font-display text-2xl text-ink-950">{currentStage}</p>
                    <p className="mt-1 text-xs text-ink-500">{stageBlurb}</p>
                  </div>
                  <div className="rounded-2xl bg-mist-100/80 p-5">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Direction</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-sm font-medium text-ink-600">{earliestReal.signal}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-iris-500" />
                      <span className="text-sm font-semibold text-ink-900">{latestReal.signal}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">how your responses appear to be moving</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Key emotional patterns */}
            <section className="animate-fade-up" style={{ animationDelay: '80ms' }}>
              <SectionLabel>Key emotional patterns</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="flex flex-wrap gap-2.5">
                  {patterns.signals.map(([label, n]) => (
                    <span
                      key={label}
                      className="rounded-full bg-iris-100 px-3.5 py-1.5 text-xs font-semibold text-iris-700"
                    >
                      {label} · {n}×
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-xs font-semibold text-ink-400">Most present situations</p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {patterns.situations.map(([label, n]) => (
                    <span
                      key={label}
                      className="rounded-full border border-ink-900/10 bg-mist-100/80 px-3.5 py-1.5 text-xs font-medium text-ink-600"
                    >
                      {label} · {n}×
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-xs text-ink-400">
                  Estimated from your reflection language — frequencies, not scores.
                </p>
              </Card>
            </section>

            {/* Possible growth areas */}
            <section className="animate-fade-up" style={{ animationDelay: '160ms' }}>
              <SectionLabel>Possible growth areas</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="space-y-3">
                  {analysis.growthAreas.map((g) => (
                    <div key={g.label} className="flex items-center justify-between rounded-2xl bg-mist-100/80 px-5 py-4">
                      <span className="text-sm font-medium text-ink-700">{g.label}</span>
                      <span className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${STATUS_STYLES[g.status]}`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-ink-400">Descriptors of a possible pattern — not scores, not a diagnosis.</p>
              </Card>
            </section>

            {/* Past → Present */}
            <section className="animate-fade-up" style={{ animationDelay: '240ms' }}>
              <SectionLabel>Past → Present</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-mist-100/80 p-6">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Past</p>
                    <p className="mt-3 font-display text-base leading-relaxed text-ink-500 italic">
                      “{analysis.past.quote}”
                    </p>
                    <p className="mt-3 text-xs text-ink-400">{analysis.past.meta}</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-iris-50 to-sage-50 p-6 ring-1 ring-iris-500/15">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-iris-600 uppercase">Present</p>
                    <p className="mt-3 font-display text-base leading-relaxed text-ink-900 italic">
                      “{analysis.present.quote}”
                    </p>
                    <p className="mt-3 text-xs text-ink-400">Your reflection · Today</p>
                  </div>
                </div>
                <div className="mt-6 flex items-start gap-4 rounded-2xl bg-gradient-to-r from-iris-500/10 to-sage-500/10 p-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-soft">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-iris-700 uppercase">Change detected</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{analysis.change}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Possible turning point */}
            <section className="animate-fade-up" style={{ animationDelay: '320ms' }}>
              <SectionLabel>Possible turning point</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                    <PathRoute className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-ink-950">What may be shaping this change?</h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-600 md:text-[15px]">{analysis.turningPoint}</p>
                    <p className="mt-4 inline-flex rounded-full border border-ink-900/10 bg-mist-100/80 px-3.5 py-1.5 text-[11px] font-medium text-ink-500">
                      A possible association — not proven causation.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Latest reflection */}
            <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
              <SectionLabel>Latest reflection</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">{latestReal.dateLabel}</p>
                  <span className="rounded-full bg-iris-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-iris-700 uppercase">
                    Your reflection
                  </span>
                </div>
                <p className="mt-4 font-display text-lg leading-relaxed text-ink-700 italic">
                  “{shorten(latestReal.text, 260)}”
                </p>
              </Card>
            </section>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button to="/timeline" variant="secondary" size="lg">
                Back to My Timeline
              </Button>
              <Button to="/reflect" variant="gradient" size="lg">
                Write a Reflection
                <PenLine className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-10 animate-fade-up">
          <div className="flex items-start gap-4 rounded-3xl border border-ink-900/10 bg-white/70 p-6 shadow-soft">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
              <Shield className="h-4.5 w-4.5" />
            </span>
            <p className="text-sm leading-relaxed text-ink-500">
              The Growth Passport is an AI-estimated reflection lens, not a clinical assessment. It describes
              possible patterns in your own words — it does not diagnose, score, or treat.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
