import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, ShoppingCart, Tag, Heart } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useRef, useState } from "react"
import { ScrollArrows } from "@/components/ui/scroll-arrows"

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  regular_price: number
  sale_price: number | null
  currency: string
  image: string | null
  is_on_sale: boolean
  in_stock: boolean
  provider: {
    id: number
    name: string
    slug: string
    city: string
  }
}

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
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

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Featured Products</h2>
            <p className="text-sm md:text-base text-muted-foreground hidden md:block">
              Shop quality products from trusted event service providers
            </p>
          </div>
          <Link href="/search?type=products" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="relative">
          <ScrollArrows scrollRef={scrollRef} className="hidden md:flex" />

          {/* Mobile horizontal scroll */}
          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group shrink-0 snap-start w-[42vw] sm:w-[45vw] md:w-auto"
              >
                <div className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative aspect-square overflow-hidden bg-muted rounded-xl">
                    {product.image ? (
                      <img
                        src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <ShoppingCart className="w-16 h-16 text-primary/20" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.is_on_sale && (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <Tag className="h-3 w-3" />
                          Sale
                        </Badge>
                      )}
                      {!product.in_stock && (
                        <Badge variant="secondary" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(product.id)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors hover:scale-110 active:scale-95"
                    >
                      <Heart
                        className={`h-5 w-5 md:h-4 md:w-4 transition-colors ${favorites.has(product.id) ? "fill-primary text-primary" : "text-foreground/70"}`}
                      />
                    </button>
                  </div>
                  <div className="py-2 md:p-4 space-y-0.5 md:space-y-1">
                    <h3 className="font-semibold text-[15px] md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.provider.city}
                    </p>
                    <div className="flex items-center">
                      {product.is_on_sale && product.sale_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-destructive">
                            {product.price}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {product.currency} {product.regular_price.toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-foreground">
                          {product.price}
                        </span>
                      )}
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
