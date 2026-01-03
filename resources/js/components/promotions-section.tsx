import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PromotionsSection() {
  const promotions = [
    {
      badge: "Featured",
      badgeVariant: "default" as const,
      title: "Trending Event Styles 2025",
      description: "Discover the hottest event trends and book the perfect providers to bring your vision to life.",
      buttonText: "Explore trends",
      buttonHref: "#",
    },
    {
      badge: "Promotion",
      badgeVariant: "secondary" as const,
      title: "Last-minute availability",
      description:
        "Need a service provider urgently? Browse providers with immediate availability and save on your booking.",
      buttonText: "View available",
      buttonHref: "#",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {promotions.map((promo) => (
            <div key={promo.title} className="border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <Badge variant={promo.badgeVariant} className="mb-4 bg-accent text-accent-foreground">
                {promo.badge}
              </Badge>
              <h3 className="text-3xl font-heading font-semibold mb-4">{promo.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{promo.description}</p>
              <Button variant="outline" className="rounded-full bg-transparent" asChild>
                <a href={promo.buttonHref}>{promo.buttonText}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
