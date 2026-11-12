import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import SearchInput from './SearchInput'
import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import { getMediaDummy } from '../services/dummy/mediaDummy'

function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export default function MediaPicker({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await getMediaDummy()
        if (active) setMedia(data)
      } catch {
        if (active) setMedia([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [open])

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (item) => {
    onSelect(item)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select Image from Media Library"
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      }
    >
      {loading ? (
        <LoadingState message="Loading media..." />
      ) : (
        <div>
          <div className="mb-4 max-w-sm">
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media..." />
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No media found" message="Upload images in the Media Library first" icon={ImageIcon} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="group overflow-hidden rounded-lg border border-gray-200 text-left transition-all hover:border-primary-400 hover:shadow-md"
                >
                  <div className="flex aspect-square items-center justify-center bg-gray-50">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.alt || item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="hidden h-full w-full flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium text-gray-900">{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
