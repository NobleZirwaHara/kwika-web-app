import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Head } from '@inertiajs/react'
import { Search, ChevronRight, ChevronLeft, Heart, MapPin, Calendar } from "lucide-react"
import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { router } from "@inertiajs/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Event {
  id: number
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
  icon: string
  color: string
}

interface TicketingIndexProps {
  trendingEvents?: Event[]
  topArtists?: Artist[]
  categories?: Category[]
  location?: string
}

const defaultTrendingEvents: Event[] = [
  {
    id: 1,
    title: "Goodyear Cotton Bowl Classic - CFP Quarterfinal: #2 Ohio State vs #3 Georgia",
    date: "Dec 31",
    price: "From $225",
    image: "/resized-win/venue-1.jpg",
    category: "Sports",
    venue: "National Stadium"
  },
  {
    id: 2,
    title: "Memories of Malawi",
    date: "Jan 15",
    price: "From $50",
    image: "/resized-win/wedding-photo-1.jpg",
    category: "Concert",
    venue: "Bingu Convention Centre"
  },
  {
    id: 3,
    title: "New Year Championship - CFP Quarterfinal: #1 Alabama vs #4 Texas",
    date: "Jan 1",
    price: "From $180",
    image: "/resized-win/venue-2.jpg",
    category: "Sports",
    venue: "Kamuzu Stadium"
  },
  {
    id: 4,
    title: "Roses at Lilongwe",
    date: "Feb 14",
    price: "From $75",
    image: "/resized-win/decor-2.jpg",
    category: "Event",
    venue: "Crossroads Hotel"
  },
  {
    id: 5,
    title: "Lake of Stars Music Festival 2025",
    date: "Sep 27-29",
    price: "From $120",
    image: "/resized-win/dj-1.jpg",
    category: "Festival",
    venue: "Lake Malawi"
  },
  {
    id: 6,
    title: "Malawi Food & Wine Expo",
    date: "Mar 20",
    price: "From $35",
    image: "/resized-win/food-7.jpg",
    category: "Event",
    venue: "Sunbird Capital"
  },
  {
    id: 7,
    title: "Jazz Night Under the Stars",
    date: "Apr 10",
    price: "From $45",
    image: "/resized-win/mc-2.jpg",
    category: "Concert",
    venue: "Garden Lounge"
  },
  {
    id: 8,
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
    id: "nfl",
    name: "NFL",
    icon: "🏈",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "concerts",
    name: "Concerts",
    icon: "🎸",
    color: "from-red-500 to-pink-600"
  },
  {
    id: "nba",
    name: "NBA",
    icon: "🏀",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "ncaa",
    name: "NCAA Football",
    icon: "🏟️",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "theater",
    name: "Theater",
    icon: "🎭",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "festivals",
    name: "Festivals",
    icon: "🎪",
    color: "from-pink-500 to-rose-600"
  }
]

export default function TicketingIndex({
  trendingEvents = defaultTrendingEvents,
  topArtists = defaultArtists,
  categories = defaultCategories,
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
      <Head title="Ticketing - Find Live Events & Sports" />
      <div className="min-h-screen bg-black text-white">
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
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
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
                  Let there be live
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-300 mb-8"
                >
                  Find and get tickets to live events and sporting
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
          <section className="py-12 bg-black">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Trending Events</h2>
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
                    className="group relative bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer"
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
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5 transition-colors",
                            favorites.includes(event.id) ? "fill-red-500 text-red-500" : "text-white"
                          )}
                        />
                      </button>
                    </div>

                    {/* Event Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">{event.date}</p>
                      <p className="text-sm font-bold text-primary">{event.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Browse Events by Location */}
          <section className="py-12 bg-gray-950">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Browse Events</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">{location}</span>
                  </div>
                  <Button variant="link" className="text-sm text-primary p-0 h-auto">
                    Change Location
                  </Button>
                  <span className="text-gray-600">•</span>
                  <Button variant="link" className="text-sm text-primary p-0 h-auto">
                    View All Dates
                  </Button>
                </div>
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity",
                      category.color
                    )} />
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <div className="text-6xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Artists */}
          <section className="py-12 bg-gray-950">
            <div className="container mx-auto px-6 lg:px-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Top artists</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topArtists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Favorite Button */}
                      <button
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <Heart className="h-5 w-5 text-white" />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {artist.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer className="bg-gray-900" />
      </div>
    </>
  )
}
