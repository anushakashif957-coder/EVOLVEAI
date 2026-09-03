/* Deterministic mock "AI" analysis for the prototype. Runs fully in-browser.
   Compares the current reflection (PRESENT) with the most relevant earlier
   reflection (PAST) — a real one from history when available, otherwise a
   clearly labeled sample. Never presents the current reflection as the past. */

import { loadReflections, getDemoHistory } from './storage.js'

const LEXICON = [
  { id: 'calm', label: 'calm', words: ['calm', 'peace', 'peaceful', 'relaxed', 'settled', 'quiet'] },
  { id: 'joy', label: 'pride or joy', words: ['happy', 'proud', 'glad', 'excited', 'grateful', 'joy', 'fun'] },
  { id: 'worry', label: 'nervousness', words: ['worried', 'worry', 'anxious', 'nervous', 'afraid', 'fear', 'stress', 'tense'] },
  { id: 'sadness', label: 'sadness', words: ['sad', 'lonely', 'disappointed', 'hurt'] },
  { id: 'frustration', label: 'frustration', words: ['angry', 'frustrated', 'annoyed', 'irritated'] },
  { id: 'hope', label: 'hope', words: ['hope', 'hopeful', 'optimistic', 'looking forward'] },
]

const SITUATIONS = [
  {
    id: 'presentation',
    keywords: ['presentation', 'presented', 'presenting', 'public speaking', 'speech', 'audience', 'slides'],
    label: 'Presentation',
    longLabel: 'A presentation or moment of public speaking',
    pastSummary: 'Avoided the situation because of fear of judgment.',
    facingSummary: 'Experienced nervousness but continued with the presentation.',
    change: 'Your response appears to be shifting from avoiding the challenge toward facing it despite discomfort.',
    turningPoint:
      'Repeatedly facing uncomfortable situations may be helping you become more comfortable acting even when you feel nervous.',
    insight:
      'You still experienced nervousness, but your response changed. Instead of allowing the emotion to determine your behavior, you continued with the presentation. That difference may represent an emerging resilience pattern.',
    followUp: 'What did you learn about yourself by acting while nervous?',
  },
  {
    id: 'criticism',
    keywords: ['critic', 'feedback', 'reviewed', 'corrected', 'called out'],
    label: 'Criticism',
    longLabel: 'Receiving criticism or feedback',
    pastSummary: 'Heard criticism as a verdict on self-worth.',
    facingSummary: 'Stayed with the feedback instead of shutting down.',
    change: 'Your response appears to be shifting from taking criticism personally toward treating it as information.',
    turningPoint: 'Practicing separating your worth from your output may be making feedback feel less like a threat.',
    insight:
      'The feedback stung, yet you stayed with it instead of shutting down. That may indicate a possible pattern of growing self-awareness around criticism.',
    followUp: 'What part of the feedback is actually useful to you?',
  },
  {
    id: 'conflict',
    keywords: ['argument', 'argued', 'conflict', 'fought', 'disagreed', 'confront', 'tense conversation'],
    label: 'Conflict',
    longLabel: 'A conflict or difficult conversation',
    pastSummary: 'Stayed silent even when something mattered.',
    facingSummary: 'Named what mattered despite the discomfort.',
    change: 'Your response appears to be shifting from silence toward naming what matters to you.',
    turningPoint: 'Small experiences of being heard may be making it feel safer to speak up in moments of disagreement.',
    insight:
      'You felt the pull to withdraw, and still you said what mattered. That difference may represent an emerging pattern in how you communicate under pressure.',
    followUp: 'What made it feel possible to speak up this time?',
  },
  {
    id: 'exams',
    keywords: ['exam', 'test', 'study', 'studied', 'deadline', 'grades', 'revision'],
    label: 'Exam pressure',
    longLabel: 'Exam or study pressure',
    pastSummary: 'Spiraled and postponed the effort.',
    facingSummary: 'Paced the effort step by step.',
    change: 'Your response appears to be shifting from spiraling toward steadier, step-by-step effort.',
    turningPoint: 'Experiencing that effort changes outcomes may be slowly replacing panic with a workable routine.',
    insight:
      'The pressure was real, but your response looked more like pacing than panic. That may indicate a possible pattern of strengthening emotional regulation.',
    followUp: 'Which small habit helped most this week?',
  },
  {
    id: 'failure',
    keywords: ['failed', 'failure', 'setback', 'mistake', 'messed up', 'rejected', 'lost'],
    label: 'Setback',
    longLabel: 'A setback or moment of failure',
    pastSummary: 'Turned the setback into a self-judgment.',
    facingSummary: 'Treated the setback as an event to learn from.',
    change: 'Your response appears to be shifting from self-judgment toward curiosity about what happened.',
    turningPoint: 'Recovering from small setbacks may be teaching you that a mistake is an event, not an identity.',
    insight:
      'You noticed the setback without letting it define you. That difference may represent an emerging resilience pattern.',
    followUp: 'What would you try next time with what you know now?',
  },
  {
    id: 'relationships',
    keywords: ['friend', 'partner', 'relationship', 'family', 'mom', 'dad', 'boyfriend', 'girlfriend', 'breakup'],
    label: 'Relationship',
    longLabel: 'A moment in a close relationship',
    pastSummary: 'Kept difficult feelings private to protect the bond.',
    facingSummary: 'Shared honestly instead of protecting silently.',
    change: 'Your response appears to be shifting from protecting others toward honest sharing.',
    turningPoint: 'Experiences of connection surviving honesty may be making openness feel less risky.',
    insight:
      'You brought more of your true self into the relationship today. That may indicate a possible pattern of growing communication and trust.',
    followUp: 'What did sharing honestly change between you?',
  },
  {
    id: 'anxiety',
    keywords: ['anxious', 'anxiety', 'nervous', 'worried', 'worry', 'panic', 'overwhelmed', 'tense'],
    label: 'Anxiety',
    longLabel: 'A wave of anxiety or nervousness',
    pastSummary: 'Waited for the anxiety to pass before acting.',
    facingSummary: 'Acted alongside the nervousness.',
    change: 'Your response appears to be shifting from waiting for calm toward acting alongside nervousness.',
    turningPoint: 'Acting while anxious — and seeing it go okay — may be loosening the link between nervousness and avoidance.',
    insight:
      'The nervousness was present, yet it did not decide your actions. That difference may represent an emerging resilience pattern.',
    followUp: 'What helped you act while the feeling was still there?',
  },
]

const GENERAL = {
  id: 'general',
  keywords: [],
  label: 'Personal moment',
  longLabel: 'A personal moment of challenge',
  pastSummary: 'Moved past difficult moments without dwelling.',
  facingSummary: 'Stayed with the moment long enough to learn from it.',
  change: 'Your response appears to be shifting from moving past moments toward learning from them.',
  turningPoint: 'Taking time to reflect may be making your inner patterns easier to notice, and therefore easier to choose.',
  insight:
    'You stayed with today’s experience long enough to learn from it. That may indicate a possible pattern of growing self-awareness.',
  followUp: 'What would “handling it well” look like next time?',
}

const FACING_WORDS = ['still', 'anyway', 'even though', 'but i', 'continued', 'kept going', 'faced', 'did it']
const AVOID_WORDS = ['avoid', 'put off', 'postpon', 'withdrew', 'stayed quiet', 'shut down', 'escaped']
const COPING_WORDS = ['walk', 'breath', 'paused', 'pause', 'talked', 'shared', 'wrote', 'journal', 'music', 'exercise', 'rest', 'tea', 'slept']
const AWARENESS_WORDS = ['noticed', 'realized', 'aware', 'understand', 'recogni']

const PRESENT_AVOID = 'Pulled back this time — a data point, not a verdict.'
const PRESENT_NEUTRAL = 'Responded in the moment, and noticed the reaction.'

const count = (haystack, needle) => haystack.split(needle).length - 1
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const pad = (t) => ` ${t.toLowerCase()} `

export function shorten(text, max = 260) {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

function firstSentences(text, max = 180) {
  const sentences = text.trim().match(/[^.!?]+[.!?]*/g) || [text]
  let out = ''
  for (const s of sentences) {
    if ((out + s).length > max && out) break
    out += s
    if (out.length >= max) break
  }
  return out.trim() || shorten(text, max)
}

function monthDay(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function detectSituation(lower) {
  let situation = GENERAL
  let best = 0
  for (const s of SITUATIONS) {
    const score = s.keywords.reduce((n, k) => n + count(lower, k), 0)
    if (score > best) {
      best = score
      situation = s
    }
  }
  return situation
}

/* Reusable per-reflection description shared by Insights and the Timeline. */
export function describeReflection(text) {
  const lower = pad(text)
  const situation = detectSituation(lower)

  const signals = LEXICON.map((g) => ({
    id: g.id,
    label: g.label,
    count: g.words.reduce((n, w) => n + count(lower, w), 0),
  }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count)

  const emotion = signals.length
    ? capitalize(signals[0].label) + (signals[1] ? `, with ${signals[1].label} underneath` : '')
    : 'A quiet, reflective tone'

  const facing = FACING_WORDS.some((w) => count(lower, w) > 0)
  const avoiding = AVOID_WORDS.some((w) => count(lower, w) > 0)
  const copingFound = COPING_WORDS.filter((w) => count(lower, w) > 0)

  const response = facing
    ? copingFound.length
      ? 'Faced the challenge with a coping strategy'
      : 'Faced the challenge despite discomfort'
    : avoiding
      ? 'Pulled away from the challenge'
      : 'Responded and observed the reaction'

  const signal = avoiding ? 'Avoidance' : facing ? (copingFound.length ? 'Coping' : 'Resilience') : 'Awareness'

  const awareness = AWARENESS_WORDS.some((w) => count(lower, w) > 0)

  return { situation, situationLabel: situation.label, emotion, response, signal, facing, avoiding, copingFound, awareness, signals }
}

function behaviorSummary(text, situation = null) {
  const lower = pad(text)
  const s = situation ?? detectSituation(lower)
  const facing = FACING_WORDS.some((w) => count(lower, w) > 0)
  return facing ? s.facingSummary : s.pastSummary
}

function resolvePast(current, situation) {
  const all = loadReflections()
  const idx = all.findIndex((r) => r.id === current.id)
  const earlier = all.slice(0, idx === -1 ? Math.max(all.length - 1, 0) : idx)
  const distinct = earlier.filter((r) => r.text.trim() !== current.text.trim())

  if (distinct.length) {
    const scored = distinct
      .map((r) => ({ r, score: situation.keywords.reduce((n, k) => n + count(pad(r.text), k), 0) }))
      .sort((a, b) => b.score - a.score)
    const pick = (scored[0].score > 0 ? scored[0] : scored[scored.length - 1]).r
    return {
      quote: shorten(pick.text, 180),
      meta: `Your reflection · ${monthDay(pick.createdAt)}`,
      summary: behaviorSummary(pick.text),
      source: 'history',
    }
  }

  const demo = getDemoHistory().find((d) => d.situation === situation.id) ?? getDemoHistory()[0]
  const demoSituation = SITUATIONS.find((s) => s.id === demo.situation) ?? GENERAL
  return {
    quote: demo.text,
    meta: 'Sample earlier reflection',
    summary: behaviorSummary(demo.text, demoSituation),
    source: 'sample',
  }
}

export function analyzeReflection(reflection) {
  const text = reflection.text
  const lower = pad(text)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const d = describeReflection(text)

  const responseLong = d.facing
    ? 'Moved toward the challenge even while it felt uncomfortable.'
    : d.avoiding
      ? 'Pulled back this time — one moment, not a pattern.'
      : 'Responded in the moment, and noticed your own reaction.'

  const coping = d.copingFound.length
    ? `Reached for steadiness — ${d.copingFound.slice(0, 2).join(', ')} — instead of letting the moment pass unexamined.`
    : 'No coping strategy named today — noticing that is itself useful.'

  const growthAreas = [
    { label: 'Resilience', status: d.facing || d.avoiding ? 'Strengthening' : 'Emerging' },
    {
      label: 'Emotional Regulation',
      status: d.copingFound.length > 0 || d.signals.some((s) => ['calm', 'hope'].includes(s.id)) ? 'Strengthening' : 'Emerging',
    },
    {
      label: 'Self-awareness',
      status: d.awareness ? 'Consistent' : d.signals.length >= 2 ? 'Strengthening' : 'Emerging',
    },
  ]

  return {
    wordCount,
    understanding: { emotion: d.emotion, situation: d.situation.longLabel, response: responseLong, coping },
    today: shorten(text, 260),
    past: resolvePast(reflection, d.situation),
    present: {
      quote: firstSentences(text, 180),
      summary: d.facing ? d.situation.facingSummary : d.avoiding ? PRESENT_AVOID : PRESENT_NEUTRAL,
    },
    change: d.situation.change,
    growthAreas,
    turningPoint: d.situation.turningPoint,
    insight: d.situation.insight,
    followUp: d.situation.followUp,
  }
}
