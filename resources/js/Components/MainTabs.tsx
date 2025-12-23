import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, usePage } from '@inertiajs/react'
import { useHeroCarousel } from '@/contexts/HeroCarouselContext'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const tabs: Tab[] = [
  {
    id: 'services',
    label: 'Services',
    href: '/',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        {/* Simple globe - global services */}

        {/* Globe circle */}
        <circle cx="16" cy="16" r="11" fill="oklch(0.65 0.18 220)" opacity="0.2" />
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />

        {/* Latitude lines */}
        <ellipse cx="16" cy="16" rx="11" ry="4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="16" cy="16" rx="11" ry="7" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

        {/* Longitude line */}
        <ellipse cx="16" cy="16" rx="4" ry="11" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

        {/* Location markers for services */}
        <circle cx="13" cy="12" r="1.5" fill="oklch(0.72 0.16 60)" />
        <circle cx="19" cy="14" r="1.5" fill="oklch(0.72 0.16 60)" />
        <circle cx="16" cy="20" r="1.5" fill="oklch(0.65 0.18 220)" />
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        {/* Shopping bag with colorful elements */}
        <defs>
          <linearGradient id="bagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.16 60)" />
            <stop offset="100%" stopColor="oklch(0.65 0.14 50)" />
          </linearGradient>
        </defs>

        {/* Shopping bag body */}
        <path
          d="M7 11L5 27C5 28.1 5.9 29 7 29H25C26.1 29 27 28.1 27 27L25 11H7Z"
          fill="oklch(0.72 0.16 60)"
          opacity="0.25"
        />
        <path
          d="M7 11L5 27C5 28.1 5.9 29 7 29H25C26.1 29 27 28.1 27 27L25 11H7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Bag handles */}
        <path
          d="M11 11V9C11 6.24 13.24 4 16 4C18.76 4 21 6.24 21 9V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Tag/label accent */}
        <rect x="13" y="18" width="6" height="4" rx="1" fill="oklch(0.65 0.18 220)" opacity="0.6" />
        <circle cx="16" cy="20" r="1" fill="white" opacity="0.8" />

        {/* Sparkles for new products */}
        <circle cx="9" cy="15" r="1" fill="oklch(0.72 0.16 60)" />
        <circle cx="23" cy="15" r="1" fill="oklch(0.72 0.16 60)" />
        <circle cx="16" cy="25" r="1" fill="oklch(0.72 0.16 60)" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'ticketing',
    label: 'Ticketing',
    href: '/ticketing',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        {/* Event ticket with vibrant colors */}
        <defs>
          <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.18 280)" />
            <stop offset="100%" stopColor="oklch(0.60 0.16 260)" />
          </linearGradient>
        </defs>

        {/* Ticket background with color */}
        <path
          d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V14C26.3431 14 25 15.3431 25 17C25 18.6569 26.3431 20 28 20V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V20C5.65685 20 7 18.6569 7 17C7 15.3431 5.65685 14 4 14V10Z"
          fill="oklch(0.65 0.18 280)"
          opacity="0.25"
        />

        {/* Ticket outline */}
        <path
          d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V14C26.3431 14 25 15.3431 25 17C25 18.6569 26.3431 20 28 20V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V20C5.65685 20 7 18.6569 7 17C7 15.3431 5.65685 14 4 14V10Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />

        {/* Perforated line - more visible */}
        <line x1="18" y1="10" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="14" x2="18" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="18" x2="18" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="22" x2="18" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* Ticket details - colorful */}
        <rect x="7" y="12" width="7" height="2.5" rx="1" fill="oklch(0.72 0.16 60)" opacity="0.7" />
        <rect x="7" y="16" width="5" height="2" rx="1" fill="oklch(0.65 0.18 220)" opacity="0.6" />
        <rect x="7" y="19.5" width="6" height="2" rx="1" fill="currentColor" opacity="0.5" />

        {/* Star accent for event excitement */}
        <path d="M23 13L23.5 14.5L25 15L23.5 15.5L23 17L22.5 15.5L21 15L22.5 14.5L23 13Z" fill="oklch(0.72 0.16 60)" />
      </svg>
    ),
  },
]

export default function MainTabs() {
  const { url } = usePage()
  const carousel = useHeroCarousel()

  // Determine active tab based on current URL
  const getActiveTab = () => {
    if (url === '/') return 'services'
    if (url.startsWith('/products')) return 'products'
    if (url.startsWith('/ticketing')) return 'ticketing'
    return 'services'
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
              {/* Icon */}
              <div
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {tab.icon}
              </div>

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
