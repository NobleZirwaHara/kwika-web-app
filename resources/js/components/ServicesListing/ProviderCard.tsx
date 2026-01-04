import { Link } from '@inertiajs/react'
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { WishlistButton } from "@/components/wishlist-button"

export interface Provider {
  id: number
  slug: string
  name: string
  description: string
  location: string
  city: string
  rating: number
  reviews: number
  image?: string
  logo?: string
  featured: boolean
  min_price?: number
  latitude?: number
  longitude?: number
}

interface ProviderCardProps {
  provider: Provider
  className?: string
}

export function ProviderCard({
  provider,
  className
}: ProviderCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className={cn("group cursor-pointer block", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Image */}
        <img
          src={provider.image || "/placeholder.svg"}
          alt={provider.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-300",
            "group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Featured badge */}
        {provider.featured && (
          <Badge className="absolute top-3 left-3 bg-background text-foreground border-0 shadow-sm">
            ⭐ Featured
          </Badge>
        )}

        {/* Wishlist button */}
        <WishlistButton
          itemType="provider"
          itemId={provider.id}
          variant="small"
          className="absolute top-3 right-3"
        />

        {/* Price tag */}
        {provider.min_price && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <span className="text-muted-foreground text-xs">From</span>
              <span>{formatPrice(provider.min_price)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="space-y-1">
        {/* Name */}
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {provider.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-muted-foreground truncate">
          {provider.city}
        </p>

        {/* Price and rating */}
        <div className="flex items-center justify-between">
          {provider.min_price ? (
            <span className="text-sm font-bold text-primary">
              From {formatPrice(provider.min_price)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Contact for pricing</span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
            <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
