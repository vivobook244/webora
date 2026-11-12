import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <h1 className="text-6xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>404</h1>
      <p className="mt-4 text-lg" style={{ color: 'var(--color-muted-text)' }}>The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 font-medium text-white"
        style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-medium)' }}
      >
        Back to Home
      </Link>
    </div>
  )
}
