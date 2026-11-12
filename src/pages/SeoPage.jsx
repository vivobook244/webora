import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import LoadingState from '../components/LoadingState'
import ConfirmModal from '../components/ConfirmModal'
import MediaPicker from '../components/MediaPicker'
import { getSeoDummy, updateSeoDummy, resetSeoDummy } from '../services/dummy/seoDummy'

const TWITTER_CARD_OPTIONS = [
  { value: 'summary', label: 'Summary' },
  { value: 'summary_large_image', label: 'Summary with Large Image' },
]

const ROBOTS_OPTIONS = [
  { value: 'index,follow', label: 'Index, Follow (Default)' },
  { value: 'noindex,nofollow', label: 'No Index, No Follow' },
  { value: 'index,nofollow', label: 'Index, No Follow' },
  { value: 'noindex,follow', label: 'No Index, Follow' },
]

const MAX_TITLE_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 160

export default function SeoPage() {
  const [seo, setSeo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [keywordInput, setKeywordInput] = useState('')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getSeoDummy()
        if (active) setSeo(data)
      } catch {
        if (active) setError('Failed to load SEO settings')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const validate = () => {
    const errs = {}
    if (!seo.siteTitle?.trim()) {
      errs.siteTitle = 'Site title is required'
    } else if (seo.siteTitle.length > MAX_TITLE_LENGTH) {
      errs.siteTitle = `Title must be ${MAX_TITLE_LENGTH} characters or less`
    }
    if (seo.siteDescription && seo.siteDescription.length > MAX_DESCRIPTION_LENGTH) {
      errs.siteDescription = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`
    }
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    setError('')
    setSuccessMessage('')
    try {
      const cleanedKeywords = (seo.keywords || [])
        .map((k) => k.trim())
        .filter(Boolean)
      const uniqueKeywords = [...new Set(cleanedKeywords)]
      await updateSeoDummy({ ...seo, keywords: uniqueKeywords })
      setSeo((prev) => ({ ...prev, keywords: uniqueKeywords }))
      setSuccessMessage('SEO settings saved successfully.')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch {
      setError('Failed to save SEO settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const fresh = await resetSeoDummy()
      setSeo(fresh)
      setResetOpen(false)
      setSuccessMessage('SEO settings reset to defaults.')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch {
      setError('Failed to reset SEO settings')
    } finally {
      setResetting(false)
    }
  }

  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (!trimmed) return
    if (seo.keywords?.includes(trimmed)) {
      setKeywordInput('')
      return
    }
    setSeo((prev) => ({ ...prev, keywords: [...(prev.keywords || []), trimmed] }))
    setKeywordInput('')
  }

  const removeKeyword = (index) => {
    setSeo((prev) => ({ ...prev, keywords: prev.keywords.filter((_, i) => i !== index) }))
  }

  const handleMediaSelect = (media) => {
    setSeo((prev) => ({ ...prev, ogImage: media.id }))
  }

  if (loading || !seo) {
    return (
      <div>
        <PageHeader title="SEO" subtitle="Search engine optimization settings" />
        <Card className="p-6">
          <LoadingState message="Loading SEO settings..." />
        </Card>
      </div>
    )
  }

  const previewTitle = seo.siteTitle || 'Your Website'
  const previewUrl = 'https://yourwebsite.com'
  const previewDescription = seo.siteDescription || 'No description set.'

  return (
    <div>
      <PageHeader title="SEO" subtitle="Search engine optimization settings">
        <Button variant="secondary" onClick={() => setResetOpen(true)}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} loading={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Settings Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">General SEO</h2>
            <div className="space-y-4">
              <div>
                <Input
                  label="Site Title"
                  name="siteTitle"
                  value={seo.siteTitle}
                  onChange={(e) => setSeo((prev) => ({ ...prev, siteTitle: e.target.value }))}
                  error={errors.siteTitle}
                  required
                  placeholder="Your website title"
                  maxLength={MAX_TITLE_LENGTH}
                />
                <p className="mt-1 text-xs text-gray-400">{(seo.siteTitle || '').length}/{MAX_TITLE_LENGTH}</p>
              </div>
              <div>
                <Textarea
                  label="Site Description"
                  name="siteDescription"
                  value={seo.siteDescription}
                  onChange={(e) => setSeo((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  error={errors.siteDescription}
                  rows={3}
                  placeholder="Brief description for search engines"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <p className="mt-1 text-xs text-gray-400">{(seo.siteDescription || '').length}/{MAX_DESCRIPTION_LENGTH}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                    placeholder="Type a keyword and press Enter"
                    className="input-field"
                  />
                  <Button variant="secondary" onClick={addKeyword} type="button">
                    Add
                  </Button>
                </div>
                {seo.keywords && seo.keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {seo.keywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {kw}
                        <button
                          onClick={() => removeKeyword(i)}
                          className="text-gray-400 hover:text-error-600"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Social</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Open Graph Image</label>
                {seo.ogImage ? (
                  <div className="flex items-center gap-3">
                    <div className="h-20 w-32 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={seo.ogImage.startsWith('http') || seo.ogImage.startsWith('/') ? seo.ogImage : undefined}
                        alt="OG preview"
                        className="h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <Button variant="secondary" onClick={() => setMediaPickerOpen(true)} type="button">
                      Change
                    </Button>
                    <Button variant="secondary" onClick={() => setSeo((prev) => ({ ...prev, ogImage: '' }))} type="button">
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => setMediaPickerOpen(true)} type="button">
                    Select from Media Library
                  </Button>
                )}
              </div>
              <Select
                label="Twitter Card"
                value={seo.twitterCard}
                onChange={(e) => setSeo((prev) => ({ ...prev, twitterCard: e.target.value }))}
                options={TWITTER_CARD_OPTIONS}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Robots</h2>
            <Select
              label="Search Engine Indexing"
              value={seo.robots}
              onChange={(e) => setSeo((prev) => ({ ...prev, robots: e.target.value }))}
              options={ROBOTS_OPTIONS}
            />
            <p className="mt-2 text-xs text-gray-400">
              Controls whether search engines can index your website.
            </p>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Google Search Preview</h2>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-1 truncate text-sm text-success-700">{previewUrl}</div>
              <div className="mb-1 truncate text-lg text-primary-700">{previewTitle}</div>
              <p className="text-sm text-gray-500 line-clamp-2">{previewDescription}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Social Preview</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex h-40 items-center justify-center bg-gray-100">
                {seo.ogImage ? (
                  <img
                    src={seo.ogImage.startsWith('http') || seo.ogImage.startsWith('/') ? seo.ogImage : undefined}
                    alt="Social preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="hidden h-full w-full flex-col items-center justify-center text-gray-400">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 text-xs">No image selected</span>
                </div>
              </div>
              <div className="p-4">
                <p className="truncate text-xs uppercase text-gray-400">{previewUrl}</p>
                <p className="mt-1 truncate font-semibold text-gray-900">{previewTitle}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{previewDescription}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset SEO"
        message="This will reset all SEO settings to their default values. This action cannot be undone."
        confirmLabel="Reset"
        loading={resetting}
      />

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}
