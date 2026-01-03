import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import { useRef, useState } from "react"
import { Link } from "@inertiajs/react"
import { ScrollArrows } from "@/components/ui/scroll-arrows"

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
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section className="py-12 relative z-0">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">{title}</h2>
        </div>

        <div className="relative">
          <ScrollArrows scrollRef={scrollRef} />
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.slug}`}
              className="group cursor-pointer shrink-0 snap-start w-72 relative z-0"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
                <img
                  src={provider.image || "/placeholder.svg"}
                  alt={provider.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {provider.featured && (
                  <Badge className="absolute top-3 left-3 bg-background text-foreground border-0 shadow-sm">
                    Featured
                  </Badge>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(provider.id)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.has(provider.id) ? "fill-primary text-primary" : "text-foreground/70"}`}
                  />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {provider.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {provider.location}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                    <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
