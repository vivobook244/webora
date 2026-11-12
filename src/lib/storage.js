export function getStorageItem(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // fail silently
  }
}

export function parseStorageItem(key, fallback) {
  const raw = getStorageItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}
