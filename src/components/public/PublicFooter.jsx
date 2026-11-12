import { isSafeUrl } from '../../lib/validation'

export default function PublicFooter({ settings }) {
  const site = settings || {}
  const social = site.social || {}
  const contact = site.contact || {}
  const socialLinks = [
    { key: 'facebook', label: 'Facebook', url: social.facebook },
    { key: 'instagram', label: 'Instagram', url: social.instagram },
    { key: 'youtube', label: 'YouTube', url: social.youtube },
    { key: 'tiktok', label: 'TikTok', url: social.tiktok },
    { key: 'linkedin', label: 'LinkedIn', url: social.linkedin },
  ].filter((item) => item.url && isSafeUrl(item.url))

  return (
    <footer className="py-10" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-background)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold" style={{ color: 'var(--color-background)', fontFamily: 'var(--font-heading)' }}>{site.siteName || 'Website'}</p>
            {site.siteDescription && <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-text)' }}>{site.siteDescription}</p>}
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            {(contact.email || contact.phone) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--color-muted-text)' }}>
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((link) => (
                  <a key={link.key} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-background)' }}>
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-background) 20%, transparent)' }}>
          <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>&copy; {new Date().getFullYear()} {site.siteName || 'Website'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
