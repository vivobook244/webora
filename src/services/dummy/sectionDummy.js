import defaultSections from '../../data/sections.json'
import defaultTemplates from '../../data/templates.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { isValidSectionVariant, SECTION_VARIANT_CONFIG } from '../../data/sectionVariants'

const SECTIONS_KEY = 'cms_lite_sections'
const ACTIVE_TEMPLATE_KEY = 'cms_lite_active_template'

function loadSections() {
  const raw = getStorageItem(SECTIONS_KEY)
  if (!raw) return JSON.parse(JSON.stringify(defaultSections))
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : JSON.parse(JSON.stringify(defaultSections))
  } catch {
    return JSON.parse(JSON.stringify(defaultSections))
  }
}

function saveSections(sections) {
  setStorageItem(SECTIONS_KEY, JSON.stringify(sections))
}

function validateSection(data) {
  if (!data.pageId) throw new Error('Section must belong to a page.')
  if (!SECTION_VARIANT_CONFIG[data.type]) throw new Error('Unknown section type.')
  if (!isValidSectionVariant(data.type, data.variant)) throw new Error('Invalid variant for this section type.')
  const activeId = getStorageItem(ACTIVE_TEMPLATE_KEY)
  const template = defaultTemplates.find((item) => item.id === activeId)
    || defaultTemplates.find((item) => item.status === 'ACTIVE')
  if (template?.sections && !template.sections.includes(data.type)) {
    throw new Error('The active template does not support this section type.')
  }
}

export async function getSectionsByPageDummy(pageId) {
  return loadSections()
    .filter((section) => section.pageId === pageId)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function getSectionByIdDummy(id) {
  return loadSections().find((section) => section.id === id) || null
}

export async function createSectionDummy(data) {
  validateSection(data)
  const sections = loadSections()
  const pageSections = sections.filter((section) => section.pageId === data.pageId)
  const maxOrder = pageSections.reduce((max, section) => Math.max(max, section.order || 0), 0)
  const created = {
    id: `section_${crypto.randomUUID?.() || Date.now()}`,
    pageId: data.pageId,
    type: data.type,
    variant: data.variant,
    order: maxOrder + 1,
    visible: true,
    content: data.content || {},
  }
  saveSections([...sections, created])
  return created
}

export async function updateSectionDummy(id, data) {
  const sections = loadSections()
  const index = sections.findIndex((section) => section.id === id)
  if (index === -1) throw new Error('Section not found')
  const next = { ...sections[index], ...data }
  validateSection(next)
  sections[index] = next
  saveSections(sections)
  return sections[index]
}

export async function deleteSectionDummy(id) {
  const sections = loadSections()
  const target = sections.find((section) => section.id === id)
  if (!target) throw new Error('Section not found')
  const filtered = sections.filter((section) => section.id !== id)
  const siblings = filtered
    .filter((section) => section.pageId === target.pageId)
    .sort((a, b) => a.order - b.order)
  siblings.forEach((section, index) => { section.order = index + 1 })
  saveSections(filtered)
  return true
}

export async function duplicateSectionDummy(id) {
  const sections = loadSections()
  const original = sections.find((section) => section.id === id)
  if (!original) throw new Error('Section not found')
  const siblings = sections.filter((section) => section.pageId === original.pageId)
  siblings.forEach((section) => {
    if (section.order > original.order) section.order += 1
  })
  const duplicated = {
    ...original,
    id: `section_${crypto.randomUUID?.() || Date.now()}`,
    order: original.order + 1,
    content: JSON.parse(JSON.stringify(original.content || {})),
    visible: true,
  }
  saveSections([...sections, duplicated])
  return duplicated
}

export async function reorderSectionsDummy(pageId, orderedIds) {
  const sections = loadSections()
  const pageIds = new Set(sections.filter((section) => section.pageId === pageId).map((section) => section.id))
  orderedIds.forEach((id, index) => {
    if (!pageIds.has(id)) return
    const section = sections.find((item) => item.id === id)
    if (section) section.order = index + 1
  })
  saveSections(sections)
  return sections.filter((section) => section.pageId === pageId).sort((a, b) => a.order - b.order)
}

export async function toggleSectionVisibilityDummy(id) {
  const sections = loadSections()
  const index = sections.findIndex((section) => section.id === id)
  if (index === -1) throw new Error('Section not found')
  sections[index].visible = !sections[index].visible
  saveSections(sections)
  return sections[index]
}
