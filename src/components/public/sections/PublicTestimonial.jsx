export default function PublicTestimonial({ section }) {
  const { variant, content } = section
  const { title, testimonials = [] } = content || {}

  if (testimonials.length === 0) return null

  if (variant === 'single') {
    const t = testimonials[0]
    return (
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-2xl px-6">
          {title && <h2 className="mb-8 text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="mx-auto h-14 w-14 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }} />
          <p className="mt-6 text-xl italic" style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</p>
          <p className="mt-4 font-semibold" style={{ color: 'var(--color-text)' }}>{t.name}</p>
          {t.role && <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>{t.role}</p>}
        </div>
      </section>
    )
  }

  if (variant === 'slider') {
    const t = testimonials[0]
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          {title && <h2 className="mb-8 text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="flex items-center gap-6">
            <span className="text-3xl" style={{ color: 'var(--color-muted-text)' }}>&lsaquo;</span>
            <div className="flex-1">
              <p className="text-xl italic" style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold" style={{ color: 'var(--color-text)' }}>{t.name}</p>
              {t.role && <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>{t.role}</p>}
            </div>
            <span className="text-3xl" style={{ color: 'var(--color-muted-text)' }}>&rsaquo;</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
        {title && <h2 className="mb-10 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 text-center" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-large)' }}>
              <div className="mx-auto h-12 w-12 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }} />
              <p className="mt-4 italic" style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-3 font-semibold" style={{ color: 'var(--color-text)' }}>{t.name}</p>
              {t.role && <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>{t.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
