export default function PublicRichText({ section }) {
  const { variant, content } = section
  const { title, content: body } = content || {}

  const widthClass = variant === 'narrow' ? 'max-w-2xl' : variant === 'wide' ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className={`mx-auto px-6 ${widthClass}`}>
        {title && <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        {body && <div className="mt-4 text-base" style={{ color: 'var(--color-text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{body}</div>}
      </div>
    </section>
  )
}
