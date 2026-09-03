import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import PageHeading from '../components/ui/PageHeading.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { ArrowRight, Compass, PathRoute, PenLine, Rings, Shield, Sparkles } from '../components/ui/Icons.jsx'
import { growthDimensions } from '../data/mockData.js'
import { analyzeReflection, shorten } from '../lib/mockAnalysis.js'
import { loadReflections } from '../lib/storage.js'
import { buildTimeline, GROWTH_STAGES } from '../lib/timeline.js'

const STATUS_STYLES = {
  Emerging: 'bg-iris-100 text-iris-700',
  Strengthening: 'bg-sage-100 text-sage-700',
  Consistent: 'bg-gold-100 text-gold-500',
  'Still gathering': 'bg-mist-200/80 text-ink-500',
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">{children}</p>
}

function findGrowthStatus(label, areas) {
  const key = label.toLowerCase()
  const area = areas.find((item) => item.label.toLowerCase().includes(key) || key.includes(item.label.toLowerCase()))
  return area?.status ?? 'Still gathering'
}

function getCurrentStage(events) {
  const facing = events.filter((event) => event.facing)
  const coping = facing.filter((event) => event.copingFound.length > 0)
  if (coping.length >= 2) return 'Adapting'
  if (coping.length === 1) return 'Coping'
  if (facing.length >= 1) return 'Experimenting'
  return 'Awareness'
}

export default function GrowthDashboardPage() {
  const location = useLocation()
  const t = useMemo(() => buildTimeline(), [location])
  const reflections = useMemo(
    () => [...loadReflections()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [location],
  )
  const latestReflection = reflections.at(-1) ?? null
  const analysis = useMemo(() => (latestReflection ? analyzeReflection(latestReflection) : null), [latestReflection])
  const personalEvents = useMemo(() => t.events.filter((event) => event.source === 'real'), [t])
  const recentActivity = useMemo(() => personalEvents.slice(-3).reverse(), [personalEvents])
  const emotions = useMemo(() => {
    const counts = {}
    for (const event of personalEvents) {
      counts[event.emotion] = (counts[event.emotion] ?? 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
  }, [personalEvents])
  const dimensions = useMemo(
    () => (analysis ? growthDimensions.map((dimension) => ({ ...dimension, status: findGrowthStatus(dimension.label, analysis.growthAreas) })) : []),
    [analysis],
  )
  const currentStage = useMemo(() => getCurrentStage(personalEvents), [personalEvents])
  const stageBlurb = GROWTH_STAGES.find((stage) => stage.id === currentStage)?.blurb ?? ''

  return (
    <AppShell>
      <div className="relative mx-auto max-w-4xl">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-200/40 via-transparent to-sage-200/40 blur-3xl" />

        <PageHeading
          eyebrow="Module 04 · Overview"
          title="Growth Dashboard"
          description="A calm view of the patterns emerging in your own reflections."
        />

        {t.realCount === 0 ? (
          <Card className="mt-10 flex flex-col items-center gap-5 p-12 text-center animate-fade-up">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500/12 to-sage-500/12 text-iris-600 ring-1 ring-ink-900/5">
              <Rings className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl text-ink-950">Your overview begins with one reflection</h2>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-500">
                Write a reflection to see a personal snapshot of your emotions, responses, and possible growth areas.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button to="/timeline" variant="secondary">
                Explore the timeline
              </Button>
              <Button to="/reflect" variant="gradient">
                Write a reflection
                <PenLine className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-10 space-y-10">
            <section className="grid gap-4 sm:grid-cols-3 animate-fade-up">
              <Card className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-iris-100 text-iris-700">
                  <PenLine className="h-4.5 w-4.5" />
                </span>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Recorded</p>
                <p className="mt-1.5 font-display text-3xl text-ink-950">{t.realCount}</p>
                <p className="mt-1 text-xs text-ink-500">of your reflections</p>
              </Card>

              <Card className="bg-gradient-to-br from-iris-50 to-sage-50 p-6 ring-1 ring-iris-500/15">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/75 text-sage-700 shadow-soft">
                  <Compass className="h-4.5 w-4.5" />
                </span>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-iris-600 uppercase">Current stage</p>
                <p className="mt-1.5 font-display text-3xl text-ink-950">{currentStage}</p>
                <p className="mt-1 text-xs text-ink-500">{stageBlurb}</p>
              </Card>

              <Card className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                  <PathRoute className="h-4.5 w-4.5" />
                </span>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Latest focus</p>
                <p className="mt-2.5 text-sm font-semibold text-ink-900">{analysis.understanding.situation}</p>
                <p className="mt-1 text-xs text-ink-500">from your most recent reflection</p>
              </Card>
            </section>

            <section className="relative animate-fade-up" style={{ animationDelay: '80ms' }}>
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-iris-300/25 via-transparent to-sage-300/25 blur-2xl" />
              <div className="rounded-[2rem] border border-iris-500/20 bg-white p-8 shadow-lift md:p-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-iris-500 to-sage-500 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase shadow-soft">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your reflection snapshot
                </span>
                <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-ink-950 md:text-3xl">{analysis.insight}</p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-500">
                  Based on {t.realCount} of your reflection{t.realCount === 1 ? '' : 's'} — a useful starting point,
                  not a score or diagnosis.
                </p>
              </div>
            </section>

            <section className="animate-fade-up" style={{ animationDelay: '160ms' }}>
              <SectionLabel>Emotional patterns</SectionLabel>
              <Card className="mt-3 p-7 md:p-8">
                <div className="flex flex-wrap gap-2.5">
                  {emotions.map(([label, count]) => (
                    <span key={label} className="rounded-full bg-iris-100 px-3.5 py-1.5 text-xs font-semibold text-iris-700">
                      {label} · {count}×
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-xs text-ink-400">Estimated from your reflection language — frequencies, not scores.</p>
              </Card>
            </section>

            <section className="animate-fade-up" style={{ animationDelay: '240ms' }}>
              <SectionLabel>Possible growth areas</SectionLabel>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {dimensions.map((dimension) => (
                  <Card key={dimension.id} className="flex items-center justify-between gap-4 p-5">
                    <span className="text-sm font-medium text-ink-700">{dimension.label}</span>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[dimension.status]}`}>
                      {dimension.status}
                    </span>
                  </Card>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">Descriptors of a possible pattern — not a measure of progress.</p>
            </section>

            <section className="animate-fade-up" style={{ animationDelay: '320ms' }}>
              <SectionLabel>Recent activity</SectionLabel>
              <Card className="mt-3 divide-y divide-ink-900/5 p-2">
                {recentActivity.map((event) => (
                  <div key={event.id} className="flex gap-4 rounded-2xl p-5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-iris-600">
                      <PenLine className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-semibold text-ink-800">{event.situationLabel}</p>
                        <span className="text-xs text-ink-400">{event.dateLabel}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">“{shorten(event.text, 150)}”</p>
                    </div>
                  </div>
                ))}
              </Card>
            </section>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button to="/timeline" variant="secondary" size="lg">
                View My Timeline
              </Button>
              <Button to="/passport" variant="gradient" size="lg">
                View My Growth Passport
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
              The dashboard is an AI-estimated reflection lens, not a clinical assessment. It describes possible
              patterns in your own words — it does not diagnose, score, or treat.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
