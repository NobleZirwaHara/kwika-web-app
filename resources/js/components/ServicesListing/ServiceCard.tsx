import { Link } from '@inertiajs/react'
import { Heart } from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { cn } from "@/lib/utils"

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
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onBookClick?: (service: Service) => void
  className?: string
}

export function ServiceCard({
  service,
  isFavorite = false,
  onToggleFavorite,
  className
}: ServiceCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(service.id)
  }

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
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors shadow-sm hover:shadow-md"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-primary text-primary" : "text-foreground/70"
              )}
            />
          </button>
        )}
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
