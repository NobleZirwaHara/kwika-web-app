import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, usePage, router } from '@inertiajs/react'
import { Search, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/Components/ui/button'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  isNew?: boolean
}

const tabs: Tab[] = [
  {
    id: 'services',
    label: 'Services',
    href: '/',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
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
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
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
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
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

        {/* Perforated line */}
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

interface MobileNavTabsProps {
  onSearchClick?: () => void
}

export default function MobileNavTabs({ onSearchClick }: MobileNavTabsProps) {
  const { url } = usePage()
  const { cart } = useCart()

  // Determine active tab based on current URL
  const getActiveTab = () => {
    if (url === '/') return 'services'
    if (url.startsWith('/products')) return 'products'
    if (url.startsWith('/ticketing')) return 'ticketing'
    return 'services'
  }

  const activeTab = getActiveTab()

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick()
    } else {
      router.visit('/search')
    }
  }

  return (
    <div className="md:hidden bg-white dark:bg-background sticky top-0 z-50 shadow-sm">
      <div className="px-6 pt-5 pb-0">
        {/* Search Bar with Cart */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleSearchClick}
            className="flex-1 flex items-center justify-center gap-3 rounded-full border border-border/20 bg-white dark:bg-card shadow-md hover:shadow-lg transition-all p-4"
          >
            <Search className="h-5 w-5 text-foreground/80" />
            <span className="text-base font-semibold text-foreground">Start your search</span>
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
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

                {/* Icon */}
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
                  {tab.icon}
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
