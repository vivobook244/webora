import defaultSettings from '../../data/site-settings.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

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

export async function updateSiteSettingsDummy(settings) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  setStorageItem(SETTINGS_KEY, JSON.stringify(settings))
  return { ...settings }
}
