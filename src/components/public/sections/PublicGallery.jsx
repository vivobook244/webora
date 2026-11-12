import Img from './PublicImg'

export default function PublicGallery({ section, mediaList }) {
  const { variant, content } = section
  const { title, images = [] } = content || {}

  if (images.length === 0) return null

  if (variant === 'featured') {
    const [first, ...rest] = images
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="grid gap-4 lg:grid-cols-2">
            <Img src={first?.url} alt={title} mediaList={mediaList} className="h-80 w-full object-cover" style={{ borderRadius: 'var(--radius-large)' }} />
            <div className="grid grid-cols-2 gap-4">
              {rest.slice(0, 4).map((img, i) => (
                <Img key={i} src={img.url} alt="" mediaList={mediaList} className="h-36 w-full object-cover" style={{ borderRadius: 'var(--radius-medium)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'masonry') {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
          {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {images.map((img, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <Img src={img.url} alt="" mediaList={mediaList} className={`w-full object-cover ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-48' : 'h-56'}`} style={{ borderRadius: 'var(--radius-medium)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
        {title && <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{title}</h2>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <Img key={i} src={img.url} alt="" mediaList={mediaList} className="h-48 w-full object-cover" style={{ borderRadius: 'var(--radius-medium)' }} />
          ))}
        </div>
      </div>
    </section>
  )
}
