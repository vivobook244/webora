import defaultSeo from '../../data/seo.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const SEO_KEY = 'cms_lite_seo'

function loadSeo() {
  const raw = getStorageItem(SEO_KEY)
  if (!raw) return JSON.parse(JSON.stringify(defaultSeo))
  try {
    const stored = JSON.parse(raw)
    return { ...defaultSeo, ...(stored || {}) }
  } catch {
    return JSON.parse(JSON.stringify(defaultSeo))
  }
}

function saveSeo(data) {
  setStorageItem(SEO_KEY, JSON.stringify(data))
}

export async function getSeoDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loadSeo()
}

export async function updateSeoDummy(data) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const current = loadSeo()
  const merged = { ...current, ...data }
  saveSeo(merged)
  return merged
}

export async function resetSeoDummy() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const fresh = JSON.parse(JSON.stringify(defaultSeo))
  saveSeo(fresh)
  return fresh
}
