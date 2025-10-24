import { Header } from "@/components/header"
import { ProviderGallery } from "@/components/provider-gallery"
import { ProviderInfo } from "@/components/provider-info"
import { ProviderBooking } from "@/components/provider-booking"
import { ProviderReviews } from "@/components/provider-reviews"
import { SimilarProviders } from "@/components/similar-providers"
import { Footer } from "@/components/footer"

const providerData = {
  id: "sarah-chen-photography",
  name: "Sarah Chen Photography",
  category: "Photographer",
  location: "San Francisco, CA",
  rating: 4.95,
  reviews: 234,
  price: 2500,
  images: [
    "/professional-photographer-portfolio-wedding.jpg",
    "/cinematic-wedding-videography.jpg",
    "/luxury-wedding-decoration-flowers.jpg",
    "/elegant-catering-food-display.jpg",
  ],
  description:
    "Join award-winning photographer Sarah Chen for a professional photography session that captures your event's most precious moments. With over 10 years of experience and a keen eye for detail, Sarah specializes in creating timeless memories.",
  about:
    "Professional photographer with expertise in weddings, corporate events, and special occasions. Michelin-recognized for visual storytelling.",
  badges: [
    {
      icon: "⭐",
      title: "Top Rated Provider",
      description: "This provider has consistently received 5-star reviews from clients.",
    },
    {
      icon: "🎖️",
      title: "Kwika.Events Original",
      description: "This photography service was designed exclusively for Kwika.Events.",
    },
  ],
  languages: ["English", "Mandarin", "Cantonese"],
  cancellationPolicy: "Free cancellation up to 7 days before the event",
}

export default function ProviderDetailPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-6 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProviderGallery images={providerData.images} />
            <ProviderInfo provider={providerData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ProviderReviews rating={providerData.rating} reviewCount={providerData.reviews} />
            </div>
            <div className="lg:col-span-1">
              <ProviderBooking price={providerData.price} cancellationPolicy={providerData.cancellationPolicy} />
            </div>
          </div>

          <SimilarProviders currentProviderId={providerData.id} category={providerData.category} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
