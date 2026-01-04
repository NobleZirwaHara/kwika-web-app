import { Link } from '@inertiajs/react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { WishlistButton } from "@/components/wishlist-button"

export interface Service {
  id: number
  slug: string
  name: string
  description: string
  price: number
  formatted_price: string
  price_type: 'fixed' | 'hourly' | 'daily' | 'custom'
  currency: string
  duration?: number
  image?: string
  category?: {
    id: number
    name: string
  }
  provider: {
    id: number
    slug: string
    name: string
    city: string
    rating: number
    reviews: number
    logo?: string
    latitude?: number
    longitude?: number
  }
}

interface ServiceCardProps {
  service: Service
  onBookClick?: (service: Service) => void
  className?: string
}

export function ServiceCard({
  service,
  className
}: ServiceCardProps) {

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn("group cursor-pointer block relative z-0", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
        {service.image ? (
          <img
            src={service.image.startsWith('http') ? service.image : `/storage/${service.image}`}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl font-bold text-primary/20">
              {service.name.charAt(0)}
            </span>
          </div>
        )}
        {service.category && (
          <Badge className="absolute top-3 left-3 bg-background text-foreground border-0 shadow-sm">
            {service.category.name}
          </Badge>
        )}
        <WishlistButton
          itemType="service"
          itemId={service.id}
          variant="small"
          className="absolute top-3 right-3"
        />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          by {service.provider.name}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {service.provider.city}
        </p>
        <span className="text-sm font-bold text-primary">{service.formatted_price}</span>
      </div>
    </Link>
  )
}
