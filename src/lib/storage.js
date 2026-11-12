export function getStorageItem(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function notifyStorageChange(key) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('webora:storage', { detail: { key } }))
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value)
    notifyStorageChange(key)
    return true
  } catch (error) {
    const message = error?.name === 'QuotaExceededError'
      ? 'Browser storage is full. Remove unused media or data and try again.'
      : 'Browser storage is unavailable. Check your browser privacy settings.'
    throw new Error(message, { cause: error })
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
    notifyStorageChange(key)
    return true
  } catch (error) {
    throw new Error('Unable to update browser storage.', { cause: error })
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
