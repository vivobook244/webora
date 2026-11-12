import { useState } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'
import Button from '../components/Button'
import Input from '../components/Input'

export default function LoginPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const validate = () => {
    const errs = {}
    if (!email.trim()) {
      errs.email = t("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = t("Please enter a valid email address")
    }
    if (!password) {
      errs.password = t("Password is required")
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setFormError(err.message || t("Login failed. Please try again."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Lite</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("Sign in to your admin account")}
          </p>
        </div>

        <div className="card-base p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {formError && (
              <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
                {formError}
              </div>
            )}

            <Input
              label=={t("Email")}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label=={t("Password")}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=={t("Enter your password")}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? t("Signing in...") : t("Sign In")}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
            <p className="font-medium text-gray-600">{t("Demo Credentials")}</p>
            <p className="mt-1">Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
