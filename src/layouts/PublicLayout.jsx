import PublicHeader from '../components/public/PublicHeader'
import PublicFooter from '../components/public/PublicFooter'
import { getCssVars } from '../components/public/publicUtils'

export default function PublicLayout({ settings, navItems, pages, appearance, children }) {
  const cssVars = getCssVars(appearance)

  return (
    <div
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
      <PublicHeader settings={settings} navItems={navItems} pages={pages} />
      <div className="flex-1">{children}</div>
      <PublicFooter settings={settings} />
    </div>
  )
}
