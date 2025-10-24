import { Header } from "@/components/header"
import { HeroSearch } from "@/components/hero-search"
import { ServiceCategories } from "@/components/service-categories"
import { FeaturedProviders } from "@/components/featured-providers"
import { BenefitsSection } from "@/components/benefits-section"
import { PromotionsSection } from "@/components/promotions-section"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
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
  )
}
