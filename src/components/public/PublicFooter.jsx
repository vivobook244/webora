import { isSafeUrl } from '../../lib/validation'

export default function PublicFooter({ settings }) {
  const s = settings || {}
  const social = s.social || {}
  const contact = s.contact || {}
  const socialLinks = [
    { key: 'facebook', label: 'Facebook', url: social.facebook },
    { key: 'instagram', label: 'Instagram', url: social.instagram },
    { key: 'youtube', label: 'YouTube', url: social.youtube },
    { key: 'tiktok', label: 'TikTok', url: social.tiktok },
    { key: 'linkedin', label: 'LinkedIn', url: social.linkedin },
  ].filter((s) => s.url && isSafeUrl(s.url))

  return (
    <footer className="py-10" style={{ backgroundColor: 'var(--color-secondary)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-white">{s.siteName || 'Website'}</p>
            {s.siteDescription && <p className="mt-1 text-sm text-gray-400">{s.siteDescription}</p>}
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            {(contact.email || contact.phone) && (
              <div className="flex gap-4 text-sm text-gray-400">
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a key={link.key} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {s.siteName || 'Website'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
