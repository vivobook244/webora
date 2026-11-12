export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'cta', label: 'CTA' },
  { value: 'contact', label: 'Contact' },
  { value: 'richtext', label: 'Rich Text' },
  { value: 'imagetext', label: 'Image + Text' },
  { value: 'faq', label: 'FAQ' },
]

export function getDefaultContent(type) {
  const defaults = {
    hero: { title: '', subtitle: '', buttonText: '', buttonUrl: '', image: '' },
    about: { title: '', description: '', image: '' },
    services: { title: '', description: '', services: [] },
    gallery: { title: '', images: [] },
    testimonial: { title: '', testimonials: [] },
    cta: { title: '', description: '', buttonText: '', buttonUrl: '' },
    contact: { title: '', description: '', email: '', phone: '', address: '' },
    richtext: { title: '', content: '' },
    imagetext: { title: '', description: '', image: '', imagePosition: 'left' },
    faq: { title: '', items: [] },
  }
  return defaults[type] || {}
}
