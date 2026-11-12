import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout'
import PageRenderer from '../../components/public/PageRenderer'
import PublicLoading from '../../components/public/PublicLoading'
import { useSeoMeta } from '../../lib/useSeoMeta'
import { getSiteSettingsDummy } from '../../services/dummy/settingsDummy'
import { getPreviewPageDummy, getPagesDummy } from '../../services/dummy/pageDummy'
import { getSectionsByPageDummy } from '../../services/dummy/sectionDummy'
import { getNavigationDummy } from '../../services/dummy/navigationDummy'
import { getAppearanceDummy } from '../../services/dummy/appearanceDummy'
import { getMediaDummy } from '../../services/dummy/mediaDummy'
import { getActiveTemplateDummy } from '../../services/dummy/templateDummy'
import { isValidSlug } from '../../lib/validation'
import { getValidVariantId, getSectionVariants } from '../../data/sectionVariants'

export default function PagePreview() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [navItems, setNavItems] = useState([])
  const [pages, setPages] = useState([])
  const [appearance, setAppearance] = useState(null)
  const [mediaList, setMediaList] = useState([])
  const [template, setTemplate] = useState(null)
  const [page, setPage] = useState(null)
  const [sections, setSections] = useState([])
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [settingsData, navData, pagesData, appearanceData, mediaData, pageData, templateData] = await Promise.all([
          getSiteSettingsDummy(),
          getNavigationDummy(),
          getPagesDummy(),
          getAppearanceDummy(),
          getMediaDummy(),
          getPreviewPageDummy(pageId),
          getActiveTemplateDummy(),
        ])

        if (!active) return

        setSettings(settingsData)
        setNavItems(navData)
        setPages(pagesData)
        setAppearance(appearanceData)
        setMediaList(mediaData)
        setPage(pageData)
        setTemplate(templateData)

        if (pageData) {
          const sectionData = await getSectionsByPageDummy(pageData.id)
          if (!active) return

          const errors = []
          if (!pageData.title?.trim()) errors.push('Page title is missing')
          if (!isValidSlug(pageData.slug)) errors.push('Page slug is invalid')

          if (!sectionData.some((section) => section.visible !== false)) {
            errors.push('Add at least one visible section before publishing')
          }

          sectionData.forEach((s) => {
            const validVariant = getValidVariantId(s.type, s.variant)
            if (!validVariant) {
              errors.push(`Section "${s.type}" has an invalid variant`)
            }
            if (!getSectionVariants(s.type).length) {
              errors.push(`Section type "${s.type}" is not recognized`)
            }
            if (Array.isArray(templateData?.sections) && !templateData.sections.includes(s.type)) {
              errors.push(`The active template does not support the "${s.type}" section`)
            }
          })

          setValidationErrors(errors)
          setSections(sectionData)
        }
      } catch {
        if (active) setPage(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [pageId])

  useSeoMeta({
    title: `Preview: ${page?.title || 'Untitled'}`,
    description: 'Preview mode - not indexed',
    robots: 'noindex,nofollow',
  })

  if (loading || !appearance) {
    return <PublicLoading />
  }

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Page not found</p>
          <Link to="/admin/pages" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
            Back to Pages
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Preview Mode Banner */}
      <div className="sticky top-0 z-[60] flex items-center justify-between bg-warning-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-semibold">PREVIEW MODE</span>
          <span className="text-sm opacity-80">— {page.status === 'DRAFT' ? 'Draft' : 'Published'} page</span>
        </div>
        <button
          onClick={() => navigate(`/admin/pages/${pageId}/sections`)}
          className="rounded-lg bg-white/20 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/30"
        >
          Back to Editor
        </button>
      </div>

      {/* Validation warnings */}
      {validationErrors.length > 0 && (
        <div className="border-b border-error-200 bg-error-50 px-4 py-3">
          <p className="mb-1 text-sm font-semibold text-error-700">Publish validation issues:</p>
          <ul className="list-inside list-disc text-sm text-error-600">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <PublicLayout settings={settings} navItems={navItems} pages={pages} appearance={appearance} template={template}>
        <PageRenderer page={page} sections={sections} mediaList={mediaList} template={template} />
      </PublicLayout>
    </div>
  )
}
