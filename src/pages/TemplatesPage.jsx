import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import PageRenderer from '../components/public/PageRenderer'
import PublicLayout from '../layouts/PublicLayout'
import {
  getTemplatesDummy,
  getActiveTemplateDummy,
  activateTemplateDummy,
} from '../services/dummy/templateDummy'
import { getPagesDummy } from '../services/dummy/pageDummy'
import { getSectionsByPageDummy } from '../services/dummy/sectionDummy'
import { getSiteSettingsDummy } from '../services/dummy/settingsDummy'
import { getNavigationDummy } from '../services/dummy/navigationDummy'
import { getAppearanceDummy } from '../services/dummy/appearanceDummy'
import { getMediaDummy } from '../services/dummy/mediaDummy'

function TemplateIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}

function TemplatePreview({ template, previewData, compact = false }) {
  const { t } = useLanguage()
  if (!previewData) {
    return (
      <div className="flex min-h-48 items-center justify-center bg-gray-50 p-6 text-sm text-gray-500">
        {t("Website preview is unavailable.")}
      </div>
    )
  }

  const website = (
    <PublicLayout
      settings={previewData.settings}
      navItems={previewData.navItems}
      pages={previewData.pages}
      appearance={{
        ...previewData.appearance,
        colors: { ...previewData.appearance.colors, ...(template.theme?.colors || {}) },
        typography: { ...previewData.appearance.typography, ...(template.theme?.typography || {}) },
        layout: { ...previewData.appearance.layout, ...(template.theme?.layout || {}) },
        radius: { ...previewData.appearance.radius, ...(template.theme?.radius || {}) },
      }}
      template={template}
    >
      <PageRenderer
        page={previewData.page}
        sections={previewData.sections}
        mediaList={previewData.mediaList}
        template={template}
      />
    </PublicLayout>
  )

  if (compact) {
    return (
      <div className="h-[280px] overflow-hidden bg-white">
        <div
          className="pointer-events-none"
          style={{
            width: '138.89%',
            transform: 'scale(0.72)',
            transformOrigin: 'top left',
          }}
        >
          {website}
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-white">
      {website}
    </div>
  )
}

export default function TemplatesPage() {
  const { t } = useLanguage()
  const [templates, setTemplates] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [error, setError] = useState('')
  const [previewError, setPreviewError] = useState('')

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const [list, activeTemplate] = await Promise.all([
          getTemplatesDummy(),
          getActiveTemplateDummy(),
        ])

        if (!active) return
        setTemplates(list)
        setActiveId(activeTemplate?.id || null)

        try {
          const [pages, settings, navItems, appearance, mediaList] = await Promise.all([
            getPagesDummy(),
            getSiteSettingsDummy(),
            getNavigationDummy(),
            getAppearanceDummy(),
            getMediaDummy(),
          ])
          const page = pages.find((item) => item.isHome)
            || pages.find((item) => item.status === 'PUBLISHED')
            || pages[0]
            || null
          const sections = page ? await getSectionsByPageDummy(page.id) : []

          if (active) {
            setPreviewData({
              page,
              pages,
              sections,
              settings,
              navItems,
              appearance,
              mediaList,
            })
          }
        } catch {
          if (active) setPreviewError(t("Website preview data could not be loaded."))
        }
      } catch {
        if (active) setError(t("Failed to load templates"))
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => { active = false }
  }, [])

  const handleActivate = async (id) => {
    setActivating(id)
    setError('')
    try {
      await activateTemplateDummy(id)
      setActiveId(id)
    } catch (err) {
      setError(err.message || 'Failed to activate template')
    } finally {
      setActivating(null)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title={t("Templates")} subtitle={t("Choose your website template")} />
        <Card className="p-6">
          <LoadingState message={t("Loading templates...")} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Templates" subtitle={t("Choose your website template")} />

      {error && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {previewError && (
        <div className="mb-4 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700">
          {previewError}
        </div>
      )}

      {templates.length === 0 ? (
        <Card className="p-6">
          <EmptyState title={t("No templates")} message={t("Templates will appear here")} icon={TemplateIcon} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {templates.map((template) => {
            const isActive = template.id === activeId
            return (
              <Card key={template.id} className="overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <TemplatePreview template={template} previewData={previewData} compact />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {isActive ? (
                      <StatusBadge status="ACTIVE" />
                    ) : (
                      <StatusBadge status="INACTIVE" />
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">{template.description}</p>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {t("Available Sections")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {template.sections.map((section) => (
                        <span
                          key={section}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setPreviewTemplate(template)}
                      disabled={!previewData}
                    >
                      {t("Preview")}
                    </Button>
                    <Button
                      onClick={() => handleActivate(template.id)}
                      loading={activating === template.id}
                      disabled={isActive}
                    >
                      {isActive ? t("Activated") : t("Activate")}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={t("Template Preview")}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setPreviewTemplate(null)}>
            {t("Close")}
          </Button>
        }
      >
        {previewTemplate && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              {previewTemplate.id === activeId && <StatusBadge status="ACTIVE" />}
            </div>
            <TemplatePreview template={previewTemplate} previewData={previewData} />
          </div>
        )}
      </Modal>
    </div>
  )
}
