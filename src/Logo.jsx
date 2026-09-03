import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="evolve-mark" x1="8" y1="29" x2="29" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D5DF6" />
          <stop offset="1" stopColor="#43A596" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="34" height="34" rx="10.5" fill="#0F0E1E" />
      <path d="M26.5 18a8.5 8.5 0 1 0-8.5 8.5" stroke="url(#evolve-mark)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22.5 18a4.5 4.5 0 1 0-4.5 4.5" stroke="url(#evolve-mark)" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      <circle cx="18" cy="18" r="1.9" fill="#FAF9F6" />
    </svg>
  )
}

export function LogoWordmark({ className = '' }) {
  return (
    <span className={`text-[15px] font-semibold tracking-[0.22em] text-ink-950 ${className}`}>
      EVOLVE
      <span className="bg-gradient-to-r from-iris-500 to-sage-500 bg-clip-text text-transparent">AI</span>
    </span>
  )
}

export default function Logo({ to = '/', markClassName = 'h-9 w-9' }) {
  return (
    <Link to={to} className="group flex items-center gap-3">
      <LogoMark className={`${markClassName} transition-transform duration-500 group-hover:rotate-6`} />
      <LogoWordmark />
    </Link>
  )
}
