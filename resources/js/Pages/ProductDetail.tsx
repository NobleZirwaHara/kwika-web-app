import { Head, Link } from '@inertiajs/react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { AddToCartButton } from '@/Components/add-to-cart-button'
import { useState } from 'react'
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Star,
  BadgeCheck,
  Tag,
  Package,
  Ruler,
  Scale,
  XCircle,
  Minus,
  Plus,
  MessageSquare,
} from 'lucide-react'

interface Product {
  id: number
  slug: string
  name: string
  description: string
  price: number
  sale_price: number | null
  display_price: string
  currency: string
  sku: string | null
  stock_quantity: number | null
  track_inventory: boolean
  unit: string | null
  weight: number | null
  dimensions: string | null
  specifications: Record<string, string> | null
  features: string[] | null
  primary_image: string | null
  gallery_images: string[]
  is_on_sale: boolean
  is_in_stock: boolean
  category: {
    id: number
    name: string
    slug: string
  } | null
  provider: {
    id: number
    slug: string
    business_name: string
    description: string
    city: string
    location: string
    phone: string
    email: string
    rating: number
    total_reviews: number
    verification_status: string
    logo: string | null
  }
}

interface RelatedProduct {
  id: number
  slug: string
  name: string
  description: string
  price: string
  regular_price: number
  sale_price: number | null
  currency: string
  image: string | null
  is_on_sale: boolean
}

interface SimilarProduct {
  id: number
  slug: string
  name: string
  price: string
  regular_price: number
  sale_price: number | null
  currency: string
  image: string | null
  is_on_sale: boolean
  provider: {
    name: string
    city: string
  }
}

interface Props {
  product: Product
  relatedProducts: RelatedProduct[]
  similarProducts: SimilarProduct[]
}

export default function ProductDetail({ product, relatedProducts, similarProducts }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product.primary_image)

  const allImages = [
    product.primary_image,
    ...(product.gallery_images || []),
  ].filter((img): img is string => img !== null && img !== undefined)

  const discountPercent = product.is_on_sale && product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  const maxQuantity = product.track_inventory ? (product.stock_quantity || 0) : 99

  return (
    <>
      <Head title={`${product.name} - ${product.provider.business_name}`} />
      <Header />

      <main className="min-h-screen bg-background pt-4 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <ShoppingBag className="w-24 h-24 text-primary/20" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_on_sale && (
                    <Badge variant="destructive" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {discountPercent}% OFF
                    </Badge>
                  )}
                  {!product.is_in_stock && (
                    <Badge variant="secondary">Out of Stock</Badge>
                  )}
                </div>

                {allImages.length > 1 && (
                  <Button
                    onClick={() => setShowAllPhotos(true)}
                    variant="outline"
                    size="sm"
                    className="absolute bottom-4 right-4 bg-white hover:bg-white/90"
                  >
                    View all photos
                  </Button>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.category && (
                  <Link href={`/search?type=products&catalogue=${product.category.id}`}>
                    <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                      {product.category.name}
                    </Badge>
                  </Link>
                )}
                {product.provider.verification_status === 'approved' && (
                  <Badge variant="default" className="gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified Seller
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

              {/* Provider */}
              <Link
                href={`/providers/${product.provider.slug}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                {product.provider.logo ? (
                  <img
                    src={product.provider.logo}
                    alt={product.provider.business_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold hover:text-primary transition-colors">
                    {product.provider.business_name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.provider.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{product.provider.city}</span>
                  </div>
                </div>
              </Link>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {product.display_price}
                  </span>
                  {product.is_on_sale && product.sale_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.currency} {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.unit && (
                  <p className="text-sm text-muted-foreground">per {product.unit}</p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.is_in_stock ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    {product.track_inventory && product.stock_quantity && (
                      <span className="text-muted-foreground">
                        ({product.stock_quantity} available)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                {product.is_in_stock && (
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <AddToCartButton
                  productId={product.id}
                  quantity={quantity}
                  size="lg"
                  className="flex-1"
                  inStock={product.is_in_stock}
                />
              </div>

              {/* Contact Seller */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <a href={`tel:${product.provider.phone}`}>
                    <Phone className="h-4 w-4" />
                    Call Seller
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <Link href={`/messages?provider=${product.provider.id}`}>
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Link>
                </Button>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">Features</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">Specifications</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                About the Seller
                {product.provider.verification_status === 'approved' && (
                  <BadgeCheck className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                {product.provider.logo && (
                  <img
                    src={product.provider.logo}
                    alt={product.provider.business_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <Link
                    href={`/providers/${product.provider.slug}`}
                    className="text-xl font-semibold hover:text-primary transition-colors"
                  >
                    {product.provider.business_name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.provider.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.provider.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {product.provider.description && (
                <p className="text-muted-foreground">{product.provider.description}</p>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{product.provider.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{product.provider.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{product.provider.email}</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/providers/${product.provider.slug}`}>
                  View All Products from This Seller
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">More from {product.provider.business_name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative aspect-square bg-muted">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        {p.is_on_sale && (
                          <Badge variant="destructive" className="absolute top-2 left-2">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <p className="font-bold text-sm text-primary mt-1">{p.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative aspect-square bg-muted">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        {p.is_on_sale && (
                          <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{p.provider.name}</p>
                        <p className="font-bold text-sm text-primary mt-1">{p.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Photo Lightbox Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm">
            <Button
              onClick={() => setShowAllPhotos(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Close
            </Button>
            <h2 className="text-white text-lg font-semibold">
              {product.name} - Photos
            </h2>
            <div className="w-20"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto grid gap-4">
              {allImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
