import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Head, Link } from '@inertiajs/react'
import { Search, ChevronRight, ChevronLeft, Heart, MapPin, Calendar, Star, Ticket, BadgeCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

interface Artist {
  id: number
  name: string
  image: string
}

interface Category {
  id: string
  name: string
  slug: string
  image: string
}

interface Organizer {
  id: number
  slug: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string | null
  logo: string | null
  event_count: number
  is_verified: boolean
}

interface TicketingIndexProps {
  trendingEvents?: Event[]
  topArtists?: Artist[]
  categories?: Category[]
  topOrganizers?: Organizer[]
  location?: string
}

const defaultTrendingEvents: Event[] = [
  {
    id: 1,
    slug: "goodyear-cotton-bowl-classic",
    title: "Goodyear Cotton Bowl Classic - CFP Quarterfinal: #2 Ohio State vs #3 Georgia",
    date: "Dec 31",
    price: "From $225",
    image: "/resized-win/venue-1.jpg",
    category: "Sports",
    venue: "National Stadium"
  },
  {
    id: 2,
    slug: "memories-of-malawi",
    title: "Memories of Malawi",
    date: "Jan 15",
    price: "From $50",
    image: "/resized-win/wedding-photo-1.jpg",
    category: "Concert",
    venue: "Bingu Convention Centre"
  },
  {
    id: 3,
    slug: "new-year-championship",
    title: "New Year Championship - CFP Quarterfinal: #1 Alabama vs #4 Texas",
    date: "Jan 1",
    price: "From $180",
    image: "/resized-win/venue-2.jpg",
    category: "Sports",
    venue: "Kamuzu Stadium"
  },
  {
    id: 4,
    slug: "roses-at-lilongwe",
    title: "Roses at Lilongwe",
    date: "Feb 14",
    price: "From $75",
    image: "/resized-win/decor-2.jpg",
    category: "Event",
    venue: "Crossroads Hotel"
  },
  {
    id: 5,
    slug: "lake-of-stars-music-festival-2025",
    title: "Lake of Stars Music Festival 2025",
    date: "Sep 27-29",
    price: "From $120",
    image: "/resized-win/dj-1.jpg",
    category: "Festival",
    venue: "Lake Malawi"
  },
  {
    id: 6,
    slug: "malawi-food-wine-expo",
    title: "Malawi Food & Wine Expo",
    date: "Mar 20",
    price: "From $35",
    image: "/resized-win/food-7.jpg",
    category: "Event",
    venue: "Sunbird Capital"
  },
  {
    id: 7,
    slug: "jazz-night-under-the-stars",
    title: "Jazz Night Under the Stars",
    date: "Apr 10",
    price: "From $45",
    image: "/resized-win/mc-2.jpg",
    category: "Concert",
    venue: "Garden Lounge"
  },
  {
    id: 8,
    slug: "african-cup-qualifiers-malawi-vs-zambia",
    title: "African Cup Qualifiers - Malawi vs Zambia",
    date: "Jun 15",
    price: "From $15",
    image: "/resized-win/venue-5.jpg",
    category: "Sports",
    venue: "Kamuzu Stadium"
  }
]

const defaultArtists: Artist[] = [
  {
    id: 1,
    name: "The Black Missionaries",
    image: "/resized-win/mc-1.jpg"
  },
  {
    id: 2,
    name: "Lucius Banda",
    image: "/resized-win/mc-3.jpg"
  },
  {
    id: 3,
    name: "Lawi",
    image: "/resized-win/mc-2.jpg"
  },
  {
    id: 4,
    name: "Patience Namadingo",
    image: "/resized-win/bride-groom-shoot-5.jpg"
  },
  {
    id: 5,
    name: "Gwamba",
    image: "/resized-win/groom-men-shoot.jpg"
  },
  {
    id: 6,
    name: "Tay Grin",
    image: "/resized-win/groomsmen-shoot.jpg"
  }
]

const defaultCategories: Category[] = [
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    image: "/resized-win/venue-1.jpg"
  },
  {
    id: "music-arts",
    name: "Music & Arts",
    slug: "music-arts",
    image: "/resized-win/dj-1.jpg"
  },
  {
    id: "festivals",
    name: "Festivals",
    slug: "festivals",
    image: "/resized-win/lighting-1.jpg"
  },
  {
    id: "cars-motorsport",
    name: "Cars & Motorsport",
    slug: "cars-motorsport",
    image: "/resized-win/venue-5.jpg"
  },
  {
    id: "expos-fairs",
    name: "Expos & Fairs",
    slug: "expos-fairs",
    image: "/resized-win/tent-1.jpg"
  }
]

const defaultOrganizers: Organizer[] = [
  {
    id: 1,
    slug: "lake-of-stars-events",
    name: "Lake of Stars Events",
    location: "Lilongwe",
    rating: 4.9,
    reviews: 156,
    image: "/resized-win/dj-1.jpg",
    logo: "/resized-win/mc-1.jpg",
    event_count: 24,
    is_verified: true
  },
  {
    id: 2,
    slug: "malawi-sports-council",
    name: "Malawi Sports Council",
    location: "Blantyre",
    rating: 4.7,
    reviews: 89,
    image: "/resized-win/venue-1.jpg",
    logo: "/resized-win/mc-2.jpg",
    event_count: 45,
    is_verified: true
  },
  {
    id: 3,
    slug: "flame-entertainment",
    name: "Flame Entertainment",
    location: "Lilongwe",
    rating: 4.8,
    reviews: 234,
    image: "/resized-win/pa-system-1.jpg",
    logo: "/resized-win/mc-3.jpg",
    event_count: 67,
    is_verified: true
  },
  {
    id: 4,
    slug: "sunbird-events",
    name: "Sunbird Events",
    location: "Lilongwe",
    rating: 4.6,
    reviews: 112,
    image: "/resized-win/venue-2.jpg",
    logo: null,
    event_count: 38,
    is_verified: true
  },
  {
    id: 5,
    slug: "capital-fm-events",
    name: "Capital FM Events",
    location: "Lilongwe",
    rating: 4.5,
    reviews: 78,
    image: "/resized-win/lighting-1.jpg",
    logo: null,
    event_count: 19,
    is_verified: false
  },
  {
    id: 6,
    slug: "crossroads-hospitality",
    name: "Crossroads Hospitality",
    location: "Lilongwe",
    rating: 4.7,
    reviews: 145,
    image: "/resized-win/venue-5.jpg",
    logo: null,
    event_count: 52,
    is_verified: true
  }
]

export default function TicketingIndex({
  trendingEvents = defaultTrendingEvents,
  topArtists = defaultArtists,
  categories = defaultCategories,
  topOrganizers = defaultOrganizers,
  location = "Lilongwe, MW"
}: TicketingIndexProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.get('/ticketing/search', { q: searchQuery })
    }
  }

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  return (
    <>
      <Head title="Events & Ticketing - Find Live Events & Sports" />
      <div className="min-h-screen bg-[#2b6068] text-white">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            {/* Background with stadium lights */}
            <div className="absolute inset-0 z-0">
              <div className="absolute left-0 top-0 w-1/3 h-full opacity-20">
                <img src="/resized-win/lighting-1.jpg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
                <img src="/resized-win/pa-system-1.jpg" alt="" className="h-full w-full object-cover transform scale-x-[-1]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#2b6068] via-[#2b6068]/50 to-[#2b6068]" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 lg:px-20 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black mb-4"
                >
                  See it for yourself
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-300 mb-8"
                >
                  Find and get tickets to live events and festivals
                </motion.p>

                {/* Search Bar */}
                <motion.form
                  onSubmit={handleSearch}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-2xl">
                    <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What do you want to see live?"
                      className="flex-1 text-base bg-transparent border-none outline-none placeholder:text-gray-400 text-black"
                    />
                  </div>
                </motion.form>
              </div>
            </div>
          </section>

          {/* Trending Events */}
          <section className="py-12 bg-[#2b6068]">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button variant="ghost" className="text-sm text-gray-300 hover:text-white">
                  See all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => router.get(`/events/${event.slug}`)}
                    className="group relative bg-white rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer shadow-lg"
                  >
                    {/* Event Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Favorite Button */}
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
                    </div>

                    {/* Event Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                      <p className="text-sm font-bold text-primary">{event.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-12 bg-black">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Organizers */}
          <section className="py-12 bg-[white] text-gray-900">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Top Organizers</h2>
                <Button variant="ghost" className="text-sm text-gray-600 hover:text-gray-900">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topOrganizers.map((organizer, index) => (
                  <motion.div
                    key={organizer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => router.get(`/ticketing/organizer/${organizer.slug}`)}
                  >
                    <Card className="overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                      {/* Cover Image */}
                      <div className="relative h-32 bg-muted">
                        {organizer.image ? (
                          <img
                            src={organizer.image}
                            alt={organizer.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>

                      <CardContent className="p-4 relative">
                        {/* Logo */}
                        <div className="absolute -top-8 left-4 w-16 h-16 rounded-xl bg-muted border-4 border-background overflow-hidden shadow-lg">
                          {organizer.logo ? (
                            <img src={organizer.logo} alt={organizer.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20">
                              <Ticket className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>

                        <div className="pt-6">
                          {/* Name & Verified Badge */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                              {organizer.name}
                            </h3>
                            {organizer.is_verified && (
                              <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{organizer.location}</span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-foreground">{organizer.rating != null ? Number(organizer.rating).toFixed(1) : 'N/A'}</span>
                              <span className="text-muted-foreground">({(organizer.reviews || 0).toLocaleString()})</span>
                            </div>
                            <Badge variant="secondary">
                              {organizer.event_count.toLocaleString()} events
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer className="bg-gray-50" />
      </div>
    </>
  )
}
