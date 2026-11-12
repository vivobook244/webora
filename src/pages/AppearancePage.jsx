import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Select from '../components/Select'
import ColorPicker from '../components/ColorPicker'
import LoadingState from '../components/LoadingState'
import ConfirmModal from '../components/ConfirmModal'
import { getAppearanceDummy, updateAppearanceDummy, resetAppearanceDummy } from '../services/dummy/appearanceDummy'
import PageRenderer from '../components/public/PageRenderer'
import PublicLayout from '../layouts/PublicLayout'
import { getPagesDummy } from '../services/dummy/pageDummy'
import { getSectionsByPageDummy } from '../services/dummy/sectionDummy'
import { getSiteSettingsDummy } from '../services/dummy/settingsDummy'
import { getNavigationDummy } from '../services/dummy/navigationDummy'
import { getActiveTemplateDummy } from '../services/dummy/templateDummy'
import { getMediaDummy } from '../services/dummy/mediaDummy'

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
  const { t } = useLanguage()
  const [appearance, setAppearance] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(true)
  const [previewError, setPreviewError] = useState('')
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

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [pages, settings, navItems, template, mediaList] = await Promise.all([
          getPagesDummy(),
          getSiteSettingsDummy(),
          getNavigationDummy(),
          getActiveTemplateDummy(),
          getMediaDummy(),
        ])
        const page = pages.find((item) => item.isHome)
          || pages.find((item) => item.status === 'PUBLISHED')
          || pages[0]
          || null
        const sections = page ? await getSectionsByPageDummy(page.id) : []

        if (active) {
          setPreviewData({ pages, page, sections, settings, navItems, template, mediaList })
        }
      } catch {
        if (active) setPreviewError('Website preview data could not be loaded.')
      } finally {
        if (active) setPreviewLoading(false)
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
      setSuccessMessage(t("Appearance saved successfully."))
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
        <PageHeader title="Appearance" subtitle={t("Customize your website design")} />
        <Card className="p-6">
          <LoadingState message="Loading appearance..." />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Appearance" subtitle={t("Customize your website design")}>
        <Button variant="secondary" onClick={() => setResetOpen(true)}>
          {t("Reset to Defaults")}
        </Button>
        <Button onClick={handleSave} loading={saving}>
          {saving ? 'Saving...' : t("Save Changes")}
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
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Colors")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorPicker label={t("Primary")} value={appearance.colors.primary} onChange={(v) => updateColor('primary', v)} />
              <ColorPicker label={t("Secondary")} value={appearance.colors.secondary} onChange={(v) => updateColor('secondary', v)} />
              <ColorPicker label={t("Background")} value={appearance.colors.background} onChange={(v) => updateColor('background', v)} />
              <ColorPicker label={t("Surface")} value={appearance.colors.surface} onChange={(v) => updateColor('surface', v)} />
              <ColorPicker label={t("Text")} value={appearance.colors.text} onChange={(v) => updateColor('text', v)} />
              <ColorPicker label={t("Muted Text")} value={appearance.colors.mutedText} onChange={(v) => updateColor('mutedText', v)} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Typography")}</h2>
            <div className="space-y-4">
              <Select label={t("Heading Font")} value={appearance.typography.headingFont} onChange={(e) => updateTypography('headingFont', e.target.value)} options={FONT_OPTIONS} />
              <Select label={t("Body Font")} value={appearance.typography.bodyFont} onChange={(e) => updateTypography('bodyFont', e.target.value)} options={FONT_OPTIONS} />
              <Select label={t("Base Font Size")} value={appearance.typography.baseSize} onChange={(e) => updateTypography('baseSize', e.target.value)} options={SIZE_OPTIONS} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Layout")}</h2>
            <div className="space-y-4">
              <Select label={t("Container Width")} value={appearance.layout.containerWidth} onChange={(e) => updateLayout('containerWidth', e.target.value)} options={CONTAINER_OPTIONS} />
              <Select label={t("Section Spacing")} value={appearance.layout.sectionSpacing} onChange={(e) => updateLayout('sectionSpacing', e.target.value)} options={SECTION_SPACING_OPTIONS} />
              <Select label={t("Content Spacing")} value={appearance.layout.contentSpacing} onChange={(e) => updateLayout('contentSpacing', e.target.value)} options={CONTENT_SPACING_OPTIONS} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Border Radius")}</h2>
            <div className="space-y-4">
              <Select label={t("Small")} value={appearance.radius.small} onChange={(e) => updateRadius('small', e.target.value)} options={RADIUS_OPTIONS} />
              <Select label={t("Medium")} value={appearance.radius.medium} onChange={(e) => updateRadius('medium', e.target.value)} options={RADIUS_OPTIONS} />
              <Select label={t("Large")} value={appearance.radius.large} onChange={(e) => updateRadius('large', e.target.value)} options={RADIUS_OPTIONS} />
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("Live Website Preview")}</h2>
                <p className="text-xs text-gray-500">{t("Uses the current page content and active template")}</p>
              </div>
              <span className="shrink-0 rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">{t("Live")}</span>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-lg border border-gray-200 bg-white">
              {previewLoading ? (
                <div className="p-6"><LoadingState message={t("Loading website preview...")} /></div>
              ) : previewError ? (
                <div className="p-6 text-sm text-error-600">{previewError}</div>
              ) : previewData?.page ? (
                <PublicLayout
                  settings={previewData.settings}
                  navItems={previewData.navItems}
                  pages={previewData.pages}
                  appearance={appearance}
                  template={previewData.template}
                >
                  <PageRenderer
                    page={previewData.page}
                    sections={previewData.sections}
                    mediaList={previewData.mediaList}
                    template={previewData.template}
                  />
                </PublicLayout>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  {t("Create a page and add sections to see the website preview.")}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title={t("Reset Appearance")}
        message={t("This will reset all appearance settings to their default values. This action cannot be undone.")}
        confirmLabel="Reset"
        loading={resetting}
      />
    </div>
  )
}
