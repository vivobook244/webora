import Img from './PublicImg'

export default function PublicImageText({ section, mediaList }) {
  const { variant, content } = section
  const { title, description, image } = content || {}

  const textBlock = (
    <div className="flex-1">
      {title && <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
      {description && <p className="mt-4 text-base" style={{ color: 'var(--color-muted-text)', lineHeight: 1.7 }}>{description}</p>}
    </div>
  )

  const imageBlock = image && (
    <div className="flex-1">
      <Img src={image} alt={title} mediaList={mediaList} className="w-full object-cover shadow-lg" style={{ borderRadius: 'var(--radius-large)' }} />
    </div>
  )

  if (variant === 'image-right') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto flex max-w-5xl items-center gap-12 px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {textBlock}
          {imageBlock}
        </div>
      </section>
    )
  }

  if (variant === 'stacked') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto max-w-3xl px-6 text-center" style={{ maxWidth: 'var(--container-width)' }}>
          {imageBlock && <div className="mb-8">{imageBlock}</div>}
          {textBlock}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="mx-auto flex max-w-5xl items-center gap-12 px-6" style={{ maxWidth: 'var(--container-width)' }}>
        {imageBlock}
        {textBlock}
      </div>
    </section>
  )
}
