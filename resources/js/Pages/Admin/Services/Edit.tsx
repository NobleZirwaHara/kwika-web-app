import { Head, Link, useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'
import {
  ArrowLeft,
  Save,
  Building2,
  Tag,
  DollarSign,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Service {
  id: number
  name: string
  slug: string
  description: string
  base_price: number
  max_price: number | null
  price_type: string
  currency: string
  duration: number | null
  max_attendees: number | null
  inclusions: string[] | null
  requirements: string[] | null
  is_active: boolean
  requires_deposit: boolean
  deposit_percentage: number | null
  cancellation_hours: number | null
  service_category_id: number
  bookings_count: number
  created_at: string
  updated_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
  category: {
    id: number
    name: string
  } | null
  catalogue: {
    id: number
    name: string
  } | null
  media: Array<{
    id: number
    url: string
    type: string
  }>
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Props {
  admin: Admin
  service: Service
  categories: Category[]
}

export default function ServicesEdit({ admin, service, categories }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: service.name,
    description: service.description || '',
    service_category_id: service.service_category_id.toString(),
    base_price: service.base_price.toString(),
    max_price: service.max_price?.toString() || '',
    price_type: service.price_type,
    currency: service.currency,
    duration: service.duration?.toString() || '',
    max_attendees: service.max_attendees?.toString() || '',
    inclusions: service.inclusions || [],
    requirements: service.requirements || [],
    requires_deposit: service.requires_deposit,
    deposit_percentage: service.deposit_percentage?.toString() || '',
    cancellation_hours: service.cancellation_hours?.toString() || '',
  })

  const [inclusionInput, setInclusionInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const submitData = {
      ...data,
      deleted_media_ids: deletedMediaIds,
    }

    console.log('Submitting with deleted media IDs:', deletedMediaIds)
    console.log('Full submit data:', submitData)

    // Include deleted media IDs in the submission
    put(route('admin.services.update', service.id), {
      data: submitData,
      onSuccess: () => {
        console.log('Update successful')
      },
      onError: (errors) => {
        console.error('Update errors:', errors)
      },
    })
  }

  function handleDeleteMedia(mediaId: number) {
    if (confirm('Are you sure you want to remove this image?')) {
      setDeletedMediaIds(prev => [...prev, mediaId])
    }
  }

  function isMediaDeleted(mediaId: number): boolean {
    return deletedMediaIds.includes(mediaId)
  }

  function addInclusion() {
    if (inclusionInput.trim()) {
      setData('inclusions', [...data.inclusions, inclusionInput.trim()])
      setInclusionInput('')
    }
  }

  function removeInclusion(index: number) {
    setData('inclusions', data.inclusions.filter((_, i) => i !== index))
  }

  function addRequirement() {
    if (requirementInput.trim()) {
      setData('requirements', [...data.requirements, requirementInput.trim()])
      setRequirementInput('')
    }
  }

  function removeRequirement(index: number) {
    setData('requirements', data.requirements.filter((_, i) => i !== index))
  }

  function handleToggleActive() {
    if (confirm(`Are you sure you want to ${service.is_active ? 'deactivate' : 'activate'} this service?`)) {
      router.put(route('admin.services.toggle-active', service.id))
    }
  }

  return (
    <AdminLayout title="Edit Service" admin={admin}>
      <Head title={`Edit Service: ${service.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.services.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Service</h1>
              <p className="text-muted-foreground mt-1">
                Modify service details and pricing
              </p>
            </div>
          </div>

          <Button
            variant={service.is_active ? "outline" : "default"}
            onClick={handleToggleActive}
          >
            {service.is_active ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate Service
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate Service
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Service Name *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="e.g., Professional Photography Session"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe the service in detail..."
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={data.service_category_id} onValueChange={(value) => setData('service_category_id', value)}>
                      <SelectTrigger className={errors.service_category_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
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
                      <p className="text-sm text-red-600 mt-1">{errors.service_category_id}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base_price">Base Price *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.base_price}
                        onChange={(e) => setData('base_price', e.target.value)}
                        className={errors.base_price ? 'border-red-500' : ''}
                      />
                      {errors.base_price && (
                        <p className="text-sm text-red-600 mt-1">{errors.base_price}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency *</Label>
                      <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                        <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MWK">MWK</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-sm text-red-600 mt-1">{errors.currency}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_type">Price Type *</Label>
                      <Select value={data.price_type} onValueChange={(value) => setData('price_type', value)}>
                        <SelectTrigger className={errors.price_type ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.price_type && (
                        <p className="text-sm text-red-600 mt-1">{errors.price_type}</p>
                      )}
                    </div>

                    {data.price_type === 'custom' && (
                      <div>
                        <Label htmlFor="max_price">Max Price</Label>
                        <Input
                          id="max_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.max_price}
                          onChange={(e) => setData('max_price', e.target.value)}
                          className={errors.max_price ? 'border-red-500' : ''}
                        />
                        {errors.max_price && (
                          <p className="text-sm text-red-600 mt-1">{errors.max_price}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        placeholder="e.g., 60"
                        className={errors.duration ? 'border-red-500' : ''}
                      />
                      {errors.duration && (
                        <p className="text-sm text-red-600 mt-1">{errors.duration}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="max_attendees">Max Attendees</Label>
                      <Input
                        id="max_attendees"
                        type="number"
                        min="1"
                        value={data.max_attendees}
                        onChange={(e) => setData('max_attendees', e.target.value)}
                        placeholder="e.g., 10"
                        className={errors.max_attendees ? 'border-red-500' : ''}
                      />
                      {errors.max_attendees && (
                        <p className="text-sm text-red-600 mt-1">{errors.max_attendees}</p>
                      )}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <Label>Inclusions</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={inclusionInput}
                        onChange={(e) => setInclusionInput(e.target.value)}
                        placeholder="Add what's included..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                      />
                      <Button type="button" onClick={addInclusion}>Add</Button>
                    </div>
                    {data.inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.inclusions.map((inclusion, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInclusion(index)}>
                            {inclusion} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div>
                    <Label>Requirements</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="Add requirements..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      />
                      <Button type="button" onClick={addRequirement}>Add</Button>
                    </div>
                    {data.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.requirements.map((requirement, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeRequirement(index)}>
                            {requirement} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Deposit & Cancellation */}
              <Card>
                <CardHeader>
                  <CardTitle>Deposit & Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requires_deposit"
                      checked={data.requires_deposit}
                      onChange={(e) => setData('requires_deposit', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="requires_deposit" className="cursor-pointer">
                      Requires deposit
                    </Label>
                  </div>

                  {data.requires_deposit && (
                    <div>
                      <Label htmlFor="deposit_percentage">Deposit Percentage</Label>
                      <Input
                        id="deposit_percentage"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={data.deposit_percentage}
                        onChange={(e) => setData('deposit_percentage', e.target.value)}
                        placeholder="e.g., 25"
                        className={errors.deposit_percentage ? 'border-red-500' : ''}
                      />
                      {errors.deposit_percentage && (
                        <p className="text-sm text-red-600 mt-1">{errors.deposit_percentage}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="cancellation_hours">Cancellation Notice (hours)</Label>
                    <Input
                      id="cancellation_hours"
                      type="number"
                      min="0"
                      value={data.cancellation_hours}
                      onChange={(e) => setData('cancellation_hours', e.target.value)}
                      placeholder="e.g., 24"
                      className={errors.cancellation_hours ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum hours before booking to allow cancellation
                    </p>
                    {errors.cancellation_hours && (
                      <p className="text-sm text-red-600 mt-1">{errors.cancellation_hours}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.services.index')}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                  <div className="flex-1">
                    <Link
                      href={route('admin.service-providers.edit', service.service_provider.id)}
                      className="font-medium hover:underline"
                    >
                      {service.service_provider.business_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">View provider details</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Status</span>
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Bookings</span>
                  <Badge variant="outline">{service.bookings_count}</Badge>
                </div>
                {service.catalogue && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Catalogue</span>
                    <span className="text-sm font-medium">{service.catalogue.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media */}
            {service.media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Media ({service.media.filter(m => !isMediaDeleted(m.id)).length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click X to remove images
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {service.media.slice(0, 8).map((media) => (
                      <div
                        key={media.id}
                        className={`relative aspect-square rounded-lg overflow-hidden bg-muted group ${
                          isMediaDeleted(media.id) ? 'opacity-30' : ''
                        }`}
                      >
                        <img
                          src={media.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {!isMediaDeleted(media.id) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(media.id)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        {isMediaDeleted(media.id) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <p className="text-white text-xs font-medium">Will be removed</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {service.media.length > 8 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      +{service.media.length - 8} more
                    </p>
                  )}
                  {deletedMediaIds.length > 0 && (
                    <p className="text-xs text-destructive mt-2 text-center">
                      {deletedMediaIds.length} image(s) marked for deletion
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">{service.created_at}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <p className="font-medium">{service.updated_at}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
