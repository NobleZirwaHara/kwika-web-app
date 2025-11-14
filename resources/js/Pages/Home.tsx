import { Header } from "@/Components/header"
import { HeroSearch } from "@/Components/hero-search"
import { ServiceCategories } from "@/Components/service-categories"
import { FeaturedServices } from "@/Components/featured-services"
import { FeaturedProducts } from "@/Components/featured-products"
import { FeaturedProviders } from "@/Components/featured-providers"
import { BenefitsSection } from "@/Components/benefits-section"
import { PromotionsSection } from "@/Components/promotions-section"
import { Testimonials } from "@/Components/testimonials"
import { Footer } from "@/Components/footer"
import { Head } from '@inertiajs/react'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
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
  return (
    <>
      <Head title="Kwika Events - Find Perfect Event Service Providers in Malawi" />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSearch categories={categories} />
          <ServiceCategories categories={categories} />
          <FeaturedServices services={featuredServices} />
          <FeaturedProducts products={featuredProducts} />
          <FeaturedProviders providers={topProviders} title="Top Service Providers" />
          <BenefitsSection />
          <PromotionsSection />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  )
}
