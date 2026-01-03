import { Head, Link, router } from '@inertiajs/react'
import CustomerLayout from '@/components/CustomerLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, MapPin, Trash2, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Service {
  id: number
  slug: string
  name: string
  description: string
  base_price: number
  max_price: number | null
  price_type: string
  currency: string
  primary_image: string | null
  added_at: string
  category: {
    id: number
    name: string
    slug: string
  } | null
  provider: {
    id: number
    slug: string
    business_name: string
    city: string
    rating: number
    verification_status: string
  }
}

interface Props {
  services: Service[]
  auth: {
    user?: {
      id: number
      name: string
      email: string
    }
  }
}

export default function WishlistIndex({ services, auth }: Props) {
  const [removingId, setRemovingId] = useState<number | null>(null)

  const handleRemoveFromWishlist = async (serviceId: number) => {
    if (!confirm('Remove this service from your wishlist?')) {
      return
    }

    setRemovingId(serviceId)

    try {
      await fetch(`/wishlist/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
        },
      })

      // Reload the page to update the list
      router.reload()
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      setRemovingId(null)
    }
  }

  const formatPrice = (service: Service) => {
    if (service.max_price) {
      return `${service.currency} ${service.base_price.toLocaleString()} - ${service.max_price.toLocaleString()}`
    }
    return `${service.currency} ${service.base_price.toLocaleString()}`
  }

  return (
    <CustomerLayout title="My Wishlist">
      <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
                <p className="text-muted-foreground mt-1">
                  {services.length} {services.length === 1 ? 'service' : 'services'} saved for later
                </p>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
                >
                  <div className="relative">
                    {/* Image */}
                    <Link href={`/services/${service.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {service.primary_image ? (
                          <img
                            src={service.primary_image}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(service.id)}
                      disabled={removingId === service.id}
                      className={cn(
                        "absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm",
                        "flex items-center justify-center shadow-lg hover:bg-white",
                        "transition-all duration-200 hover:scale-110 cursor-pointer",
                        removingId === service.id && "opacity-50 cursor-not-allowed"
                      )}
                      title="Remove from wishlist"
                    >
                      <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    </button>

                    {/* Category Badge */}
                    {service.category && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-md">
                          {service.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    {/* Provider Info */}
                    <Link
                      href={`/providers/${service.provider.slug}`}
                      className="flex items-center gap-2 mb-3 group/provider"
                    >
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.provider.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground group-hover/provider:text-primary transition-colors">
                        {service.provider.business_name}
                      </span>
                    </Link>

                    {/* Service Name */}
                    <Link href={`/services/${service.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {service.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(service)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per {service.price_type}
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/services/${service.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>

                    {/* Added At */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Added {service.added_at}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-6">
                  <Heart className="h-12 w-12 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start saving services you love by clicking the heart icon on service pages.
                  We'll keep them here for you!
                </p>
                <Button asChild size="lg">
                  <Link href="/search">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Services
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          {services.length > 0 && (
            <Card className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to book?</h3>
                <p className="text-muted-foreground mb-6">
                  Turn your wishlist into reality. Book your favorite services today!
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button asChild size="lg">
                    <Link href="/search">
                      Browse More Services
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </CustomerLayout>
  )
}
