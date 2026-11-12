import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Select from '../components/Select'
import ColorPicker from '../components/ColorPicker'
import LoadingState from '../components/LoadingState'
import ConfirmModal from '../components/ConfirmModal'
import { getAppearanceDummy, updateAppearanceDummy, resetAppearanceDummy } from '../services/dummy/appearanceDummy'

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'system-ui', label: 'System UI' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
]

const SIZE_OPTIONS = [
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
]

const CONTAINER_OPTIONS = [
  { value: '1024px', label: '1024px' },
  { value: '1200px', label: '1200px' },
  { value: '1280px', label: '1280px' },
]

const SECTION_SPACING_OPTIONS = [
  { value: '48px', label: '48px' },
  { value: '64px', label: '64px' },
  { value: '80px', label: '80px' },
  { value: '96px', label: '96px' },
]

const CONTENT_SPACING_OPTIONS = [
  { value: '16px', label: '16px' },
  { value: '24px', label: '24px' },
  { value: '32px', label: '32px' },
]

const RADIUS_OPTIONS = [
  { value: '4px', label: '4px' },
  { value: '8px', label: '8px' },
  { value: '12px', label: '12px' },
  { value: '16px', label: '16px' },
  { value: '24px', label: '24px' },
]

export default function AppearancePage() {
  const [appearance, setAppearance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getAppearanceDummy()
        if (active) setAppearance(data)
      } catch {
        if (active) setError('Failed to load appearance settings')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const updateColor = (key, value) => {
    setAppearance((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }))
  }

  const updateTypography = (key, value) => {
    setAppearance((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: value },
    }))
  }

  const updateLayout = (key, value) => {
    setAppearance((prev) => ({
      ...prev,
      layout: { ...prev.layout, [key]: value },
    }))
  }

  const updateRadius = (key, value) => {
    setAppearance((prev) => ({
      ...prev,
      radius: { ...prev.radius, [key]: value },
    }))
  }

  const validateColors = () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    return Object.values(appearance.colors).every((c) => hexRegex.test(c))
  }

  const handleSave = async () => {
    if (!validateColors()) {
      setError('Please fix all invalid color values before saving')
      return
    }
    setSaving(true)
    setError('')
    setSuccessMessage('')
    try {
      await updateAppearanceDummy(appearance)
      setSuccessMessage('Appearance saved successfully.')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setError(err.message || 'Failed to save appearance settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const fresh = await resetAppearanceDummy()
      setAppearance(fresh)
      setResetOpen(false)
      setSuccessMessage('Appearance reset to defaults.')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setError(err.message || 'Failed to reset appearance settings')
    } finally {
      setResetting(false)
    }
  }

  if (loading || !appearance) {
    return (
      <div>
        <PageHeader title="Appearance" subtitle="Customize your website design" />
        <Card className="p-6">
          <LoadingState message="Loading appearance..." />
        </Card>
      </div>
    )
  }

  const previewStyle = {
    '--preview-primary': appearance.colors.primary,
    '--preview-secondary': appearance.colors.secondary,
    '--preview-bg': appearance.colors.background,
    '--preview-surface': appearance.colors.surface,
    '--preview-text': appearance.colors.text,
    '--preview-muted': appearance.colors.mutedText,
    '--preview-radius-sm': appearance.radius.small,
    '--preview-radius-md': appearance.radius.medium,
    '--preview-radius-lg': appearance.radius.large,
    '--preview-heading-font': appearance.typography.headingFont,
    '--preview-body-font': appearance.typography.bodyFont,
    '--preview-base-size': appearance.typography.baseSize,
  }

  return (
    <div>
      <PageHeader title="Appearance" subtitle="Customize your website design">
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
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Colors</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorPicker label="Primary" value={appearance.colors.primary} onChange={(v) => updateColor('primary', v)} />
              <ColorPicker label="Secondary" value={appearance.colors.secondary} onChange={(v) => updateColor('secondary', v)} />
              <ColorPicker label="Background" value={appearance.colors.background} onChange={(v) => updateColor('background', v)} />
              <ColorPicker label="Surface" value={appearance.colors.surface} onChange={(v) => updateColor('surface', v)} />
              <ColorPicker label="Text" value={appearance.colors.text} onChange={(v) => updateColor('text', v)} />
              <ColorPicker label="Muted Text" value={appearance.colors.mutedText} onChange={(v) => updateColor('mutedText', v)} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Typography</h2>
            <div className="space-y-4">
              <Select
                label="Heading Font"
                value={appearance.typography.headingFont}
                onChange={(e) => updateTypography('headingFont', e.target.value)}
                options={FONT_OPTIONS}
              />
              <Select
                label="Body Font"
                value={appearance.typography.bodyFont}
                onChange={(e) => updateTypography('bodyFont', e.target.value)}
                options={FONT_OPTIONS}
              />
              <Select
                label="Base Font Size"
                value={appearance.typography.baseSize}
                onChange={(e) => updateTypography('baseSize', e.target.value)}
                options={SIZE_OPTIONS}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Layout</h2>
            <div className="space-y-4">
              <Select
                label="Container Width"
                value={appearance.layout.containerWidth}
                onChange={(e) => updateLayout('containerWidth', e.target.value)}
                options={CONTAINER_OPTIONS}
              />
              <Select
                label="Section Spacing"
                value={appearance.layout.sectionSpacing}
                onChange={(e) => updateLayout('sectionSpacing', e.target.value)}
                options={SECTION_SPACING_OPTIONS}
              />
              <Select
                label="Content Spacing"
                value={appearance.layout.contentSpacing}
                onChange={(e) => updateLayout('contentSpacing', e.target.value)}
                options={CONTENT_SPACING_OPTIONS}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Border Radius</h2>
            <div className="space-y-4">
              <Select
                label="Small"
                value={appearance.radius.small}
                onChange={(e) => updateRadius('small', e.target.value)}
                options={RADIUS_OPTIONS}
              />
              <Select
                label="Medium"
                value={appearance.radius.medium}
                onChange={(e) => updateRadius('medium', e.target.value)}
                options={RADIUS_OPTIONS}
              />
              <Select
                label="Large"
                value={appearance.radius.large}
                onChange={(e) => updateRadius('large', e.target.value)}
                options={RADIUS_OPTIONS}
              />
            </div>
          </Card>
        </div>

        {/* Live Preview Column */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Live Preview</h2>
            <div
              style={previewStyle}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              {/* Preview Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  backgroundColor: 'var(--preview-surface)',
                  fontFamily: 'var(--preview-heading-font)',
                }}
              >
                <span
                  className="text-base font-bold"
                  style={{ color: 'var(--preview-text)' }}
                >
                  Your Website
                </span>
                <div className="flex gap-4">
                  <span className="text-sm" style={{ color: 'var(--preview-muted)' }}>Home</span>
                  <span className="text-sm" style={{ color: 'var(--preview-muted)' }}>About</span>
                </div>
              </div>

              {/* Preview Hero */}
              <div
                className="px-6 py-12 text-center"
                style={{
                  backgroundColor: 'var(--preview-bg)',
                  fontFamily: 'var(--preview-body-font)',
                  fontSize: 'var(--preview-base-size)',
                }}
              >
                <h1
                  className="text-2xl font-bold"
                  style={{
                    color: 'var(--preview-text)',
                    fontFamily: 'var(--preview-heading-font)',
                  }}
                >
                  Welcome to Our Company
                </h1>
                <p
                  className="mt-3 text-sm"
                  style={{ color: 'var(--preview-muted)' }}
                >
                  Professional services for your business needs
                </p>
                <button
                  className="mt-4 px-5 py-2 text-sm font-medium text-white"
                  style={{
                    backgroundColor: 'var(--preview-primary)',
                    borderRadius: 'var(--preview-radius-md)',
                  }}
                >
                  Get Started
                </button>
              </div>

              {/* Preview Card */}
              <div
                className="px-6 py-8"
                style={{
                  backgroundColor: 'var(--preview-surface)',
                }}
              >
                <div
                  className="mx-auto max-w-sm p-5"
                  style={{
                    backgroundColor: 'var(--preview-bg)',
                    borderRadius: 'var(--preview-radius-lg)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <h3
                    className="text-base font-semibold"
                    style={{
                      color: 'var(--preview-text)',
                      fontFamily: 'var(--preview-heading-font)',
                    }}
                  >
                    Our Services
                  </h3>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: 'var(--preview-muted)' }}
                  >
                    We offer comprehensive solutions tailored to your needs, delivered with excellence and care.
                  </p>
                  <div className="mt-3">
                    <input
                      type="text"
                      disabled
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 text-sm"
                      style={{
                        backgroundColor: 'var(--preview-surface)',
                        color: 'var(--preview-text)',
                        borderRadius: 'var(--preview-radius-sm)',
                        border: '1px solid var(--preview-muted)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Footer */}
              <div
                className="px-6 py-4 text-center"
                style={{
                  backgroundColor: 'var(--preview-secondary)',
                }}
              >
                <p className="text-xs" style={{ color: '#fff' }}>
                  © 2026 Your Website. All rights reserved.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Appearance"
        message="This will reset all appearance settings to their default values. This action cannot be undone."
        confirmLabel="Reset"
        loading={resetting}
      />
    </div>
  )
}
