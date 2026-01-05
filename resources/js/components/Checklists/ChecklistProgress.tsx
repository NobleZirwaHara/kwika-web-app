import { cn } from '@/lib/utils'

interface ChecklistProgressProps {
  completed: number
  total: number
  className?: string
}

export function ChecklistProgress({ completed, total, className }: ChecklistProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-24">
        <div
          className={cn(
            'h-full transition-all duration-300',
            percentage === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {completed}/{total}
      </span>
    </div>
  )
}
