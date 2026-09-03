import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import TimelineEvent from '../components/timeline/TimelineEvent.jsx'
import { ArrowRight, PathRoute, Sparkles } from '../components/ui/Icons.jsx'
import { buildTimeline, GROWTH_STAGES } from '../lib/timeline.js'
import { shorten } from '../lib/mockAnalysis.js'

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">{children}</p>
}

export default function GrowthTimelinePage() {
  const location = useLocation()
  const t = useMemo(() => buildTimeline(), [location])

  return (
    <AppShell>
      <div className="relative mx-auto max-w-4xl">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-200/40 via-transparent to-sage-200/40 blur-3xl" />

        <div className="max-w-2xl animate-fade-up">
          <span className="text-[11px] font-semibold tracking-[0.22em] text-iris-600 uppercase">
            Module 03 · Your story
          </span>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink-950 md:text-5xl">Your Growth Timeline</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            See how your responses have evolved, not just how your emotions changed.
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

        {t.events.length === 0 ? (
          <Card className="mt-10 flex flex-col items-center gap-5 p-12 text-center">
            <h2 className="font-display text-2xl text-ink-950">No reflections yet</h2>
            <p className="max-w-md leading-relaxed text-ink-500">
              Your timeline begins with your first reflection. It takes about two minutes.
            </p>
            <Button to="/reflect">Write your first reflection</Button>
          </Card>
        ) : (
          <div className="mt-12 space-y-12">
            {/* Chronological timeline */}
            <section>
              {t.events.map((event, i) => (
                <Reveal key={event.id} delay={Math.min(i, 4) * 90}>
                  <TimelineEvent event={event} isLatest={event.id === t.latest.id} isLast={i === t.events.length - 1} />
                </Reveal>
              ))}

              {t.realCount === 0 && (
                <Reveal>
                  <Card className="mt-8 p-7 text-center">
                    <p className="text-sm leading-relaxed text-ink-500">
                      You're viewing labeled demo history.{' '}
                      <span className="font-semibold text-ink-800">Write your first reflection</span> to start your own
                      timeline.
                    </p>
                    <Button to="/reflect" variant="secondary" size="sm" className="mt-5">
                      Start your timeline
                    </Button>
                  </Card>
                </Reveal>
              )}

              {t.realCount === 1 && (
                <Reveal>
                  <Card className="mt-8 p-7 text-center">
                    <p className="text-sm leading-relaxed text-ink-500">
                      One reflection recorded. There is not enough personal history yet to establish a change. Each
                      new reflection adds another point to your arc.
                    </p>
                    <Button to="/reflect" variant="secondary" size="sm" className="mt-5">
                      Add another reflection
                    </Button>
                  </Card>
                </Reveal>
              )}
            </section>

            {/* Pattern emerging */}
            {t.pattern && (
              <section className="relative animate-fade-up">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-iris-300/25 via-transparent to-sage-300/25 blur-2xl" />
                <div className="rounded-[2rem] border border-iris-500/20 bg-white p-8 shadow-lift md:p-12">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-iris-500 to-sage-500 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase shadow-soft">
                    <Sparkles className="h-3.5 w-3.5" />
                    Pattern emerging
                  </span>
                  <p className="mt-7 text-balance font-display text-2xl leading-snug text-ink-950 md:text-3xl">
                    You may not be experiencing fewer difficult emotions.{' '}
                    <span className="bg-gradient-to-r from-iris-600 to-sage-500 bg-clip-text italic text-transparent">
                      Your responses to those emotions appear to be changing.
                    </span>
                  </p>

                  <div className="mt-9 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
                    <div className="flex-1 rounded-2xl bg-mist-100/80 p-5">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">Then</p>
                      <p className="mt-1.5 text-sm font-medium text-ink-700">{t.pattern.then}</p>
                    </div>
                    <span className="z-10 flex h-10 w-10 shrink-0 rotate-90 items-center justify-center self-center rounded-full bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-lift md:rotate-0">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-iris-50 to-sage-50 p-5 ring-1 ring-iris-500/15">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-iris-600 uppercase">Now</p>
                      <p className="mt-1.5 text-sm font-medium text-ink-900">{t.pattern.now}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* What may be shaping this change */}
            {t.realCount >= 2 && t.shaping && (
              <section className="animate-fade-up">
                <SectionLabel>What may be shaping this change?</SectionLabel>
                <Card className="mt-3 p-7 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                      <PathRoute className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed text-ink-600 md:text-[15px]">{t.shaping}</p>
                      <p className="mt-4 inline-flex rounded-full border border-ink-900/10 bg-mist-100/80 px-3.5 py-1.5 text-[11px] font-medium text-ink-500">
                        Possible association, not proven causation.
                      </p>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Growth path */}
            {t.realCount > 0 && (
              <section className="animate-fade-up">
                <SectionLabel>Your growth path</SectionLabel>
                <Card className="mt-3 p-7 md:p-8">
                  <p className="text-xs text-ink-400">AI-estimated from your reflection pattern — a lens, not a measure.</p>
                  <ol className="mt-6">
                    {GROWTH_STAGES.map((stage, i) => {
                      const highlighted = stage.id === t.stage
                      const reached = GROWTH_STAGES.findIndex((s) => s.id === t.stage) >= i
                      return (
                        <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                          {i < GROWTH_STAGES.length - 1 && (
                            <span
                              className="absolute top-9 left-[13px] h-[calc(100%-2.25rem)] w-px bg-gradient-to-b from-ink-900/15 to-ink-900/5"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              highlighted
                                ? 'bg-gradient-to-br from-iris-500 to-sage-500 text-white shadow-glow'
                                : reached
                                  ? 'bg-white text-iris-500 ring-1 ring-iris-500/30'
                                  : 'bg-white text-ink-300 ring-1 ring-ink-900/10'
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                          </span>
                          <div>
                            <p className={`text-sm ${highlighted ? 'font-semibold text-ink-950' : reached ? 'font-medium text-ink-700' : 'text-ink-400'}`}>
                              {stage.id}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-400">{stage.blurb}</p>
                            {highlighted && (
                              <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-iris-500 to-sage-500 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                                Most supported now
                              </span>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </Card>
              </section>
            )}

            {/* Latest reflection */}
            {t.latest && (
              <section className="animate-fade-up">
                <SectionLabel>Latest reflection</SectionLabel>
                <Card className="mt-3 p-7 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-400 uppercase">
                      {t.latest.dateLabel}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${
                        t.latest.source === 'sample' ? 'bg-mist-200/80 text-ink-500' : 'bg-iris-100 text-iris-700'
                      }`}
                    >
                      {t.latest.source === 'sample' ? 'Demo history' : 'Your reflection'}
                    </span>
                  </div>
                  <p className="mt-4 font-display text-lg leading-relaxed text-ink-700 italic">
                    “{shorten(t.latest.text, 260)}”
                  </p>
                </Card>
              </section>
            )}

            <div className="flex justify-center pt-2">
              <Button to="/passport" variant="gradient" size="lg">
                View My Growth Passport
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            <p className="text-center text-xs text-ink-400">
              A reflection pattern view — AI-estimated, not a clinical measurement.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
