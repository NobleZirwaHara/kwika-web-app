import CachedHeader, { useCachedHeaderScroll } from "@/components/CachedHeader"
import CachedFooter from "@/components/CachedFooter"
import { HeroFeatured } from "@/components/hero-featured"
import { ServiceCategories } from "@/components/service-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { FeaturedProviders } from "@/components/featured-providers"
import { BenefitsSection } from "@/components/benefits-section"
import { PromotionsSection } from "@/components/promotions-section"
import { Testimonials } from "@/components/testimonials"
import { EventHighlight } from "@/components/event-highlight"
import { KwikaRewards } from "@/components/kwika-rewards"
import { HeroCarouselProvider } from "@/contexts/HeroCarouselContext"
import { SEO } from "@/components/seo"
import { usePage } from "@inertiajs/react"

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
  lilongweProviders: Provider[]
  newProviders: Provider[]
  featuredProducts: Product[]
}

export default function Home({ categories, featuredProviders, topProviders, lilongweProviders, newProviders, featuredProducts }: HomeProps) {
  const { props } = usePage()
  const hasScrolled = useCachedHeaderScroll()
  const sharedData = (props as any).shared

  return (
    <HeroCarouselProvider>
      <SEO
        title="Find Perfect Event Service Providers in Malawi"
        description="Discover top-rated photographers, caterers, venues, decorators, DJs, and more for your wedding, corporate event, or celebration in Malawi. Book trusted providers in Lilongwe, Blantyre, and across the country."
        keywords="events Malawi, wedding services Lilongwe, event planning Blantyre, photographers, caterers, venues, decorators, DJ services, event rentals, wedding planner, party supplies Malawi"
      />
      <div className="min-h-screen pb-20 md:pb-0">
        <CachedHeader
          categories={sharedData?.categories || []}
          hasScrolled={hasScrolled}
        />
        <main>
          <HeroFeatured />
          <ServiceCategories categories={categories} />
          <FeaturedProducts products={featuredProducts} />
          <FeaturedProviders providers={lilongweProviders} title="Providers in Lilongwe" />
          <FeaturedProviders providers={topProviders} title="Top Providers" />
          <FeaturedProviders providers={newProviders} title="New to the Platform" />
          <KwikaRewards />
          {/* <EventHighlight
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
          /> */}
          {/* <BenefitsSection /> */}
          <PromotionsSection />

          {/* <Testimonials /> */}
        </main>
        <CachedFooter />
      </div>
    </HeroCarouselProvider>
  )
}
