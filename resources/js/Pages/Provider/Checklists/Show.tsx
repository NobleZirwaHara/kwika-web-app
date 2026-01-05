import { Head, Link, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  ListChecks,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Clock,
  CheckSquare,
  Save
} from 'lucide-react'

interface TemplateItem {
  id: number
  title: string
  notes: string | null
  default_days_before_event: number | null
  display_order: number
}

interface Template {
  id: number
  name: string
  description: string | null
  is_active: boolean
  items: TemplateItem[]
  created_at: string
  updated_at: string
  bookings_using_count: number
}

interface Props {
  template: Template
}

export default function ChecklistShow({ template }: Props) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const editForm = useForm({
    name: template.name,
    description: template.description || '',
  })

  const itemForm = useForm({
    title: '',
    notes: '',
    default_days_before_event: '',
  })

  function handleEditTemplate(e: React.FormEvent) {
    e.preventDefault()

    editForm.put(`/provider/checklists/${template.id}`, {
      preserveScroll: true,
      onSuccess: () => setEditDialogOpen(false),
    })
  }

  function handleToggleActive() {
    router.put(`/provider/checklists/${template.id}/toggle`, {}, {
      preserveScroll: true,
    })
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault()

    itemForm.post(`/provider/checklists/${template.id}/items`, {
      preserveScroll: true,
      onSuccess: () => {
        itemForm.reset()
        setAddItemDialogOpen(false)
      },
    })
  }

  function handleEditItem(e: React.FormEvent) {
    e.preventDefault()
    if (!editingItem) return

    itemForm.put(`/provider/checklists/${template.id}/items/${editingItem.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        itemForm.reset()
        setEditItemDialogOpen(false)
        setEditingItem(null)
      },
    })
  }

  function handleDeleteItem(item: TemplateItem) {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return

    router.delete(`/provider/checklists/${template.id}/items/${item.id}`, {
      preserveScroll: true,
    })
  }

  function handleDeleteTemplate() {
    router.delete(`/provider/checklists/${template.id}`, {
      onSuccess: () => {
        // Will redirect to index
      },
    })
  }

  function openEditItemDialog(item: TemplateItem) {
    setEditingItem(item)
    itemForm.setData({
      title: item.title,
      notes: item.notes || '',
      default_days_before_event: item.default_days_before_event?.toString() || '',
    })
    setEditItemDialogOpen(true)
  }

  function closeItemDialog() {
    itemForm.reset()
    setAddItemDialogOpen(false)
    setEditItemDialogOpen(false)
    setEditingItem(null)
  }

  return (
    <ProviderLayout title={template.name}>
      <Head title={`${template.name} - Checklist Template`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/checklists">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{template.name}</h1>
                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                  {template.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {template.description && (
                <p className="text-muted-foreground mt-1">{template.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{template.items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used in Bookings</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{template.bookings_using_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Switch
                  checked={template.is_active}
                  onCheckedChange={handleToggleActive}
                />
                <span className="text-sm">
                  {template.is_active ? 'Available for use' : 'Hidden from templates'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Checklist Items
                </CardTitle>
                <CardDescription>
                  Items will be copied to booking checklists when this template is applied
                </CardDescription>
              </div>
              <Button onClick={() => setAddItemDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {template.items.length > 0 ? (
              <div className="space-y-2">
                {template.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-muted-foreground mt-1 cursor-move">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-mono">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{item.title}</span>
                        {item.default_days_before_event && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {item.default_days_before_event} days before
                          </Badge>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditItemDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No items in this template yet.
                </p>
                <Button onClick={() => setAddItemDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the template name and description.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditTemplate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.data.name}
                  onChange={(e) => editForm.setData('name', e.target.value)}
                />
                {editForm.errors.name && (
                  <p className="text-sm text-destructive">{editForm.errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.data.description}
                  onChange={(e) => editForm.setData('description', e.target.value)}
                  rows={3}
                />
                {editForm.errors.description && (
                  <p className="text-sm text-destructive">{editForm.errors.description}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.processing || !editForm.data.name}>
                <Save className="h-4 w-4 mr-2" />
                {editForm.processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={(open) => !open && closeItemDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
            <DialogDescription>
              Add a new item to this template. These items will be copied to bookings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddItem}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-title">Title *</Label>
                <Input
                  id="add-title"
                  value={itemForm.data.title}
                  onChange={(e) => itemForm.setData('title', e.target.value)}
                  placeholder="e.g., Confirm venue access time"
                />
                {itemForm.errors.title && (
                  <p className="text-sm text-destructive">{itemForm.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-notes">Notes (optional)</Label>
                <Textarea
                  id="add-notes"
                  value={itemForm.data.notes}
                  onChange={(e) => itemForm.setData('notes', e.target.value)}
                  placeholder="Additional details or instructions..."
                  rows={2}
                />
                {itemForm.errors.notes && (
                  <p className="text-sm text-destructive">{itemForm.errors.notes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-days">Days Before Event (optional)</Label>
                <Input
                  id="add-days"
                  type="number"
                  min="0"
                  value={itemForm.data.default_days_before_event}
                  onChange={(e) => itemForm.setData('default_days_before_event', e.target.value)}
                  placeholder="e.g., 3"
                />
                <p className="text-xs text-muted-foreground">
                  When applied to a booking, due date will be calculated from the event date.
                </p>
                {itemForm.errors.default_days_before_event && (
                  <p className="text-sm text-destructive">{itemForm.errors.default_days_before_event}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeItemDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={itemForm.processing || !itemForm.data.title}>
                {itemForm.processing ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editItemDialogOpen} onOpenChange={(open) => !open && closeItemDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Item</DialogTitle>
            <DialogDescription>
              Update this checklist item.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditItem}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-title">Title *</Label>
                <Input
                  id="edit-item-title"
                  value={itemForm.data.title}
                  onChange={(e) => itemForm.setData('title', e.target.value)}
                />
                {itemForm.errors.title && (
                  <p className="text-sm text-destructive">{itemForm.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-item-notes">Notes (optional)</Label>
                <Textarea
                  id="edit-item-notes"
                  value={itemForm.data.notes}
                  onChange={(e) => itemForm.setData('notes', e.target.value)}
                  rows={2}
                />
                {itemForm.errors.notes && (
                  <p className="text-sm text-destructive">{itemForm.errors.notes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-item-days">Days Before Event (optional)</Label>
                <Input
                  id="edit-item-days"
                  type="number"
                  min="0"
                  value={itemForm.data.default_days_before_event}
                  onChange={(e) => itemForm.setData('default_days_before_event', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When applied to a booking, due date will be calculated from the event date.
                </p>
                {itemForm.errors.default_days_before_event && (
                  <p className="text-sm text-destructive">{itemForm.errors.default_days_before_event}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeItemDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={itemForm.processing || !itemForm.data.title}>
                <Save className="h-4 w-4 mr-2" />
                {itemForm.processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{template.name}"? This action cannot be undone.
              {template.bookings_using_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  Note: This template is referenced by {template.bookings_using_count} booking checklist(s).
                  Existing booking checklists will not be affected.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  )
}
