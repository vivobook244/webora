export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  required = false,
  ...props
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`input-field resize-none ${error ? 'input-field-error' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
}
