import defaultMedia from '../../data/media.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const MEDIA_KEY = 'cms_lite_media'

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

export async function getMediaDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loadMedia()
}

export async function getMediaByIdDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const media = loadMedia()
  return media.find((m) => m.id === id) || null
}

export async function uploadMediaDummy(file) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5 MB limit')
  }

  const media = loadMedia()
  const url = URL.createObjectURL(file)
  const id = `media_${Date.now()}`
  const newMedia = {
    id,
    name: file.name,
    url,
    type: 'image',
    mimeType: file.type,
    size: file.size,
    alt: '',
    createdAt: new Date().toISOString(),
  }

  saveMedia([newMedia, ...media])
  return newMedia
}

export async function updateMediaDummy(id, data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const media = loadMedia()
  const index = media.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error('Media not found')
  }
  media[index] = { ...media[index], ...data }
  saveMedia(media)
  return media[index]
}

export async function deleteMediaDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const media = loadMedia()
  const filtered = media.filter((m) => m.id !== id)
  saveMedia(filtered)
  return true
}
