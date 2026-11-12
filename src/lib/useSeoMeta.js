import { useEffect } from 'react'

export function useSeoMeta({
  title,
  description,
  keywords = [],
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  robots,
  canonicalUrl,
}) {
  useEffect(() => {
    if (title) document.title = title

    const updateMeta = (attribute, key, value) => {
      const selector = `meta[${attribute}="${key}"]`
      let element = document.head.querySelector(selector)
      if (!value) {
        element?.remove()
        return
      }
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', String(value))
    }

    updateMeta('name', 'description', description)
    updateMeta('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords)
    updateMeta('name', 'robots', robots || 'index,follow')
    updateMeta('name', 'twitter:card', twitterCard || 'summary')
    updateMeta('name', 'twitter:title', ogTitle || title)
    updateMeta('name', 'twitter:description', ogDescription || description)
    updateMeta('name', 'twitter:image', ogImage)
    updateMeta('property', 'og:title', ogTitle || title)
    updateMeta('property', 'og:description', ogDescription || description)
    updateMeta('property', 'og:image', ogImage)
    updateMeta('property', 'og:type', 'website')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = canonicalUrl
    } else {
      canonical?.remove()
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, robots, canonicalUrl])
}
