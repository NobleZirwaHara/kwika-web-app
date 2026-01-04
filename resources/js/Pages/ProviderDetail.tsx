import { SearchHeader } from "@/components/search-header"
import { ProviderCover } from "@/components/provider-cover"
import { ProviderGalleryLightbox } from "@/components/provider-gallery-lightbox"
import { ProviderServices } from "@/components/provider-services"
import { ProviderPackagesSection } from "@/components/provider-packages-section"
import { ProviderReviews } from "@/components/provider-reviews"
import { SimilarProviders } from "@/components/similar-providers"
import { Footer } from "@/components/footer"
import { Share2, Heart, MapPin } from "lucide-react"
import { useState } from "react"
import { SEO, createLocalBusinessSchema, createBreadcrumbSchema } from "@/components/seo"

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
  verificationStatus: string
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

interface ServicePackage {
  id: number
  slug: string
  name: string
  description: string | null
  package_type: 'tier' | 'bundle'
  final_price: number
  currency: string
  is_featured: boolean
  primary_image: string | null
  items: {
    quantity: number
    service_name: string
  }[]
}

interface Props {
  provider: ProviderData
  services: Service[]
  packages: ServicePackage[]
  reviews: Review[]
  similarProviders: SimilarProvider[]
  categories?: Category[]
  auth?: {
    user?: any
  }
}

export default function ProviderDetail({ provider, services, packages, reviews, similarProviders, categories = [], auth }: Props) {
  const [isFavorite, setIsFavorite] = useState(false)

  const businessSchema = createLocalBusinessSchema({
    name: provider.name,
    description: provider.description,
    address: provider.location,
    city: provider.city,
    phone: provider.phone,
    email: provider.email,
    image: provider.coverImage || provider.logo,
    rating: provider.rating,
    reviewCount: provider.totalReviews,
  })

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Providers', url: '/search?listing_type=providers' },
    { name: provider.name, url: `/providers/${provider.slug}` },
  ])

  return (
    <>
      <SEO
        title={`${provider.name} - Event Services in ${provider.city}`}
        description={`${provider.description?.substring(0, 155) || `Book ${provider.name} for your events in ${provider.city}, Malawi.`}...`}
        keywords={`${provider.name}, event services ${provider.city}, ${provider.location}, weddings Malawi, events`}
        image={provider.coverImage || provider.logo}
        type="profile"
        structuredData={{ ...businessSchema, ...breadcrumbs }}
      />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
        <SearchHeader categories={categories} />
        <main className="pt-16">
          {/* Cover Image with Logo */}
          <ProviderCover
            coverImage={provider.coverImage || provider.images[0]}
            logo={provider.logo}
            name={provider.name}
          />

          {/* Provider Info Section */}
          <div className="container mx-auto px-6 lg:px-20 mt-8 mb-8">
            <div className="flex flex-col gap-6">
              {/* Name and basic info */}
              <div>
                <div className="flex flex-col gap-3 mb-3">
                  <h1 className="text-3xl md:text-5xl font-bold font-heading text-balance">
                    {provider.name}
                  </h1>
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    {provider.images && provider.images.length > 0 && (
                      <ProviderGalleryLightbox images={provider.images} providerName={provider.name} />
                    )}
                    <button className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border hover:bg-accent transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-4">{provider.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                  {provider.verificationStatus === 'approved' && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">Verified Provider</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{provider.totalBookings} bookings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="container mx-auto px-6 lg:px-20 py-8">
            <div className="space-y-8 mb-12">
              {/* Packages Section - Prominent */}
              <ProviderPackagesSection packages={packages} providerId={provider.id} />

              {/* Services Section */}
              <ProviderServices services={services} currency="MWK" providerId={provider.id} />

              {/* Reviews Section */}
              <ProviderReviews rating={provider.rating} reviewCount={provider.totalReviews} />
            </div>

            <SimilarProviders currentProviderId={provider.id.toString()} providers={similarProviders} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
