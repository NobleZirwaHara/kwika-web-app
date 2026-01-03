import { Head } from '@inertiajs/react'
import { SearchHeader } from "@/components/search-header"
import { Footer } from "@/components/footer"
import { ServicesListingContainer } from "@/components/ServicesListing/ServicesListingContainer"
import type { Provider } from "@/components/ServicesListing/ProviderCard"
import type { Service } from "@/components/ServicesListing/ServiceCard"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  subcategories?: Array<{ id: number; name: string }>
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

interface SearchParams {
  query?: string
  category?: number
  city?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  price_type?: 'fixed' | 'hourly' | 'daily' | 'custom'
  available_date?: string
  sort_by: 'rating' | 'reviews' | 'price' | 'newest'
  sort_order: 'asc' | 'desc'
  per_page: number
  listing_type: 'providers' | 'services'
}

interface SearchProps {
  results: PaginatedData<Provider> | PaginatedData<Service>
  listingType: 'providers' | 'services'
  categories: Category[]
  cities: string[]
  searchParams: SearchParams
  totalResults: number
}

export default function Search({
  results,
  listingType,
  categories,
  cities,
  searchParams,
  totalResults
}: SearchProps) {
  const getPageTitle = () => {
    const parts = []

    if (searchParams.query) {
      parts.push(`"${searchParams.query}"`)
    }

    if (searchParams.category) {
      const category = categories.find(c => c.id === searchParams.category)
      if (category) {
        parts.push(category.name)
      }
    }

    if (searchParams.city) {
      parts.push(`in ${searchParams.city}`)
    }

    if (parts.length > 0) {
      return `${parts.join(' ')} - Search Results`
    }

    return listingType === 'providers' ? 'Browse Providers' : 'Browse Services'
  }

  const getPageHeading = () => {
    if (searchParams.query) {
      return `Results for "${searchParams.query}"`
    }

    if (searchParams.category) {
      const category = categories.find(c => c.id === searchParams.category)
      if (category) {
        return category.name
      }
    }

    if (searchParams.city) {
      return `${listingType === 'providers' ? 'Providers' : 'Services'} in ${searchParams.city}`
    }

    return listingType === 'providers' ? 'All Providers' : 'All Services'
  }

  return (
    <>
      <Head title={getPageTitle()} />
      <div className="min-h-screen">
        <SearchHeader />

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-6 lg:px-20">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                {getPageHeading()}
              </h1>
              {searchParams.query && (
                <p className="text-muted-foreground">
                  Showing {listingType === 'providers' ? 'service providers' : 'services'} matching your search
                </p>
              )}
            </div>

            {/* Listing Container */}
            <ServicesListingContainer
              results={results}
              listingType={listingType}
              categories={categories}
              cities={cities}
              searchParams={searchParams}
              totalResults={totalResults}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
