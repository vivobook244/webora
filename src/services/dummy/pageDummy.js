import defaultPages from '../../data/pages.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const PAGES_KEY = 'cms_lite_pages'

function loadPages() {
  const raw = getStorageItem(PAGES_KEY)
  if (!raw) return [...defaultPages]
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...defaultPages]
  } catch {
    return [...defaultPages]
  }
}

function savePages(pages) {
  setStorageItem(PAGES_KEY, JSON.stringify(pages))
}

export async function getPagesDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loadPages()
}

export async function getPageByIdDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const pages = loadPages()
  return pages.find((p) => p.id === id) || null
}

export async function createPageDummy(data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pages = loadPages()
  const now = new Date().toISOString()
  const newPage = {
    id: `page_${Date.now()}`,
    title: data.title,
    slug: data.slug,
    status: data.status || 'DRAFT',
    isHome: data.isHome || false,
    seo: data.seo || { title: '', description: '' },
    createdAt: now,
    updatedAt: now,
  }

  if (newPage.isHome) {
    pages.forEach((p) => { p.isHome = false })
  }

  savePages([...pages, newPage])
  return newPage
}

export async function updatePageDummy(id, data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pages = loadPages()
  const index = pages.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Page not found')
  }

  if (data.isHome) {
    pages.forEach((p) => { p.isHome = false })
  }

  pages[index] = {
    ...pages[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  savePages(pages)
  return pages[index]
}

export async function deletePageDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const pages = loadPages()
  savePages(pages.filter((p) => p.id !== id))
  return true
}

export async function publishPageDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pages = loadPages()
  const index = pages.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Page not found')
  }
  pages[index] = {
    ...pages[index],
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  }
  savePages(pages)
  return pages[index]
}

export async function unpublishPageDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pages = loadPages()
  const index = pages.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Page not found')
  }
  pages[index] = {
    ...pages[index],
    status: 'DRAFT',
    updatedAt: new Date().toISOString(),
  }
  savePages(pages)
  return pages[index]
}

export async function getPreviewPageDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const pages = loadPages()
  return pages.find((p) => p.id === id) || null
}
