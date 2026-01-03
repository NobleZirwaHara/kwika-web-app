import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, usePage } from '@inertiajs/react'
import { ShoppingCart } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'

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
      className={cn("w-8 h-8 object-contain", className)}
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
  isNew?: boolean
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
    label: 'Events',
    href: '/ticketing',
    iconSrc: '/icons/animated/tickets.mp4',
  },
]

export default function MobileNavTabs() {
  const { url } = usePage()
  const { cart } = useCart()

  // Determine active tab based on current URL
  const getActiveTab = () => {
    if (url.startsWith('/providers')) return 'providers'
    if (url.startsWith('/ticketing') || url.startsWith('/events')) return 'events'
    if (url === '/') return 'providers'
    return 'providers'
  }

  const activeTab = getActiveTab()

  return (
    <div className="md:hidden bg-white dark:bg-background sticky top-0 z-50 shadow-sm">
      <div className="px-6 pt-5 pb-0">
        {/* Logo and Cart */}
        <div className="relative flex items-center justify-center mb-5">
          {/* Logo - Centered */}
          <Link href="/">
            <img src="/kwika-logo.png" alt="Kwika" className="h-14" />
          </Link>

          {/* Cart Icon - Absolute Right */}
          <Link href="/cart" className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-md">
              <ShoppingCart className="h-5 w-5" />
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {cart.total_items > 99 ? '99+' : cart.total_items}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-start justify-around border-b border-border/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 py-3 px-6 transition-all duration-200',
                  'focus:outline-none'
                )}
              >

                {/* Animated Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                >
                  <AnimatedIcon src={tab.iconSrc} />
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-semibold transition-colors duration-200 whitespace-nowrap',
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  )}
                >
                  {tab.label}
                </span>

                {/* Active Underline */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-foreground"
                    style={{ width: '80%' }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
