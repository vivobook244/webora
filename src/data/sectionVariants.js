export const SECTION_VARIANT_CONFIG = {
  hero: [
    { id: 'center', name: 'Centered', description: 'Content centered on the page' },
    { id: 'split', name: 'Split', description: 'Text and image side by side' },
    { id: 'background', name: 'Background', description: 'Content over a background image' },
  ],
  about: [
    { id: 'image-left', name: 'Image Left', description: 'Image on the left, text on the right' },
    { id: 'image-right', name: 'Image Right', description: 'Image on the right, text on the left' },
    { id: 'centered', name: 'Centered', description: 'Text and image stacked, centered' },
  ],
  services: [
    { id: 'three-cards', name: 'Three Cards', description: 'Services displayed in a 3-column grid' },
    { id: 'four-cards', name: 'Four Cards', description: 'Services displayed in a 4-column grid' },
    { id: 'icon-list', name: 'Icon List', description: 'Services listed with icons in a row' },
  ],
  gallery: [
    { id: 'grid', name: 'Grid', description: 'Images in a uniform grid' },
    { id: 'masonry', name: 'Masonry', description: 'Images in a masonry layout' },
    { id: 'featured', name: 'Featured', description: 'One large image with smaller thumbnails' },
  ],
  testimonial: [
    { id: 'cards', name: 'Cards', description: 'Multiple testimonials in card layout' },
    { id: 'single', name: 'Single', description: 'One featured testimonial' },
    { id: 'slider', name: 'Slider', description: 'Testimonials in a carousel slider' },
  ],
  cta: [
    { id: 'centered', name: 'Centered', description: 'Centered call to action' },
    { id: 'split', name: 'Split', description: 'Text and button side by side' },
    { id: 'background', name: 'Background', description: 'Call to action over a background image' },
  ],
  contact: [
    { id: 'form-info', name: 'Form + Info', description: 'Contact form next to info details' },
    { id: 'centered', name: 'Centered', description: 'Centered contact information' },
    { id: 'two-column', name: 'Two Column', description: 'Info on one side, map on the other' },
  ],
  richtext: [
    { id: 'default', name: 'Default', description: 'Standard content width' },
    { id: 'narrow', name: 'Narrow', description: 'Narrower content for readability' },
    { id: 'wide', name: 'Wide', description: 'Full-width content area' },
  ],
  imagetext: [
    { id: 'image-left', name: 'Image Left', description: 'Image on the left, text on the right' },
    { id: 'image-right', name: 'Image Right', description: 'Image on the right, text on the left' },
    { id: 'stacked', name: 'Stacked', description: 'Image above text, stacked vertically' },
  ],
  faq: [
    { id: 'accordion', name: 'Accordion', description: 'Expandable accordion items' },
    { id: 'two-column', name: 'Two Column', description: 'Questions in a 2-column layout' },
    { id: 'simple-list', name: 'Simple List', description: 'Questions and answers in a simple list' },
  ],
}

export function getSectionVariants(type) {
  return SECTION_VARIANT_CONFIG[type] || []
}

export function getSectionVariant(type, variantId) {
  return getSectionVariants(type).find((variant) => variant.id === variantId) || null
}

export function getValidVariantId(type, variantId) {
  return getSectionVariant(type, variantId)?.id || null
}

export function getDefaultVariantId(type) {
  return getSectionVariants(type)[0]?.id || null
}

export function isValidSectionVariant(type, variantId) {
  return Boolean(getSectionVariant(type, variantId))
}
