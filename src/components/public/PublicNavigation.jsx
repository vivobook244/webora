import { Link } from 'react-router-dom'
import { isSafeUrl } from '../../lib/validation'

export default function PublicNavigation({ items, pages }) {
  const visibleItems = (items || [])
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)

  const pageList = pages || []
  const topLevel = visibleItems.filter((item) => !item.parentId)
  const childrenOf = (parentId) => visibleItems.filter((item) => item.parentId === parentId)

  const getItemUrl = (item) => {
    if (item.type === 'CUSTOM_URL') {
      return isSafeUrl(item.url) ? item.url : null
    }
    if (item.type === 'PAGE' && item.pageId) {
      const page = pageList.find((p) => p.id === item.pageId)
      if (page && page.status === 'PUBLISHED') {
        return page.isHome ? '/' : `/${page.slug}`
      }
    }
    return null
  }

  const isItemValid = (item) => {
    if (item.type === 'CUSTOM_URL') return !!item.url
    if (item.type === 'PAGE' && item.pageId) {
      const page = pageList.find((p) => p.id === item.pageId)
      return page && page.status === 'PUBLISHED'
    }
    return false
  }

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {topLevel.map((item) => {
          if (!isItemValid(item)) return null
          const url = getItemUrl(item)
          if (!url) return null
          const children = childrenOf(item.id).filter(isItemValid)

          return (
            <li key={item.id} className="group relative">
              {item.type === 'PAGE' ? (
                <Link to={url} className="block px-4 py-2 text-sm font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                  {item.label}
                </Link>
              ) : (
                <a href={url} className="block px-4 py-2 text-sm font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                  {item.label}
                </a>
              )}
              {children.length > 0 && (
                <ul className="absolute left-0 top-full z-50 hidden min-w-[180px] py-2 shadow-lg group-hover:block" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-small)' }}>
                  {children.map((child) => {
                    const childUrl = getItemUrl(child)
                    if (!childUrl) return null
                    return (
                      <li key={child.id}>
                        {child.type === 'PAGE' ? (
                          <Link to={childUrl} className="block px-4 py-2 text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                            {child.label}
                          </Link>
                        ) : (
                          <a href={childUrl} className="block px-4 py-2 text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
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
    </nav>
  )
}
