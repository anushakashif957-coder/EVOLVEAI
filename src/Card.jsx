export default function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-3xl border border-ink-900/5 bg-white/80 shadow-soft backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
