import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'
import LoadingState from '../components/LoadingState'

export default function ProtectedRoute({ children, roles = ['ADMIN'] }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState message="Checking authentication..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
