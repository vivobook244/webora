import defaultSections from '../../data/sections.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const SECTIONS_KEY = 'cms_lite_sections'

function loadSections() {
  const raw = getStorageItem(SECTIONS_KEY)
  if (!raw) return [...defaultSections]
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...defaultSections]
  } catch {
    return [...defaultSections]
  }
}

function saveSections(sections) {
  setStorageItem(SECTIONS_KEY, JSON.stringify(sections))
}

export async function getSectionsByPageDummy(pageId) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const sections = loadSections()
  return sections
    .filter((s) => s.pageId === pageId)
    .sort((a, b) => a.order - b.order)
}

export async function getSectionByIdDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const sections = loadSections()
  return sections.find((s) => s.id === id) || null
}

export async function createSectionDummy(data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const sections = loadSections()
  const pageSections = sections.filter((s) => s.pageId === data.pageId)
  const maxOrder = pageSections.reduce((max, s) => Math.max(max, s.order), 0)
  const newSection = {
    id: `section_${Date.now()}`,
    pageId: data.pageId,
    type: data.type,
    variant: data.variant || 'default',
    order: maxOrder + 1,
    visible: true,
    content: data.content || {},
  }
  saveSections([...sections, newSection])
  return newSection
}

export async function updateSectionDummy(id, data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const sections = loadSections()
  const index = sections.findIndex((s) => s.id === id)
  if (index === -1) {
    throw new Error('Section not found')
  }
  sections[index] = { ...sections[index], ...data }
  saveSections(sections)
  return sections[index]
}

export async function deleteSectionDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const sections = loadSections()
  const target = sections.find((s) => s.id === id)
  const filtered = sections.filter((s) => s.id !== id)
  if (target) {
    const pageSections = filtered
      .filter((s) => s.pageId === target.pageId)
      .sort((a, b) => a.order - b.order)
    pageSections.forEach((s, i) => { s.order = i + 1 })
  }
  saveSections(filtered)
  return true
}

export async function duplicateSectionDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const sections = loadSections()
  const original = sections.find((s) => s.id === id)
  if (!original) {
    throw new Error('Section not found')
  }
  const pageSections = sections.filter((s) => s.pageId === original.pageId)
  const originalOrder = original.order
  pageSections.forEach((s) => {
    if (s.order > originalOrder) s.order += 1
  })
  const newSection = {
    ...original,
    id: `section_${Date.now()}`,
    order: originalOrder + 1,
    content: JSON.parse(JSON.stringify(original.content)),
    visible: true,
  }
  saveSections([...sections, newSection])
  return newSection
}

export async function reorderSectionsDummy(pageId, orderedIds) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const sections = loadSections()
  orderedIds.forEach((id, i) => {
    const section = sections.find((s) => s.id === id)
    if (section) section.order = i + 1
  })
  saveSections(sections)
  return sections.filter((s) => s.pageId === pageId).sort((a, b) => a.order - b.order)
}

export async function toggleSectionVisibilityDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const sections = loadSections()
  const index = sections.findIndex((s) => s.id === id)
  if (index === -1) {
    throw new Error('Section not found')
  }
  sections[index].visible = !sections[index].visible
  saveSections(sections)
  return sections[index]
}
