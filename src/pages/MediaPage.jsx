import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import SearchInput from '../components/SearchInput'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import {
  getMediaDummy,
  uploadMediaDummy,
  updateMediaDummy,
  deleteMediaDummy,
} from '../services/dummy/mediaDummy'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr, language = 'en') {
  return new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export default function MediaPage() {
  const { t, language } = useLanguage()
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [editModal, setEditModal] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAlt, setEditAlt] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let active = true
    ;(async () => {
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
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const newMedia = await uploadMediaDummy(file)
      setMedia((prev) => [newMedia, ...prev])
    } catch (err) {
      setUploadError(err.message || t("Upload failed"))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const openEdit = (item) => {
    setEditModal(item)
    setEditName(item.name)
    setEditAlt(item.alt || '')
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    try {
      const updated = await updateMediaDummy(editModal.id, {
        name: editName,
        alt: editAlt,
      })
      setMedia((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setEditModal(null)
    } catch {
      setUploadError(t("Failed to update media"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteMediaDummy(deleteId)
      setMedia((prev) => prev.filter((m) => m.id !== deleteId))
      setDeleteId(null)
    } catch {
      setUploadError(t("Failed to delete media"))
    } finally {
      setDeleting(false)
    }
  }

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div>
        <PageHeader title=={t("Media Library")} subtitle=={t("Manage your image assets")} />
        <Card className="p-6">
          <LoadingState message=={t("Loading media...")} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title=={t("Media Library")} subtitle=={t("Manage your image assets")}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
          onChange={handleUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
          {uploading ? t("Uploading...") : t("Upload Image")}
        </Button>
      </PageHeader>

      {uploadError && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {uploadError}
        </div>
      )}

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder=={t("Search media...")} />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title={search ? t("No media found") : t("No media yet")}
            message={search ? t("Try a different search term") : t("Upload your first image to get started")}
            icon={ImageIcon}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div
                className="flex aspect-square cursor-pointer items-center justify-center bg-gray-50"
                onClick={() => openEdit(item)}
              >
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
                  <ImageIcon className="h-10 w-10" />
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">{formatSize(item.size)}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatDate(item.createdAt, language)}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-lg border border-error-200 px-2 py-1.5 text-xs font-medium text-error-600 hover:bg-error-50"
                  >
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Media"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(null)} disabled={saving}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSaveEdit} loading={saving}>
              {saving ? t("Saving...") : t("Save")}
            </Button>
          </>
        }
      >
        {editModal && (
          <div className="space-y-4">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 p-4">
              {editModal.url ? (
                <img
                  src={editModal.url}
                  alt={editModal.alt || editModal.name}
                  className="max-h-40 rounded-lg object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <Input
              label="File Name"
              name="editName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              label="Alt Text"
              name="editAlt"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Describe this image for accessibility"
            />
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
              <p>Type: {editModal.mimeType}</p>
              <p>Size: {formatSize(editModal.size)}</p>
              <p>Uploaded: {formatDate(editModal.createdAt, language)}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
