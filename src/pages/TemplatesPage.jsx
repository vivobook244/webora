import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import {
  getTemplatesDummy,
  getActiveTemplateDummy,
  activateTemplateDummy,
} from '../services/dummy/templateDummy'

function TemplateIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}

function TemplatePreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="flex h-8 items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3">
        <div className="h-2 w-2 rounded-full bg-gray-300" />
        <div className="h-2 w-2 rounded-full bg-gray-300" />
        <div className="h-2 w-2 rounded-full bg-gray-300" />
      </div>
      <div className="space-y-2 p-3">
        <div className="h-20 rounded bg-gradient-to-br from-primary-100 to-primary-50" />
        <div className="space-y-1.5">
          <div className="h-3 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-5/6 rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
        <div className="h-8 rounded bg-gray-50" />
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [list, activeTemplate] = await Promise.all([
          getTemplatesDummy(),
          getActiveTemplateDummy(),
        ])
        if (active) {
          setTemplates(list)
          setActiveId(activeTemplate?.id || null)
        }
      } catch {
        if (active) setError('Failed to load templates')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const handleActivate = async (id) => {
    setActivating(id)
    setError('')
    try {
      await activateTemplateDummy(id)
      setActiveId(id)
    } catch (err) {
      setError(err.message || 'Failed to activate template')
    } finally {
      setActivating(null)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Templates" subtitle="Choose your website template" />
        <Card className="p-6">
          <LoadingState message="Loading templates..." />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Templates" subtitle="Choose your website template" />

      {error && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {templates.length === 0 ? (
        <Card className="p-6">
          <EmptyState title="No templates" message="Templates will appear here" icon={TemplateIcon} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {templates.map((template) => {
            const isActive = template.id === activeId
            return (
              <Card key={template.id} className="overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <TemplatePreview template={template} />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {isActive ? (
                      <StatusBadge status="ACTIVE" />
                    ) : (
                      <StatusBadge status="INACTIVE" />
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">{template.description}</p>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Available Sections
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {template.sections.map((section) => (
                        <span
                          key={section}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleActivate(template.id)}
                      loading={activating === template.id}
                      disabled={isActive}
                    >
                      {isActive ? 'Activated' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title="Template Preview"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setPreviewTemplate(null)}>
            Close
          </Button>
        }
      >
        {previewTemplate && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              {previewTemplate.id === activeId && <StatusBadge status="ACTIVE" />}
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-gray-100 px-6">
                <div className="h-3 w-20 rounded bg-gray-300" />
                <div className="flex gap-4">
                  <div className="h-3 w-12 rounded bg-gray-200" />
                  <div className="h-3 w-12 rounded bg-gray-200" />
                  <div className="h-3 w-12 rounded bg-gray-200" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-white py-16">
                <div className="h-6 w-64 rounded bg-gray-200" />
                <div className="h-4 w-96 rounded bg-gray-100" />
                <div className="h-10 w-32 rounded bg-primary-200" />
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="h-24 rounded-lg bg-gray-100" />
                <div className="h-24 rounded-lg bg-gray-100" />
                <div className="h-24 rounded-lg bg-gray-100" />
              </div>
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="mx-auto h-4 w-48 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
