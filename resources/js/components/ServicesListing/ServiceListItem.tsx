import { Link } from '@inertiajs/react'
import { Star, Clock, Tag, MapPin, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Service } from "./ServiceCard"

interface ServiceListItemProps {
  service: Service
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onBookClick?: (service: Service) => void
  className?: string
}

export function ServiceListItem({
  service,
  isFavorite = false,
  onToggleFavorite,
  onBookClick,
  className
}: ServiceListItemProps) {
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
    <div className={cn(
      "group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-48 h-32 shrink-0 overflow-hidden rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Category badge */}
          {service.category && (
            <Badge className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-sm text-xs">
              {service.category.name}
            </Badge>
          )}

          {/* Duration */}
          {service.duration && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-1 text-xs font-medium">
                <Clock className="h-3 w-3" />
                {formatDuration(service.duration)}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              {/* Provider info */}
              <Link
                href={`/providers/${service.provider.slug}`}
                className="flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={service.provider.logo} alt={service.provider.name} />
                  <AvatarFallback className="text-xs">{service.provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{service.provider.name}</span>
                  <span>•</span>
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
              </Link>
            </div>

            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-primary text-primary" : "text-foreground/70"
                  )}
                />
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {service.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t">
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
    </div>
  )
}
