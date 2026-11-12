import usersData from '../../data/users.json'
import { getStorageItem, removeStorageItem, setStorageItem } from '../../lib/storage'

const AUTH_KEY = 'cms_lite_auth'
const SESSION_DURATION = 12 * 60 * 60 * 1000

function normalizeSession(value) {
  if (!value || typeof value !== 'object') return null
  if (!value.id || !value.email || value.role !== 'ADMIN') return null
  if (!Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now()) return null
  return {
    id: value.id,
    name: String(value.name || 'Administrator'),
    email: String(value.email),
    role: 'ADMIN',
    expiresAt: value.expiresAt,
  }
}

export async function loginDummy(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const user = usersData.find(
    (item) => String(item.email).toLowerCase() === normalizedEmail && item.password === password
  )

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Invalid email or password')
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION,
  }

  setStorageItem(AUTH_KEY, JSON.stringify(session))
  return normalizeSession(session)
}

export async function logoutDummy() {
  await new Promise((resolve) => setTimeout(resolve, 150))
  removeStorageItem(AUTH_KEY)
}

export async function getCurrentUserDummy() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const raw = getStorageItem(AUTH_KEY)
  if (!raw) return null

  try {
    const session = normalizeSession(JSON.parse(raw))
    if (!session) removeStorageItem(AUTH_KEY)
    return session
  } catch {
    removeStorageItem(AUTH_KEY)
    return null
  }
}
