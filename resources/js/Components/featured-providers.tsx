"use client"

import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import { useRef, useState } from "react"
import Link from "next/link"

const providers = [
  {
    id: "sarah-chen-photography",
    name: "Sarah Chen Photography",
    category: "Photographer",
    location: "San Francisco, CA",
    rating: 4.95,
    reviews: 234,
    price: 2500,
    image: "/professional-photographer-portfolio-wedding.jpg",
    featured: true,
  },
  {
    id: "elegant-events-decor",
    name: "Elegant Events Decor",
    category: "Decorator",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 189,
    price: 3200,
    image: "/luxury-wedding-decoration-flowers.jpg",
    featured: true,
  },
  {
    id: "motion-masters-video",
    name: "Motion Masters Video",
    category: "Videographer",
    location: "New York, NY",
    rating: 4.89,
    reviews: 156,
    price: 3800,
    image: "/cinematic-wedding-videography.jpg",
    featured: true,
  },
  {
    id: "crystal-sound-systems",
    name: "Crystal Sound Systems",
    category: "PA System",
    location: "Austin, TX",
    rating: 4.92,
    reviews: 98,
    price: 1200,
    image: "/professional-audio-equipment-event.jpg",
    featured: false,
  },
  {
    id: "bloom-petal-florists",
    name: "Bloom & Petal Florists",
    category: "Florist",
    location: "Seattle, WA",
    rating: 4.97,
    reviews: 312,
    price: 1800,
    image: "/luxury-wedding-flowers-bouquet.jpg",
    featured: true,
  },
  {
    id: "gourmet-gatherings",
    name: "Gourmet Gatherings",
    category: "Caterer",
    location: "Chicago, IL",
    rating: 4.88,
    reviews: 267,
    price: 4500,
    image: "/elegant-catering-food-display.jpg",
    featured: false,
  },
]

export function FeaturedProviders() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(name)) {
        newSet.delete(name)
      } else {
        newSet.add(name)
      }
      return newSet
    })
  }

  return (
    <section className="py-12 relative z-0">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">Top-rated providers</h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {providers.map((provider) => (
            <Link
              key={provider.name}
              href={`/providers/${provider.id}`}
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
                    Guest favorite
                  </Badge>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(provider.name)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.has(provider.name) ? "fill-primary text-primary" : "text-foreground/70"}`}
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
                <p className="text-sm text-muted-foreground">{provider.category}</p>
                <p className="text-sm">
                  <span className="font-semibold text-foreground">${provider.price.toLocaleString()}</span>
                  <span className="text-muted-foreground"> per event</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
