import { Head } from '@inertiajs/react'
import { SearchHeader } from "@/Components/search-header"
import { Footer } from "@/Components/footer"
import { ServicesListingContainer } from "@/Components/ServicesListing/ServicesListingContainer"
import type { Provider } from "@/Components/ServicesListing/ProviderCard"

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

interface ProvidersProps {
  results: PaginatedData<Provider>
  listingType: 'providers'
  categories: Category[]
  cities: string[]
  searchParams: SearchParams
  totalResults: number
}

export default function Providers({
  results,
  listingType,
  categories,
  cities,
  searchParams,
  totalResults
}: ProvidersProps) {
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
      return `${parts.join(' ')} - Providers`
    }

    return 'Browse Providers'
  }

  const getPageHeading = () => {
    if (searchParams.query) {
      return `Providers matching "${searchParams.query}"`
    }

    if (searchParams.category) {
      const category = categories.find(c => c.id === searchParams.category)
      if (category) {
        return `${category.name} Providers`
      }
    }

    if (searchParams.city) {
      return `Providers in ${searchParams.city}`
    }

    return 'Browse Providers'
  }

  const getPageDescription = () => {
    if (searchParams.query) {
      return `Discover service providers matching your search`
    }

    if (searchParams.category) {
      return `Find the best service providers for your needs`
    }

    if (searchParams.city) {
      return `Explore trusted service providers in your area`
    }

    return 'Discover and connect with trusted event service providers in Malawi'
  }

  return (
    <>
      <Head title={getPageTitle()} />
      <div className="min-h-screen">
        <SearchHeader />

        <main className="pt-32 pb-12">
          <div className="container mx-auto px-6 lg:px-20">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                {getPageHeading()}
              </h1>
              <p className="text-muted-foreground">
                {getPageDescription()}
              </p>
            </div>

            {/* Listing Container */}
            <ServicesListingContainer
              results={results}
              listingType={listingType}
              categories={categories}
              cities={cities}
              searchParams={searchParams}
              totalResults={totalResults}
              hideListingTypeToggle
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
