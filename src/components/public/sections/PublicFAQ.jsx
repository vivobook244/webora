import { useState } from 'react'

export default function PublicFAQ({ section }) {
  const { variant, content } = section
  const { title, items = [] } = content || {}
  const [openIndex, setOpenIndex] = useState(null)

  if (items.length === 0) return null

  if (variant === 'two-column') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item, i) => (
              <div key={i} className="p-5" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-medium)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{item.question}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-text)', lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'simple-list') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-3xl px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="border-b pb-4" style={{ borderColor: 'var(--color-muted-text)', opacity: 0.3 }}>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{item.question}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-text)', lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-3xl px-6" style={{ maxWidth: 'var(--container-width)' }}>
        {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="overflow-hidden" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-medium)' }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                style={{ color: 'var(--color-text)' }}
              >
                <span className="font-medium">{item.question}</span>
                <span className="text-xl" style={{ color: 'var(--color-muted-text)' }}>{openIndex === i ? '\u2212' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-sm" style={{ color: 'var(--color-muted-text)', lineHeight: 1.6 }}>{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
