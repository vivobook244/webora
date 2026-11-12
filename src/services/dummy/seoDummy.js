import defaultSeo from '../../data/seo.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const SEO_KEY = 'cms_lite_seo'

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultSeo))
}

function loadSeo() {
  const raw = getStorageItem(SEO_KEY)
  if (!raw) return cloneDefault()
  try {
    const stored = JSON.parse(raw)
    return {
      ...defaultSeo,
      ...(stored && typeof stored === 'object' ? stored : {}),
      keywords: Array.isArray(stored?.keywords)
        ? stored.keywords.filter((keyword) => typeof keyword === 'string')
        : [...(defaultSeo.keywords || [])],
    }
  } catch {
    return cloneDefault()
  }
}

function validateSeo(data) {
  if (!String(data.siteTitle || '').trim() || String(data.siteTitle).length > 60) {
    throw new Error('Site title is required and must be 60 characters or fewer.')
  }
  if (String(data.siteDescription || '').length > 160) {
    throw new Error('Site description must be 160 characters or fewer.')
  }
  if (!['summary', 'summary_large_image'].includes(data.twitterCard)) {
    throw new Error('Invalid Twitter card type.')
  }
  if (!['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'].includes(data.robots)) {
    throw new Error('Invalid search engine indexing setting.')
  }
  if (!Array.isArray(data.keywords) || data.keywords.length > 30) {
    throw new Error('SEO keywords must be a list of up to 30 items.')
  }
}

function saveSeo(data) {
  setStorageItem(SEO_KEY, JSON.stringify(data))
}

export async function getSeoDummy() {
  return loadSeo()
}

export async function updateSeoDummy(data) {
  const merged = {
    ...loadSeo(),
    ...data,
    keywords: [...new Set((Array.isArray(data.keywords) ? data.keywords : [])
      .map((keyword) => String(keyword).trim().slice(0, 40))
      .filter(Boolean))].slice(0, 30),
  }
  validateSeo(merged)
  saveSeo(merged)
  return merged
}

export async function resetSeoDummy() {
  const fresh = cloneDefault()
  saveSeo(fresh)
  return fresh
}
