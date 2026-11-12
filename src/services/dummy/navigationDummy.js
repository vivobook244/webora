import defaultNavigation from '../../data/navigation.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'

const NAV_KEY = 'cms_lite_navigation'

function loadNav() {
  const raw = getStorageItem(NAV_KEY)
  if (!raw) return [...defaultNavigation]
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...defaultNavigation]
  } catch {
    return [...defaultNavigation]
  }
}

function saveNav(items) {
  setStorageItem(NAV_KEY, JSON.stringify(items))
}

export async function getNavigationDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loadNav().sort((a, b) => a.order - b.order)
}

export async function getNavigationItemDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const items = loadNav()
  return items.find((item) => item.id === id) || null
}

export async function createNavigationItemDummy(data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const items = loadNav()
  const siblings = items.filter(
    (item) => item.parentId === (data.parentId || null)
  )
  const maxOrder = siblings.reduce((max, item) => Math.max(max, item.order), 0)
  const newItem = {
    id: `nav_${Date.now()}`,
    label: data.label,
    url: data.url || '',
    type: data.type,
    pageId: data.pageId || null,
    parentId: data.parentId || null,
    order: maxOrder + 1,
    visible: data.visible !== false,
  }
  saveNav([...items, newItem])
  return newItem
}

export async function updateNavigationItemDummy(id, data) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const items = loadNav()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Navigation item not found')
  }
  items[index] = { ...items[index], ...data }
  saveNav(items)
  return items[index]
}

export async function deleteNavigationItemDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const items = loadNav()
  const filtered = items.filter((item) => item.id !== id && item.parentId !== id)
  saveNav(filtered)
  return true
}

export async function reorderNavigationDummy(orderedIds) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const items = loadNav()
  orderedIds.forEach((id, i) => {
    const item = items.find((item) => item.id === id)
    if (item) item.order = i + 1
  })
  saveNav(items)
  return items.sort((a, b) => a.order - b.order)
}

export async function toggleNavigationVisibilityDummy(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const items = loadNav()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Navigation item not found')
  }
  items[index].visible = !items[index].visible
  saveNav(items)
  return items[index]
}
