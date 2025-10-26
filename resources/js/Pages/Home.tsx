import { Header } from "@/Components/header"
import { HeroSearch } from "@/Components/hero-search"
import { ServiceCategories } from "@/Components/service-categories"
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

interface HomeProps {
  categories: Category[]
  featuredProviders: Provider[]
  topProviders: Provider[]
}

export default function Home({ categories, featuredProviders, topProviders }: HomeProps) {
  return (
    <>
      <Head title="Kwika Events - Find Perfect Event Service Providers in Malawi" />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSearch categories={categories} />
          <ServiceCategories categories={categories} />
          <FeaturedProviders providers={featuredProviders} title="Featured providers" />
          <div className="border-t">
            <FeaturedProviders providers={topProviders} title="Top-rated providers" />
          </div>
          <BenefitsSection />
          <PromotionsSection />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  )
}
