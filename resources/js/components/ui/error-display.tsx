import { AlertCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  errors?: Record<string, string> | string
  title?: string
  className?: string
}

export function ErrorDisplay({ errors, title = 'Error', className }: ErrorDisplayProps) {
  if (!errors) return null

  // Handle string errors (general error messages)
  if (typeof errors === 'string') {
    return (
      <Alert variant="destructive" className={cn('animate-in fade-in-0 slide-in-from-top-1', className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{errors}</AlertDescription>
      </Alert>
    )
  }

  // Handle object errors (validation errors)
  const errorKeys = Object.keys(errors)
  if (errorKeys.length === 0) return null

  // Single error
  if (errorKeys.length === 1) {
    return (
      <Alert variant="destructive" className={cn('animate-in fade-in-0 slide-in-from-top-1', className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{errors[errorKeys[0]]}</AlertDescription>
      </Alert>
    )
  }

  // Multiple errors
  return (
    <Alert variant="destructive" className={cn('animate-in fade-in-0 slide-in-from-top-1', className)}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title} - {errorKeys.length} issue{errorKeys.length > 1 ? 's' : ''} found</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          {errorKeys.map((key) => (
            <li key={key} className="text-sm">
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>: {errors[key]}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

interface FieldErrorProps {
  error?: string
  className?: string
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null

  return (
    <p className={cn('text-sm text-destructive flex items-center gap-1 mt-1 animate-in fade-in-0 slide-in-from-left-1', className)}>
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{error}</span>
    </p>
  )
}
