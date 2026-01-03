import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { resizeImage, resizeImages, createImagePreview } from '@/lib/imageUtils'

interface Catalogue {
  id: number
  name: string
  company_id: number
}

interface Product {
  id: number
  catalogue_id: number
  name: string
  description: string | null
  sku: string | null
  price: number
  sale_price: number | null
  currency: string
  stock_quantity: number
  track_inventory: boolean
  unit: string | null
  weight: number | null
  dimensions: string | null
  specifications: string[] | null
  features: string[] | null
  primary_image: string | null
  gallery_images: string[] | null
  is_active: boolean
  is_featured: boolean
  display_order: number
}

interface Props {
  product: Product
  catalogues: Catalogue[]
}

export default function ProductsEdit({ product, catalogues }: Props) {
  const [formData, setFormData] = useState({
    catalogue_id: product.catalogue_id.toString(),
    name: product.name,
    description: product.description || '',
    sku: product.sku || '',
    price: product.price.toString(),
    sale_price: product.sale_price?.toString() || '',
    currency: product.currency,
    stock_quantity: product.stock_quantity.toString(),
    track_inventory: product.track_inventory,
    unit: product.unit || '',
    weight: product.weight?.toString() || '',
    dimensions: product.dimensions || '',
    specifications: product.specifications || [],
    features: product.features || [],
    primary_image: null as File | null,
    gallery_images: [] as File[],
    is_active: product.is_active,
    is_featured: product.is_featured,
    display_order: product.display_order.toString(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)
  const [newSpecification, setNewSpecification] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(product.gallery_images || [])

  function handleChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resizedFile = await resizeImage(file, 'product', 2)
        setFormData(prev => ({ ...prev, primary_image: resizedFile }))
      } catch (error) {
        console.error('Error resizing primary image:', error)
        setFormData(prev => ({ ...prev, primary_image: file }))
      }
    }
  }

  async function handleGalleryImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      try {
        // Resize all gallery images
        const resizedFiles = await resizeImages(files, 'gallery', 2)
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...resizedFiles] }))

        // Create previews for resized images
        const previews = await Promise.all(resizedFiles.map(file => createImagePreview(file)))
        setGalleryPreviews(prev => [...prev, ...previews])
      } catch (error) {
        console.error('Error resizing gallery images:', error)
        // Fallback to original files
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...files] }))

        const previews = await Promise.all(files.map(file => createImagePreview(file)))
        setGalleryPreviews(prev => [...prev, ...previews])
      }
    }
  }

  function removeNewGalleryImage(index: number) {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function removeExistingGalleryImage(index: number) {
    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  function addSpecification() {
    if (newSpecification.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, newSpecification.trim()]
      }))
      setNewSpecification('')
    }
  }

  function removeSpecification(index: number) {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }))
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  function removeFeature(index: number) {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    const submitData = new FormData()
    submitData.append('_method', 'PUT')

    submitData.append('catalogue_id', formData.catalogue_id)
    submitData.append('name', formData.name)
    if (formData.description) submitData.append('description', formData.description)
    if (formData.sku) submitData.append('sku', formData.sku)
    submitData.append('price', formData.price)
    if (formData.sale_price) submitData.append('sale_price', formData.sale_price)
    submitData.append('currency', formData.currency)
    if (formData.stock_quantity) submitData.append('stock_quantity', formData.stock_quantity)
    submitData.append('track_inventory', formData.track_inventory ? '1' : '0')
    if (formData.unit) submitData.append('unit', formData.unit)
    if (formData.weight) submitData.append('weight', formData.weight)
    if (formData.dimensions) submitData.append('dimensions', formData.dimensions)

    // Specifications and features
    formData.specifications.forEach((spec, index) => {
      submitData.append(`specifications[${index}]`, spec)
    })
    formData.features.forEach((feature, index) => {
      submitData.append(`features[${index}]`, feature)
    })

    if (formData.primary_image) {
      submitData.append('primary_image', formData.primary_image)
    }

    // Gallery images - new uploads
    formData.gallery_images.forEach((file, index) => {
      submitData.append(`gallery_images[${index}]`, file)
    })

    // Existing gallery images that should be kept
    existingGalleryImages.forEach((image, index) => {
      submitData.append(`existing_gallery_images[${index}]`, image)
    })

    submitData.append('is_active', formData.is_active ? '1' : '0')
    submitData.append('is_featured', formData.is_featured ? '1' : '0')
    submitData.append('display_order', formData.display_order)

    router.post(`/provider/products/${product.id}`, submitData, {
      onError: (errors) => {
        setErrors(errors)
        setProcessing(false)
      },
      onSuccess: () => {
        setProcessing(false)
      }
    })
  }

  return (
    <ProviderLayout title="Edit Product">
      <Head title="Edit Product" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground mt-1">
              Update your product details
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/provider/products')}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="catalogue_id">Product Catalogue *</Label>
                <Select value={formData.catalogue_id} onValueChange={(value) => handleChange('catalogue_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a catalogue" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogues.map((catalogue) => (
                      <SelectItem key={catalogue.id} value={catalogue.id.toString()}>
                        {catalogue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.catalogue_id && <p className="text-sm text-destructive">{errors.catalogue_id}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="e.g., PROD-001"
                  />
                  {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your product"
                  rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your product pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sale_price}
                    onChange={(e) => handleChange('sale_price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.sale_price && <p className="text-sm text-destructive">{errors.sale_price}</p>}
                  <p className="text-xs text-muted-foreground">Must be less than regular price</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MWK">MWK</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track your product stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) => handleChange('track_inventory', checked)}
                />
                <Label htmlFor="track_inventory" className="cursor-pointer">
                  Track inventory for this product
                </Label>
              </div>

              {formData.track_inventory && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => handleChange('stock_quantity', e.target.value)}
                      placeholder="0"
                    />
                    {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit of Measure</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleChange('unit', e.target.value)}
                      placeholder="e.g., pieces, kg, liters"
                    />
                    {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
              <CardDescription>Product dimensions and weight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                    placeholder="e.g., 10 x 20 x 30 cm"
                  />
                  {errors.dimensions && <p className="text-sm text-destructive">{errors.dimensions}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications & Features</CardTitle>
              <CardDescription>Additional product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Specifications</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSpecification}
                    onChange={(e) => setNewSpecification(e.target.value)}
                    placeholder="Add a specification and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSpecification()
                      }
                    }}
                  />
                  <Button type="button" onClick={addSpecification}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.specifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specifications.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.primary_image && (
                <div className="space-y-2">
                  <Label>Current Primary Image</Label>
                  <img
                    src={product.primary_image}
                    alt="Current product"
                    className="w-full max-w-md rounded-lg border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="primary_image">
                  {product.primary_image ? 'Replace Primary Image' : 'Primary Image'}
                </Label>
                <Input
                  id="primary_image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.primary_image && <p className="text-sm text-destructive">{errors.primary_image}</p>}
                <p className="text-xs text-muted-foreground">
                  Recommended size: 800x800px, Max size: 5MB
                </p>
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>

                {/* Existing gallery images */}
                {existingGalleryImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Gallery Images</p>
                    <div className="grid grid-cols-4 gap-2">
                      {existingGalleryImages.map((image, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeExistingGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New gallery images upload */}
                <div className="space-y-2">
                  <Label htmlFor="gallery_images">Add More Gallery Images</Label>
                  <Input
                    id="gallery_images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                  />
                  {errors.gallery_images && <p className="text-sm text-destructive">{errors.gallery_images}</p>}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={preview}
                            alt={`New gallery preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeNewGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload multiple images to showcase your product from different angles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
              <CardDescription>Visibility and status options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active (visible to customers)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured product
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/provider/products')}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ProviderLayout>
  )
}
