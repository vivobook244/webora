import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import SearchInput from '../components/SearchInput'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import MediaPicker from '../components/MediaPicker'
import {
  getPagesDummy,
  createPageDummy,
  updatePageDummy,
  deletePageDummy,
  publishPageDummy,
  unpublishPageDummy,
} from '../services/dummy/pageDummy'
import { generateSlug, isSlugUnique, generateUniqueSlug } from '../lib/slug'

function formatDate(dateStr, language = 'en') {
  return new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  status: 'DRAFT',
  isHome: false,
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
}

export default function PagesPage() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [publishId, setPublishId] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [unpublishId, setUnpublishId] = useState(null)
  const [unpublishing, setUnpublishing] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getPagesDummy()
        if (active) setPages(data)
      } catch {
        if (active) setError(t("Failed to load pages"))
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSlugManuallyEdited(false)
    setModalOpen(true)
  }

  const openEdit = (page) => {
    setEditingId(page.id)
    setForm({
      title: page.title,
      slug: page.slug,
      status: page.status,
      isHome: page.isHome,
      seoTitle: page.seo?.title || '',
      seoDescription: page.seo?.description || '',
      ogImage: page.seo?.ogImage || '',
    })
    setErrors({})
    setSlugManuallyEdited(true)
    setModalOpen(true)
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm((prev) => {
      const next = { ...prev, title }
      if (!slugManuallyEdited) {
        next.slug = generateSlug(title)
      }
      return next
    })
  }

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true)
    setForm((prev) => ({ ...prev, slug: e.target.value }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) {
      errs.title = t("Title is required")
    }
    if (!form.slug.trim()) {
      errs.slug = t("Slug is required")
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      errs.slug = 'Slug must be URL-friendly (lowercase letters, numbers, hyphens)'
    } else if (!isSlugUnique(form.slug, pages, editingId)) {
      errs.slug = t("Slug is already in use")
    }
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    setError('')
    try {
      const data = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        status: form.status,
        isHome: form.isHome,
        seo: {
          title: form.seoTitle.trim(),
          description: form.seoDescription.trim(),
          ogImage: form.ogImage || '',
        },
      }

      if (editingId) {
        const updated = await updatePageDummy(editingId, data)
        setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      } else {
        const finalSlug = generateUniqueSlug(form.slug, pages)
        const newPage = await createPageDummy({ ...data, slug: finalSlug })
        setPages((prev) => [...prev, newPage])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message || t("Failed to save page"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePageDummy(deleteId)
      setPages((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err.message || t("Failed to delete page"))
    } finally {
      setDeleting(false)
    }
  }

  const validatePublish = (page) => {
    const errs = []
    if (!page.title?.trim()) errs.push(t("Title is required"))
    if (!page.slug?.trim()) errs.push(t("Slug is required"))
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug)) errs.push(t("Slug must be URL-friendly"))
    const otherPages = pages.filter((p) => p.id !== page.id)
    if (!isSlugUnique(page.slug, otherPages, page.id)) errs.push(t("Slug must be unique"))
    return errs
  }

  const handlePublish = async () => {
    const page = pages.find((p) => p.id === publishId)
    if (!page) return
    const errs = validatePublish(page)
    if (errs.length > 0) {
      setError(errs.join(', '))
      setPublishId(null)
      return
    }
    setPublishing(true)
    setError('')
    try {
      const updated = await publishPageDummy(publishId)
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setPublishId(null)
      setSuccessMessage(t("Page published successfully."))
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setError(err.message || t("Failed to publish page"))
    } finally {
      setPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setUnpublishing(true)
    setError('')
    try {
      const updated = await unpublishPageDummy(unpublishId)
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setUnpublishId(null)
      setSuccessMessage(t("Page unpublished successfully."))
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setError(err.message || t("Failed to unpublish page"))
    } finally {
      setUnpublishing(false)
    }
  }

  const filtered = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div>
        <PageHeader title=={t("Pages")} subtitle=={t("Manage your website pages")} />
        <Card className="p-6">
          <LoadingState message=={t("Loading pages...")} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title=={t("Pages")} subtitle=={t("Manage your website pages")}>
        <Button onClick={openCreate}>{t("Create Page")}</Button>
      </PageHeader>

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700 animate-fade-in">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder=={t("Search pages...")} />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: t("All Status") },
              { value: 'DRAFT', label: t("Draft") },
              { value: 'PUBLISHED', label: t("Published") },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title={search || statusFilter !== 'ALL' ? t("No pages found") : t("No pages yet")}
            message={search || statusFilter !== 'ALL' ? t("Try a different search or filter") : t("Create your first page to get started")}
            icon={PageIcon}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("Title")}</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">{t("Slug")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("Status")}</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">{t("Updated")}</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((page) => (
                  <tr key={page.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{page.title}</span>
                        {page.isHome && (
                          <span className="inline-flex items-center rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                            {t("Home")}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 sm:hidden">/{page.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">/{page.slug}</td>
                    <td className="px-4 py-3"><StatusBadge status={page.status} /></td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{formatDate(page.updatedAt, language)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/pages/${page.id}/preview`)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          title=={t("Preview page")}
                        >
                          {t("Preview")}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/pages/${page.id}/sections`)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          title=={t("Manage Sections")}
                        >
                          {t("Sections")}
                        </button>
                        <button
                          onClick={() => openEdit(page)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          {t("Edit")}
                        </button>
                        {page.status === 'DRAFT' ? (
                          <button
                            onClick={() => setPublishId(page.id)}
                            className="rounded-lg border border-success-200 px-2.5 py-1.5 text-xs font-medium text-success-700 hover:bg-success-50"
                          >
                            {t("Publish")}
                          </button>
                        ) : (
                          <button
                            onClick={() => setUnpublishId(page.id)}
                            className="rounded-lg border border-warning-200 px-2.5 py-1.5 text-xs font-medium text-warning-700 hover:bg-warning-50"
                          >
                            {t("Unpublish")}
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(page.id)}
                          className="rounded-lg border border-error-200 px-2.5 py-1.5 text-xs font-medium text-error-600 hover:bg-error-50"
                        >
                          {t("Delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? t("Edit Page") : t("Create Page")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {saving ? t("Saving...") : t("Save")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label=={t("Title")}
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            error={errors.title}
            required
            placeholder=={t("Page title")}
          />
          <Input
            label=={t("Slug")}
            name="slug"
            value={form.slug}
            onChange={handleSlugChange}
            error={errors.slug}
            required
            placeholder="url-friendly-slug"
          />
          <Select
            label=={t("Status")}
            name="status"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'DRAFT', label: t("Draft") },
              { value: 'PUBLISHED', label: t("Published") },
            ]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHome"
              checked={form.isHome}
              onChange={(e) => setForm((prev) => ({ ...prev, isHome: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isHome" className="text-sm font-medium text-gray-700">
              {t("Set as Homepage")}
            </label>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">{t("SEO")}</p>
            <Input
              label=={t("SEO Title")}
              name="seoTitle"
              value={form.seoTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="SEO page title"
            />
            <div className="mt-4">
              <Textarea
                label=={t("SEO Description")}
                name="seoDescription"
                value={form.seoDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                rows={2}
                placeholder="Meta description for search engines"
              />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("OG Image")}</label>
              {form.ogImage ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{form.ogImage}</span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    {t("Change")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, ogImage: '' }))}
                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    {t("Remove")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {t("Select from Media Library")}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title=={t("Delete Page")}
        message=={t("Are you sure you want to delete this page? This action cannot be undone.")}
        loading={deleting}
      />

      <ConfirmModal
        open={!!publishId}
        onClose={() => setPublishId(null)}
        onConfirm={handlePublish}
        title=={t("Publish Page")}
        message=={t("This page will be visible on your public website. Continue?")}
        confirmLabel=={t("Publish")}
        loading={publishing}
      />

      <ConfirmModal
        open={!!unpublishId}
        onClose={() => setUnpublishId(null)}
        onConfirm={handleUnpublish}
        title=={t("Unpublish Page")}
        message=={t("This page will no longer be visible on your public website. It will return to draft status.")}
        confirmLabel=={t("Unpublish")}
        loading={unpublishing}
      />

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => setForm((prev) => ({ ...prev, ogImage: media.id }))}
      />
    </div>
  )
}
