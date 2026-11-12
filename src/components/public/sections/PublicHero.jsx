import Img from './PublicImg'
import { isSafeUrl } from '../../../lib/validation'

export default function PublicHero({ section, mediaList }) {
  const { variant, content } = section
  const { title, subtitle, buttonText, buttonUrl, image } = content || {}
  const safeUrl = isSafeUrl(buttonUrl) ? buttonUrl : '#'

  if (variant === 'split') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto flex max-w-5xl items-center gap-12 px-6" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="flex-1">
            {title && <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h1>}
            {subtitle && <p className="mt-4 text-lg" style={{ color: 'var(--color-muted-text)' }}>{subtitle}</p>}
            {buttonText && (
              <a href={safeUrl} className="mt-6 inline-block px-6 py-3 font-medium text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>
                {buttonText}
              </a>
            )}
          </div>
          {image && (
            <div className="flex-1">
              <Img src={image} alt={title} mediaList={mediaList} className="w-full rounded-xl object-cover shadow-lg" style={{ borderRadius: 'var(--radius-large)' }} />
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'background') {
    return (
      <section className="relative flex min-h-[400px] items-center justify-center overflow-hidden py-24 text-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
        {image && (
          <Img src={image} alt="" mediaList={mediaList} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          {title && <h1 className="text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h1>}
          {subtitle && <p className="mt-4 text-lg text-gray-200">{subtitle}</p>}
          {buttonText && (
            <a href={safeUrl} className="mt-6 inline-block px-6 py-3 font-medium text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>
              {buttonText}
            </a>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="mx-auto max-w-2xl px-6">
        {title && <h1 className="text-4xl font-bold sm:text-5xl" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h1>}
        {subtitle && <p className="mt-4 text-lg" style={{ color: 'var(--color-muted-text)' }}>{subtitle}</p>}
        {buttonText && (
          <a href={safeUrl} className="mt-6 inline-block px-6 py-3 font-medium text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
