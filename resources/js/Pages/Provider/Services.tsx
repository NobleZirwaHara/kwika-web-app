import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Package, DollarSign, Clock, Image as ImageIcon, X } from 'lucide-react'
import { processCroppedImage, createImagePreview } from '@/lib/imageUtils'
import { ImageCropperDialog } from '@/components/ImageCropperDialog'

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
  primary_image: string | null
  gallery_images: string[]
}

interface Subcategory {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  subcategories: Subcategory[]
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
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [primaryImage, setPrimaryImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null)

  // Cropper state
  const [primaryCropperOpen, setPrimaryCropperOpen] = useState(false)
  const [galleryCropperOpen, setGalleryCropperOpen] = useState(false)
  const [primaryImageSrc, setPrimaryImageSrc] = useState<string>('')
  const [galleryImageSrc, setGalleryImageSrc] = useState<string>('')
  const [primaryFileName, setPrimaryFileName] = useState<string>('')
  const [currentGalleryFileName, setCurrentGalleryFileName] = useState<string>('')

  const { data, setData, reset } = useForm({
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
    setSelectedParentCategory(null)
    setPrimaryImage(null)
    setGalleryImages([])
    setPrimaryImagePreview(null)
    setGalleryPreviews([])
    setErrors({})
    setDialogOpen(true)
  }

  function openEditDialog(service: Service) {
    setEditingService(service)

    // Find the subcategory and its parent
    let foundSubcategoryId = ''
    let foundParentId: number | null = null

    for (const parent of categories) {
      const subcategory = parent.subcategories.find(sub => sub.name === service.category_name)
      if (subcategory) {
        foundSubcategoryId = subcategory.id.toString()
        foundParentId = parent.id
        break
      }
    }

    setSelectedParentCategory(foundParentId)
    setData({
      name: service.name,
      service_category_id: foundSubcategoryId,
      description: service.description || '',
      base_price: service.base_price.toString(),
      price_type: service.price_type,
      max_price: service.max_price?.toString() || '',
      duration: service.duration?.toString() || '',
      max_attendees: service.max_attendees?.toString() || '',
      inclusions: [''],
      is_active: service.is_active,
    })
    setPrimaryImage(null)
    setGalleryImages([])
    // Set existing image previews
    setPrimaryImagePreview(service.primary_image)
    setGalleryPreviews(service.gallery_images || [])
    setErrors({})
    setDialogOpen(true)
  }

  async function handlePrimaryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageSrc = await createImagePreview(file)
        setPrimaryImageSrc(imageSrc)
        setPrimaryFileName(file.name)
        setPrimaryCropperOpen(true)
      } catch (error) {
        console.error('Error loading primary image:', error)
      }
    }
  }

  async function handlePrimaryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, primaryFileName, 'service', 5)
      setPrimaryImage(processedFile)

      const preview = await createImagePreview(processedFile)
      setPrimaryImagePreview(preview)
    } catch (error) {
      console.error('Error processing cropped primary image:', error)
    }
  }

  async function handleGalleryImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      // For simplicity, process first file with cropper
      // TODO: Could enhance to queue multiple files for cropping
      const file = files[0]
      try {
        const imageSrc = await createImagePreview(file)
        setGalleryImageSrc(imageSrc)
        setCurrentGalleryFileName(file.name)
        setGalleryCropperOpen(true)
      } catch (error) {
        console.error('Error loading gallery image:', error)
      }
    }
  }

  async function handleGalleryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, currentGalleryFileName, 'gallery', 5)
      setGalleryImages(prev => [...prev, processedFile])

      const preview = await createImagePreview(processedFile)
      setGalleryPreviews(prev => [...prev, preview])
    } catch (error) {
      console.error('Error processing cropped gallery image:', error)
    }
  }

  function removeGalleryImage(index: number) {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    setProcessing(true)
    setErrors({})

    const formData = new FormData()

    // Append regular form fields
    formData.append('name', data.name)
    formData.append('service_category_id', data.service_category_id)
    if (data.description) formData.append('description', data.description)
    formData.append('base_price', data.base_price)
    formData.append('price_type', data.price_type)
    if (data.max_price) formData.append('max_price', data.max_price)
    if (data.duration) formData.append('duration', data.duration)
    if (data.max_attendees) formData.append('max_attendees', data.max_attendees)
    formData.append('is_active', data.is_active ? '1' : '0')

    // Append image files
    if (primaryImage) {
      formData.append('primary_image', primaryImage)
    }

    galleryImages.forEach((file, index) => {
      formData.append(`gallery_images[${index}]`, file)
    })

    if (editingService) {
      formData.append('_method', 'PUT')
      router.post(`/provider/services/${editingService.id}`, formData, {
        onError: (errors) => {
          setErrors(errors)
          setProcessing(false)
        },
        onSuccess: () => {
          setDialogOpen(false)
          reset()
          setPrimaryImage(null)
          setGalleryImages([])
          setPrimaryImagePreview(null)
          setGalleryPreviews([])
          setProcessing(false)
        },
      })
    } else {
      router.post('/provider/services', formData, {
        onError: (errors) => {
          setErrors(errors)
          setProcessing(false)
        },
        onSuccess: () => {
          setDialogOpen(false)
          reset()
          setPrimaryImage(null)
          setGalleryImages([])
          setPrimaryImagePreview(null)
          setGalleryPreviews([])
          setProcessing(false)
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

            {/* Category - Two-step selection */}
            <div className="space-y-4">
              {/* Parent Category */}
              <div className="space-y-2">
                <Label htmlFor="parent-category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedParentCategory?.toString() ?? ''}
                  onValueChange={(value) => {
                    setSelectedParentCategory(value ? parseInt(value) : null)
                    setData('service_category_id', '') // Reset subcategory when parent changes
                  }}
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
              </div>

              {/* Subcategory */}
              {selectedParentCategory && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    Subcategory <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.service_category_id}
                    onValueChange={(value) => setData('service_category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find(c => c.id === selectedParentCategory)
                        ?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.service_category_id && (
                    <p className="text-sm text-destructive">{errors.service_category_id}</p>
                  )}
                </div>
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

            {/* Image Uploads */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="primary_image">Primary Image</Label>
                <Input
                  id="primary_image"
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageChange}
                />
                {errors.primary_image && (
                  <p className="text-sm text-destructive">{errors.primary_image}</p>
                )}
                {primaryImagePreview && (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={primaryImagePreview}
                      alt="Primary preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPrimaryImage(null)
                        setPrimaryImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x800px, Max size: 5MB
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery_images">Gallery Images</Label>
                <Input
                  id="gallery_images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                />
                {errors.gallery_images && (
                  <p className="text-sm text-destructive">{errors.gallery_images}</p>
                )}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload multiple images to showcase your service
                </p>
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

      {/* Primary Image Cropper Dialog */}
      <ImageCropperDialog
        open={primaryCropperOpen}
        onOpenChange={setPrimaryCropperOpen}
        imageSrc={primaryImageSrc}
        onCropComplete={handlePrimaryCropComplete}
        imageType="service"
        title="Crop Service Image"
      />

      {/* Gallery Image Cropper Dialog */}
      <ImageCropperDialog
        open={galleryCropperOpen}
        onOpenChange={setGalleryCropperOpen}
        imageSrc={galleryImageSrc}
        onCropComplete={handleGalleryCropComplete}
        imageType="gallery"
        title="Crop Gallery Image"
      />
    </ProviderLayout>
  )
}
