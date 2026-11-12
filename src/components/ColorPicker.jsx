export default function ColorPicker({ label, value, onChange }) {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value)

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <input
            type="color"
            value={isValidHex ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-lg border border-gray-200 p-0.5"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field font-mono text-sm ${!isValidHex ? 'input-field-error' : ''}`}
          placeholder="#2563EB"
        />
      </div>
      {!isValidHex && (
        <p className="mt-1 text-xs text-error-600">Please enter a valid hex color (e.g. #2563EB)</p>
      )}
    </div>
  )
}
