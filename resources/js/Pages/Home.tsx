import { Header } from "@/Components/header"
import { HeroFeatured } from "@/Components/hero-featured"
import { ServiceCategories } from "@/Components/service-categories"
import { FeaturedServices } from "@/Components/featured-services"
import { FeaturedProducts } from "@/Components/featured-products"
import { FeaturedProviders } from "@/Components/featured-providers"
import { BenefitsSection } from "@/Components/benefits-section"
import { PromotionsSection } from "@/Components/promotions-section"
import { Testimonials } from "@/Components/testimonials"
import { Footer } from "@/Components/footer"
import { Head, usePage } from '@inertiajs/react'
import { EventHighlight } from "@/Components/event-highlight"
import { KwikaRewards } from "@/Components/kwika-rewards"
import { HeroCarouselProvider } from "@/contexts/HeroCarouselContext"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  subcategories: {
    id: number
    name: string
  }[]
}

interface Provider {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  logo?: string
  description?: string
  featured: boolean
}

interface Service {
  id: number
  name: string
  slug: string
  description: string
  price: string
  base_price: number
  currency: string
  image: string | null
  category: string | null
  provider: {
    id: number
    name: string
    slug: string
    city: string
  }
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
  provider: {
    id: number
    name: string
    slug: string
    city: string
  }
}

interface HomeProps {
  categories: Category[]
  featuredProviders: Provider[]
  topProviders: Provider[]
  featuredServices: Service[]
  featuredProducts: Product[]
}

export default function Home({ categories, featuredProviders, topProviders, featuredServices, featuredProducts }: HomeProps) {
  const { auth } = usePage().props as any
  const isAuthenticated = !!auth?.user

  // Category names that have actual images (not placeholders)
  const categoriesWithImages = [
    'Photographers',
    'Videographers',
    'Decorators',
    'PA Systems',
    'Caterers',
    'Florists',
    'Venues',
    'DJs'
  ]

  // Sort categories: those with images first, then the rest
  const sortedCategories = [...categories].sort((a, b) => {
    const aHasImage = categoriesWithImages.includes(a.name)
    const bHasImage = categoriesWithImages.includes(b.name)

    if (aHasImage && !bHasImage) return -1
    if (!aHasImage && bHasImage) return 1
    return 0 // Maintain original order within each group
  })

  return (
    <HeroCarouselProvider>
      <Head title="Kwika Events - Find Perfect Event Service Providers in Malawi" />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroFeatured />
          <ServiceCategories categories={sortedCategories} />
          <FeaturedServices services={featuredServices} isAuthenticated={isAuthenticated} />
          <FeaturedProducts products={featuredProducts} />
          <FeaturedProviders providers={topProviders} title="Top Service Providers" />
          {/* <KwikaRewards /> */}
          <EventHighlight
            eyebrowLabel="Kwika"
            eyebrowText="Service Partner Series"
            title="Lunch Tasting for Culinary Creators"
            description="An intimate lunch tasting that brings together every food service provider—chefs, caterers, bakers, and mixologists—to co-create 2025 menu inspirations and collaborate on premium event experiences."
            details={[
              { label: "Date", value: "Friday, 12 Dec · 11:30-15:00" },
              { label: "Venue", value: "Kwika Test Kitchen, Lilongwe" },
              { label: "Focus", value: "Curated tasting · Supplier showcases" },
            ]}
            ctaLabel="RSVP to Attend"
            imageSrc="/elegant-catering-food-display.jpg"
            imageAlt="Kwika lunch tasting setup"
          />
          {/* <BenefitsSection /> */}
          <PromotionsSection />
          
          <Testimonials />
        </main>
        <Footer />
      </div>
    </HeroCarouselProvider>
  )
}
