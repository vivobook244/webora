import usersData from '../../data/users.json'
import { getStorageItem, removeStorageItem, setStorageItem } from '../../lib/storage'

const AUTH_KEY = 'cms_lite_auth'

export async function loginDummy(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = usersData.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  setStorageItem(AUTH_KEY, JSON.stringify(session))
  return session
}

export async function logoutDummy() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  removeStorageItem(AUTH_KEY)
}

export async function getCurrentUserDummy() {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const raw = getStorageItem(AUTH_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
