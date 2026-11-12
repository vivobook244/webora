import PublicHero from './sections/PublicHero'
import PublicAbout from './sections/PublicAbout'
import PublicServices from './sections/PublicServices'
import PublicGallery from './sections/PublicGallery'
import PublicTestimonial from './sections/PublicTestimonial'
import PublicCTA from './sections/PublicCTA'
import PublicContact from './sections/PublicContact'
import PublicRichText from './sections/PublicRichText'
import PublicImageText from './sections/PublicImageText'
import PublicFAQ from './sections/PublicFAQ'
import { getSectionVariants, getValidVariantId } from '../../data/sectionVariants'

const RENDERERS = {
  hero: PublicHero,
  about: PublicAbout,
  services: PublicServices,
  gallery: PublicGallery,
  testimonial: PublicTestimonial,
  cta: PublicCTA,
  contact: PublicContact,
  richtext: PublicRichText,
  imagetext: PublicImageText,
  faq: PublicFAQ,
}

export default function PublicSectionRenderer({ section, mediaList }) {
  const Component = RENDERERS[section.type]
  if (!Component) return null

  const validVariant = getValidVariantId(section.type, section.variant)
  const safeSection = validVariant ? section : { ...section, variant: getSectionVariants(section.type)[0]?.id }

  return <Component section={safeSection} mediaList={mediaList} />
}
