import defaultAppearance from '../../data/appearance.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { isValidCssLength, isValidHexColor } from '../../lib/validation'

const APPEARANCE_KEY = 'cms_lite_appearance'
const FONT_OPTIONS = ['Inter', 'system-ui', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New']

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultAppearance))
}

function loadAppearance() {
  const raw = getStorageItem(APPEARANCE_KEY)
  if (!raw) return cloneDefault()
  try {
    const stored = JSON.parse(raw)
    const merged = {
      colors: { ...defaultAppearance.colors, ...(stored?.colors || {}) },
      typography: { ...defaultAppearance.typography, ...(stored?.typography || {}) },
      layout: { ...defaultAppearance.layout, ...(stored?.layout || {}) },
      radius: { ...defaultAppearance.radius, ...(stored?.radius || {}) },
    }
    validateAppearance(merged)
    return merged
  } catch {
    return cloneDefault()
  }
}

function validateAppearance(value) {
  if (!Object.values(value.colors).every(isValidHexColor)) {
    throw new Error('Appearance contains an invalid color value.')
  }
  if (!FONT_OPTIONS.includes(value.typography.headingFont) || !FONT_OPTIONS.includes(value.typography.bodyFont)) {
    throw new Error('Choose a font from the available font list.')
  }
  if (!['14px', '16px', '18px'].includes(value.typography.baseSize)) {
    throw new Error('Invalid base font size.')
  }
  const layoutValues = ['containerWidth', 'sectionSpacing', 'contentSpacing']
  if (!layoutValues.every((key) => isValidCssLength(value.layout[key]))) {
    throw new Error('Invalid layout dimension.')
  }
  if (!Object.values(value.radius).every(isValidCssLength)) {
    throw new Error('Invalid border radius value.')
  }
}

function saveAppearance(data) {
  setStorageItem(APPEARANCE_KEY, JSON.stringify(data))
}

export async function getAppearanceDummy() {
  return loadAppearance()
}

export async function updateAppearanceDummy(data) {
  const current = loadAppearance()
  const merged = {
    colors: { ...current.colors, ...data.colors },
    typography: { ...current.typography, ...data.typography },
    layout: { ...current.layout, ...data.layout },
    radius: { ...current.radius, ...data.radius },
  }
  validateAppearance(merged)
  saveAppearance(merged)
  return merged
}

export async function resetAppearanceDummy() {
  const fresh = cloneDefault()
  saveAppearance(fresh)
  return fresh
}
