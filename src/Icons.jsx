const defaults = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M3.5 10h12.5M11.5 5.5 16 10l-4.5 4.5" />
    </svg>
  )
}

export function Sparkles({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M10 2.8 11.7 8.3 17.2 10l-5.5 1.7L10 17.2 8.3 11.7 2.8 10l5.5-1.7L10 2.8Z" />
      <path d="M16 3v3M14.5 4.5h3" />
    </svg>
  )
}

export function TrendUp({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M2.5 14.5 8 9l3.5 3.5L17.5 6.5M17.5 11V6.5H13" />
    </svg>
  )
}

export function PenLine({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="m3.5 16.5 1-4L13 4l3 3-8.5 8.5-4 1Z" />
      <path d="m11.5 5.5 3 3" />
    </svg>
  )
}

export function Shield({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M10 2.5 16 5v4.5c0 3.9-2.5 6.7-6 8-3.5-1.3-6-4.1-6-8V5l6-2.5Z" />
    </svg>
  )
}

export function Rings({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M16.5 10a6.5 6.5 0 1 0-6.5 6.5" />
      <path d="M13.5 10a3.5 3.5 0 1 0-3.5 3.5" opacity="0.65" />
      <circle cx="10" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PathRoute({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M3.5 16c4.5 0 4.5-5.5 9-5.5 3 0 3.5-3 4-6" />
      <circle cx="3.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Compass({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" />
      <path d="m13.2 6.8-1.9 4.5-4.5 1.9 1.9-4.5 4.5-1.9Z" />
    </svg>
  )
}

export function Check({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="m4.5 10.5 3.5 3.5L15.5 6.5" />
    </svg>
  )
}

export function Mic({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <path d="M10 2.75a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 10 2.75Z" />
      <path d="M5.5 10.25a4.5 4.5 0 0 0 9 0M10 14.75v2.5" />
    </svg>
  )
}

export function Lock({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...defaults} aria-hidden="true">
      <rect x="4.75" y="8.75" width="10.5" height="8" rx="2.5" />
      <path d="M7.25 8.75V6.75a2.75 2.75 0 0 1 5.5 0v2" />
    </svg>
  )
}
