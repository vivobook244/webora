import defaultTemplates from '../../data/templates.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const ACTIVE_TEMPLATE_KEY = 'cms_lite_active_template'

export async function getTemplatesDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...defaultTemplates]
}

export async function getTemplateByIdDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const template = defaultTemplates.find((t) => t.id === id)
  return template || null
}

export async function getActiveTemplateDummy() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const stored = getStorageItem(ACTIVE_TEMPLATE_KEY)
  if (stored) {
    const template = defaultTemplates.find((t) => t.id === stored)
    if (template) return template
  }
  const active = defaultTemplates.find((t) => t.status === 'ACTIVE')
  return active || null
}

export async function activateTemplateDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const template = defaultTemplates.find((t) => t.id === id)
  if (!template) {
    throw new Error('Template not found')
  }
  setStorageItem(ACTIVE_TEMPLATE_KEY, id)
  return template
}
