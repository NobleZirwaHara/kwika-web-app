import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Users, Share2, Heart, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { SEO, createEventSchema } from '@/components/seo'
import { formatDate, formatPrice, formatTime, getStorageUrl } from '@/lib/utils'

interface TicketPackage {
  id: number
  name: string
  description: string
  price: number
  currency: string
  quantity_available: number
  sold_count: number
  remaining: number
  min_purchase: number
  max_purchase: number
  is_available: boolean
  features: string[]
}

interface Event {
  id: number
  title: string
  slug: string
  description: string
  cover_image: string
  start_datetime: string
  end_datetime: string
  venue_name: string
  venue_address: string
  venue_city: string
  category: string
  type: string
  max_attendees: number
  registered_count: number
  requires_seating: boolean
  service_provider: {
    id: number
    business_name: string
    logo: string
  }
}

interface Props {
  event: Event
  ticketPackages: TicketPackage[]
  seatingData: any
  similarEvents: Event[]
}

export default function EventDetail({ event, ticketPackages, similarEvents }: Props) {
  const [selectedPackages, setSelectedPackages] = useState<Record<number, number>>({})

  const handleQuantityChange = (packageId: number, quantity: number) => {
    setSelectedPackages(prev => {
      if (quantity === 0) {
        const { [packageId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [packageId]: quantity }
    })
  }

  const getTotalTickets = () => {
    return Object.values(selectedPackages).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedPackages).reduce((sum, [packageId, qty]) => {
      const pkg = ticketPackages.find(p => p.id === parseInt(packageId))
      return sum + (pkg ? pkg.price * qty : 0)
    }, 0)
  }

  const handleProceedToCheckout = () => {
    if (getTotalTickets() === 0) return

    // Navigate to checkout page with selected packages
    const packages = Object.entries(selectedPackages).map(([packageId, quantity]) => ({
      package_id: parseInt(packageId),
      quantity
    }))

    router.post(route('ticket-orders.checkout'), {
      event_id: event.id,
      packages: packages
    })
  }

  const minPrice = ticketPackages.length > 0
    ? Math.min(...ticketPackages.map(p => p.price))
    : undefined

  const eventSchema = createEventSchema({
    name: event.title,
    description: event.description,
    startDate: event.start_datetime,
    endDate: event.end_datetime,
    location: event.venue_name,
    city: event.venue_city,
    image: event.cover_image,
    price: minPrice,
    currency: ticketPackages[0]?.currency || 'MWK',
    organizer: event.service_provider?.business_name,
  })

  return (
    <>
      <SEO
        title={`${event.title} - Tickets & Info`}
        description={`Get tickets for ${event.title} at ${event.venue_name}, ${event.venue_city}. ${event.description?.substring(0, 100) || ''}`}
        keywords={`${event.title}, ${event.category}, tickets ${event.venue_city}, events Malawi, ${event.service_provider?.business_name}`}
        image={event.cover_image}
        type="event"
        structuredData={eventSchema}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[400px] lg:h-[500px]">
          <img
            src={getStorageUrl(event.cover_image)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-8 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.history.back()}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full mb-4">
                    {event.category}
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(event.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{formatTime(event.start_datetime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Venue Info */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Venue</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold">{event.venue_name}</div>
                      <div className="text-muted-foreground">{event.venue_address}</div>
                      <div className="text-muted-foreground">{event.venue_city}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>

              {/* Organizer */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Organized By</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={getStorageUrl(event.service_provider.logo, '/placeholder-user.jpg')}
                    alt={event.service_provider.business_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{event.service_provider.business_name}</div>
                    <Link href={`/providers/${event.service_provider.id}`} className="text-sm text-primary hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tickets */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-bold mb-6">Select Tickets</h2>

                  <div className="space-y-4">
                    {ticketPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`border rounded-lg p-4 ${
                          !pkg.is_available ? 'opacity-50' : 'hover:border-primary'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{pkg.name}</div>
                            <div className="text-sm text-muted-foreground">{pkg.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {pkg.currency} {pkg.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                          <ul className="text-sm text-muted-foreground mb-3 space-y-1">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {pkg.remaining} remaining
                          </span>

                          {pkg.is_available ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(pkg.id, Math.max(0, (selectedPackages[pkg.id] || 0) - 1))}
                                disabled={!selectedPackages[pkg.id]}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {selectedPackages[pkg.id] || 0}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(pkg.id, Math.min(pkg.max_purchase, pkg.remaining, (selectedPackages[pkg.id] || 0) + 1))}
                                disabled={(selectedPackages[pkg.id] || 0) >= Math.min(pkg.max_purchase, pkg.remaining)}
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-destructive">Sold Out</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total & Checkout */}
                  {getTotalTickets() > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Total ({getTotalTickets()} tickets)</div>
                          <div className="text-2xl font-bold">
                            {formatPrice(getTotalPrice())}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  )}
                </div>

                {/* Event Stats */}
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="text-sm">Attendees</div>
                      <div className="font-semibold text-foreground">
                        {event.registered_count} / {event.max_attendees || '∞'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Events */}
          {similarEvents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Similar Events</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarEvents.map((similarEvent) => (
                  <Link
                    key={similarEvent.id}
                    href={route('events.show', similarEvent.slug)}
                    className="group"
                  >
                    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={getStorageUrl(similarEvent.cover_image)}
                        alt={similarEvent.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-4">
                        <div className="text-sm text-primary font-medium mb-1">
                          {formatDate(similarEvent.start_datetime)}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {similarEvent.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {similarEvent.venue_city}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
