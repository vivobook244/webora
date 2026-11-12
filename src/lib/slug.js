export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isSlugUnique(slug, pages, excludeId = null) {
  return !pages.some((p) => p.slug === slug && p.id !== excludeId)
}

export function generateUniqueSlug(title, pages, excludeId = null) {
  let base = generateSlug(title) || 'page'
  let slug = base
  let counter = 1
  while (!isSlugUnique(slug, pages, excludeId)) {
    slug = `${base}-${counter}`
    counter++
  }
  return slug
}
