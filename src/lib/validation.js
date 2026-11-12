const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']

export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false
  const lower = trimmed.toLowerCase()
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lower.startsWith(protocol)) return false
  }
  if (lower.startsWith('http://') || lower.startsWith('https://')) return true
  if (lower.startsWith('/')) return true
  if (lower.startsWith('./') || lower.startsWith('../')) return true
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !lower.startsWith('mailto:') && !lower.startsWith('tel:')) {
    return false
  }
  return true
}
