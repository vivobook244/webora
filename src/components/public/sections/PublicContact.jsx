export default function PublicContact({ section }) {
  const { variant, content } = section
  const { title, description, email, phone, address } = content || {}

  const info = (
    <div className="space-y-3">
      {email && <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}><span style={{ color: 'var(--color-muted-text)' }}>Email:</span> {email}</p>}
      {phone && <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}><span style={{ color: 'var(--color-muted-text)' }}>Phone:</span> {phone}</p>}
      {address && <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}><span style={{ color: 'var(--color-muted-text)' }}>Address:</span> {address}</p>}
    </div>
  )

  if (variant === 'two-column') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="grid gap-8 lg:grid-cols-2">
            <div>{info}</div>
            <div className="flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-large)', minHeight: '200px' }}>
              <span className="text-sm" style={{ color: 'var(--color-muted-text)' }}>Map placeholder</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'form-info') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <input type="text" disabled placeholder="Your Name" className="w-full px-4 py-3" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderRadius: 'var(--radius-small)' }} />
              <input type="email" disabled placeholder="Your Email" className="w-full px-4 py-3" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderRadius: 'var(--radius-small)' }} />
              <textarea disabled placeholder="Message" rows={4} className="w-full px-4 py-3" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderRadius: 'var(--radius-small)' }} />
              <button disabled className="px-6 py-3 font-medium text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>Send Message</button>
            </div>
            <div>{info}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="mx-auto max-w-2xl px-6">
        {title && <h2 className="mb-4 text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        {description && <p className="mb-6" style={{ color: 'var(--color-muted-text)' }}>{description}</p>}
        {info}
      </div>
    </section>
  )
}
