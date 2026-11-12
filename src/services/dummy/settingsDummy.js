import defaultSettings from '../../data/site-settings.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { isSafeUrl } from '../../lib/validation'

const SETTINGS_KEY = 'cms_lite_site_settings'

export async function getSiteSettingsDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const raw = getStorageItem(SETTINGS_KEY)
  if (!raw) {
    return { ...defaultSettings }
  }

  try {
    const stored = JSON.parse(raw)
    return {
      ...defaultSettings,
      ...(stored || {}),
      contact: { ...defaultSettings.contact, ...(stored?.contact || {}) },
      social: { ...defaultSettings.social, ...(stored?.social || {}) },
    }
  } catch {
    return { ...defaultSettings }
  }
}

function validateSettings(settings) {
  if (!String(settings.siteName || '').trim() || settings.siteName.length > 100) {
    throw new Error('Site name is required and must be 100 characters or fewer.')
  }
  if (String(settings.siteDescription || '').length > 300) {
    throw new Error('Site description must be 300 characters or fewer.')
  }
  const email = settings.contact?.email || ''
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Enter a valid contact email address.')
  }
  for (const [name, url] of Object.entries(settings.social || {})) {
    if (url && !isSafeUrl(url)) throw new Error(`Invalid ${name} URL.`)
  }
}

export async function updateSiteSettingsDummy(settings) {
  validateSettings(settings)
  setStorageItem(SETTINGS_KEY, JSON.stringify(settings))
  return { ...settings }
}
