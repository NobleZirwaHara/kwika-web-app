import { Head, Link } from '@inertiajs/react'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import { WishlistButton } from '@/components/wishlist-button'
import AnimatedLayout from '@/layouts/AnimatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import {
  Package as PackageIcon,
  CheckCircle,
  Star,
  MapPin,
  BadgeCheck,
  ArrowLeft,
  Clock,
  Users,
  Store,
} from 'lucide-react'

interface PackageItem {
  id: number
  quantity: number
  unit_price: number
  service: {
    id: number
    name: string
    description: string
    base_price: number
    price_type: string
    primary_image: string | null
  } | null
}

interface ServicePackage {
  id: number
  slug: string
  name: string
  description: string | null
  package_type: 'tier' | 'bundle'
  base_price: number
  final_price: number
  currency: string
  is_featured: boolean
  primary_image: string | null
  max_attendees: number | null
  valid_days: number | null
  items: PackageItem[]
  service_provider: {
    id: number
    business_name: string
    slug: string
    description: string
    location: string
    city: string
    logo: string | null
    average_rating: number | null
    total_reviews: number
    verification_status: string
  }
  base_service?: {
    id: number
    name: string
  } | null
}

interface RelatedPackage {
  id: number
  slug: string
  name: string
  description: string | null
  package_type: 'tier' | 'bundle'
  final_price: number
  currency: string
  is_featured: boolean
  primary_image: string | null
  items: PackageItem[]
}

interface SimilarPackage extends RelatedPackage {
  service_provider: {
    id: number
    business_name: string
    slug: string
    city: string
  }
}

interface Props {
  package: ServicePackage
  relatedPackages: RelatedPackage[]
  similarPackages: SimilarPackage[]
}

export default function PackageDetail({ package: pkg, relatedPackages, similarPackages }: Props) {
  const provider = pkg.service_provider
  const isVerified = provider.verification_status === 'approved'
  const hasDiscount = pkg.base_price > pkg.final_price
  const discountPercent = hasDiscount
    ? Math.round((1 - pkg.final_price / pkg.base_price) * 100)
    : 0

  return (
    <AnimatedLayout>
      <Head title={`${pkg.name} - ${provider.business_name}`} />
      <SearchHeader variant="back" />

      <main className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href={`/providers/${provider.slug}`} className="hover:text-primary">
              {provider.business_name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{pkg.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Package Header Card */}
              <Card>
                <div className="relative">
                  {/* Package Image */}
                  {pkg.primary_image ? (
                    <div className="relative h-64 md:h-80 overflow-hidden rounded-t-lg">
                      <img
                        src={pkg.primary_image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-64 md:h-80 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center rounded-t-lg">
                      <PackageIcon className="h-24 w-24 text-primary/30" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge variant={pkg.package_type === 'bundle' ? 'default' : 'secondary'}>
                      {pkg.package_type === 'bundle' ? 'Bundle Package' : 'Tier Package'}
                    </Badge>
                    {pkg.is_featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <WishlistButton
                      itemType="package"
                      itemId={pkg.id}
                      variant="default"
                    />
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl">{pkg.name}</CardTitle>
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="flex items-center gap-2 mt-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {provider.logo ? (
                          <img src={provider.logo} alt={provider.business_name} className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <Store className="h-5 w-5" />
                        )}
                        <span>{provider.business_name}</span>
                        {isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      </Link>
                    </div>
                    <div className="text-right shrink-0">
                      {hasDiscount && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(pkg.base_price, pkg.currency)}
                        </p>
                      )}
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {formatPrice(pkg.final_price, pkg.currency)}
                      </p>
                      {hasDiscount && (
                        <Badge variant="destructive" className="mt-1">
                          Save {discountPercent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  {pkg.description && (
                    <p className="text-muted-foreground">{pkg.description}</p>
                  )}

                  {/* Package Details */}
                  <div className="flex flex-wrap gap-4">
                    {pkg.max_attendees && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {pkg.max_attendees} guests</span>
                      </div>
                    )}
                    {pkg.valid_days && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Valid for {pkg.valid_days} days</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.city}</span>
                    </div>
                  </div>

                  {/* What's Included */}
                  {pkg.items.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-4">What's Included</h3>
                      <div className="space-y-3">
                        {pkg.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                  {item.quantity}x {item.service?.name || 'Service'}
                                </span>
                                {item.unit_price > 0 && (
                                  <span className="text-sm text-muted-foreground">
                                    {formatPrice(item.unit_price * item.quantity, pkg.currency)}
                                  </span>
                                )}
                              </div>
                              {item.service?.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {item.service.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-4 border-t">
                    <Button size="lg" className="w-full" asChild>
                      <Link href={`/bookings/package/${pkg.slug}`}>
                        Book This Package
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/providers/${provider.slug}`}
                    className="flex items-start gap-4 group"
                  >
                    {provider.logo ? (
                      <img
                        src={provider.logo}
                        alt={provider.business_name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Store className="h-8 w-8 text-primary/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {provider.business_name}
                        </h3>
                        {isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{provider.location}</span>
                      </div>
                      {provider.average_rating != null && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{Number(provider.average_rating).toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({provider.total_reviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/providers/${provider.slug}`}>
                      View All Services
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Book Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Book This Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">Total Price</span>
                    <div className="text-right">
                      {hasDiscount && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(pkg.base_price, pkg.currency)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(pkg.final_price, pkg.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>{pkg.items.length} services included</p>
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link href={`/bookings/package/${pkg.slug}`}>
                      Book Now
                    </Link>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    No payment required until confirmation
                  </p>
                </CardContent>
              </Card>

              {/* Related Packages */}
              {relatedPackages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">More from {provider.business_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPackages.map((related) => (
                      <Link
                        key={related.id}
                        href={`/packages/${related.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {related.primary_image ? (
                            <img
                              src={related.primary_image}
                              alt={related.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <PackageIcon className="h-6 w-6 text-primary/50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {related.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {related.items.length} services
                            </p>
                            <p className="text-sm font-semibold text-primary mt-1">
                              {formatPrice(related.final_price, related.currency)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Similar Packages */}
          {similarPackages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Similar Packages</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarPackages.map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/packages/${similar.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        {similar.primary_image ? (
                          <img
                            src={similar.primary_image}
                            alt={similar.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <PackageIcon className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                        {similar.is_featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {similar.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {similar.service_provider.business_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {similar.service_provider.city}
                        </p>
                        <p className="text-lg font-bold text-primary mt-2">
                          {formatPrice(similar.final_price, similar.currency)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </AnimatedLayout>
  )
}
