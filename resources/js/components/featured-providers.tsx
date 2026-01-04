import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useRef } from "react"
import { Link } from "@inertiajs/react"
import { ScrollArrows } from "@/components/ui/scroll-arrows"
import { WishlistButton } from "@/components/wishlist-button"

interface Provider {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  logo?: string
  description?: string
  featured: boolean
}

interface FeaturedProvidersProps {
  providers: Provider[]
  title?: string
}

export function FeaturedProviders({ providers, title = "Top-rated providers" }: FeaturedProvidersProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-4 md:py-12 relative z-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-heading)]">{title}</h2>
        </div>

        <div className="relative">
          <ScrollArrows scrollRef={scrollRef} className="hidden md:flex" />
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.slug}`}
              className="group cursor-pointer shrink-0 snap-start w-[42vw] sm:w-[45vw] md:w-72 relative z-0"
            >
              {/* Mobile: square aspect ratio like Airbnb, Desktop: square */}
              <div className="relative aspect-square overflow-hidden rounded-xl mb-2 md:mb-3">
                <img
                  src={provider.image || "/placeholder.svg"}
                  alt={provider.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {provider.featured && (
                  <Badge className="absolute top-3 left-3 bg-background text-foreground border-0 shadow-sm text-xs">
                    Featured
                  </Badge>
                )}
                <WishlistButton
                  itemType="provider"
                  itemId={provider.id}
                  variant="small"
                  className="absolute top-3 right-3"
                />
              </div>

              <div className="space-y-0.5 md:space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[15px] md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                    <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {provider.location}
                </p>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
