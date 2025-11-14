import { SearchHeader } from "@/Components/search-header"
import { ProviderGallery } from "@/Components/provider-gallery"
import { ProviderInfo } from "@/Components/provider-info"
import { ProviderServices } from "@/Components/provider-services"
import { ProviderBooking } from "@/Components/provider-booking"
import { ProviderReviews } from "@/Components/provider-reviews"
import { SimilarProviders } from "@/Components/similar-providers"
import { Footer } from "@/Components/footer"
import { Head } from '@inertiajs/react'

interface ProviderData {
  id: string | number
  slug: string
  name: string
  description: string
  location: string
  city: string
  phone: string
  email: string
  website?: string
  rating: number
  totalReviews: number
  totalBookings: number
  coverImage?: string
  logo?: string
  isVerified: boolean
  isFeatured: boolean
  images: string[]
}

interface Service {
  id: number
  name: string
  description: string
  category: string
  price: string
  basePrice: number
  priceType: string
  duration?: string
  inclusions?: string[]
}

interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  createdAt: string
  isVerified: boolean
}

interface SimilarProvider {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image?: string
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface Props {
  provider: ProviderData
  services: Service[]
  reviews: Review[]
  similarProviders: SimilarProvider[]
  categories?: Category[]
  auth?: {
    user?: any
  }
}

export default function ProviderDetail({ provider, services, reviews, similarProviders, categories = [], auth }: Props) {
  // Get the first service for booking component
  const firstService = services.length > 0 ? services[0] : null
  const basePrice = firstService ? firstService.basePrice : 0
  const serviceId = firstService ? firstService.id : undefined
  const priceType = firstService ? firstService.priceType : 'event'

  return (
    <>
      <Head title={`${provider.name} - EventHub`} />
      <div className="min-h-screen">
        <SearchHeader categories={categories} user={auth?.user} />
        <main className="pt-24">
          <div className="container mx-auto px-6 lg:px-20 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <ProviderGallery images={provider.images} />
              <ProviderInfo provider={provider} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-8">
                {/* Services Section */}
                <ProviderServices services={services} currency="MWK" providerId={provider.id} />

                {/* Reviews Section */}
                <ProviderReviews rating={provider.rating} reviewCount={provider.totalReviews} />
              </div>
              <div className="lg:col-span-1">
                <ProviderBooking
                  price={basePrice}
                  currency="MWK"
                  priceType={priceType}
                  serviceId={serviceId}
                  cancellationPolicy="Flexible cancellation up to 24 hours before the event"
                />
              </div>
            </div>

            <SimilarProviders currentProviderId={provider.id.toString()} providers={similarProviders} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
