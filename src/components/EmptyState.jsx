export default function EmptyState({ title, message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && (
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {message && (
        <p className="max-w-sm text-sm text-gray-500">{message}</p>
      )}
    </div>
  )
}
