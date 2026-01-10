import React, { memo, useCallback, useMemo } from 'react'
import { Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, MapPin } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import UserMenu from '@/components/user-menu'
import MainTabs from '@/components/MainTabs'
import CompactSearchBar from '@/components/compact-search-bar'
import MobileNavTabs from '@/components/MobileNavTabs'
import { cn } from '@/lib/utils'

interface CachedHeaderProps {
    categories?: Array<{
        id: number
        name: string
        parent_id: number | null
    }>
    hasScrolled?: boolean
    locationName?: string
    className?: string
}

// Memoized sub-components
const MemoizedMainTabs = memo(MainTabs)
const MemoizedCompactSearchBar = memo(CompactSearchBar)
const MemoizedUserMenu = memo(UserMenu)
const MemoizedMobileNavTabs = memo(MobileNavTabs)

// Memoized cart button component
const CartButton = memo(({ itemCount }: { itemCount: number }) => (
    <Link href="/cart" className="relative">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </button>
    </Link>
))

CartButton.displayName = 'CartButton'

// Main cached header component with shallow comparison
const CachedHeader = memo<CachedHeaderProps>(({
    categories = [],
    hasScrolled = false,
    locationName = '',
    className = ''
}) => {
    const { cart } = useCart()

    // Memoize cart item count calculation
    const cartItemCount = useMemo(() => {
        return cart?.total_items || 0
    }, [cart?.total_items])

    // Memoize location display
    const locationDisplay = useMemo(() => {
        if (!locationName) return null
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{locationName}</span>
            </div>
        )
    }, [locationName])

    // Use refs and callbacks for event handlers
    const handleLogoClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        window.location.href = '/'
    }, [])

    return (
        <>
            {/* Desktop Header */}
            <header
                className={cn(
                    "bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-shadow duration-300",
                    hasScrolled && "shadow-sm",
                    className
                )}
            >
                <div className="mx-auto max-w-[1400px] px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/"
                                onClick={handleLogoClick}
                                className="flex items-center gap-2 no-underline"
                            >
                                <img src="/logo-desktop.svg" alt="Kwika Events" className="h-8" />
                            </Link>
                            {locationDisplay}
                        </div>

                        {/* Center Section - Animated Tabs/Search */}
                        <div className="hidden md:flex items-center justify-center flex-1 px-8">
                            <AnimatePresence mode="wait">
                                {!hasScrolled ? (
                                    <motion.div
                                        key="tabs"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full max-w-md"
                                    >
                                        <MemoizedMainTabs />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="search"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-full max-w-2xl"
                                    >
                                        <MemoizedCompactSearchBar categories={categories} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            <CartButton itemCount={cartItemCount} />
                            <MemoizedUserMenu />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <MemoizedMobileNavTabs />
            </div>
        </>
    )
}, (prevProps, nextProps) => {
    // Custom shallow comparison for better performance
    return (
        prevProps.hasScrolled === nextProps.hasScrolled &&
        prevProps.locationName === nextProps.locationName &&
        prevProps.className === nextProps.className &&
        prevProps.categories?.length === nextProps.categories?.length
    )
})

CachedHeader.displayName = 'CachedHeader'

// Export both the cached version and a hook for scroll handling
export const useCachedHeaderScroll = () => {
    const [hasScrolled, setHasScrolled] = React.useState(false)

    React.useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setHasScrolled(window.scrollY > 80)
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return hasScrolled
}

export default CachedHeader