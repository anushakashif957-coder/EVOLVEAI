export default function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl animate-fade-up">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-600">{eyebrow}</span>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink-950 md:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-lg leading-relaxed text-ink-500">{description}</p>}
    </div>
  )
}
