import { Search, MessageSquare, Calendar, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse through thousands of verified event service providers in your area",
  },
  {
    icon: MessageSquare,
    title: "Connect & Compare",
    description: "Message providers, view portfolios, and compare quotes to find your perfect match",
  },
  {
    icon: Calendar,
    title: "Book with Confidence",
    description: "Secure your booking with our protected payment system and flexible cancellation",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Event",
    description: "Relax knowing you've hired the best professionals for your special day",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">How EventHub works</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Finding and booking event services has never been easier
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] bg-border lg:block" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
