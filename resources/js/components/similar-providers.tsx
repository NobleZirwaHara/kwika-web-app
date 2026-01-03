import { Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const similarProviders = [
  {
    id: "2",
    name: "Michael Torres Photography",
    category: "Photographer",
    location: "Oakland, CA",
    rating: 4.92,
    reviews: 187,
    price: 2200,
    image: "/cinematic-wedding-videography.jpg",
    featured: true,
  },
  {
    id: "3",
    name: "Lens & Light Studios",
    category: "Photographer",
    location: "San Jose, CA",
    rating: 4.88,
    reviews: 156,
    price: 2800,
    image: "/professional-photographer-portfolio-wedding.jpg",
    featured: false,
  },
  {
    id: "4",
    name: "Capture Moments Pro",
    category: "Photographer",
    location: "Berkeley, CA",
    rating: 4.96,
    reviews: 203,
    price: 2600,
    image: "/luxury-wedding-decoration-flowers.jpg",
    featured: true,
  },
]

interface Provider {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image?: string
}

interface SimilarProvidersProps {
  currentProviderId: string
  providers?: Provider[]
}

export function SimilarProviders({ currentProviderId, providers = [] }: SimilarProvidersProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
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

  // Use provided providers or fallback to hardcoded data
  const displayProviders = providers.length > 0 ? providers : similarProviders

  return (
    <section className="border-t pt-12">
      <h2 className="text-2xl font-semibold font-heading mb-6">Similar Providers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProviders.map((provider) => (
          <div key={provider.id} className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
              <img
                src={provider.image || "/placeholder.svg"}
                alt={provider.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {'featured' in provider && provider.featured && (
                <Badge className="absolute top-3 left-3 bg-background text-foreground border-0 shadow-sm">
                  Guest favorite
                </Badge>
              )}
              <button
                onClick={() => toggleFavorite(provider.id.toString())}
                className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.has(provider.id.toString()) ? "fill-primary text-primary" : "text-foreground/70"}`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">{provider.location}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate">{provider.name}</p>
              {'price' in provider && (
                <p className="text-sm">
                  <span className="font-semibold text-foreground">${(provider as any).price.toLocaleString()}</span>
                  <span className="text-muted-foreground"> per event</span>
                </p>
              )}
              {provider.reviews > 0 && (
                <p className="text-sm text-muted-foreground">
                  {provider.reviews} {provider.reviews === 1 ? 'review' : 'reviews'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
