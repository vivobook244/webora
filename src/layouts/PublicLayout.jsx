import PublicHeader from '../components/public/PublicHeader'
import PublicFooter from '../components/public/PublicFooter'
import { getCssVars } from '../components/public/publicUtils'

export default function PublicLayout({ settings, navItems, pages, appearance, template, children }) {
  const cssVars = getCssVars(appearance, template)
  const sections = Array.isArray(template?.sections) ? template.sections : null
  const showHeader = !sections || sections.includes('header')
  const showFooter = !sections || sections.includes('footer')

  return (
    <div
      className="public-site"
      data-template={template?.slug || 'default'}
      style={{
        ...cssVars,
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--font-size-base)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {showHeader && <PublicHeader settings={settings} navItems={navItems} pages={pages} />}
      <div className="flex-1">{children}</div>
      {showFooter && <PublicFooter settings={settings} />}
    </div>
  )
}
