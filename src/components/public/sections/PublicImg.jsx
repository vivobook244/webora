import { useState } from 'react'
import { resolveMediaUrl } from '../publicUtils'

function Img({ src, alt, className, mediaList, style }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const resolved = resolveMediaUrl(src, mediaList)

  if (!resolved || failedSrc === resolved) {
    return (
      <div className={`flex items-center justify-center bg-surface text-muted-text ${className}`} style={style}>
        <svg className="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={alt || ''}
      className={className}
      style={style}
      onError={() => setFailedSrc(resolved)}
    />
  )
}

export default Img
