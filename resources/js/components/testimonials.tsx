const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Wedding Planner",
    event: "Beach Wedding",
    image: "/testimonial-sarah.jpg",
    quote:
      "Kwika.Events made finding the perfect photographer and decorator so easy. Our beach wedding was absolutely stunning!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Corporate Event Manager",
    event: "Tech Conference",
    image: "/testimonial-michael.jpg",
    quote:
      "The quality of service providers on this platform is outstanding. We found an amazing PA system team and videographer for our annual conference. Highly recommend!",
  },
  {
    id: 3,
    name: "Amara Okafor",
    role: "Birthday Celebration",
    event: "50th Birthday Party",
    image: "/testimonial-amara.jpg",
    quote:
      "From decorators to caterers, every vendor we booked through Kwika.Events exceeded our expectations. The booking process was seamless and stress-free.",
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Festival Organizer",
    event: "Music Festival",
    image: "/testimonial-david.jpg",
    quote: "Incredible platform! We found top-tier sound engineers and lighting specialists all in one place.",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Engagement Party",
    event: "Garden Engagement",
    image: "/testimonial-priya.jpg",
    quote: "The decorators and caterers we found made our engagement party unforgettable. Highly recommend!",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Loved by event organizers everywhere
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied clients who found their perfect event service providers
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto min-h-[700px]">
          {/* First testimonial - top left */}
          <div className="absolute top-0 left-0 w-full md:w-[35%] lg:w-[30%] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-foreground/90 leading-relaxed mb-4 text-pretty text-sm">"{testimonials[0].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={testimonials[0].image || "/placeholder.svg"}
                    alt={testimonials[0].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonials[0].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[0].event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second testimonial - top right */}
          <div className="absolute top-0 right-0 w-full md:w-[35%] lg:w-[30%] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-foreground/90 leading-relaxed mb-4 text-pretty text-sm">"{testimonials[1].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={testimonials[1].image || "/placeholder.svg"}
                    alt={testimonials[1].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonials[1].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[1].event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Third testimonial - middle left */}
          <div className="absolute top-[200px] left-[8%] w-full md:w-[35%] lg:w-[30%] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-foreground/90 leading-relaxed mb-4 text-pretty text-sm">"{testimonials[2].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={testimonials[2].image || "/placeholder.svg"}
                    alt={testimonials[2].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonials[2].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[2].event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fourth testimonial - middle right */}
          <div className="absolute top-[220px] right-[5%] w-full md:w-[35%] lg:w-[30%] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-foreground/90 leading-relaxed mb-4 text-pretty text-sm">"{testimonials[3].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={testimonials[3].image || "/placeholder.svg"}
                    alt={testimonials[3].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonials[3].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[3].event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fifth testimonial - bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[35%] lg:w-[30%] transform hover:scale-105 transition-transform duration-300">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-foreground/90 leading-relaxed mb-4 text-pretty text-sm">"{testimonials[4].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={testimonials[4].image || "/placeholder.svg"}
                    alt={testimonials[4].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonials[4].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[4].event}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
