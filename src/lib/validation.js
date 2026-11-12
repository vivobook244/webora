const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']

export function isSafeUrl(value) {
  if (typeof value !== 'string') return false
  const url = value.trim()
  if (!url || /[\u0000-\u001F\u007F]/.test(url)) return false

  const lower = url.toLowerCase()
  if (DANGEROUS_PROTOCOLS.some((protocol) => lower.startsWith(protocol))) return false
  if (url.startsWith('//')) return false
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) return true
  if (/^(mailto|tel):/i.test(url)) return true

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidHexColor(value) {
  return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)
}

export function isValidSlug(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function isValidCssLength(value) {
  return typeof value === 'string' && /^(\d+(?:\.\d+)?)(px|rem|em|%)$/.test(value)
}
