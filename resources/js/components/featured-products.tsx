import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, ShoppingCart, Tag } from "lucide-react"
import { Link } from "@inertiajs/react"

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
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Shop quality products from trusted event service providers
            </p>
          </div>
          <Link href="/search?type=products">
            <Button variant="outline" className="gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.image ? (
                    <img
                      src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <ShoppingCart className="w-16 h-16 text-primary/20" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_on_sale && (
                      <Badge variant="destructive" className="gap-1">
                        <Tag className="h-3 w-3" />
                        Sale
                      </Badge>
                    )}
                    {!product.in_stock && (
                      <Badge variant="secondary">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    by {product.provider.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.provider.city}
                  </p>
                  <div className="flex items-center pt-1">
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
                      <span className="text-sm font-bold text-primary">
                        {product.price}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
