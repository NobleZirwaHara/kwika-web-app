import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChecklistProgress } from './ChecklistProgress'
import { ChecklistItem } from './ChecklistItem'
import { AddChecklistItemDialog } from './AddChecklistItemDialog'
import { EditChecklistItemDialog } from './EditChecklistItemDialog'
import { ApplyTemplateDialog } from './ApplyTemplateDialog'
import { CheckSquare, Plus, AlertCircle, Trash2, ListChecks } from 'lucide-react'

interface ChecklistItemType {
  id: number
  title: string
  notes: string | null
  due_date: string | null
  due_date_formatted: string | null
  is_completed: boolean
  is_overdue: boolean
  is_due_today: boolean
  display_order: number
}

interface Checklist {
  id: number
  name: string
  items: ChecklistItemType[]
  progress: {
    total: number
    completed: number
    percentage: number
  }
  overdue_count: number
}

interface Template {
  id: number
  name: string
  description: string | null
  item_count: number
}

interface ChecklistSectionProps {
  bookingId: number
  bookingStatus: string
  checklist: Checklist | null
  templates: Template[]
}

export function ChecklistSection({
  bookingId,
  bookingStatus,
  checklist,
  templates,
}: ChecklistSectionProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItemType | null>(null)

  // Only show for confirmed or completed bookings
  if (bookingStatus !== 'confirmed' && bookingStatus !== 'completed') {
    return null
  }

  function handleEditItem(item: ChecklistItemType) {
    setEditingItem(item)
    setEditDialogOpen(true)
  }

  function handleDeleteChecklist() {
    if (!confirm('Are you sure you want to delete this checklist? All items will be removed.')) return

    router.delete(`/provider/bookings/${bookingId}/checklist`, {
      preserveScroll: true,
    })
  }

  // No checklist yet - show create option
  if (!checklist) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Booking Checklist
            </CardTitle>
            <CardDescription>
              Create a checklist to track preparation tasks for this booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No checklist created yet. Start tracking your tasks.
              </p>
              <Button onClick={() => setTemplateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Checklist
              </Button>
            </div>
          </CardContent>
        </Card>

        <ApplyTemplateDialog
          bookingId={bookingId}
          templates={templates}
          open={templateDialogOpen}
          onOpenChange={setTemplateDialogOpen}
        />
      </>
    )
  }

  // Has checklist - show items
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Booking Checklist
                {checklist.overdue_count > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {checklist.overdue_count} overdue
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Track preparation tasks for this booking
              </CardDescription>
            </div>
            <ChecklistProgress
              completed={checklist.progress.completed}
              total={checklist.progress.total}
            />
          </div>
        </CardHeader>
        <CardContent>
          {checklist.items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                No items in this checklist yet.
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {checklist.items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  bookingId={bookingId}
                  item={item}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          )}

          {checklist.items.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDeleteChecklist}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Checklist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddChecklistItemDialog
        bookingId={bookingId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <EditChecklistItemDialog
        bookingId={bookingId}
        item={editingItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  )
}
