import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { useAuth } from '../lib/useAuth'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import { getPagesDummy } from '../services/dummy/pageDummy'
import { getMediaDummy } from '../services/dummy/mediaDummy'
import { getActiveTemplateDummy } from '../services/dummy/templateDummy'

function StatCard({ label, value, icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState({ pages: 0, published: 0, draft: 0, media: 0 })
  const [activeTemplate, setActiveTemplate] = useState(t("Not configured"))
  const [homepageWarning, setHomepageWarning] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [pages, media, template] = await Promise.all([
          getPagesDummy(),
          getMediaDummy(),
          getActiveTemplateDummy(),
        ])
        if (active) {
          setStats({
            pages: pages.length,
            published: pages.filter((p) => p.status === 'PUBLISHED').length,
            draft: pages.filter((p) => p.status === 'DRAFT').length,
            media: media.length,
          })
          setActiveTemplate(template?.name || t("Not configured"))

          const homepage = pages.find((p) => p.isHome)
          if (homepage && homepage.status === 'DRAFT') {
            setHomepageWarning(`Your homepage "${homepage.title}" is still a draft. Publish it to make your website visible to visitors.`)
          } else if (!homepage) {
            setHomepageWarning(t("No homepage has been set. Go to Pages and set a page as your homepage."))
          } else {
            setHomepageWarning('')
          }
        }
      } catch {
        if (active) {
          setStats({ pages: 0, published: 0, draft: 0, media: 0 })
          setActiveTemplate(t("Not configured"))
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const statItems = [
    {
      label: t("Pages"),
      value: stats.pages,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: t("Published"),
      value: stats.published,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: t("Draft"),
      value: stats.draft,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: t("Media"),
      value: stats.media,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  if (loading) {
    return (
      <div>
        <PageHeader
          title={`Welcome, ${user?.name || 'Administrator'}`}
          subtitle=={t("Here's an overview of your website")}
        />
        <Card className="p-6">
          <LoadingState message=={t("Loading dashboard...")} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name || 'Administrator'}`}
        subtitle=={t("Here's an overview of your website")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {homepageWarning && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-warning-700">{homepageWarning}</p>
        </div>
      )}

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Active Template")}</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {activeTemplate}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  )
}
