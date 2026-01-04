import { Link } from '@inertiajs/react'
import { Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Provider } from "./ProviderCard"
import { WishlistButton } from "@/components/wishlist-button"

interface ProviderListItemProps {
  provider: Provider
  className?: string
}

export function ProviderListItem({
  provider,
  className
}: ProviderListItemProps) {
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
    <div className={cn(
      "group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex gap-4 p-4">
        {/* Image */}
        <Link
          href={`/providers/${provider.slug}`}
          className="relative w-48 h-32 shrink-0 overflow-hidden rounded-lg"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={provider.image || "/placeholder.svg"}
            alt={provider.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {provider.featured && (
            <Badge className="absolute top-2 left-2 bg-background text-foreground border-0 shadow-sm text-xs">
              ⭐ Featured
            </Badge>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <Link href={`/providers/${provider.slug}`} className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {provider.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{provider.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  <span>({provider.reviews} reviews)</span>
                </div>
              </div>
            </Link>

            {/* Wishlist button */}
            <WishlistButton
              itemType="provider"
              itemId={provider.id}
              variant="small"
            />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {provider.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t">
            <div className="flex items-center gap-4">
              {provider.min_price && (
                <div>
                  <p className="text-xs text-muted-foreground">Starting from</p>
                  <p className="text-lg font-bold">{formatPrice(provider.min_price)}</p>
                </div>
              )}
            </div>
            <Button
              asChild
              size="sm"
              className="rounded-full"
            >
              <Link href={`/providers/${provider.slug}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
