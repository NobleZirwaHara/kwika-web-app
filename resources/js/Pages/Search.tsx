import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Head, Link } from '@inertiajs/react'
import { Star, Heart, MapPin } from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { useState } from "react"
import { SearchHeader } from "@/Components/search-header"

interface Provider {
  id: number
  slug: string
  name: string
  description: string
  location: string
  city: string
  rating: number
  reviews: number
  image?: string
  logo?: string
  featured: boolean
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface SearchParams {
  query?: string
  category?: number
  city?: string
}

interface PaginatedProviders {
  data: Provider[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface SearchProps {
  providers: PaginatedProviders
  categories: Category[]
  searchParams: SearchParams
  totalResults: number
}

export default function Search({ providers, categories, searchParams, totalResults }: SearchProps) {
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

  const getSearchTitle = () => {
    if (searchParams?.query && typeof searchParams.query === 'string') {
      return `Search results for "${searchParams.query}"`
    }
    if (searchParams?.city && typeof searchParams.city === 'string') {
      return `Providers in ${searchParams.city}`
    }
    if (searchParams?.category) {
      const category = categories.find(c => c.id === searchParams.category)
      if (category) {
        return `${category.name}`
      }
    }
    return 'Search Results'
  }

  return (
    <>
      <Head title={getSearchTitle()} />
      <div className="min-h-screen">
        <SearchHeader />
        <main className="pt-24">
          <div className="container mx-auto px-6 lg:px-20 py-8">
            {/* Search header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-heading mb-2">{getSearchTitle()}</h1>
              <p className="text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'provider' : 'providers'} found
              </p>
            </div>

            {/* Results grid */}
            {providers.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.data.map((provider) => (
                  <Link
                    key={provider.id}
                    href={`/providers/${provider.slug}`}
                    className="group cursor-pointer"
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">{provider.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                          <span className="text-sm font-medium">{provider.rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{provider.city}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
                      <p className="text-sm text-muted-foreground">({provider.reviews} reviews)</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">No providers found</p>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}

            {/* Pagination */}
            {providers.last_page > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: providers.last_page }, (_, i) => i + 1).map((page) => {
                  const params: Record<string, string> = { page: page.toString() }
                  if (searchParams?.query) params.query = String(searchParams.query)
                  if (searchParams?.category) params.category = String(searchParams.category)
                  if (searchParams?.city) params.city = String(searchParams.city)

                  return (
                    <Link
                      key={page}
                      href={`/search?${new URLSearchParams(params).toString()}`}
                      className={`px-4 py-2 rounded-lg ${
                        page === providers.current_page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {page}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
