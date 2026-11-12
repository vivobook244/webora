import defaultPages from '../../data/pages.json'
import defaultSections from '../../data/sections.json'
import defaultNavigation from '../../data/navigation.json'
import defaultTemplates from '../../data/templates.json'
import { SECTION_VARIANT_CONFIG, isValidSectionVariant } from '../../data/sectionVariants'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { isValidSlug } from '../../lib/validation'

const PAGES_KEY = 'cms_lite_pages'
const SECTIONS_KEY = 'cms_lite_sections'
const NAV_KEY = 'cms_lite_navigation'
const ACTIVE_TEMPLATE_KEY = 'cms_lite_active_template'

function readArray(key, fallback) {
  try {
    const value = JSON.parse(getStorageItem(key) || 'null')
    return Array.isArray(value) ? value : JSON.parse(JSON.stringify(fallback))
  } catch {
    return JSON.parse(JSON.stringify(fallback))
  }
}

function loadPages() {
  return readArray(PAGES_KEY, defaultPages)
}

function savePages(pages) {
  setStorageItem(PAGES_KEY, JSON.stringify(pages))
}

function assertPageData(data, pages, excludeId = null) {
  if (!String(data.title || '').trim()) throw new Error('Page title is required')
  if (!isValidSlug(data.slug)) throw new Error('Slug must contain lowercase letters, numbers, and hyphens')
  if (pages.some((page) => page.id !== excludeId && page.slug.toLowerCase() === data.slug.toLowerCase())) {
    throw new Error('Slug is already in use')
  }
  if (data.seo?.title && String(data.seo.title).length > 60) throw new Error('SEO title must be 60 characters or fewer')
  if (data.seo?.description && String(data.seo.description).length > 160) throw new Error('SEO description must be 160 characters or fewer')
  if (data.status && !['DRAFT', 'PUBLISHED'].includes(data.status)) {
    throw new Error('Invalid page status')
  }
}

function validateForPublish(page, pages) {
  assertPageData(page, pages, page.id)
  const sections = readArray(SECTIONS_KEY, defaultSections).filter((section) => section.pageId === page.id)
  const templateId = getStorageItem(ACTIVE_TEMPLATE_KEY)
  const template = defaultTemplates.find((item) => item.id === templateId)
    || defaultTemplates.find((item) => item.status === 'ACTIVE')
  const allowedTypes = new Set((template?.sections || Object.keys(SECTION_VARIANT_CONFIG))
    .filter((type) => !['header', 'footer'].includes(type)))

  if (!sections.some((section) => section.visible !== false)) {
    throw new Error('Add at least one visible section before publishing this page.')
  }

  sections.forEach((section) => {
    if (!SECTION_VARIANT_CONFIG[section.type]) throw new Error(`Unknown section type: ${section.type}`)
    if (!allowedTypes.has(section.type)) throw new Error(`The active template does not support the ${section.type} section.`)
    if (!isValidSectionVariant(section.type, section.variant)) {
      throw new Error(`Section ${section.type} has an invalid variant.`)
    }
  })
}

export async function getPagesDummy() {
  return loadPages()
}

export async function getPageByIdDummy(id) {
  return loadPages().find((page) => page.id === id) || null
}

export async function createPageDummy(data) {
  const pages = loadPages()
  const normalized = {
    ...data,
    title: String(data.title || '').trim(),
    slug: String(data.slug || '').trim(),
  }
  assertPageData(normalized, pages)
  if (normalized.status === 'PUBLISHED') {
    throw new Error('Create the page as a draft, add its sections, then publish it.')
  }
  const now = new Date().toISOString()
  const newPage = {
    id: `page_${crypto.randomUUID?.() || Date.now()}`,
    title: normalized.title,
    slug: normalized.slug,
    status: normalized.status || 'DRAFT',
    isHome: Boolean(normalized.isHome),
    seo: normalized.seo || { title: '', description: '', ogImage: '' },
    createdAt: now,
    updatedAt: now,
  }
  if (newPage.isHome) pages.forEach((page) => { page.isHome = false })
  savePages([...pages, newPage])
  return newPage
}

export async function updatePageDummy(id, data) {
  const pages = loadPages()
  const index = pages.findIndex((page) => page.id === id)
  if (index === -1) throw new Error('Page not found')
  const normalized = {
    ...data,
    title: String(data.title ?? pages[index].title).trim(),
    slug: String(data.slug ?? pages[index].slug).trim(),
  }
  assertPageData(normalized, pages, id)
  if (pages[index].isHome && normalized.status === 'DRAFT' && normalized.isHome !== false) {
    throw new Error('Choose another published homepage before changing this homepage to draft.')
  }
  if (normalized.status === 'PUBLISHED') validateForPublish({ ...pages[index], ...normalized }, pages)
  if (normalized.isHome) pages.forEach((page) => { page.isHome = false })
  pages[index] = { ...pages[index], ...normalized, updatedAt: new Date().toISOString() }
  savePages(pages)
  return pages[index]
}

export async function deletePageDummy(id) {
  const pages = loadPages()
  if (!pages.some((page) => page.id === id)) throw new Error('Page not found')
  const sections = readArray(SECTIONS_KEY, defaultSections).filter((section) => section.pageId !== id)
  const navigationItems = readArray(NAV_KEY, defaultNavigation)
  const removedNavigationIds = new Set(navigationItems.filter((item) => item.pageId === id).map((item) => item.id))
  const navigation = navigationItems.filter((item) => item.pageId !== id && !removedNavigationIds.has(item.parentId))

  setStorageItem(SECTIONS_KEY, JSON.stringify(sections))
  setStorageItem(NAV_KEY, JSON.stringify(navigation))
  savePages(pages.filter((page) => page.id !== id))
  return true
}

export async function publishPageDummy(id) {
  const pages = loadPages()
  const index = pages.findIndex((page) => page.id === id)
  if (index === -1) throw new Error('Page not found')
  validateForPublish(pages[index], pages)
  pages[index] = { ...pages[index], status: 'PUBLISHED', updatedAt: new Date().toISOString() }
  savePages(pages)
  return pages[index]
}

export async function unpublishPageDummy(id) {
  const pages = loadPages()
  const index = pages.findIndex((page) => page.id === id)
  if (index === -1) throw new Error('Page not found')
  if (pages[index].isHome) {
    throw new Error('Choose another published homepage before unpublishing the current homepage.')
  }
  pages[index] = { ...pages[index], status: 'DRAFT', updatedAt: new Date().toISOString() }
  savePages(pages)
  return pages[index]
}

export async function getPreviewPageDummy(id) {
  return getPageByIdDummy(id)
}
