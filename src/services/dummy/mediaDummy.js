import defaultMedia from '../../data/media.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { getMediaBlob, putMediaBlob, deleteMediaBlob } from '../../lib/mediaStore'

const MEDIA_KEY = 'cms_lite_media'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']
const objectUrls = new Map()

function loadMedia() {
  const raw = getStorageItem(MEDIA_KEY)
  if (!raw) return [...defaultMedia]
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...defaultMedia]
  } catch {
    return [...defaultMedia]
  }
}

function saveMedia(media) {
  setStorageItem(MEDIA_KEY, JSON.stringify(media))
}

async function hydrateMedia(item) {
  if (!item.storageId) {
    return { ...item, url: item.url?.startsWith('blob:') ? null : item.url || null }
  }

  if (!objectUrls.has(item.storageId)) {
    const blob = await getMediaBlob(item.storageId)
    if (blob) objectUrls.set(item.storageId, URL.createObjectURL(blob))
  }

  return { ...item, url: objectUrls.get(item.storageId) || null }
}

function safeParse(key, fallback) {
  try {
    const parsed = JSON.parse(getStorageItem(key) || 'null')
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function containsReference(value, id) {
  if (value === id) return true
  if (!value || typeof value !== 'object') return false
  return Object.values(value).some((item) => containsReference(item, id))
}

export async function getMediaDummy() {
  return Promise.all(loadMedia().map(hydrateMedia))
}

export async function getMediaByIdDummy(id) {
  const item = loadMedia().find((media) => media.id === id)
  return item ? hydrateMedia(item) : null
}

export async function uploadMediaDummy(file) {
  if (!(file instanceof Blob) || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Use a PNG, JPG, GIF, WebP, or AVIF image file')
  }
  if (file.size > MAX_FILE_SIZE) throw new Error('File size exceeds 5 MB limit')

  const id = `media_${crypto.randomUUID?.() || Date.now()}`
  await putMediaBlob(id, file)
  const url = URL.createObjectURL(file)
  const newMedia = {
    id,
    storageId: id,
    name: String(file.name || 'image').slice(0, 180),
    url,
    type: 'image',
    mimeType: file.type,
    size: file.size,
    alt: '',
    createdAt: new Date().toISOString(),
  }

  try {
    const storedMedia = { ...newMedia }
    delete storedMedia.url
    saveMedia([storedMedia, ...loadMedia()])
    objectUrls.set(id, url)
    return newMedia
  } catch (error) {
    await deleteMediaBlob(id)
    URL.revokeObjectURL(url)
    throw error
  }
}

export async function updateMediaDummy(id, data) {
  const media = loadMedia()
  const index = media.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Media not found')

  const name = data.name === undefined ? media[index].name : String(data.name).trim()
  if (!name) throw new Error('File name is required')
  media[index] = {
    ...media[index],
    name: name.slice(0, 180),
    alt: data.alt === undefined ? media[index].alt : String(data.alt).trim().slice(0, 300),
  }
  saveMedia(media)
  return hydrateMedia(media[index])
}

export async function deleteMediaDummy(id) {
  const sections = safeParse('cms_lite_sections', [])
  const pages = safeParse('cms_lite_pages', [])
  const seo = safeParse('cms_lite_seo', {})
  if (containsReference(sections, id) || containsReference(pages, id) || containsReference(seo, id)) {
    throw new Error('This image is currently used by a page or section. Replace its usage before deleting it.')
  }

  const media = loadMedia()
  const target = media.find((item) => item.id === id)
  if (!target) throw new Error('Media not found')
  saveMedia(media.filter((item) => item.id !== id))

  if (target.storageId) {
    await deleteMediaBlob(target.storageId)
    const objectUrl = objectUrls.get(target.storageId)
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrls.delete(target.storageId)
  }
  return true
}
