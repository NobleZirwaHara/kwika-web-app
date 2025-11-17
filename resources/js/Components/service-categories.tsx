import { Camera, Video, Sparkles, Music, Utensils, Flower, Building, Disc } from "lucide-react"
import { useRef } from "react"
import { Link } from "@inertiajs/react"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface ServiceCategoriesProps {
  categories: Category[]
}

// Map icon names to Lucide components
const iconMap: Record<string, any> = {
  camera: Camera,
  video: Video,
  sparkles: Sparkles,
  music: Music,
  utensils: Utensils,
  flower: Flower,
  building: Building,
  disc: Disc,
}

// Map category names to images
const categoryImages: Record<string, string> = {
  Photographers: "/professional-event-photographer-with-camera.jpg",
  Videographers: "/videographer-filming-wedding-event.jpg",
  Decorators: "/elegant-event-decoration-setup.jpg",
  "PA Systems": "/professional-sound-system-event-setup.jpg",
  Caterers: "/professional-catering-service.jpg",
  Florists: "/elegant-floral-arrangements.jpg",
  Venues: "/elegant-event-venue.png",
  DJs: "/professional-sound-system-event-setup.jpg",
}

export function ServiceCategories({ categories }: ServiceCategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-12 border-b relative z-0">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-heading)]">Browse by category</h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Sparkles
            const image = categoryImages[category.name] || "/placeholder.svg"

            return (
              <Link
                key={category.slug}
                href={`/search?category=${category.id}`}
                className="group cursor-pointer shrink-0 snap-start relative z-0"
              >
                <div className="relative w-64 aspect-square overflow-hidden rounded-xl mb-3">
                  <img
                    src={image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* <Icon className="h-4 w-4 text-foreground" /> */}
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
