export default function SectionHeading({ eyebrow, title, sub, align = 'center' }) {
  const alignment = align === 'left' ? 'items-start text-left' : 'mx-auto items-center text-center'
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-ink-900/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 shadow-soft backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-iris-500 to-sage-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl leading-tight tracking-tight text-ink-950 md:text-4xl">{title}</h2>
      {sub && <p className="text-base leading-relaxed text-ink-500">{sub}</p>}
    </div>
  )
}
