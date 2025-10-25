import { Header } from "@/Components/header"
import { ProviderGallery } from "@/Components/provider-gallery"
import { ProviderInfo } from "@/Components/provider-info"
import { ProviderBooking } from "@/Components/provider-booking"
import { ProviderReviews } from "@/Components/provider-reviews"
import { SimilarProviders } from "@/Components/similar-providers"
import { Footer } from "@/Components/footer"
import { Head } from '@inertiajs/react'

interface ProviderData {
  id: string
  name: string
  category: string
  location: string
  rating: number
  reviews: number
  price: number
  images: string[]
  description: string
  about: string
  badges: Array<{
    icon: string
    title: string
    description: string
  }>
  languages: string[]
  cancellationPolicy: string
}

interface Props {
  provider: ProviderData
}

export default function ProviderDetail({ provider }: Props) {
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
                <ProviderReviews rating={provider.rating} reviewCount={provider.reviews} />
              </div>
              <div className="lg:col-span-1">
                <ProviderBooking price={provider.price} cancellationPolicy={provider.cancellationPolicy} />
              </div>
            </div>

            <SimilarProviders currentProviderId={provider.id} category={provider.category} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
