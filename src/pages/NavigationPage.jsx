import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import {
  getNavigationDummy,
  createNavigationItemDummy,
  updateNavigationItemDummy,
  deleteNavigationItemDummy,
  reorderNavigationDummy,
  toggleNavigationVisibilityDummy,
} from '../services/dummy/navigationDummy'
import { getPagesDummy } from '../services/dummy/pageDummy'
import { isSafeUrl } from '../lib/validation'

function NavIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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

const EMPTY_FORM = {
  label: '',
  type: 'PAGE',
  pageId: '',
  url: '',
  parentId: '',
  visible: true,
}

export default function NavigationPage() {
  const [items, setItems] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [navData, pageData] = await Promise.all([
          getNavigationDummy(),
          getPagesDummy(),
        ])
        if (active) {
          setItems(navData)
          setPages(pageData)
        }
      } catch {
        if (active) setError('Failed to load navigation')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const topLevelItems = items.filter((item) => !item.parentId)
  const childrenByParent = (parentId) => items.filter((item) => item.parentId === parentId)

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      label: item.label,
      type: item.type,
      pageId: item.pageId || '',
      url: item.url || '',
      parentId: item.parentId || '',
      visible: item.visible,
    })
    setErrors({})
    setModalOpen(true)
  }

  const handlePageSelect = (e) => {
    const pageId = e.target.value
    const page = pages.find((p) => p.id === pageId)
    setForm((prev) => ({
      ...prev,
      pageId,
      url: page ? `/${page.slug}` : '',
    }))
  }

  const validate = () => {
    const errs = {}
    if (!form.label.trim()) {
      errs.label = 'Label is required'
    }
    if (form.type === 'PAGE' && !form.pageId) {
      errs.pageId = 'Please select a page'
    }
    if (form.type === 'CUSTOM_URL' && !form.url.trim()) {
      errs.url = 'URL is required'
    } else if (form.type === 'CUSTOM_URL' && !isSafeUrl(form.url)) {
      errs.url = 'URL must start with http://, https://, or / (relative path)'
    }
    if (form.parentId) {
      if (form.parentId === editingId) {
        errs.parentId = 'An item cannot be its own parent'
      }
      const parent = items.find((item) => item.id === form.parentId)
      if (parent && parent.parentId) {
        errs.parentId = 'Cannot select a child item as parent (max 2 levels)'
      }
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
        label: form.label.trim(),
        type: form.type,
        pageId: form.type === 'PAGE' ? form.pageId : null,
        url: form.type === 'CUSTOM_URL' ? form.url.trim() : form.url,
        parentId: form.parentId || null,
        visible: form.visible,
      }

      if (editingId) {
        const updated = await updateNavigationItemDummy(editingId, data)
        setItems((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        )
      } else {
        const newItem = await createNavigationItemDummy(data)
        setItems((prev) => [...prev, newItem])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to save navigation item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const item = items.find((i) => i.id === deleteId)
    const hasChildren = item && items.some((i) => i.parentId === deleteId)
    if (hasChildren) {
      setError('Cannot delete: this item has child menu items. Remove or reassign children first.')
      setDeleteId(null)
      return
    }
    setDeleting(true)
    try {
      await deleteNavigationItemDummy(deleteId)
      setItems((prev) => prev.filter((i) => i.id !== deleteId))
      setDeleteId(null)
    } catch {
      setError('Failed to delete navigation item')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleVisibility = async (id) => {
    try {
      const updated = await toggleNavigationVisibilityDummy(id)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    } catch {
      setError('Failed to toggle visibility')
    }
  }

  const handleMove = async (item, direction) => {
    const siblings = items
      .filter((i) => (i.parentId || null) === (item.parentId || null))
      .sort((a, b) => a.order - b.order)
    const index = siblings.findIndex((i) => i.id === item.id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === siblings.length - 1) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = siblings[index]
    siblings[index] = siblings[swapIndex]
    siblings[swapIndex] = temp

    const orderedIds = siblings.map((i) => i.id)
    const updated = await reorderNavigationDummy(orderedIds)
    setItems(updated)
  }

  const getPageTitle = (pageId) => {
    const page = pages.find((p) => p.id === pageId)
    return page ? page.title : 'Page not found'
  }

  const renderNavItem = (item, isChild = false) => {
    const siblings = isChild
      ? childrenByParent(item.parentId)
      : topLevelItems
    const index = siblings.findIndex((i) => i.id === item.id)
    const hasChildren = !isChild && items.some((i) => i.parentId === item.id)

    return (
      <div key={item.id}>
        <Card className={`p-3 ${!item.visible ? 'opacity-60' : ''} ${isChild ? 'ml-8' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-500">
                {item.order}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    item.type === 'PAGE' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.type === 'PAGE' ? 'Page' : 'Custom URL'}
                  </span>
                  {!item.visible && (
                    <span className="inline-flex items-center rounded-md bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <span>{item.url || '/'}</span>
                  {item.type === 'PAGE' && (
                    <span className="text-gray-400">({getPageTitle(item.pageId)})</span>
                  )}
                  {item.type === 'PAGE' && !pages.find((p) => p.id === item.pageId) && (
                    <span className="text-error-500">Page not found</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMove(item, 'up')}
                disabled={index === 0}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMove(item, 'down')}
                disabled={index === siblings.length - 1}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDownIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleToggleVisibility(item.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title={item.visible ? 'Hide' : 'Show'}
              >
                {item.visible ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => openEdit(item)}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="rounded-lg border border-error-200 px-2.5 py-1 text-xs font-medium text-error-600 hover:bg-error-50"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
        {hasChildren && childrenByParent(item.id).map((child) => renderNavItem(child, true))}
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Navigation" subtitle="Manage your website menu" />
        <Card className="p-6">
          <LoadingState message="Loading navigation..." />
        </Card>
      </div>
    )
  }

  const availableParents = topLevelItems.filter((item) => item.id !== editingId)

  return (
    <div>
      <PageHeader title="Navigation" subtitle="Manage your website menu">
        <Button onClick={openCreate}>Add Menu Item</Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {topLevelItems.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title="No menu items"
            message="Add your first menu item to build your website navigation"
            icon={NavIcon}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {topLevelItems.map((item) => renderNavItem(item))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Menu Item' : 'Add Menu Item'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Label"
            name="label"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            error={errors.label}
            required
            placeholder="Menu label"
          />
          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'PAGE', label: 'Page' },
              { value: 'CUSTOM_URL', label: 'Custom URL' },
            ]}
          />
          {form.type === 'PAGE' && (
            <Select
              label="Page"
              name="pageId"
              value={form.pageId}
              onChange={handlePageSelect}
              options={pages.map((p) => ({ value: p.id, label: p.title }))}
              error={errors.pageId}
              placeholder="Select a page"
              required
            />
          )}
          {form.type === 'CUSTOM_URL' && (
            <Input
              label="URL"
              name="url"
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              error={errors.url}
              required
              placeholder="/custom-path or https://example.com"
            />
          )}
          {availableParents.length > 0 && (
            <Select
              label="Parent (optional)"
              name="parentId"
              value={form.parentId}
              onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))}
              options={[{ value: '', label: 'None (top level)' }, ...availableParents.map((p) => ({ value: p.id, label: p.label }))]}
              error={errors.parentId}
            />
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="navVisible"
              checked={form.visible}
              onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="navVisible" className="text-sm font-medium text-gray-700">
              Visible in menu
            </label>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
