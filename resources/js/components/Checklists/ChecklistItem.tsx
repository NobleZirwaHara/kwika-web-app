import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, Clock, AlertCircle } from 'lucide-react'

interface ChecklistItemProps {
  bookingId: number
  item: {
    id: number
    title: string
    notes: string | null
    due_date: string | null
    due_date_formatted: string | null
    is_completed: boolean
    is_overdue: boolean
    is_due_today: boolean
  }
  onEdit: (item: ChecklistItemProps['item']) => void
}

export function ChecklistItem({ bookingId, item, onEdit }: ChecklistItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  function handleToggle() {
    if (isToggling) return

    setIsToggling(true)
    router.post(`/provider/bookings/${bookingId}/checklist/items/${item.id}/toggle`, {}, {
      preserveScroll: true,
      onFinish: () => setIsToggling(false),
    })
  }

  function handleDelete() {
    if (!confirm('Are you sure you want to delete this item?')) return

    router.delete(`/provider/bookings/${bookingId}/checklist/items/${item.id}`, {
      preserveScroll: true,
    })
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border transition-colors',
        item.is_completed ? 'bg-muted/50' : 'hover:bg-muted/30',
        item.is_overdue && !item.is_completed && 'border-destructive/50 bg-destructive/5'
      )}
    >
      <Checkbox
        checked={item.is_completed}
        onCheckedChange={handleToggle}
        disabled={isToggling}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium',
              item.is_completed && 'line-through text-muted-foreground'
            )}
          >
            {item.title}
          </span>

          {item.is_overdue && !item.is_completed && (
            <Badge variant="destructive" className="gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </Badge>
          )}

          {item.is_due_today && !item.is_completed && (
            <Badge variant="secondary" className="gap-1 text-xs bg-amber-100 text-amber-800">
              <Clock className="h-3 w-3" />
              Due Today
            </Badge>
          )}
        </div>

        {item.notes && (
          <p className={cn(
            'text-sm text-muted-foreground mt-1',
            item.is_completed && 'line-through'
          )}>
            {item.notes}
          </p>
        )}

        {item.due_date_formatted && !item.is_overdue && !item.is_due_today && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Due: {item.due_date_formatted}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(item)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
