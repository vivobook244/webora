import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import SectionEditor from '../components/SectionEditor'
import PublicSectionRenderer from '../components/public/PublicSectionRenderer'
import PageRenderer from '../components/public/PageRenderer'
import PublicLayout from '../layouts/PublicLayout'
import { getCssVars } from '../components/public/publicUtils'
import { SECTION_TYPES, getDefaultContent } from '../lib/sectionTypes'
import { getSectionVariants, getValidVariantId, getDefaultVariantId, getSectionVariant } from '../data/sectionVariants'
import { getPageByIdDummy, getPagesDummy } from '../services/dummy/pageDummy'
import { getSiteSettingsDummy } from '../services/dummy/settingsDummy'
import { getNavigationDummy } from '../services/dummy/navigationDummy'
import { getAppearanceDummy } from '../services/dummy/appearanceDummy'
import { getMediaDummy } from '../services/dummy/mediaDummy'
import { getActiveTemplateDummy } from '../services/dummy/templateDummy'
import {
  getSectionsByPageDummy,
  createSectionDummy,
  updateSectionDummy,
  deleteSectionDummy,
  duplicateSectionDummy,
  reorderSectionsDummy,
  toggleSectionVisibilityDummy,
} from '../services/dummy/sectionDummy'

function SectionIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function ArrowUpIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

function ArrowDownIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CopyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function PreviewWrapper({ appearance, children }) {
  const cssVars = getCssVars(appearance)
  return (
    <div
      className="public-site"
      style={{
        ...cssVars,
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--font-size-base)',
      }}
    >
      <main>{children}</main>
    </div>
  )
}

function VariantPreview({ type, variantId, appearance, mediaList }) {
  const section = {
    type,
    variant: variantId,
    content: getDefaultContent(type),
  }
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <PreviewWrapper appearance={appearance}>
        <PublicSectionRenderer section={section} mediaList={mediaList} />
      </PreviewWrapper>
    </div>
  )
}

function VariantSelector({ type, selectedVariant, onSelect, appearance, mediaList }) {
  const variants = getSectionVariants(type)
  if (variants.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">Variant</label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`rounded-lg border p-2 text-left transition-all ${
              selectedVariant === variant.id
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="mb-1.5 overflow-hidden rounded">
              <VariantPreview type={type} variantId={variant.id} appearance={appearance} mediaList={mediaList} />
            </div>
            <div className="text-xs font-semibold text-gray-800">{variant.name}</div>
            <div className="text-xs text-gray-500">{variant.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SectionBuilderPage() {
  const { t } = useLanguage()
  const { pageId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [pages, setPages] = useState([])
  const [settings, setSettings] = useState(null)
  const [navItems, setNavItems] = useState([])
  const [sections, setSections] = useState([])
  const [appearance, setAppearance] = useState(null)
  const [mediaList, setMediaList] = useState([])
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [addOpen, setAddOpen] = useState(false)
  const [newType, setNewType] = useState('')
  const [newVariant, setNewVariant] = useState('')
  const [creating, setCreating] = useState(false)

  const [editSection, setEditSection] = useState(null)
  const [editContent, setEditContent] = useState({})
  const [editVariant, setEditVariant] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [duplicateId, setDuplicateId] = useState(null)
  const [duplicating, setDuplicating] = useState(false)

  const loadSections = async () => {
    try {
      const [pageData, sectionData, appearanceData, mediaData, templateData, pagesData, settingsData, navigationData] = await Promise.all([
        getPageByIdDummy(pageId),
        getSectionsByPageDummy(pageId),
        getAppearanceDummy(),
        getMediaDummy(),
        getActiveTemplateDummy(),
        getPagesDummy(),
        getSiteSettingsDummy(),
        getNavigationDummy(),
      ])
      const validated = sectionData.map((s) => {
        const validVariant = getValidVariantId(s.type, s.variant)
        return validVariant ? s : { ...s, variant: getDefaultVariantId(s.type) }
      })
      setPage(pageData)
      setPages(pagesData)
      setSettings(settingsData)
      setNavItems(navigationData)
      setSections(validated)
      setAppearance(appearanceData)
      setMediaList(mediaData)
      setTemplate(templateData)
    } catch {
      setError('Failed to load page data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      await loadSections()
      if (!active) return
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const allowedTypes = Array.isArray(template?.sections)
    ? SECTION_TYPES.filter((type) => template.sections.includes(type.value))
    : SECTION_TYPES

  const handleAddTypeChange = (e) => {
    const type = e.target.value
    setNewType(type)
    setNewVariant(getDefaultVariantId(type) || '')
  }

  const handleCreate = async () => {
    if (!newType) return
    const validVariant = getValidVariantId(newType, newVariant)
    if (!validVariant) {
      setError('Invalid variant for this section type')
      return
    }
    setCreating(true)
    setError('')
    try {
      const content = getDefaultContent(newType)
      const created = await createSectionDummy({
        pageId,
        type: newType,
        variant: validVariant,
        content,
      })
      setSections((prev) => [...prev, created])
      setAddOpen(false)
      setNewType('')
      setNewVariant('')
    } catch {
      setError('Failed to create section')
    } finally {
      setCreating(false)
    }
  }

  const openEdit = (section) => {
    const validVariant = getValidVariantId(section.type, section.variant) || getDefaultVariantId(section.type)
    setEditSection(section)
    setEditContent(section.content || {})
    setEditVariant(validVariant)
  }

  const handleSaveEdit = async () => {
    const validVariant = getValidVariantId(editSection.type, editVariant)
    if (!validVariant) {
      setError('Invalid variant for this section type')
      return
    }
    setSaving(true)
    setError('')
    try {
      const updated = await updateSectionDummy(editSection.id, {
        content: editContent,
        variant: validVariant,
      })
      setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      setEditSection(null)
    } catch {
      setError('Failed to save section')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSectionDummy(deleteId)
      setSections((prev) => prev.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    } catch {
      setError('Failed to delete section')
    } finally {
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    setDuplicating(true)
    try {
      const duplicated = await duplicateSectionDummy(duplicateId)
      const all = [...sections, duplicated].sort((a, b) => a.order - b.order)
      setSections(all)
      setDuplicateId(null)
    } catch {
      setError('Failed to duplicate section')
    } finally {
      setDuplicating(false)
    }
  }

  const handleToggleVisibility = async (id) => {
    try {
      const updated = await toggleSectionVisibilityDummy(id)
      setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch {
      setError('Failed to toggle visibility')
    }
  }

  const handleMove = async (section, direction) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex((s) => s.id === section.id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sorted.length - 1) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = sorted[index]
    sorted[index] = sorted[swapIndex]
    sorted[swapIndex] = temp

    const orderedIds = sorted.map((s) => s.id)
    const updated = await reorderSectionsDummy(pageId, orderedIds)
    setSections(updated)
  }

  const typeLabel = (type) => {
    const found = SECTION_TYPES.find((t) => t.value === type)
    return found ? found.label : type
  }

  const variantLabel = (type, variantId) => {
    const variant = getSectionVariant(type, variantId)
    return variant ? variant.name : variantId
  }

  if (loading) {
    return (
      <div>
        <PageHeader title=={t("Section Builder")} subtitle=={t("Loading...")} />
        <Card className="p-6">
          <LoadingState message="Loading sections..." />
        </Card>
      </div>
    )
  }

  if (!page) {
    return (
      <div>
        <PageHeader title=={t("Section Builder")} subtitle=={t("Page not found")} />
        <Card className="p-6">
          <EmptyState title=={t("Page not found")} message=={t("This page may have been deleted")} icon={SectionIcon} />
        </Card>
        <div className="mt-4">
          <Link to="/admin/pages" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            {t("Back to Pages")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={page.title}
        subtitle={
          <span className="flex items-center gap-2">
            <StatusBadge status={page.status} />
            <span>{t("Section Builder")}</span>
          </span>
        }
      >
        <Button variant="secondary" onClick={() => navigate('/admin/pages')}>
          {t("Back to Pages")}
        </Button>
        <Button onClick={() => setAddOpen(true)}>{t("Add Section")}</Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">{t("Live Website Preview")}</h2>
          <p className="mt-1 text-xs text-gray-500">{t("This preview uses the same layout and section renderer as the published website.")}</p>
        </div>
        <div className="max-h-[760px] overflow-auto">
          <PublicLayout settings={settings} navItems={navItems} pages={pages} appearance={appearance} template={template}>
            <PageRenderer page={page} sections={sections} mediaList={mediaList} template={template} />
          </PublicLayout>
        </div>
      </Card>

      {sections.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title=={t("No sections yet")}
            message=={t("Add your first section to start building this page")}
            icon={SectionIcon}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {[...sections].sort((a, b) => a.order - b.order).map((section, index, arr) => (
            <Card key={section.id} className={`p-4 ${!section.visible ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500">
                    {section.order}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{typeLabel(section.type)}</h3>
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        {variantLabel(section.type, section.variant)}
                      </span>
                      {!section.visible && (
                        <span className="inline-flex items-center rounded-md bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                          {t("Hidden")}
                        </span>
                      )}
                    </div>
                    {section.content?.title && (
                      <p className="mt-1 text-sm text-gray-500">{section.content.title}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleMove(section, 'up')}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                    title=={t("Move Up")}
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(section, 'down')}
                    disabled={index === arr.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                    title=={t("Move Down")}
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(section.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title={section.visible ? t("Hide") : t("Show")}
                  >
                    {section.visible ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(section)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Edit"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDuplicateId(section.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title=={t("Duplicate")}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(section.id)}
                    className="rounded-lg p-1.5 text-error-400 hover:bg-error-50 hover:text-error-600"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                <PreviewWrapper appearance={appearance}>
                  <PublicSectionRenderer section={section} mediaList={mediaList} />
                </PreviewWrapper>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title=={t("Add Section")}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={creating} disabled={!newType}>
              {creating ? t("Creating...") : t("Add Section")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("Section Type")} <span className="text-error-500">*</span></label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {allowedTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={handleAddTypeChange}
                  value={type.value}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    newType === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          {newType && (
            <VariantSelector
              type={newType}
              selectedVariant={newVariant}
              onSelect={setNewVariant}
              appearance={appearance}
              mediaList={mediaList}
            />
          )}
        </div>
      </Modal>

      <Modal
        open={!!editSection}
        onClose={() => setEditSection(null)}
        title={editSection ? `Edit ${typeLabel(editSection.type)} Section` : ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditSection(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        {editSection && (
          <div className="space-y-4">
            {getSectionVariants(editSection.type).length > 1 && (
              <VariantSelector
                type={editSection.type}
                selectedVariant={editVariant}
                onSelect={setEditVariant}
                appearance={appearance}
                mediaList={mediaList}
              />
            )}
            <SectionEditor
              type={editSection.type}
              content={editContent}
              onChange={setEditContent}
            />
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title=={t("Delete Section")}
        message=={t("Are you sure you want to delete this section? This action cannot be undone.")}
        loading={deleting}
      />

      <ConfirmModal
        open={!!duplicateId}
        onClose={() => setDuplicateId(null)}
        onConfirm={handleDuplicate}
        title=={t("Duplicate Section")}
        message=={t("This will create a copy of this section placed right after the original.")}
        confirmLabel=={t("Duplicate")}
        loading={duplicating}
      />
    </div>
  )
}
