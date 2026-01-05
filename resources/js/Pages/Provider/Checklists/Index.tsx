import { Head, Link, router } from '@inertiajs/react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ListChecks,
  Plus,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Eye,
  CheckSquare,
  FileText
} from 'lucide-react'
import { useForm } from '@inertiajs/react'

interface Template {
  id: number
  name: string
  description: string | null
  is_active: boolean
  item_count: number
  created_at: string
  bookings_using_count: number
}

interface Props {
  templates: Template[]
  stats: {
    total: number
    active: number
    total_items: number
  }
}

export default function ChecklistsIndex({ templates, stats }: Props) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)

  const createForm = useForm({
    name: '',
    description: '',
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    createForm.post('/provider/checklists', {
      onSuccess: () => {
        createForm.reset()
        setCreateDialogOpen(false)
      },
    })
  }

  function handleDuplicate(template: Template) {
    router.post(`/provider/checklists/${template.id}/duplicate`, {}, {
      preserveScroll: true,
    })
  }

  function handleToggleActive(template: Template) {
    router.put(`/provider/checklists/${template.id}/toggle`, {}, {
      preserveScroll: true,
    })
  }

  function handleDelete() {
    if (!templateToDelete) return

    router.delete(`/provider/checklists/${templateToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setTemplateToDelete(null)
      },
    })
  }

  function openDeleteDialog(template: Template) {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  return (
    <ProviderLayout title="Checklist Templates">
      <Head title="Checklist Templates" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Checklist Templates</h1>
            <p className="text-muted-foreground mt-1">
              Create reusable checklists to quickly set up booking preparation tasks
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_items}</div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        {template.name}
                      </CardTitle>
                      {template.description && (
                        <CardDescription>{template.description}</CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/provider/checklists/${template.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View & Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(template)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <Badge variant="secondary">{template.item_count}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used in bookings</span>
                    <span className="font-medium">{template.bookings_using_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={() => handleToggleActive(template)}
                    />
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/provider/checklists/${template.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Template
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListChecks className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create checklist templates to quickly set up preparation tasks for your bookings.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Checklist Template</DialogTitle>
            <DialogDescription>
              Create a new reusable checklist template. You can add items after creating.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={createForm.data.name}
                  onChange={(e) => createForm.setData('name', e.target.value)}
                  placeholder="e.g., Wedding Setup Checklist"
                />
                {createForm.errors.name && (
                  <p className="text-sm text-destructive">{createForm.errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={createForm.data.description}
                  onChange={(e) => createForm.setData('description', e.target.value)}
                  placeholder="Describe what this checklist is for..."
                  rows={3}
                />
                {createForm.errors.description && (
                  <p className="text-sm text-destructive">{createForm.errors.description}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  createForm.reset()
                  setCreateDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createForm.processing || !createForm.data.name}
              >
                {createForm.processing ? 'Creating...' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
              {templateToDelete && templateToDelete.bookings_using_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  Note: This template is currently used in {templateToDelete.bookings_using_count} booking(s).
                  Existing booking checklists will not be affected.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  )
}
