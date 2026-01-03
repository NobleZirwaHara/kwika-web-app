import { Button } from "@/components/ui/button"
import { Search, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { router, Link, usePage } from "@inertiajs/react"
import { motion, AnimatePresence } from "framer-motion"
import { useHeroCarousel } from "@/contexts/HeroCarouselContext"
import { SearchDropdown } from "@/components/search-dropdown"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  subcategories?: { id: number; name: string }[]
}

interface FeaturedEvent {
  id: number
  title: string
  description?: string
  ctaText: string
  ctaLink: string
  backgroundType: 'gradient' | 'image'
  backgroundValue: string
  favoriteCount?: string
}

interface HeroFeaturedProps {
  events?: FeaturedEvent[]
}

const defaultEvents: FeaturedEvent[] = [
  {
    id: 1,
    title: "Wedding Photography",
    description: "Professional event photographers ready to capture your special moments",
    ctaText: "Browse Photographers",
    ctaLink: "/search?category=35",
    backgroundType: 'image',
    backgroundValue: '/resized-win/bride-groom-shoot-3.jpg',
    favoriteCount: "12.6K"
  },
  {
    id: 2,
    title: "Event Catering",
    description: "Top-rated caterers for events of any size",
    ctaText: "Find Caterers",
    ctaLink: "/search?category=35",
    backgroundType: 'image',
    backgroundValue: '/resized-win/food-5.jpg',
    favoriteCount: "8.3K"
  },
  {
    id: 3,
    title: "Event Decor",
    description: "Transform your venue with professional decorators",
    ctaText: "Browse Decorators",
    ctaLink: "/search?category=35",
    backgroundType: 'image',
    backgroundValue: '/resized-win/decor-3.jpg',
    favoriteCount: "5.1K"
  }
]

export function HeroFeatured({ events = defaultEvents }: HeroFeaturedProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchActive, setIsSearchActive] = useState(false)
  const { activeSlide, setActiveSlide, setTotalSlides } = useHeroCarousel()
  const { categories } = usePage().props as { categories?: Category[] }

  // Set total slides on mount
  useEffect(() => {
    setTotalSlides(events.length)
  }, [events.length, setTotalSlides])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % events.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [events.length, setActiveSlide])

  const handleSearchFocus = () => {
    setIsSearchActive(true)
  }

  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery("")
  }

  const handleSelect = (value: string, categoryId?: number, type?: 'category' | 'location' | 'date') => {
    setIsSearchActive(false)
    if (categoryId) {
      router.get('/providers', { category: categoryId })
    } else if (type === 'location') {
      router.get('/providers', { city: value })
    } else if (type === 'date') {
      router.get('/providers', { available_date: value })
    } else {
      router.get('/providers', { query: value })
    }
  }

  const currentEvent = events[activeSlide]

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 pt-8 pb-6">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Search Bar - Clickable to expand */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto relative">
            <button
              type="button"
              onClick={handleSearchFocus}
              className="w-full flex items-center gap-3 rounded-full border-2 border-border bg-background px-6 py-4 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-text text-left"
            >
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-base text-muted-foreground/60">
                Search photographers, caterers, decorators and more
              </span>
            </button>
          </div>
        </div>

        {/* Centered Search Dropdown Modal */}
        <AnimatePresence>
          {isSearchActive && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                onClick={handleCloseSearch}
              />

              {/* Centered Search with Dropdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[calc(100%-2rem)] z-[110]"
              >
                {/* Search Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (searchQuery.trim()) {
                      handleCloseSearch()
                      router.get('/providers', { query: searchQuery })
                    }
                  }}
                  className="mb-2"
                >
                  <div className="flex items-center gap-3 rounded-full border-2 border-primary bg-background px-6 py-4 shadow-xl">
                    <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search photographers, caterers, decorators..."
                      className="flex-1 text-base bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                      autoFocus
                    />
                    {searchQuery && (
                      <Button
                        type="submit"
                        size="sm"
                        className="rounded-full"
                      >
                        Search
                      </Button>
                    )}
                  </div>
                </form>

                {/* Dropdown */}
                <SearchDropdown
                  activeField="service"
                  onClose={handleCloseSearch}
                  onSelect={handleSelect}
                  searchValue={searchQuery}
                  categories={categories}
                  floating
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Featured Event Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] lg:h-[500px]"
            >
              {/* Background */}
              <div className="absolute inset-0">
                {currentEvent.backgroundType === 'gradient' && (
                  <GeometricBackground variant={currentEvent.backgroundValue} />
                )}
                {currentEvent.backgroundType === 'image' && (
                  <>
                    <img
                      src={currentEvent.backgroundValue}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlays for better text readability - teal/blue theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.12_215)]/95 via-[oklch(0.35_0.14_215)]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Geometric pattern overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.58_0.16_215)]/30 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[oklch(0.48_0.14_205)]/30 rounded-full blur-3xl" />
                    </div>
                  </>
                )}
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-8 lg:px-16">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-white"
                    >
                      <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-8">
                        {currentEvent.title}
                      </h2>
                      {currentEvent.description && (
                        <p className="text-lg lg:text-xl mb-8 text-white/90">
                          {currentEvent.description}
                        </p>
                      )}
                      <Link href={currentEvent.ctaLink}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-xl transition-all duration-300"
                        >
                          {currentEvent.ctaText}
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Right: Large Text Display */}
                    {/* <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="hidden lg:flex items-center justify-center"
                    >
                      <div className="text-center relative">
                        
                        {(() => {
                          const words = currentEvent.title.toUpperCase().split(' ')

                          return (
                            <div className="relative">
                              <div className="flex flex-col gap-2">
                                {words.map((word, index) => (
                                  <div
                                    key={index}
                                    className="text-7xl xl:text-8xl 2xl:text-9xl font-black text-white leading-none tracking-tighter"
                                  >
                                    {word}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </motion.div> */}
                  </div>
                </div>
              </div>

              {/* Favorite Badge */}
              {currentEvent.favoriteCount && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <span className="font-semibold">{currentEvent.favoriteCount}</span>
                  <Heart className="h-4 w-4 fill-white" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - appear on hover */}
          {events.length > 1 && (
            <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + events.length) % events.length)}
                className="bg-black/80 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % events.length)}
                className="bg-black/80 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Geometric Background Component
function GeometricBackground({ variant }: { variant: string }) {
  const variants: Record<string, string> = {
    'geometric-purple': `
      bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900
      before:absolute before:inset-0 before:opacity-40
      before:bg-[radial-gradient(circle_at_30%_30%,_#7c3aed_0%,_transparent_50%),radial-gradient(circle_at_70%_70%,_#4f46e5_0%,_transparent_50%)]
      after:absolute after:inset-0 after:opacity-20
      after:bg-[linear-gradient(45deg,_transparent_40%,_#a855f7_40%,_#a855f7_60%,_transparent_60%),linear-gradient(-45deg,_transparent_40%,_#6366f1_40%,_#6366f1_60%,_transparent_60%)]
      after:bg-[length:200px_200px]
    `,
    'geometric-blue': `
      bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900
      before:absolute before:inset-0 before:opacity-40
      before:bg-[radial-gradient(circle_at_40%_40%,_#3b82f6_0%,_transparent_50%),radial-gradient(circle_at_60%_60%,_#8b5cf6_0%,_transparent_50%)]
      after:absolute after:inset-0 after:opacity-20
      after:bg-[linear-gradient(30deg,_transparent_40%,_#60a5fa_40%,_#60a5fa_60%,_transparent_60%)]
      after:bg-[length:180px_180px]
    `,
    'geometric-orange': `
      bg-gradient-to-br from-orange-800 via-red-800 to-pink-900
      before:absolute before:inset-0 before:opacity-40
      before:bg-[radial-gradient(circle_at_50%_30%,_#f97316_0%,_transparent_50%),radial-gradient(circle_at_70%_80%,_#ec4899_0%,_transparent_50%)]
      after:absolute after:inset-0 after:opacity-20
      after:bg-[linear-gradient(60deg,_transparent_40%,_#fb923c_40%,_#fb923c_60%,_transparent_60%)]
      after:bg-[length:220px_220px]
    `,
  }

  return (
    <div className={cn("absolute inset-0 relative", variants[variant] || variants['geometric-purple'])}>
      {/* Additional geometric overlays */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Animated geometric shapes */}
      <motion.div
        className="absolute top-20 right-20 w-40 h-40 bg-blue-400/10 backdrop-blur-sm"
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1, 0.9, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-40 w-32 h-32 bg-purple-400/10 backdrop-blur-sm"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [1, 0.9, 1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}
