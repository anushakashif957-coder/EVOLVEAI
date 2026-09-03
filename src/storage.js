const KEY = 'evolveai:reflections'

export function loadReflections() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveReflection(text) {
  const reflection = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    text,
  }
  try {
    localStorage.setItem(KEY, JSON.stringify([...loadReflections(), reflection]))
  } catch {
    /* private mode — keep the flow working in-memory */
  }
  return reflection
}

export function getLatestReflection() {
  const all = loadReflections()
  return all.length ? all[all.length - 1] : null
}

const DEMO_KEY = 'evolveai:demo-history:v2'

const DEMO_HISTORY = [
  {
    id: 'demo-presentation',
    situation: 'presentation',
    createdAt: '2026-05-12T18:00:00.000Z',
    text: 'I was extremely nervous about presenting in class, so I tried to avoid speaking and hoped the teacher would not call on me. I felt that everyone would judge me if I made a mistake.',
  },
  {
    id: 'demo-criticism',
    situation: 'criticism',
    createdAt: '2026-05-19T18:00:00.000Z',
    text: "When someone criticizes my work, I hear it as a verdict on me as a person.",
  },
  {
    id: 'demo-conflict',
    situation: 'conflict',
    createdAt: '2026-05-26T18:00:00.000Z',
    text: "I usually stay quiet during conflict, even when something matters to me.",
  },
  {
    id: 'demo-exams',
    situation: 'exams',
    createdAt: '2026-06-02T18:00:00.000Z',
    text: "When exams approach, I spiral and convince myself it's too late to try.",
  },
  {
    id: 'demo-failure',
    situation: 'failure',
    createdAt: '2026-06-09T18:00:00.000Z',
    text: "When I fail, I tell myself I'm just not capable.",
  },
  {
    id: 'demo-relationships',
    situation: 'relationships',
    createdAt: '2026-06-16T18:00:00.000Z',
    text: "I tend to keep difficult feelings to myself to protect the relationship.",
  },
  {
    id: 'demo-anxiety',
    situation: 'anxiety',
    createdAt: '2026-06-23T18:00:00.000Z',
    text: "When anxiety rises, I wait until it passes before I do anything.",
  },
]

export function getDemoHistory() {
  try {
    if (!localStorage.getItem(DEMO_KEY)) {
      localStorage.setItem(DEMO_KEY, JSON.stringify(DEMO_HISTORY))
    }
    return JSON.parse(localStorage.getItem(DEMO_KEY))
  } catch {
    return DEMO_HISTORY
  }
}
