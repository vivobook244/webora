import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PageRenderer from '../components/public/PageRenderer'
import NotFoundPage from '../components/public/NotFoundPage'
import PublicLoading from '../components/public/PublicLoading'
import { useSeoMeta } from '../lib/useSeoMeta'
import useStorageRevision from '../lib/useStorageRevision'
import { resolveMediaUrl } from '../components/public/publicUtils'
import { getSiteSettingsDummy } from '../services/dummy/settingsDummy'
import { getPagesDummy } from '../services/dummy/pageDummy'
import { getSectionsByPageDummy } from '../services/dummy/sectionDummy'
import { getNavigationDummy } from '../services/dummy/navigationDummy'
import { getAppearanceDummy } from '../services/dummy/appearanceDummy'
import { getMediaDummy } from '../services/dummy/mediaDummy'
import { getSeoDummy } from '../services/dummy/seoDummy'
import { getActiveTemplateDummy } from '../services/dummy/templateDummy'

export default function PublicPage() {
  const { slug } = useParams()
  const storageRevision = useStorageRevision()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [navItems, setNavItems] = useState([])
  const [pages, setPages] = useState([])
  const [appearance, setAppearance] = useState(null)
  const [mediaList, setMediaList] = useState([])
  const [seo, setSeo] = useState(null)
  const [template, setTemplate] = useState(null)
  const [page, setPage] = useState(null)
  const [sections, setSections] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [noHomepage, setNoHomepage] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setNotFound(false)
      setNoHomepage(false)
      try {
        const [settingsData, navData, pagesData, appearanceData, mediaData, seoData, templateData] = await Promise.all([
          getSiteSettingsDummy(),
          getNavigationDummy(),
          getPagesDummy(),
          getAppearanceDummy(),
          getMediaDummy(),
          getSeoDummy(),
          getActiveTemplateDummy(),
        ])

        if (!active) return

        setSettings(settingsData)
        setNavItems(navData)
        setPages(pagesData)
        setAppearance(appearanceData)
        setMediaList(mediaData)
        setSeo(seoData)
        setTemplate(templateData)

        let targetPage = null

        if (!slug) {
          targetPage = pagesData.find((p) => p.isHome)
          if (!targetPage || targetPage.status !== 'PUBLISHED') {
            setNoHomepage(true)
            setPage(null)
            setSections([])
          } else {
            setPage(targetPage)
            const sectionData = await getSectionsByPageDummy(targetPage.id)
            if (!active) return
            setSections(sectionData)
          }
        } else {
          targetPage = pagesData.find((p) => p.slug === slug)
          if (!targetPage || targetPage.status !== 'PUBLISHED') {
            setNotFound(true)
            setPage(null)
            setSections([])
          } else {
            setPage(targetPage)
            const sectionData = await getSectionsByPageDummy(targetPage.id)
            if (!active) return
            setSections(sectionData)
          }
        }
      } catch {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [slug, storageRevision])

  const seoTitle = notFound || noHomepage
    ? (notFound ? 'Page Not Found' : 'Website')
    : page?.seo?.title || page?.title || seo?.siteTitle || settings?.siteName || 'Website'

  const seoDescription = notFound
    ? 'The page you are looking for does not exist.'
    : noHomepage
      ? 'Homepage has not been configured yet.'
      : page?.seo?.description || seo?.siteDescription || ''

  const ogImage = notFound || noHomepage
    ? null
    : resolveMediaUrl(page?.seo?.ogImage || seo?.ogImage, mediaList)

  const publicOgImage = ogImage && !ogImage.startsWith('blob:')
    ? (ogImage.startsWith('/') && typeof window !== 'undefined' ? window.location.origin + ogImage : ogImage)
    : null

  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogImage: publicOgImage,
    twitterCard: notFound || noHomepage ? 'summary' : seo?.twitterCard,
    robots: notFound || noHomepage || page?.status !== 'PUBLISHED' ? 'noindex,nofollow' : seo?.robots,
    keywords: seo?.keywords || [],
    canonicalUrl: typeof window !== 'undefined' ? window.location.origin + (page?.isHome ? '/' : window.location.pathname) : '',
  })

  if (loading || !appearance) {
    return <PublicLoading />
  }

  if (notFound) {
    return (
      <PublicLayout settings={settings} navItems={navItems} pages={pages} appearance={appearance} template={template}>
        <NotFoundPage />
      </PublicLayout>
    )
  }

  if (noHomepage) {
    return (
      <PublicLayout settings={settings} navItems={navItems} pages={pages} appearance={appearance} template={template}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: 'var(--color-surface)' }}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-muted-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            {settings?.siteName || 'Website'}
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--color-muted-text)' }}>
            The homepage hasn&apos;t been configured yet. Please check back soon.
          </p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout settings={settings} navItems={navItems} pages={pages} appearance={appearance} template={template}>
      <PageRenderer page={page} sections={sections} mediaList={mediaList} template={template} />
    </PublicLayout>
  )
}
