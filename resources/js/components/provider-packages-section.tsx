import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@inertiajs/react"
import { Package, Plus, CheckCircle, Star } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"
import { formatPrice } from "@/lib/utils"

interface PackageItem {
  quantity: number
  service_name: string
}

interface ServicePackage {
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

interface ProviderPackagesSectionProps {
  packages: ServicePackage[]
  providerId: string | number
}

export function ProviderPackagesSection({ packages, providerId }: ProviderPackagesSectionProps) {
  const currency = packages[0]?.currency || 'MWK'
  const hasPackages = packages.length > 0

  return (
    <div className="border-t pt-6 mb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Service Packages
            </h2>
            <p className="text-muted-foreground mt-1">
              {hasPackages
                ? 'Choose from our curated packages or build your own custom package'
                : 'Build your own custom package by selecting the services you need'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button asChild size="lg" className="gap-2">
          <Link href={`/bookings/custom?provider_id=${providerId}`}>
            <Plus className="h-5 w-5" />
            Build Your Own Package
          </Link>
        </Button>
        {hasPackages && (
          <Button asChild variant="outline" size="lg">
            <Link href="#packages-grid">
              View Pre-Built Packages ({packages.length})
            </Link>
          </Button>
        )}
      </div>

      {/* Packages Grid */}
      {hasPackages && (
        <div id="packages-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group"
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              {pkg.is_featured && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white px-3 py-1 text-xs font-bold flex items-center gap-1 rounded-bl-lg">
                    <Star className="h-3 w-3 fill-current" />
                    FEATURED
                  </div>
                </div>
              )}

              {/* Package Image */}
              {pkg.primary_image ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.primary_image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <WishlistButton
                    itemType="package"
                    itemId={pkg.id}
                    variant="small"
                    className="absolute top-3 left-3 z-20"
                  />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge
                      variant={pkg.package_type === 'bundle' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {pkg.package_type === 'bundle' ? 'Bundle Package' : 'Tier Package'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Package className="h-16 w-16 text-primary/30" />
                  <WishlistButton
                    itemType="package"
                    itemId={pkg.id}
                    variant="small"
                    className="absolute top-3 left-3 z-20"
                  />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge
                      variant={pkg.package_type === 'bundle' ? 'default' : 'secondary'}
                    >
                      {pkg.package_type === 'bundle' ? 'Bundle Package' : 'Tier Package'}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {pkg.name}
                </CardTitle>
                {pkg.description && (
                  <CardDescription className="line-clamp-2 text-sm">
                    {pkg.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Included Services */}
                {pkg.items.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Includes:
                    </p>
                    <ul className="space-y-1.5">
                      {pkg.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">{item.quantity}x</span> {item.service_name}
                          </span>
                        </li>
                      ))}
                      {pkg.items.length > 3 && (
                        <li className="text-sm text-muted-foreground italic pl-6">
                          + {pkg.items.length - 3} more service{pkg.items.length - 3 > 1 ? 's' : ''}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Price */}
                <div className="pt-3 border-t">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Total Price</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(pkg.final_price, currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full group-hover:bg-primary/90" size="sm">
                  View Package Details
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      )}
    </div>
  )
}
