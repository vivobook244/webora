import { useLanguage } from '../lib/LanguageContext'

export default function StatusBadge({ status }) {
  const { t } = useLanguage()
  const labels = { PUBLISHED: t('Published'), ACTIVE: t('Active'), DRAFT: t('Draft'), INACTIVE: t('Inactive') }
  const styles = {
    PUBLISHED: 'bg-success-100 text-success-700',
    ACTIVE: 'bg-success-100 text-success-700',
    DRAFT: 'bg-warning-100 text-warning-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  }

  const className = styles[status] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {labels[status] || status}
    </span>
  )
}
