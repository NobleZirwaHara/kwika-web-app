import { ReactNode } from 'react'
import { ErrorDisplay } from './error-display'
import { cn } from '@/lib/utils'

interface FormWrapperProps {
  onSubmit: (e: React.FormEvent) => void
  errors?: Record<string, string>
  children: ReactNode
  className?: string
  errorTitle?: string
  excludeFieldsFromGeneral?: string[]
}

/**
 * FormWrapper - Wraps forms with automatic error display
 *
 * Features:
 * - Automatically displays general errors at the top of the form
 * - Filters out field-specific errors from general display
 * - Supports custom error title
 *
 * Usage:
 * ```tsx
 * <FormWrapper
 *   onSubmit={handleSubmit}
 *   errors={errors}
 *   errorTitle="Booking Error"
 *   excludeFieldsFromGeneral={['name', 'email']}
 * >
 *   <Input ... />
 *   <FieldError error={errors?.name} />
 * </FormWrapper>
 * ```
 */
export function FormWrapper({
  onSubmit,
  errors,
  children,
  className,
  errorTitle = 'Form Error',
  excludeFieldsFromGeneral = [],
}: FormWrapperProps) {
  // Check if there are any general errors (not field-specific)
  const hasGeneralError = errors && Object.keys(errors).some(
    key => !excludeFieldsFromGeneral.includes(key)
  )

  // Filter out field-specific errors
  const generalErrors = errors ? Object.keys(errors).reduce((acc, key) => {
    if (!excludeFieldsFromGeneral.includes(key)) {
      acc[key] = errors[key]
    }
    return acc
  }, {} as Record<string, string>) : undefined

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {/* General Error Display */}
      {hasGeneralError && generalErrors && Object.keys(generalErrors).length > 0 && (
        <ErrorDisplay
          errors={generalErrors}
          title={errorTitle}
        />
      )}

      {/* Form Fields */}
      {children}
    </form>
  )
}
