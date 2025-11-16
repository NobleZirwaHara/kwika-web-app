import { DollarSign, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BenefitsSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Package & Save",
      description: "Bundle multiple services for your event and get exclusive discounts",
      buttonText: "Learn more",
      buttonHref: "#",
    },
    {
      icon: Users,
      title: "All services, one platform",
      description: "We have more event service providers than any other marketplace",
      buttonText: "Explore services",
      buttonHref: "#",
    },
    {
      icon: Shield,
      title: "Verified providers",
      description: "All our providers are verified with reviews from real clients",
      buttonText: "See providers",
      buttonHref: "#",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="bg-muted/50 rounded-3xl px-8 py-12 md:px-12 md:py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 rounded-full bg-primary/10">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{benefit.description}</p>
                <Button variant="outline" className="rounded-full bg-transparent" asChild>
                  <a href={benefit.buttonHref}>{benefit.buttonText}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
