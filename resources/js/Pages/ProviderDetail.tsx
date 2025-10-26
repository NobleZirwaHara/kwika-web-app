import { Header } from "@/Components/header"
import { ProviderGallery } from "@/Components/provider-gallery"
import { ProviderInfo } from "@/Components/provider-info"
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

interface Props {
  provider: ProviderData
  services: Service[]
  reviews: Review[]
  similarProviders: SimilarProvider[]
}

export default function ProviderDetail({ provider, services, reviews, similarProviders }: Props) {
  // Get the first service price for booking component, or use default
  const basePrice = services.length > 0 ? services[0].basePrice : 0

  return (
    <>
      <Head title={`${provider.name} - EventHub`} />
      <div className="min-h-screen">
        <Header />
        <main className="pt-24">
          <div className="container mx-auto px-6 lg:px-20 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <ProviderGallery images={provider.images} />
              <ProviderInfo provider={provider} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <ProviderReviews rating={provider.rating} reviewCount={provider.totalReviews} />
              </div>
              <div className="lg:col-span-1">
                <ProviderBooking price={basePrice} cancellationPolicy="Flexible cancellation up to 24 hours before the event" />
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
