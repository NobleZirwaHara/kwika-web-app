import { Link } from '@inertiajs/react'
import { Star, Clock, Tag, MapPin, Heart } from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { useState } from "react"
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
  onBookClick,
  className
}: ServiceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(service.id)
  }

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onBookClick?.(service)
  }

  const getPriceTypeLabel = () => {
    switch (service.price_type) {
      case 'hourly':
        return '/hr'
      case 'daily':
        return '/day'
      case 'custom':
        return ''
      case 'fixed':
      default:
        return ''
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className={cn("group cursor-pointer block rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Image */}
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-300",
            "group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Category badge */}
        {service.category && (
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-sm">
            <Tag className="h-3 w-3 mr-1" />
            {service.category.name}
          </Badge>
        )}

        {/* Favorite button */}
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

        {/* Duration */}
        {service.duration && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              {formatDuration(service.duration)}
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Service name */}
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Provider info */}
        <Link
          href={`/providers/${service.provider.slug}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={service.provider.logo} alt={service.provider.name} />
            <AvatarFallback>{service.provider.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{service.provider.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-foreground text-foreground" />
                <span>{service.provider.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{service.provider.city}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Price and book button */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-xl font-bold text-foreground">
              {service.formatted_price}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {getPriceTypeLabel()}
              </span>
            </p>
          </div>
          <Button
            onClick={handleBookClick}
            size="sm"
            className="rounded-full"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )
}
