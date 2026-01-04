import { motion, useAnimationControls } from 'framer-motion'
import { Link, router } from '@inertiajs/react'
import { Search, Heart, CalendarDays, MessageCircle, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  activeIcon?: React.ReactNode
}

interface MobileBottomNavProps {
  user?: any
}

export default function MobileBottomNav({ user }: MobileBottomNavProps) {
  const [currentUrl, setCurrentUrl] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const controls = useAnimationControls()
  const scrollThreshold = 10 // Minimum scroll distance to trigger show/hide

  // Listen for Inertia navigation events
  useEffect(() => {
    const handleNavigate = () => {
      setCurrentUrl(window.location.pathname)
    }

    // Listen to Inertia's navigate event
    const removeListener = router.on('navigate', handleNavigate)

    return () => {
      removeListener()
    }
  }, [])

  // Define nav items based on auth status
  const loggedInItems: NavItem[] = [
    {
      id: 'explore',
      label: 'Explore',
      icon: <Search className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <Search className="h-6 w-6" strokeWidth={2.5} />,
      href: '/',
    },
    {
      id: 'wishlists',
      label: 'Wishlists',
      icon: <Heart className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <Heart className="h-6 w-6 fill-current" strokeWidth={2} />,
      href: '/wishlist',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: <CalendarDays className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <CalendarDays className="h-6 w-6" strokeWidth={2.5} />,
      href: '/user/bookings',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageCircle className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <MessageCircle className="h-6 w-6 fill-current" strokeWidth={2} />,
      href: '/user/messages',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: user?.avatar ? (
        <img src={user.avatar} alt="" className="h-7 w-7 rounded-full border border-border" />
      ) : (
        <div className="h-7 w-7 rounded-full border border-foreground/40 flex items-center justify-center">
          <User className="h-4 w-4" strokeWidth={1.5} />
        </div>
      ),
      activeIcon: user?.avatar ? (
        <img src={user.avatar} alt="" className="h-7 w-7 rounded-full border-2 border-foreground" />
      ) : (
        <div className="h-7 w-7 rounded-full border-2 border-foreground flex items-center justify-center">
          <User className="h-4 w-4" strokeWidth={2} />
        </div>
      ),
      href: '/user/profile',
    },
  ]

  const loggedOutItems: NavItem[] = [
    {
      id: 'explore',
      label: 'Explore',
      icon: <Search className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <Search className="h-6 w-6" strokeWidth={2.5} />,
      href: '/',
    },
    {
      id: 'wishlists',
      label: 'Wishlists',
      icon: <Heart className="h-6 w-6" strokeWidth={1.5} />,
      activeIcon: <Heart className="h-6 w-6 fill-current" strokeWidth={2} />,
      href: '/wishlist',
    },
    {
      id: 'login',
      label: 'Log in',
      icon: (
        <div className="h-7 w-7 rounded-full border border-foreground/40 flex items-center justify-center">
          <User className="h-4 w-4" strokeWidth={1.5} />
        </div>
      ),
      activeIcon: (
        <div className="h-7 w-7 rounded-full border-2 border-foreground flex items-center justify-center">
          <User className="h-4 w-4" strokeWidth={2} />
        </div>
      ),
      href: '/login',
    },
  ]

  const navItems = user ? loggedInItems : loggedOutItems

  // Determine active item based on URL
  const getActiveItem = () => {
    if (currentUrl === '/' || currentUrl.startsWith('/search') || currentUrl.startsWith('/providers') || currentUrl.startsWith('/services')) return 'explore'
    if (currentUrl.startsWith('/wishlist')) return 'wishlists'
    if (currentUrl.startsWith('/user/bookings')) return 'bookings'
    if (currentUrl.startsWith('/user/messages')) return 'messages'
    if (currentUrl.startsWith('/user/profile') || currentUrl.startsWith('/user/settings')) return 'profile'
    if (currentUrl.startsWith('/login') || currentUrl.startsWith('/register')) return 'login'
    return 'explore'
  }

  const activeItem = getActiveItem()

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDiff = currentScrollY - lastScrollY

      // Only trigger if scroll distance exceeds threshold
      if (Math.abs(scrollDiff) < scrollThreshold) return

      if (currentScrollY < 100) {
        // Always show near top of page
        setIsVisible(true)
      } else if (scrollDiff > 0) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Animate based on visibility
  useEffect(() => {
    controls.start({
      y: isVisible ? 0 : 100,
      opacity: isVisible ? 1 : 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    })
  }, [isVisible, controls])

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 pb-safe"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-3 min-w-[64px] transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                {isActive ? item.activeIcon || item.icon : item.icon}
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
