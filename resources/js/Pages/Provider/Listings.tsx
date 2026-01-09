import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import ProviderLayout from '@/components/ProviderLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MoreVertical, Eye, Edit, Trash2, Package, Briefcase, X, DollarSign, Clock, Calendar } from 'lucide-react'
import { Link } from '@inertiajs/react'
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
  minimum_quantity: number
  category_name: string
  is_active: boolean
  bookings_count: number
  primary_image: string | null
  gallery_images: string[]
}

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  sku: string | null
  price: number
  sale_price: number | null
  currency: string
  stock_quantity: number
  track_inventory: boolean
  unit: string | null
  specifications: string[]
  features: string[]
  primary_image: string | null
  gallery_images: string[]
  is_active: boolean
  is_featured: boolean
  catalogue_name?: string
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

interface Catalogue {
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
  products: Product[]
  categories: Category[]
  catalogues: Catalogue[]
}

export default function Listings({ provider, services = [], products = [], categories = [], catalogues = [] }: Props) {
  // Service state
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteServiceDialogOpen, setDeleteServiceDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const [serviceProcessing, setServiceProcessing] = useState(false)
  const [serviceErrors, setServiceErrors] = useState<Record<string, string>>({})
  const [servicePrimaryImage, setServicePrimaryImage] = useState<File | null>(null)
  const [serviceGalleryImages, setServiceGalleryImages] = useState<File[]>([])
  const [servicePrimaryImagePreview, setServicePrimaryImagePreview] = useState<string | null>(null)
  const [serviceGalleryPreviews, setServiceGalleryPreviews] = useState<string[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null)

  // Service cropper state
  const [servicePrimaryCropperOpen, setServicePrimaryCropperOpen] = useState(false)
  const [serviceGalleryCropperOpen, setServiceGalleryCropperOpen] = useState(false)
  const [servicePrimaryImageSrc, setServicePrimaryImageSrc] = useState<string>('')
  const [serviceGalleryImageSrc, setServiceGalleryImageSrc] = useState<string>('')
  const [servicePrimaryFileName, setServicePrimaryFileName] = useState<string>('')
  const [serviceCurrentGalleryFileName, setServiceCurrentGalleryFileName] = useState<string>('')

  // Product state
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [productProcessing, setProductProcessing] = useState(false)
  const [productErrors, setProductErrors] = useState<Record<string, string>>({})
  const [productPrimaryImage, setProductPrimaryImage] = useState<File | null>(null)
  const [productGalleryImages, setProductGalleryImages] = useState<File[]>([])
  const [productPrimaryImagePreview, setProductPrimaryImagePreview] = useState<string | null>(null)
  const [productGalleryPreviews, setProductGalleryPreviews] = useState<string[]>([])
  const [specInput, setSpecInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')

  // Product cropper state
  const [productPrimaryCropperOpen, setProductPrimaryCropperOpen] = useState(false)
  const [productGalleryCropperOpen, setProductGalleryCropperOpen] = useState(false)
  const [productPrimaryImageSrc, setProductPrimaryImageSrc] = useState<string>('')
  const [productGalleryImageSrc, setProductGalleryImageSrc] = useState<string>('')
  const [productPrimaryFileName, setProductPrimaryFileName] = useState<string>('')
  const [productCurrentGalleryFileName, setProductCurrentGalleryFileName] = useState<string>('')

  const { data: serviceData, setData: setServiceData, reset: resetService } = useForm({
    name: '',
    service_category_id: '',
    description: '',
    base_price: '',
    price_type: 'fixed' as 'fixed' | 'hourly' | 'daily' | 'custom',
    max_price: '',
    duration: '',
    max_attendees: '',
    minimum_quantity: '',
    is_active: true,
  })

  const { data: productData, setData: setProductData, reset: resetProduct } = useForm({
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
  })

  const deleteServiceForm = useForm({})
  const deleteProductForm = useForm({})

  // ===== SERVICE FUNCTIONS =====
  function openCreateServiceDialog() {
    resetService()
    setEditingService(null)
    setSelectedParentCategory(null)
    setServicePrimaryImage(null)
    setServiceGalleryImages([])
    setServicePrimaryImagePreview(null)
    setServiceGalleryPreviews([])
    setServiceErrors({})
    setServiceDialogOpen(true)
  }

  function openEditServiceDialog(service: Service) {
    setEditingService(service)

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
    setServiceData({
      name: service.name,
      service_category_id: foundSubcategoryId,
      description: service.description || '',
      base_price: service.base_price.toString(),
      price_type: service.price_type,
      max_price: service.max_price?.toString() || '',
      duration: service.duration?.toString() || '',
      max_attendees: service.max_attendees?.toString() || '',
      minimum_quantity: service.minimum_quantity > 1 ? service.minimum_quantity.toString() : '',
      is_active: service.is_active,
    })
    setServicePrimaryImage(null)
    setServiceGalleryImages([])
    setServicePrimaryImagePreview(service.primary_image)
    setServiceGalleryPreviews(service.gallery_images || [])
    setServiceErrors({})
    setServiceDialogOpen(true)
  }

  async function handleServicePrimaryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageSrc = await createImagePreview(file)
        setServicePrimaryImageSrc(imageSrc)
        setServicePrimaryFileName(file.name)
        setServicePrimaryCropperOpen(true)
      } catch (error) {
        console.error('Error loading primary image:', error)
      }
    }
  }

  async function handleServicePrimaryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, servicePrimaryFileName, 'service', 5)
      setServicePrimaryImage(processedFile)
      const preview = await createImagePreview(processedFile)
      setServicePrimaryImagePreview(preview)
    } catch (error) {
      console.error('Error processing cropped primary image:', error)
    }
  }

  async function handleServiceGalleryImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      try {
        const imageSrc = await createImagePreview(file)
        setServiceGalleryImageSrc(imageSrc)
        setServiceCurrentGalleryFileName(file.name)
        setServiceGalleryCropperOpen(true)
      } catch (error) {
        console.error('Error loading gallery image:', error)
      }
    }
  }

  async function handleServiceGalleryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, serviceCurrentGalleryFileName, 'gallery', 5)
      setServiceGalleryImages(prev => [...prev, processedFile])
      const preview = await createImagePreview(processedFile)
      setServiceGalleryPreviews(prev => [...prev, preview])
    } catch (error) {
      console.error('Error processing cropped gallery image:', error)
    }
  }

  function removeServiceGalleryImage(index: number) {
    setServiceGalleryImages(prev => prev.filter((_, i) => i !== index))
    setServiceGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function handleServiceSubmit() {
    setServiceProcessing(true)
    setServiceErrors({})

    const formData = new FormData()
    formData.append('name', serviceData.name)
    formData.append('service_category_id', serviceData.service_category_id)
    if (serviceData.description) formData.append('description', serviceData.description)
    formData.append('base_price', serviceData.base_price)
    formData.append('price_type', serviceData.price_type)
    if (serviceData.max_price) formData.append('max_price', serviceData.max_price)
    if (serviceData.duration) formData.append('duration', serviceData.duration)
    if (serviceData.max_attendees) formData.append('max_attendees', serviceData.max_attendees)
    if (serviceData.minimum_quantity) formData.append('minimum_quantity', serviceData.minimum_quantity)
    formData.append('is_active', serviceData.is_active ? '1' : '0')

    if (servicePrimaryImage) {
      formData.append('primary_image', servicePrimaryImage)
    }

    serviceGalleryImages.forEach((file, index) => {
      formData.append(`gallery_images[${index}]`, file)
    })

    if (editingService) {
      formData.append('_method', 'PUT')
      router.post(`/provider/services/${editingService.id}`, formData, {
        onError: (errors) => {
          setServiceErrors(errors)
          setServiceProcessing(false)
        },
        onSuccess: () => {
          setServiceDialogOpen(false)
          resetService()
          setServicePrimaryImage(null)
          setServiceGalleryImages([])
          setServicePrimaryImagePreview(null)
          setServiceGalleryPreviews([])
          setServiceProcessing(false)
        },
      })
    } else {
      router.post('/provider/services', formData, {
        onError: (errors) => {
          setServiceErrors(errors)
          setServiceProcessing(false)
        },
        onSuccess: () => {
          setServiceDialogOpen(false)
          resetService()
          setServicePrimaryImage(null)
          setServiceGalleryImages([])
          setServicePrimaryImagePreview(null)
          setServiceGalleryPreviews([])
          setServiceProcessing(false)
        },
      })
    }
  }

  function handleDeleteService() {
    if (serviceToDelete) {
      deleteServiceForm.delete(`/provider/services/${serviceToDelete}`, {
        onSuccess: () => {
          setDeleteServiceDialogOpen(false)
          setServiceToDelete(null)
        },
      })
    }
  }

  // ===== PRODUCT FUNCTIONS =====
  function openCreateProductDialog() {
    resetProduct()
    setEditingProduct(null)
    setProductPrimaryImage(null)
    setProductGalleryImages([])
    setProductPrimaryImagePreview(null)
    setProductGalleryPreviews([])
    setProductErrors({})
    setProductDialogOpen(true)
  }

  function openEditProductDialog(product: Product) {
    setEditingProduct(product)
    setProductData({
      catalogue_id: product.catalogue_name || '',
      name: product.name,
      description: product.description || '',
      sku: product.sku || '',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      currency: product.currency,
      stock_quantity: product.stock_quantity.toString(),
      track_inventory: product.track_inventory,
      unit: product.unit || '',
      weight: '',
      dimensions: '',
      specifications: product.specifications || [],
      features: product.features || [],
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    setProductPrimaryImage(null)
    setProductGalleryImages([])
    setProductPrimaryImagePreview(product.primary_image)
    setProductGalleryPreviews(product.gallery_images || [])
    setProductErrors({})
    setProductDialogOpen(true)
  }

  async function handleProductPrimaryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageSrc = await createImagePreview(file)
        setProductPrimaryImageSrc(imageSrc)
        setProductPrimaryFileName(file.name)
        setProductPrimaryCropperOpen(true)
      } catch (error) {
        console.error('Error loading product primary image:', error)
      }
    }
  }

  async function handleProductPrimaryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, productPrimaryFileName, 'product', 5)
      setProductPrimaryImage(processedFile)
      const preview = await createImagePreview(processedFile)
      setProductPrimaryImagePreview(preview)
    } catch (error) {
      console.error('Error processing cropped product primary image:', error)
    }
  }

  async function handleProductGalleryImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      try {
        const imageSrc = await createImagePreview(file)
        setProductGalleryImageSrc(imageSrc)
        setProductCurrentGalleryFileName(file.name)
        setProductGalleryCropperOpen(true)
      } catch (error) {
        console.error('Error loading product gallery image:', error)
      }
    }
  }

  async function handleProductGalleryCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, productCurrentGalleryFileName, 'gallery', 5)
      setProductGalleryImages(prev => [...prev, processedFile])
      const preview = await createImagePreview(processedFile)
      setProductGalleryPreviews(prev => [...prev, preview])
    } catch (error) {
      console.error('Error processing cropped product gallery image:', error)
    }
  }

  function removeProductGalleryImage(index: number) {
    setProductGalleryImages(prev => prev.filter((_, i) => i !== index))
    setProductGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function addSpecification() {
    if (specInput.trim()) {
      setProductData('specifications', [...productData.specifications, specInput.trim()])
      setSpecInput('')
    }
  }

  function removeSpecification(index: number) {
    setProductData('specifications', productData.specifications.filter((_, i) => i !== index))
  }

  function addFeature() {
    if (featureInput.trim()) {
      setProductData('features', [...productData.features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  function removeFeature(index: number) {
    setProductData('features', productData.features.filter((_, i) => i !== index))
  }

  function handleProductSubmit() {
    setProductProcessing(true)
    setProductErrors({})

    const formData = new FormData()
    formData.append('catalogue_id', productData.catalogue_id)
    formData.append('name', productData.name)
    if (productData.description) formData.append('description', productData.description)
    if (productData.sku) formData.append('sku', productData.sku)
    formData.append('price', productData.price)
    if (productData.sale_price) formData.append('sale_price', productData.sale_price)
    formData.append('currency', productData.currency)
    formData.append('stock_quantity', productData.stock_quantity)
    formData.append('track_inventory', productData.track_inventory ? '1' : '0')
    if (productData.unit) formData.append('unit', productData.unit)
    if (productData.weight) formData.append('weight', productData.weight)
    if (productData.dimensions) formData.append('dimensions', productData.dimensions)
    formData.append('is_active', productData.is_active ? '1' : '0')
    formData.append('is_featured', productData.is_featured ? '1' : '0')

    productData.specifications.forEach((spec, index) => {
      formData.append(`specifications[${index}]`, spec)
    })

    productData.features.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature)
    })

    if (productPrimaryImage) {
      formData.append('primary_image', productPrimaryImage)
    }

    productGalleryImages.forEach((file, index) => {
      formData.append(`gallery_images[${index}]`, file)
    })

    if (editingProduct) {
      formData.append('_method', 'PUT')
      router.post(`/provider/products/${editingProduct.id}`, formData, {
        onError: (errors) => {
          setProductErrors(errors)
          setProductProcessing(false)
        },
        onSuccess: () => {
          setProductDialogOpen(false)
          resetProduct()
          setProductPrimaryImage(null)
          setProductGalleryImages([])
          setProductPrimaryImagePreview(null)
          setProductGalleryPreviews([])
          setProductProcessing(false)
        },
      })
    } else {
      router.post('/provider/products', formData, {
        onError: (errors) => {
          setProductErrors(errors)
          setProductProcessing(false)
        },
        onSuccess: () => {
          setProductDialogOpen(false)
          resetProduct()
          setProductPrimaryImage(null)
          setProductGalleryImages([])
          setProductPrimaryImagePreview(null)
          setProductGalleryPreviews([])
          setProductProcessing(false)
        },
      })
    }
  }

  function handleDeleteProduct() {
    if (productToDelete) {
      deleteProductForm.delete(`/provider/products/${productToDelete}`, {
        onSuccess: () => {
          setDeleteProductDialogOpen(false)
          setProductToDelete(null)
        },
      })
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
      : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }

  const EmptyState = ({ type }: { type: 'services' | 'products' }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        {type === 'services' ? (
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        No {type} yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create your first {type === 'services' ? 'service' : 'product'} to start getting bookings and orders.
      </p>
      <Button onClick={type === 'services' ? openCreateServiceDialog : openCreateProductDialog}>
        <Plus className="h-4 w-4 mr-2" />
        Create your first {type === 'services' ? 'service' : 'product'}
      </Button>
    </div>
  )

  return (
    <ProviderLayout title="Listings" provider={provider}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your listings ({services.length + products.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/provider/events/create">
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Link>
            </Button>
            <Button variant="outline" onClick={openCreateProductDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button onClick={openCreateServiceDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>

        {/* Unified Listings Grid */}
        {services.length === 0 && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first listing to start getting bookings and orders from customers.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" asChild>
                <Link href="/provider/events/create">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Event
                </Link>
              </Button>
              <Button variant="outline" onClick={openCreateProductDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button onClick={openCreateServiceDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Services */}
            {services.map((service) => (
              <Card key={`service-${service.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {service.primary_image ? (
                    <img src={service.primary_image} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  )}
                  <Badge className="absolute top-2 left-2 bg-blue-500 text-white">Service</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.category_name}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(service.is_active)}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-bold text-primary">
                        {service.currency} {service.base_price.toLocaleString()}
                        {service.max_price && ` - ${service.max_price.toLocaleString()}`}
                      </p>
                    </div>
                    {service.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutes</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {service.bookings_count} booking{service.bookings_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditServiceDialog(service)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setServiceToDelete(service.id)
                        setDeleteServiceDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Products */}
            {products.map((product) => (
              <Card key={`product-${product.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground" />
                  )}
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white">Product</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.catalogue_name}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(product.is_active)}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-bold text-primary">
                        {product.currency} {product.price.toLocaleString()}
                      </p>
                    </div>
                    {product.sale_price && product.sale_price < product.price && (
                      <p className="text-sm text-muted-foreground line-through">
                        {product.currency} {product.sale_price.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Stock: {product.track_inventory ? product.stock_quantity : 'Unlimited'}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditProductDialog(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProductToDelete(product.id)
                        setDeleteProductDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Create/Edit Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
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
              <Label htmlFor="service-name">
                Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service-name"
                value={serviceData.name}
                onChange={(e) => setServiceData('name', e.target.value)}
                placeholder="e.g., Wedding Photography"
              />
              {serviceErrors.name && <p className="text-sm text-destructive">{serviceErrors.name}</p>}
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
                    setServiceData('service_category_id', '')
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
                    value={serviceData.service_category_id}
                    onValueChange={(value) => setServiceData('service_category_id', value)}
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
                  {serviceErrors.service_category_id && (
                    <p className="text-sm text-destructive">{serviceErrors.service_category_id}</p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={serviceData.description}
                onChange={(e) => setServiceData('description', e.target.value)}
                placeholder="Describe your service..."
                rows={4}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base-price">
                  Base Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="base-price"
                  type="number"
                  value={serviceData.base_price}
                  onChange={(e) => setServiceData('base_price', e.target.value)}
                  placeholder="5000"
                />
                {serviceErrors.base_price && (
                  <p className="text-sm text-destructive">{serviceErrors.base_price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-type">
                  Price Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={serviceData.price_type}
                  onValueChange={(value) => setServiceData('price_type', value as any)}
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

            {serviceData.price_type === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="max-price">Maximum Price</Label>
                <Input
                  id="max-price"
                  type="number"
                  value={serviceData.max_price}
                  onChange={(e) => setServiceData('max_price', e.target.value)}
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
                  value={serviceData.duration}
                  onChange={(e) => setServiceData('duration', e.target.value)}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-attendees">Max Attendees</Label>
                <Input
                  id="max-attendees"
                  type="number"
                  value={serviceData.max_attendees}
                  onChange={(e) => setServiceData('max_attendees', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Minimum Quantity */}
            <div className="space-y-2">
              <Label htmlFor="minimum-quantity">Minimum Quantity</Label>
              <Input
                id="minimum-quantity"
                type="number"
                value={serviceData.minimum_quantity}
                onChange={(e) => setServiceData('minimum_quantity', e.target.value)}
                placeholder="1"
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Set the minimum quantity customers must order. Leave empty for no minimum (defaults to 1).
              </p>
              {serviceErrors.minimum_quantity && (
                <p className="text-sm text-destructive">{serviceErrors.minimum_quantity}</p>
              )}
            </div>

            {/* Image Uploads */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="service-primary-image">Primary Image</Label>
                <Input
                  id="service-primary-image"
                  type="file"
                  accept="image/*"
                  onChange={handleServicePrimaryImageChange}
                />
                {servicePrimaryImagePreview && (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={servicePrimaryImagePreview}
                      alt="Primary preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setServicePrimaryImage(null)
                        setServicePrimaryImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-gallery-images">Gallery Images</Label>
                <Input
                  id="service-gallery-images"
                  type="file"
                  accept="image/*"
                  onChange={handleServiceGalleryImagesChange}
                />
                {serviceGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {serviceGalleryPreviews.map((preview, index) => (
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
                          onClick={() => removeServiceGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setServiceDialogOpen(false)}
              disabled={serviceProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleServiceSubmit} disabled={serviceProcessing}>
              {serviceProcessing ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Create/Edit Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update your product details and pricing'
                : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product-name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-name"
                value={productData.name}
                onChange={(e) => setProductData('name', e.target.value)}
                placeholder="e.g., Premium Event Tent"
              />
              {productErrors.name && <p className="text-sm text-destructive">{productErrors.name}</p>}
            </div>

            {/* Catalogue */}
            <div className="space-y-2">
              <Label htmlFor="catalogue">
                Catalogue <span className="text-destructive">*</span>
              </Label>
              <Select
                value={productData.catalogue_id}
                onValueChange={(value) => setProductData('catalogue_id', value)}
              >
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
              {productErrors.catalogue_id && (
                <p className="text-sm text-destructive">{productErrors.catalogue_id}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={productData.description}
                onChange={(e) => setProductData('description', e.target.value)}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>

            {/* SKU and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={productData.sku}
                  onChange={(e) => setProductData('sku', e.target.value)}
                  placeholder="PROD-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={productData.unit}
                  onChange={(e) => setProductData('unit', e.target.value)}
                  placeholder="piece, set, day"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="product-price"
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData('price', e.target.value)}
                  placeholder="5000"
                />
                {productErrors.price && (
                  <p className="text-sm text-destructive">{productErrors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-price">Sale Price</Label>
                <Input
                  id="sale-price"
                  type="number"
                  value={productData.sale_price}
                  onChange={(e) => setProductData('sale_price', e.target.value)}
                  placeholder="4000"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock-quantity">Stock Quantity</Label>
              <Input
                id="stock-quantity"
                type="number"
                value={productData.stock_quantity}
                onChange={(e) => setProductData('stock_quantity', e.target.value)}
                placeholder="10"
              />
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <Label>Specifications</Label>
              <div className="flex gap-2">
                <Input
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  placeholder="Add specification..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                />
                <Button type="button" onClick={addSpecification} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {productData.specifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {productData.specifications.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {productData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {productData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Image Uploads */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="product-primary-image">Primary Image</Label>
                <Input
                  id="product-primary-image"
                  type="file"
                  accept="image/*"
                  onChange={handleProductPrimaryImageChange}
                />
                {productPrimaryImagePreview && (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={productPrimaryImagePreview}
                      alt="Primary preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setProductPrimaryImage(null)
                        setProductPrimaryImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-gallery-images">Gallery Images</Label>
                <Input
                  id="product-gallery-images"
                  type="file"
                  accept="image/*"
                  onChange={handleProductGalleryImagesChange}
                />
                {productGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {productGalleryPreviews.map((preview, index) => (
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
                          onClick={() => removeProductGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialogOpen(false)}
              disabled={productProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleProductSubmit} disabled={productProcessing}>
              {productProcessing ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Dialog */}
      <Dialog open={deleteServiceDialogOpen} onOpenChange={setDeleteServiceDialogOpen}>
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
              onClick={() => setDeleteServiceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              disabled={deleteServiceForm.processing}
            >
              {deleteServiceForm.processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={deleteProductDialogOpen} onOpenChange={setDeleteProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleteProductForm.processing}
            >
              {deleteProductForm.processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Image Croppers */}
      <ImageCropperDialog
        open={servicePrimaryCropperOpen}
        onOpenChange={setServicePrimaryCropperOpen}
        imageSrc={servicePrimaryImageSrc}
        onCropComplete={handleServicePrimaryCropComplete}
        imageType="service"
        title="Crop Service Image"
      />

      <ImageCropperDialog
        open={serviceGalleryCropperOpen}
        onOpenChange={setServiceGalleryCropperOpen}
        imageSrc={serviceGalleryImageSrc}
        onCropComplete={handleServiceGalleryCropComplete}
        imageType="gallery"
        title="Crop Gallery Image"
      />

      {/* Product Image Croppers */}
      <ImageCropperDialog
        open={productPrimaryCropperOpen}
        onOpenChange={setProductPrimaryCropperOpen}
        imageSrc={productPrimaryImageSrc}
        onCropComplete={handleProductPrimaryCropComplete}
        imageType="product"
        title="Crop Product Image"
      />

      <ImageCropperDialog
        open={productGalleryCropperOpen}
        onOpenChange={setProductGalleryCropperOpen}
        imageSrc={productGalleryImageSrc}
        onCropComplete={handleProductGalleryCropComplete}
        imageType="gallery"
        title="Crop Gallery Image"
      />
    </ProviderLayout>
  )
}
