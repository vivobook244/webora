export default function PublicLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}
