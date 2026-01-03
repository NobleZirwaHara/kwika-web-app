import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { WishlistButton } from "@/Components/wishlist-button"
import { ArrowRight } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useRef } from "react"
import { ScrollArrows } from "@/Components/ui/scroll-arrows"

interface Service {
  id: number
  name: string
  slug: string
  description: string
  price: string
  base_price: number
  currency: string
  image: string | null
  category: string | null
  provider: {
    id: number
    name: string
    slug: string
    city: string
  }
}

interface FeaturedServicesProps {
  services: Service[]
  isAuthenticated?: boolean
}

export function FeaturedServices({ services, isAuthenticated = false }: FeaturedServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!services || services.length === 0) {
    return null
  }

  return (
    <section className="py-12 relative z-0 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">Featured Services</h2>
          <Link href="/search?type=services">
            <Button variant="outline" className="gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <ScrollArrows scrollRef={scrollRef} />
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {services.slice(0, 8).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group cursor-pointer shrink-0 snap-start w-72 relative z-0"
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
                    {service.category}
                  </Badge>
                )}
                <div className="absolute top-3 right-3">
                  <WishlistButton
                    serviceId={service.id}
                    isAuthenticated={isAuthenticated}
                    variant="default"
                  />
                </div>
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
                <span className="text-sm font-bold text-primary">{service.price}</span>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
