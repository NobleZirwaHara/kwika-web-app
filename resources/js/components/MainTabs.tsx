import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, usePage } from '@inertiajs/react'
import { useHeroCarousel } from '@/contexts/HeroCarouselContext'
import { useRef, useEffect } from 'react'

// Animated icon component that plays on load and hover
function AnimatedIcon({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Play on initial load
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      className={cn("w-7 h-7 object-contain", className)}
      muted
      playsInline
      onMouseEnter={handleMouseEnter}
    />
  )
}

interface Tab {
  id: string
  label: string
  iconSrc: string
  href: string
}

const tabs: Tab[] = [
  {
    id: 'providers',
    label: 'Providers',
    href: '/',
    iconSrc: '/icons/animated/platter.mp4',
  },
  {
    id: 'events',
    label: 'Events & Ticketing',
    href: '/ticketing',
    iconSrc: '/icons/animated/tickets.mp4',
  },
]

export default function MainTabs() {
  const { url } = usePage()
  const carousel = useHeroCarousel()

  // Determine active tab based on current URL
  const getActiveTab = () => {
    if (url.startsWith('/providers')) return 'providers'
    if (url.startsWith('/ticketing') || url.startsWith('/events')) return 'events'
    if (url === '/') return 'providers'
    return 'providers'
  }

  const activeTab = getActiveTab()

  // Only show carousel dots on homepage when context is available
  const isHomePage = url === '/'
  const showCarouselDots = isHomePage && carousel && carousel.totalSlides > 1

  return (
    <div className="w-auto">
      <div className="relative flex items-center gap-8">
        {/* Tab buttons */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'relative flex items-center gap-2 py-4 px-1 transition-all duration-200',
                'min-w-0',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              {/* Animated Icon */}
              <AnimatedIcon src={tab.iconSrc} />

              {/* Label */}
              <span
                className={cn(
                  'text-[15px] font-medium transition-colors duration-200 whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground/90'
                )}
              >
                {tab.label}
              </span>

              {/* Bottom border underline for active tab */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                initial={false}
                animate={{
                  scaleX: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />

              {/* Hover underline for inactive tabs */}
              {!isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/20"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Hero Carousel Navigation Dots (only on homepage) */}
      {/* {showCarouselDots && carousel && (
        <motion.div
          className="flex justify-center mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-1.5">
            {Array.from({ length: carousel.totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => carousel.setActiveSlide(index)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300 cursor-pointer',
                  index === carousel.activeSlide ? 'w-4 bg-primary' : 'w-1 bg-border hover:bg-border/80'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )} */}
    </div>
  )
}
