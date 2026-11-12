import { useEffect, useState } from 'react'

export default function useStorageRevision() {
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const handleCustomChange = (event) => {
      const key = event.detail?.key
      if (!key || key.startsWith('cms_lite_')) setRevision((value) => value + 1)
    }
    const handleCrossTabChange = (event) => {
      if (!event.key || event.key.startsWith('cms_lite_')) setRevision((value) => value + 1)
    }

    window.addEventListener('webora:storage', handleCustomChange)
    window.addEventListener('storage', handleCrossTabChange)
    return () => {
      window.removeEventListener('webora:storage', handleCustomChange)
      window.removeEventListener('storage', handleCrossTabChange)
    }
  }, [])

  return revision
}
