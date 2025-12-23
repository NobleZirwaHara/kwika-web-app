import { Head, Link, router } from '@inertiajs/react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'
import { Button } from '@/Components/ui/button'
import { Card, CardContent } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Search, ArrowRight, ShoppingBag, Tag, Sparkles, TrendingUp, Star, MapPin } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  product_count: number
}

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
  category?: string
  discount_percent?: number
  provider: {
    id: number
    name: string
    slug: string
    city: string
  }
}

interface Seller {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string | null
  logo: string | null
  product_count: number
}

interface ProductsProps {
  categories: Category[]
  featuredProducts: Product[]
  saleProducts: Product[]
  newArrivals: Product[]
  topSellers: Seller[]
}

export default function Products({
  categories = [],
  featuredProducts = [],
  saleProducts = [],
  newArrivals = [],
  topSellers = []
}: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.get('/search', { query: searchQuery, type: 'products' })
    }
  }

  return (
    <>
      <Head title="Products - Kwika Events" />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-background to-muted/20 pt-8 pb-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="max-w-3xl mx-auto relative">
                  <div className="flex items-center gap-3 rounded-full border-2 border-border bg-background px-6 py-4 shadow-lg hover:shadow-xl transition-shadow">
                    <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search decorations, party supplies, equipment and more"
                      className="flex-1 text-base bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              </form>

              {/* Featured Product Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative h-[400px] lg:h-[480px]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src="/resized-win/decor-3.jpg"
                      alt="Event products"
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlays - warm amber/orange theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.08_45)]/95 via-[oklch(0.30_0.10_40)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {/* Geometric glow effects */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.65_0.18_45)]/40 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[oklch(0.55_0.15_30)]/30 rounded-full blur-3xl" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="container mx-auto px-8 lg:px-16">
                      <div className="max-w-2xl">
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Badge */}
                          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="text-sm font-medium">Event Products Marketplace</span>
                          </div>

                          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.1]">
                            Everything for Your Perfect Event
                          </h1>

                          <p className="text-lg lg:text-xl text-white/85 mb-8 max-w-xl">
                            Decorations, equipment, party supplies — all from trusted local providers.
                          </p>

                          <div className="flex flex-wrap gap-3">
                            <Link href="/search?type=products">
                              <Button
                                size="lg"
                                className="bg-white text-[oklch(0.35_0.10_40)] hover:bg-white/90 text-base px-8 py-6 rounded-xl font-semibold shadow-lg"
                              >
                                Browse All Products
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Button>
                            </Link>
                            <Link href="/search?type=products&on_sale=true">
                              <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 text-base px-8 py-6 rounded-xl font-semibold"
                              >
                                <Tag className="mr-2 h-5 w-5" />
                                View Deals
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Category Pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute bottom-6 right-6 hidden lg:flex flex-wrap gap-2 max-w-xs justify-end"
                  >
                    {['Decorations', 'Party Supplies', 'Rentals', 'Cakes'].map((cat, i) => (
                      <motion.span
                        key={cat}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/30"
                      >
                        {cat}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Stats Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white px-5 py-3 rounded-2xl"
                  >
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs text-white/70">Products Available</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          {categories.length > 0 && (
            <section className="py-12 border-b">
              <div className="container mx-auto px-6 lg:px-20">
                <h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-heading)]">
                  Browse by Category
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        href={`/search?type=products&catalogue=${category.id}`}
                        className="group block"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <ShoppingBag className="w-12 h-12 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-semibold text-white text-sm">{category.name}</h3>
                            <p className="text-white/70 text-xs">{category.product_count} products</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Sale Products Section */}
          {saleProducts.length > 0 && (
            <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
              <div className="container mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">Hot Deals</h2>
                      <p className="text-sm text-muted-foreground">Limited time offers</p>
                    </div>
                  </div>
                  <Link href="/search?type=products&on_sale=true">
                    <Button variant="outline" className="gap-2">
                      View all deals
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                  {saleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showDiscount compact />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">Featured Products</h2>
                  </div>
                  <Link href="/search?type=products">
                    <Button variant="outline" className="gap-2">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {featuredProducts.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* New Arrivals Section */}
          {newArrivals.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">New Arrivals</h2>
                      <p className="text-sm text-muted-foreground">Fresh products just added</p>
                    </div>
                  </div>
                  <Link href="/search?type=products&sort_by=newest">
                    <Button variant="outline" className="gap-2">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} showNew compact />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Top Sellers Section */}
          {topSellers.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">Top Product Sellers</h2>
                  <Link href="/search?type=providers&has_products=true">
                    <Button variant="outline" className="gap-2">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topSellers.map((seller) => (
                    <Link
                      key={seller.id}
                      href={`/providers/${seller.slug}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative h-32 bg-muted">
                          {seller.image ? (
                            <img
                              src={seller.image}
                              alt={seller.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <CardContent className="p-4 relative">
                          {/* Logo */}
                          <div className="absolute -top-8 left-4 w-16 h-16 rounded-xl bg-background border-4 border-background overflow-hidden shadow-lg">
                            {seller.logo ? (
                              <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </div>

                          <div className="pt-6">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {seller.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{seller.location}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{seller.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({seller.reviews})</span>
                              </div>
                              <Badge variant="secondary">{seller.product_count} products</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {featuredProducts.length === 0 && saleProducts.length === 0 && newArrivals.length === 0 && (
            <section className="py-24">
              <div className="container mx-auto px-6 lg:px-20 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                  <ShoppingBag className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Products Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We're preparing an amazing marketplace for event products. Check back soon!
                </p>
                <Link href="/">
                  <Button>Browse Services Instead</Button>
                </Link>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}

// Product Card Component
function ProductCard({ product, showDiscount = false, showNew = false, compact = false }: { product: Product; showDiscount?: boolean; showNew?: boolean; compact?: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group shrink-0 snap-start ${compact ? 'w-36 md:w-40' : 'w-48 md:w-auto'}`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
        <div className={`relative ${compact ? 'aspect-[5/4]' : 'aspect-square'} overflow-hidden bg-muted`}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <ShoppingBag className="w-12 h-12 text-primary/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {showDiscount && product.discount_percent && (
              <Badge variant="destructive" className="text-xs">
                -{product.discount_percent}%
              </Badge>
            )}
            {showNew && (
              <Badge className="bg-green-500 text-white text-xs">
                New
              </Badge>
            )}
            {product.is_on_sale && !showDiscount && (
              <Badge variant="destructive" className="text-xs">
                Sale
              </Badge>
            )}
            {!product.in_stock && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate mb-2">
            {product.provider.name}
          </p>
          <div className="flex items-center gap-2">
            {product.is_on_sale && product.sale_price ? (
              <>
                <span className="font-bold text-sm text-destructive">{product.price}</span>
                <span className="text-xs text-muted-foreground line-through">
                  {product.currency} {product.regular_price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-bold text-sm text-primary">{product.price}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
