import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  typingText: string | null
  className?: string
}

export function TypingIndicator({ typingText, className }: TypingIndicatorProps) {
  if (!typingText) return null

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2', className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
      </div>
      <span className="text-sm text-muted-foreground">{typingText}</span>
    </div>
  )
}
