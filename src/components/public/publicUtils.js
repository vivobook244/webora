export function getCssVars(appearance) {
  if (!appearance) return {}
  const { colors, typography, layout, radius } = appearance
  return {
    '--color-primary': colors?.primary || '#2563EB',
    '--color-secondary': colors?.secondary || '#0F172A',
    '--color-background': colors?.background || '#FFFFFF',
    '--color-surface': colors?.surface || '#F8FAFC',
    '--color-text': colors?.text || '#0F172A',
    '--color-muted-text': colors?.mutedText || '#64748B',
    '--container-width': layout?.containerWidth || '1200px',
    '--section-spacing': layout?.sectionSpacing || '80px',
    '--content-spacing': layout?.contentSpacing || '24px',
    '--radius-small': radius?.small || '6px',
    '--radius-medium': radius?.medium || '10px',
    '--radius-large': radius?.large || '16px',
    '--font-heading': typography?.headingFont || 'Inter',
    '--font-body': typography?.bodyFont || 'Inter',
    '--font-size-base': typography?.baseSize || '16px',
  }
}

export function resolveMediaUrl(url, mediaList) {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  const media = mediaList?.find((m) => m.id === url)
  return media?.url || null
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
