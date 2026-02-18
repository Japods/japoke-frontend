export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  multiline = false,
}) {
  const baseClasses = `
    w-full px-4 py-3 rounded-xl border
    font-body text-negro placeholder:text-gris/50
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-naranja/30 focus:border-naranja
    ${error ? 'border-error' : 'border-gris-border'}
  `;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-negro">
          {label}
          {required && <span className="text-naranja ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
