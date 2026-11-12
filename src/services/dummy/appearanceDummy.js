import defaultAppearance from '../../data/appearance.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const APPEARANCE_KEY = 'cms_lite_appearance'

function loadAppearance() {
  const raw = getStorageItem(APPEARANCE_KEY)
  if (!raw) return JSON.parse(JSON.stringify(defaultAppearance))
  try {
    const stored = JSON.parse(raw)
    return {
      colors: { ...defaultAppearance.colors, ...(stored?.colors || {}) },
      typography: { ...defaultAppearance.typography, ...(stored?.typography || {}) },
      layout: { ...defaultAppearance.layout, ...(stored?.layout || {}) },
      radius: { ...defaultAppearance.radius, ...(stored?.radius || {}) },
    }
  } catch {
    return JSON.parse(JSON.stringify(defaultAppearance))
  }
}

function saveAppearance(data) {
  setStorageItem(APPEARANCE_KEY, JSON.stringify(data))
}

export async function getAppearanceDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loadAppearance()
}

export async function updateAppearanceDummy(data) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const current = loadAppearance()
  const merged = {
    colors: { ...current.colors, ...data.colors },
    typography: { ...current.typography, ...data.typography },
    layout: { ...current.layout, ...data.layout },
    radius: { ...current.radius, ...data.radius },
  }
  saveAppearance(merged)
  return merged
}

export async function resetAppearanceDummy() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const fresh = JSON.parse(JSON.stringify(defaultAppearance))
  saveAppearance(fresh)
  return fresh
}
