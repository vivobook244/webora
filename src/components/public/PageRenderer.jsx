import PublicSectionRenderer from './PublicSectionRenderer'

export default function PageRenderer({ page, sections, mediaList, template }) {
  if (!page) return null

  const allowedTypes = Array.isArray(template?.sections)
    ? new Set(template.sections.filter((type) => !['header', 'footer'].includes(type)))
    : null

  const visibleSections = (sections || [])
    .filter((section) => section.visible !== false)
    .filter((section) => !allowedTypes || allowedTypes.has(section.type))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (visibleSections.length === 0) {
    return (
      <div className="py-20 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <p className="text-lg" style={{ color: 'var(--color-muted-text)' }}>This page has no available content for the active template.</p>
      </div>
    )
  }

  return (
    <main>
      {visibleSections.map((section) => (
        <PublicSectionRenderer key={section.id} section={section} mediaList={mediaList} />
      ))}
    </main>
  )
}
