import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Head, Link } from '@inertiajs/react'
import { MapPin, Star, Calendar, Users, Globe, Mail, Phone, BadgeCheck, ChevronRight, Heart, Ticket } from "lucide-react"
import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { router } from "@inertiajs/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Event {
  id: number
  slug: string
  title: string
  date: string
  price: string
  image: string
  category: string
  venue?: string
}

interface Organizer {
  id: number
  slug: string
  name: string
  description?: string
  location: string
  rating: number
  reviews: number
  image: string | null
  logo: string | null
  is_verified: boolean
  event_count: number
  total_attendees: number
  website?: string
  email?: string
  phone?: string
}

interface OrganizerDetailProps {
  organizer: Organizer
  upcomingEvents: Event[]
  pastEvents: Event[]
}

export default function OrganizerDetail({
  organizer,
  upcomingEvents,
  pastEvents
}: OrganizerDetailProps) {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => router.get(`/events/${event.slug}`)}
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer shadow-lg",
        isPast && "opacity-75"
      )}
    >
      {/* Event Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image || '/resized-win/venue-1.jpg'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isPast && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">Past Event</Badge>
          </div>
        )}
        {/* Favorite Button */}
        {!isPast && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(event.id)
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                favorites.includes(event.id) ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>
        )}
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {event.category}
        </Badge>
      </div>

      {/* Event Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <Calendar className="h-3 w-3" />
          <span>{event.date}</span>
        </div>
        {event.venue && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{event.venue}</span>
          </div>
        )}
        <p className="text-sm font-bold text-primary">{event.price}</p>
      </div>
    </motion.div>
  )

  return (
    <>
      <Head title={`${organizer.name} - Events & Ticketing`} />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative bg-[#2b6068] text-white">
            {/* Cover Image */}
            <div className="absolute inset-0 z-0">
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="w-full h-full object-cover opacity-30"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b6068] via-[#2b6068]/80 to-[#2b6068]/60" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 lg:px-20 relative z-10 py-20">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Logo */}
                <div className="w-32 h-32 rounded-2xl bg-white shadow-xl overflow-hidden flex-shrink-0">
                  {organizer.logo ? (
                    <img src={organizer.logo} alt={organizer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Ticket className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{organizer.name}</h1>
                    {organizer.is_verified && (
                      <BadgeCheck className="h-7 w-7 text-primary flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-gray-300 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{organizer.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-white">{organizer.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({organizer.reviews} reviews)</span>
                    </div>
                  </div>

                  {organizer.description && (
                    <p className="text-gray-300 mb-6 max-w-2xl">{organizer.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex gap-8">
                    <div>
                      <div className="text-3xl font-bold">{organizer.event_count}</div>
                      <div className="text-sm text-gray-400">Events</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{organizer.total_attendees.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Attendees</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-4 mt-6 flex-wrap">
                    {organizer.website && (
                      <a href={organizer.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      </a>
                    )}
                    {organizer.email && (
                      <a href={`mailto:${organizer.email}`}>
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      </a>
                    )}
                    {organizer.phone && (
                      <a href={`tel:${organizer.phone}`}>
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Events Tabs */}
          <section className="py-12">
            <div className="container mx-auto px-6 lg:px-20">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="upcoming" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Upcoming Events ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Past Events ({pastEvents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming events</h3>
                      <p className="text-gray-500">Check back later for new events from this organizer.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past">
                  {pastEvents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No past events</h3>
                      <p className="text-gray-500">This organizer hasn't hosted any events yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} isPast />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
