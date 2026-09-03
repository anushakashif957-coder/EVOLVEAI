import { Link } from 'react-router-dom'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-ink-950 text-mist-50 shadow-soft hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-lift',
  gradient:
    'bg-gradient-to-r from-iris-600 to-sage-500 text-white shadow-soft hover:-translate-y-0.5 hover:brightness-105 hover:shadow-lift',
  secondary:
    'bg-white/70 text-ink-900 ring-1 ring-ink-900/10 backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:shadow-soft',
  ghost: 'text-ink-600 hover:bg-ink-900/5 hover:text-ink-950',
  light: 'bg-mist-50 text-ink-950 shadow-soft hover:-translate-y-0.5 hover:shadow-lift',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
}

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
