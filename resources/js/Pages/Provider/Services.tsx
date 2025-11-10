import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Badge } from '@/Components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Plus, Edit, Trash2, Package, DollarSign, Clock } from 'lucide-react'

interface Service {
  id: number
  name: string
  slug: string
  description: string | null
  base_price: number
  price_type: 'fixed' | 'hourly' | 'daily' | 'custom'
  max_price: number | null
  currency: string
  duration: number | null
  max_attendees: number | null
  category_name: string
  is_active: boolean
  bookings_count: number
}

interface Category {
  id: number
  name: string
}

interface Props {
  provider: {
    id: number
    business_name: string
    logo?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
  }
  services: Service[]
  categories: Category[]
}

export default function Services({ provider, services, categories }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    service_category_id: '',
    description: '',
    base_price: '',
    price_type: 'fixed' as 'fixed' | 'hourly' | 'daily' | 'custom',
    max_price: '',
    duration: '',
    max_attendees: '',
    inclusions: [''],
    is_active: true,
  })

  const deleteForm = useForm({})

  function openCreateDialog() {
    reset()
    setEditingService(null)
    setDialogOpen(true)
  }

  function openEditDialog(service: Service) {
    setEditingService(service)
    setData({
      name: service.name,
      service_category_id: categories.find(c => c.name === service.category_name)?.id.toString() || '',
      description: service.description || '',
      base_price: service.base_price.toString(),
      price_type: service.price_type,
      max_price: service.max_price?.toString() || '',
      duration: service.duration?.toString() || '',
      max_attendees: service.max_attendees?.toString() || '',
      inclusions: [''],
      is_active: service.is_active,
    })
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (editingService) {
      put(`/provider/services/${editingService.id}`, {
        onSuccess: () => {
          setDialogOpen(false)
          reset()
        },
      })
    } else {
      post('/provider/services', {
        onSuccess: () => {
          setDialogOpen(false)
          reset()
        },
      })
    }
  }

  function handleDelete() {
    if (serviceToDelete) {
      deleteForm.delete(`/provider/services/${serviceToDelete}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setServiceToDelete(null)
        },
      })
    }
  }

  function toggleServiceStatus(serviceId: number, currentStatus: boolean) {
    put(`/provider/services/${serviceId}/toggle`, {
      is_active: !currentStatus,
    })
  }

  return (
    <ProviderLayout title="Services" provider={provider}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Service Catalog</h2>
            <p className="text-muted-foreground mt-1">
              Manage your service offerings and pricing
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{service.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {service.category_name}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {service.currency} {service.base_price.toLocaleString()}
                      {service.max_price && ` - ${service.max_price.toLocaleString()}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Per {service.price_type}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    {service.duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutes</span>
                      </div>
                    )}
                    {service.max_attendees && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Max {service.max_attendees} attendees</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {service.bookings_count} booking{service.bookings_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleServiceStatus(service.id, service.is_active)}
                    >
                      {service.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setServiceToDelete(service.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first service to start receiving bookings
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Update your service details and pricing'
                : 'Add a new service to your catalog'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="e.g., Wedding Photography"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.service_category_id}
                onValueChange={(value) => setData('service_category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service_category_id && (
                <p className="text-sm text-destructive">{errors.service_category_id}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Describe your service..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">
                  Base Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  value={data.base_price}
                  onChange={(e) => setData('base_price', e.target.value)}
                  placeholder="5000"
                />
                {errors.base_price && (
                  <p className="text-sm text-destructive">{errors.base_price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_type">
                  Price Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={data.price_type}
                  onValueChange={(value) => setData('price_type', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {data.price_type === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="max_price">Maximum Price</Label>
                <Input
                  id="max_price"
                  type="number"
                  value={data.max_price}
                  onChange={(e) => setData('max_price', e.target.value)}
                  placeholder="10000"
                />
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={data.duration}
                  onChange={(e) => setData('duration', e.target.value)}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_attendees">Max Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={data.max_attendees}
                  onChange={(e) => setData('max_attendees', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={processing}>
              {processing ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteForm.processing}
            >
              {deleteForm.processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  )
}
