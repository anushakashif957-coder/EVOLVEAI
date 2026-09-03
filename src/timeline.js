import { loadReflections, getDemoHistory } from './storage.js'
import { describeReflection, shorten } from './mockAnalysis.js'

export const GROWTH_STAGES = [
  { id: 'Awareness', blurb: 'Noticing emotions and reactions' },
  { id: 'Experimenting', blurb: 'Trying a different response' },
  { id: 'Coping', blurb: 'Using strategies to steady yourself' },
  { id: 'Adapting', blurb: 'New responses starting to feel natural' },
]

const NOW_LABEL = {
  Avoidance: 'Pulling away from discomfort',
  Awareness: 'Noticing reactions as they happen',
  Coping: 'Facing the challenge with steady strategies',
  Resilience: 'Facing the situation despite discomfort',
}

function toEvent(entry, source) {
  const d = describeReflection(entry.text)
  return {
    id: entry.id,
    createdAt: entry.createdAt,
    source,
    dateLabel: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    excerpt: shorten(entry.text, 140),
    text: entry.text,
    situationLabel: d.situationLabel,
    emotion: d.emotion,
    response: d.response,
    signal: d.signal,
    facing: d.facing,
    copingFound: d.copingFound,
  }
}

function computeStage(events) {
  const facing = events.filter((e) => e.facing)
  const coping = facing.filter((e) => e.copingFound.length > 0)
  if (coping.length >= 2) return 'Adapting'
  if (coping.length === 1) return 'Coping'
  if (facing.length >= 1) return 'Experimenting'
  return 'Awareness'
}

export function buildTimeline() {
  const real = loadReflections().map((r) => toEvent(r, 'real'))
  const samples = getDemoHistory().map((d) => toEvent(d, 'sample'))
  const events = [...samples, ...real].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const realEvents = events.filter((event) => event.source === 'real')
  const latestReal = realEvents.at(-1) ?? null

  return {
    events,
    realCount: realEvents.length,
    sampleCount: samples.length,
    latest: latestReal ?? events.at(-1) ?? null,
    stage: computeStage(realEvents),
    pattern:
      realEvents.length >= 2
        ? { then: realEvents[0].signal, now: NOW_LABEL[latestReal.signal] }
        : null,
    shaping: latestReal ? describeReflection(latestReal.text).situation.turningPoint : null,
  }
}
