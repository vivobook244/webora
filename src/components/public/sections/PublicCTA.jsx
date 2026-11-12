import { isSafeUrl } from '../../../lib/validation'

export default function PublicCTA({ section }) {
  const { variant, content } = section
  const { title, description, buttonText, buttonUrl } = content || {}
  const safeUrl = isSafeUrl(buttonUrl) ? buttonUrl : '#'

  if (variant === 'split') {
    return (
      <section className="py-12" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="text-center sm:text-left">
            {title && <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
            {description && <p className="mt-2 text-white/80">{description}</p>}
          </div>
          {buttonText && (
            <a href={safeUrl} className="shrink-0 px-6 py-3 font-medium" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>
              {buttonText}
            </a>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="mx-auto max-w-2xl px-6">
        {title && <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        {description && <p className="mt-3 text-white/80">{description}</p>}
        {buttonText && (
          <a href={safeUrl} className="mt-6 inline-block px-6 py-3 font-medium" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
