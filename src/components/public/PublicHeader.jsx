import { useState } from 'react'
import { Link } from 'react-router-dom'
import PublicNavigation from './PublicNavigation'
import { isSafeUrl } from '../../lib/validation'

export default function PublicHeader({ settings, navItems, pages }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleItems = (navItems || [])
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)

  const topLevel = visibleItems.filter((item) => !item.parentId)
  const childrenOf = (parentId) => visibleItems.filter((item) => item.parentId === parentId)

  const getItemUrl = (item) => {
    if (item.type === 'CUSTOM_URL') return isSafeUrl(item.url) ? item.url : null
    if (item.type === 'PAGE' && item.pageId) {
      const page = pages.find((p) => p.id === item.pageId)
      if (page && page.status === 'PUBLISHED') {
        return page.isHome ? '/' : `/${page.slug}`
      }
    }
    return null
  }

  const isItemValid = (item) => {
    if (item.type === 'CUSTOM_URL') return !!item.url
    if (item.type === 'PAGE' && item.pageId) {
      const page = pages.find((p) => p.id === item.pageId)
      return page && page.status === 'PUBLISHED'
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'color-mix(in srgb, var(--color-muted-text) 20%, transparent)' }}>
      <div className="mx-auto flex h-16 items-center justify-between px-6" style={{ maxWidth: 'var(--container-width)' }}>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            {settings?.siteName || 'Website'}
          </span>
        </Link>

        <PublicNavigation items={navItems} pages={pages} />

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'var(--color-text)' }}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t lg:hidden" style={{ backgroundColor: 'var(--color-background)', borderColor: 'color-mix(in srgb, var(--color-muted-text) 20%, transparent)' }}>
          <ul className="space-y-1 px-6 py-4">
            {topLevel.map((item) => {
              if (!isItemValid(item)) return null
              const url = getItemUrl(item)
              if (!url) return null
              const children = childrenOf(item.id).filter(isItemValid)
              return (
                <li key={item.id}>
                  {item.type === 'PAGE' ? (
                    <Link to={url} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={url} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </a>
                  )}
                  {children.length > 0 && (
                    <ul className="ml-4 space-y-1">
                      {children.map((child) => {
                        const childUrl = getItemUrl(child)
                        if (!childUrl) return null
                        return (
                          <li key={child.id}>
                            {child.type === 'PAGE' ? (
                              <Link to={childUrl} onClick={() => setMobileOpen(false)} className="block py-2 text-sm" style={{ color: 'var(--color-muted-text)' }}>
                                {child.label}
                              </Link>
                            ) : (
                              <a href={childUrl} onClick={() => setMobileOpen(false)} className="block py-2 text-sm" style={{ color: 'var(--color-muted-text)' }}>
                                {child.label}
                              </a>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
