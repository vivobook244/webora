import defaultNavigation from '../../data/navigation.json'
import defaultPages from '../../data/pages.json'
import { getStorageItem, setStorageItem } from '../../lib/storage'
import { isSafeUrl } from '../../lib/validation'

const NAV_KEY = 'cms_lite_navigation'

function loadNav() {
  const raw = getStorageItem(NAV_KEY)
  if (!raw) return JSON.parse(JSON.stringify(defaultNavigation))
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : JSON.parse(JSON.stringify(defaultNavigation))
  } catch {
    return JSON.parse(JSON.stringify(defaultNavigation))
  }
}

function loadPages() {
  try {
    const pages = JSON.parse(getStorageItem('cms_lite_pages') || 'null')
    return Array.isArray(pages) ? pages : JSON.parse(JSON.stringify(defaultPages))
  } catch {
    return JSON.parse(JSON.stringify(defaultPages))
  }
}

function saveNav(items) {
  setStorageItem(NAV_KEY, JSON.stringify(items))
}

function validateItem(data, items, excludeId = null) {
  if (!String(data.label || '').trim()) throw new Error('Menu label is required')
  if (!['PAGE', 'CUSTOM_URL'].includes(data.type)) throw new Error('Invalid menu item type')

  if (data.type === 'CUSTOM_URL' && !isSafeUrl(data.url)) {
    throw new Error('Menu URL must be a safe HTTP(S), mailto, tel, or relative URL')
  }
  if (data.type === 'PAGE') {
    if (!data.pageId) throw new Error('Select a page for this menu item')
    if (!loadPages().some((page) => page.id === data.pageId)) throw new Error('The selected page no longer exists')
  }

  if (data.parentId) {
    if (excludeId && items.some((item) => item.parentId === excludeId)) {
      throw new Error('Move or remove child menu items before nesting this menu item.')
    }
    if (data.parentId === excludeId) throw new Error('A menu item cannot be its own parent')
    const parent = items.find((item) => item.id === data.parentId)
    if (!parent || parent.parentId) throw new Error('Menu nesting is limited to two levels')
    const childIds = items.filter((item) => item.parentId === excludeId).map((item) => item.id)
    if (childIds.includes(data.parentId)) throw new Error('A menu item cannot be moved below its own child')
  }
}

export async function getNavigationDummy() {
  return loadNav().sort((a, b) => a.order - b.order)
}

export async function getNavigationItemDummy(id) {
  return loadNav().find((item) => item.id === id) || null
}

export async function createNavigationItemDummy(data) {
  const items = loadNav()
  validateItem(data, items)
  const siblings = items.filter((item) => (item.parentId || null) === (data.parentId || null))
  const maxOrder = siblings.reduce((max, item) => Math.max(max, item.order || 0), 0)
  const newItem = {
    id: `nav_${crypto.randomUUID?.() || Date.now()}`,
    label: String(data.label).trim().slice(0, 80),
    url: data.type === 'CUSTOM_URL' ? data.url.trim() : '',
    type: data.type,
    pageId: data.type === 'PAGE' ? data.pageId : null,
    parentId: data.parentId || null,
    order: maxOrder + 1,
    visible: data.visible !== false,
  }
  saveNav([...items, newItem])
  return newItem
}

export async function updateNavigationItemDummy(id, data) {
  const items = loadNav()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Navigation item not found')
  validateItem(data, items, id)
  items[index] = {
    ...items[index],
    ...data,
    label: String(data.label).trim().slice(0, 80),
    url: data.type === 'CUSTOM_URL' ? data.url.trim() : '',
    pageId: data.type === 'PAGE' ? data.pageId : null,
    parentId: data.parentId || null,
  }
  saveNav(items)
  return items[index]
}

export async function deleteNavigationItemDummy(id) {
  const items = loadNav()
  if (!items.some((item) => item.id === id)) throw new Error('Navigation item not found')
  if (items.some((item) => item.parentId === id)) {
    throw new Error('Remove or reassign child menu items before deleting this item.')
  }
  saveNav(items.filter((item) => item.id !== id))
  return true
}

export async function reorderNavigationDummy(orderedIds) {
  const items = loadNav()
  orderedIds.forEach((id, index) => {
    const item = items.find((entry) => entry.id === id)
    if (item) item.order = index + 1
  })
  saveNav(items)
  return items.sort((a, b) => a.order - b.order)
}

export async function toggleNavigationVisibilityDummy(id) {
  const items = loadNav()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Navigation item not found')
  items[index].visible = !items[index].visible
  saveNav(items)
  return items[index]
}
