import { useEffect } from 'react'

export function useSeoMeta({ title, description, ogTitle, ogDescription, ogImage, twitterCard, robots }) {
  useEffect(() => {
    if (title) document.title = title

    const setMetaContent = (name, content, useProperty = false) => {
      if (!content) return
      const attr = useProperty ? 'property' : 'name'
      let el = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMetaContent('description', description)
    setMetaContent('og:title', ogTitle || title, true)
    setMetaContent('og:description', ogDescription || description, true)
    setMetaContent('twitter:card', twitterCard)
    setMetaContent('robots', robots)

    if (ogImage) {
      setMetaContent('og:image', ogImage, true)
    }
  }, [title, description, ogTitle, ogDescription, ogImage, twitterCard, robots])
}
