import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-caption font-medium text-body-strong"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block h-[44px] w-full rounded-md border px-4 py-3 text-body-md text-ink shadow-sm transition-colors placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-0 ${
            error
              ? 'border-semantic-error focus:border-semantic-error'
              : 'border-hairline-strong'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-caption text-semantic-error">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input
