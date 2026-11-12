import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import LoadingState from '../components/LoadingState'
import { getSiteSettingsDummy, updateSiteSettingsDummy } from '../services/dummy/settingsDummy'
import { isSafeUrl } from '../lib/validation'

export default function SettingsPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getSiteSettingsDummy()
        if (active) {
          setSettings(data)
        }
      } catch {
        if (active) {
          setSettings(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const validate = () => {
    const errs = {}
    if (!settings.siteName.trim()) {
      errs.siteName = t("Site name is required")
    } else if (settings.siteName.length > 100) {
      errs.siteName = t("Site name must be 100 characters or less")
    }
    if (settings.siteDescription && settings.siteDescription.length > 300) {
      errs.siteDescription = t("Site description must be 300 characters or less")
    }
    if (settings.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contact.email)) {
      errs.contactEmail = t("Please enter a valid email address")
    }
    if (settings.logo && !isSafeUrl(settings.logo)) {
      errs.logo = 'Logo URL must be a valid http:// or https:// URL'
    }
    if (settings.favicon && !isSafeUrl(settings.favicon)) {
      errs.favicon = 'Favicon URL must be a valid http:// or https:// URL'
    }
    return errs
  }

  const handleFieldChange = (section, field, value) => {
    if (section) {
      setSettings((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }))
    } else {
      setSettings((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await updateSiteSettingsDummy(settings)
      setSuccessMessage(t("Settings saved successfully."))
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setErrors({ form: err.message || t("Failed to save settings. Please try again.") })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div>
        <PageHeader title=={t("Site Settings")} subtitle=={t("Configure your website")} />
        <Card className="p-6">
          <LoadingState message=={t("Loading settings...")} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title=={t("Site Settings")} subtitle=={t("Configure your website")} />

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700 animate-fade-in">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}

      {errors.form && (
        <div className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Website")}</h2>
          <div className="space-y-4">
            <Input
              label=={t("Site Name")}
              name="siteName"
              value={settings.siteName}
              onChange={(e) => handleFieldChange(null, 'siteName', e.target.value)}
              error={errors.siteName}
              required
            />
            <Textarea
              label=={t("Site Description")}
              name="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleFieldChange(null, 'siteDescription', e.target.value)}
              rows={3}
            />
            <Input
              label=={t("Logo URL")}
              name="logo"
              value={settings.logo}
              onChange={(e) => handleFieldChange(null, 'logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <Input
              label=={t("Favicon URL")}
              name="favicon"
              value={settings.favicon}
              onChange={(e) => handleFieldChange(null, 'favicon', e.target.value)}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Contact")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label=={t("Email")}
              name="contactEmail"
              type="email"
              value={settings.contact.email}
              onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
              error={errors.contactEmail}
              placeholder="admin@example.com"
            />
            <Input
              label=={t("Phone")}
              name="contactPhone"
              value={settings.contact.phone}
              onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
              placeholder="+1 234 567 890"
            />
            <Input
              label=={t("WhatsApp")}
              name="contactWhatsapp"
              value={settings.contact.whatsapp}
              onChange={(e) => handleFieldChange('contact', 'whatsapp', e.target.value)}
              placeholder="+1 234 567 890"
            />
            <Input
              label=={t("Address")}
              name="contactAddress"
              value={settings.contact.address}
              onChange={(e) => handleFieldChange('contact', 'address', e.target.value)}
              placeholder="123 Main Street, City, Country"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("Social Media")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Facebook"
              name="socialFacebook"
              value={settings.social.facebook}
              onChange={(e) => handleFieldChange('social', 'facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
            <Input
              label="Instagram"
              name="socialInstagram"
              value={settings.social.instagram}
              onChange={(e) => handleFieldChange('social', 'instagram', e.target.value)}
              placeholder="https://instagram.com/youraccount"
            />
            <Input
              label="YouTube"
              name="socialYoutube"
              value={settings.social.youtube}
              onChange={(e) => handleFieldChange('social', 'youtube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
            />
            <Input
              label="TikTok"
              name="socialTiktok"
              value={settings.social.tiktok}
              onChange={(e) => handleFieldChange('social', 'tiktok', e.target.value)}
              placeholder="https://tiktok.com/@youraccount"
            />
            <Input
              label="LinkedIn"
              name="socialLinkedin"
              value={settings.social.linkedin}
              onChange={(e) => handleFieldChange('social', 'linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            {saving ? t("Saving...") : t("Save Settings")}
          </Button>
        </div>
      </form>
    </div>
  )
}
