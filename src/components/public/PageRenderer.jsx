import PublicSectionRenderer from './PublicSectionRenderer'

export default function PageRenderer({ page, sections, mediaList }) {
  if (!page) return null

  const visibleSections = (sections || [])
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  if (visibleSections.length === 0) {
    return (
      <div className="py-20 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <p className="text-lg" style={{ color: 'var(--color-muted-text)' }}>This page has no content yet.</p>
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
