import { forwardRef, type TextareaHTMLAttributes, useId } from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  showCount?: boolean
  currentLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      showCount,
      currentLength,
      maxLength,
      id,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`

    const charCount =
      currentLength !== undefined
        ? currentLength
        : typeof value === 'string'
        ? value.length
        : 0

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              {label}
            </label>
          )}

          {(showCount || maxLength !== undefined) && (
            <span
              className={cn(
                'text-[11px] font-medium text-slate-400',
                maxLength && charCount >= maxLength && 'text-amber-600 font-semibold'
              )}
            >
              {charCount}
              {maxLength ? ` / ${maxLength}` : ''}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
            'focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20',
            'resize-y min-h-[80px]',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900',
            disabled && 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200',
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
