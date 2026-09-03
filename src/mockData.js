/* Mock data for the EvolveAI demo. Replace with real API responses later. */

export const user = {
  name: 'Jordan',
  streakWeeks: 12,
  reflectionsPerWeek: 6,
}

export const growthDimensions = [
  { id: 'self-awareness', label: 'Self-awareness', delta: '+18%' },
  { id: 'resilience', label: 'Resilience', delta: '+24%' },
  { id: 'regulation', label: 'Regulation', delta: '+12%' },
  { id: 'communication', label: 'Communication', delta: '+9%' },
]

export const growthCurve = {
  months: ['May', 'Jun', 'Jul', 'Aug'],
}

export const sampleInsight = {
  title: 'Pattern detected',
  text: 'Calm evening language rose 2× on weeks with bedtime reflections.',
}

export const reflections = [
  {
    id: 'r-014',
    date: 'Aug 27',
    emotion: 'settled',
    energy: 7,
    note: 'The presentation went better than I feared. I noticed my worry peaked the night before, not in the room.',
  },
  {
    id: 'r-013',
    date: 'Aug 26',
    emotion: 'tense',
    energy: 4,
    note: 'Rehearsed twice and went for a walk after lunch. The walk helped more than the extra rehearsal.',
  },
  {
    id: 'r-012',
    date: 'Aug 25',
    emotion: 'hopeful',
    energy: 6,
    note: 'Told a friend about the project I have been postponing. Saying it out loud made it feel smaller.',
  },
]
