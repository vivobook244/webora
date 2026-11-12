export default function PublicServices({ section }) {
  const { variant, content } = section
  const { title, description, services = [] } = content || {}

  const cols = variant === 'four-cards' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'

  if (variant === 'icon-list') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-4xl px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          {description && <p className="mt-3 text-center text-base" style={{ color: 'var(--color-muted-text)' }}>{description}</p>}
          <div className="mt-8 space-y-4">
            {services.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-medium)' }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-small)' }}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
                  {s.description && <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-text)' }}>{s.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
        {title && <h2 className="text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        {description && <p className="mt-3 text-center text-base" style={{ color: 'var(--color-muted-text)' }}>{description}</p>}
        {services.length > 0 && (
          <div className={`mt-10 grid gap-6 ${cols}`}>
            {services.map((s, i) => (
              <div key={i} className="p-6 text-center" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-medium)' }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-small)' }}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
                {s.description && <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-text)' }}>{s.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
