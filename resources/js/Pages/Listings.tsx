import { Head } from '@inertiajs/react'
import { Header } from "@/components/header"
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

interface ListingsProps {
  results: PaginatedData<Provider> | PaginatedData<Service>
  listingType: 'providers' | 'services'
  categories: Category[]
  cities: string[]
  searchParams: SearchParams
  totalResults: number
}

export default function Listings({
  results,
  listingType,
  categories,
  cities,
  searchParams,
  totalResults
}: ListingsProps) {
  return (
    <>
      <Head title={listingType === 'providers' ? 'Browse Providers' : 'Browse Services'} />
      <div className="min-h-screen">
        <Header />

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-6 lg:px-20">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                {listingType === 'providers' ? 'Browse Service Providers' : 'Browse Services'}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {listingType === 'providers'
                  ? 'Discover verified service providers for your next event. Filter by category, location, price range, and more.'
                  : 'Browse individual services from verified providers. Find exactly what you need for your event.'}
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
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
