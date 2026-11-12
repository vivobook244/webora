import { isSafeUrl } from '../../lib/validation'

export function getCssVars(appearance) {
  const colors = appearance?.colors || {}
  const typography = appearance?.typography || {}
  const layout = appearance?.layout || {}
  const radius = appearance?.radius || {}

  return {
    '--color-primary': colors.primary || '#2563EB',
    '--color-secondary': colors.secondary || '#0F172A',
    '--color-background': colors.background || '#FFFFFF',
    '--color-surface': colors.surface || '#F8FAFC',
    '--color-text': colors.text || '#0F172A',
    '--color-muted-text': colors.mutedText || '#64748B',
    '--container-width': layout.containerWidth || '1200px',
    '--section-spacing': layout.sectionSpacing || '80px',
    '--content-spacing': layout.contentSpacing || '24px',
    '--radius-small': radius.small || '6px',
    '--radius-medium': radius.medium || '10px',
    '--radius-large': radius.large || '16px',
    '--font-heading': typography.headingFont || 'Inter',
    '--font-body': typography.bodyFont || 'Inter',
    '--font-size-base': typography.baseSize || '16px',
  }
}

export function resolveMediaUrl(value, mediaList) {
  if (!value || typeof value !== 'string') return null
  const media = mediaList?.find((item) => item.id === value)
  if (media) {
    const mediaUrl = media.url
    if (typeof mediaUrl !== 'string') return null
    if (media.storageId && mediaUrl.startsWith('blob:')) return mediaUrl
    if (isSafeUrl(mediaUrl) && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://') || (mediaUrl.startsWith('/') && !mediaUrl.startsWith('//')))) return mediaUrl
    return null
  }
  if (!isSafeUrl(value)) return null
  if (/^https?:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//'))) return value
  return null
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
