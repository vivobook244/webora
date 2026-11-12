import { useState } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { Outlet } from 'react-router-dom'
import Sidebar, { MenuIcon } from '../components/Sidebar'
import { useAuth } from '../lib/useAuth'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1" aria-label="Language">
      <button type="button" onClick={() => setLanguage('id')} aria-pressed={language === 'id'} className={language === 'id' ? 'rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-sm' : 'rounded-md px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800'}>ID</button>
      <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={language === 'en' ? 'rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-sm' : 'rounded-md px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800'}>EN</button>
    </div>
  )
}

export default function AdminLayout() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
