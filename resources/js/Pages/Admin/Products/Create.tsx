import { Head, Link, useForm } from '@inertiajs/react'
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
import { ArrowLeft, Save, Plus, X, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import { resizeImage, createImagePreview } from '@/lib/imageUtils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Catalogue {
  id: number
  name: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Props {
  admin: Admin
  catalogues: Catalogue[]
  providers: Provider[]
}

export default function ProductsCreate({ admin, catalogues, providers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    service_provider_id: '',
    catalogue_id: '',
    name: '',
    description: '',
    sku: '',
    price: '',
    sale_price: '',
    currency: 'MWK',
    stock_quantity: '0',
    track_inventory: true,
    unit: '',
    weight: '',
    dimensions: '',
    specifications: [] as string[],
    features: [] as string[],
    is_active: true,
    is_featured: false,
    display_order: '0',
    primary_image: null as File | null,
  })

  const [specInput, setSpecInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('admin.products.store'))
  }

  function addSpecification() {
    if (specInput.trim()) {
      setData('specifications', [...data.specifications, specInput.trim()])
      setSpecInput('')
    }
  }

  function removeSpecification(index: number) {
    setData('specifications', data.specifications.filter((_, i) => i !== index))
  }

  function addFeature() {
    if (featureInput.trim()) {
      setData('features', [...data.features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  function removeFeature(index: number) {
    setData('features', data.features.filter((_, i) => i !== index))
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resizedFile = await resizeImage(file, 'product', 2)
        setData('primary_image', resizedFile)

        const preview = await createImagePreview(resizedFile)
        setImagePreview(preview)
      } catch (error) {
        console.error('Error resizing product image:', error)
        setData('primary_image', file)

        const preview = await createImagePreview(file)
        setImagePreview(preview)
      }
    }
  }

  function removeImage() {
    setData('primary_image', null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <AdminLayout title="Create Product" admin={admin}>
      <Head title="Create Product" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={route('admin.products.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Product</h1>
            <p className="text-muted-foreground mt-1">
              Add a new product to the catalogue
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_provider_id">Service Provider *</Label>
                  <Select
                    value={data.service_provider_id}
                    onValueChange={(value) => setData('service_provider_id', value)}
                  >
                    <SelectTrigger className={errors.service_provider_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service_provider_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.service_provider_id}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="catalogue_id">Catalogue *</Label>
                  <Select
                    value={data.catalogue_id}
                    onValueChange={(value) => setData('catalogue_id', value)}
                  >
                    <SelectTrigger className={errors.catalogue_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select catalogue" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogues.map((catalogue) => (
                        <SelectItem key={catalogue.id} value={catalogue.id.toString()}>
                          {catalogue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.catalogue_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.catalogue_id}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Premium Decorative Balloons"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Detailed description of the product..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input
                  id="sku"
                  value={data.sku}
                  onChange={(e) => setData('sku', e.target.value)}
                  placeholder="e.g., BALL-001"
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500 mt-1">{errors.sku}</p>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Regular Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    placeholder="0.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sale_price">Sale Price</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.sale_price}
                    onChange={(e) => setData('sale_price', e.target.value)}
                    placeholder="0.00"
                    className={errors.sale_price ? 'border-red-500' : ''}
                  />
                  {errors.sale_price && (
                    <p className="text-sm text-red-500 mt-1">{errors.sale_price}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty if not on sale
                  </p>
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={data.currency}
                    onValueChange={(value) => setData('currency', value)}
                  >
                    <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MWK">MWK (Malawi Kwacha)</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && (
                    <p className="text-sm text-red-500 mt-1">{errors.currency}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="track_inventory"
                  checked={data.track_inventory}
                  onChange={(e) => setData('track_inventory', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="track_inventory">Track inventory for this product</Label>
              </div>

              {data.track_inventory && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={data.stock_quantity}
                      onChange={(e) => setData('stock_quantity', e.target.value)}
                      className={errors.stock_quantity ? 'border-red-500' : ''}
                    />
                    {errors.stock_quantity && (
                      <p className="text-sm text-red-500 mt-1">{errors.stock_quantity}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                      placeholder="e.g., piece, pack, kg"
                      className={errors.unit ? 'border-red-500' : ''}
                    />
                    {errors.unit && (
                      <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.weight}
                    onChange={(e) => setData('weight', e.target.value)}
                    placeholder="0.00"
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && (
                    <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                  <Input
                    id="dimensions"
                    value={data.dimensions}
                    onChange={(e) => setData('dimensions', e.target.value)}
                    placeholder="e.g., 10 x 20 x 30 cm"
                    className={errors.dimensions ? 'border-red-500' : ''}
                  />
                  {errors.dimensions && (
                    <p className="text-sm text-red-500 mt-1">{errors.dimensions}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Specifications */}
              <div>
                <Label>Specifications</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    placeholder="e.g., Material: Latex"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                  />
                  <Button type="button" onClick={addSpecification}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.specifications.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g., Biodegradable"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary_image">Primary Image</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-48 h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                      <label htmlFor="primary_image" className="cursor-pointer text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload</span>
                      </label>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="primary_image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {errors.primary_image && (
                  <p className="text-sm text-red-500 mt-1">{errors.primary_image}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: JPEG, JPG, PNG, WEBP. Max size: 2MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_active">Active (product is visible and available)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={data.is_featured}
                  onChange={(e) => setData('is_featured', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_featured">Featured (highlight this product)</Label>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={data.display_order}
                  onChange={(e) => setData('display_order', e.target.value)}
                  className={errors.display_order ? 'border-red-500' : ''}
                />
                {errors.display_order && (
                  <p className="text-sm text-red-500 mt-1">{errors.display_order}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={route('admin.products.index')}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
