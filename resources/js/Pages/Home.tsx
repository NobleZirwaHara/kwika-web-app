import { Header } from "@/Components/header"
import { HeroSearch } from "@/Components/hero-search"
import { ServiceCategories } from "@/Components/service-categories"
import { FeaturedProviders } from "@/Components/featured-providers"
import { BenefitsSection } from "@/Components/benefits-section"
import { PromotionsSection } from "@/Components/promotions-section"
import { Testimonials } from "@/Components/testimonials"
import { Footer } from "@/Components/footer"
import { Head } from '@inertiajs/react'

export default function Home() {
  return (
    <>
      <Head title="EventHub - Find Perfect Event Service Providers" />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSearch />
          <ServiceCategories />
          <FeaturedProviders />
          <div className="border-t">
            <FeaturedProviders />
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
