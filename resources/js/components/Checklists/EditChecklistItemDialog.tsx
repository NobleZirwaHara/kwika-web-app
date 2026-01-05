import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ChecklistItem {
  id: number
  title: string
  notes: string | null
  due_date: string | null
}

interface EditChecklistItemDialogProps {
  bookingId: number
  item: ChecklistItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditChecklistItemDialog({
  bookingId,
  item,
  open,
  onOpenChange,
}: EditChecklistItemDialogProps) {
  const form = useForm({
    title: '',
    notes: '',
    due_date: '',
  })

  useEffect(() => {
    if (item) {
      form.setData({
        title: item.title,
        notes: item.notes || '',
        due_date: item.due_date || '',
      })
    }
  }, [item])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!item) return

    form.put(`/provider/bookings/${bookingId}/checklist/items/${item.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Checklist Item</DialogTitle>
          <DialogDescription>
            Update the details for this checklist item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
                placeholder="Enter task title..."
              />
              {form.errors.title && (
                <p className="text-sm text-destructive">{form.errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (optional)</Label>
              <Textarea
                id="edit-notes"
                value={form.data.notes}
                onChange={(e) => form.setData('notes', e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
              {form.errors.notes && (
                <p className="text-sm text-destructive">{form.errors.notes}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-due_date">Due Date (optional)</Label>
              <Input
                id="edit-due_date"
                type="date"
                value={form.data.due_date}
                onChange={(e) => form.setData('due_date', e.target.value)}
              />
              {form.errors.due_date && (
                <p className="text-sm text-destructive">{form.errors.due_date}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing || !form.data.title}>
              {form.processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
