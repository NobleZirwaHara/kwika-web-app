import React, { memo, useCallback, useMemo } from 'react'
import { Link, router } from '@inertiajs/react'
import { ChevronLeft } from 'lucide-react'
import CompactSearchBar from '@/components/compact-search-bar'
import UserMenu from '@/components/user-menu'
import { cn } from '@/lib/utils'

interface CachedSearchHeaderProps {
    variant?: 'detail' | 'search'
    showBackButton?: boolean
    backUrl?: string
    categories?: Array<{
        id: number
        name: string
        parent_id: number | null
    }>
    className?: string
}

// Memoized sub-components
const MemoizedCompactSearchBar = memo(CompactSearchBar)
const MemoizedUserMenu = memo(UserMenu)

// Memoized back button component
const BackButton = memo(({ url }: { url: string }) => {
    const handleBack = useCallback(() => {
        router.visit(url, { preserveScroll: true })
    }, [url])

    return (
        <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
        >
            <ChevronLeft className="h-5 w-5" />
        </button>
    )
})

BackButton.displayName = 'BackButton'

// Logo component
const Logo = memo(() => (
    <Link href="/" className="flex items-center">
        <img src="/logo-desktop.svg" alt="Kwika Events" className="h-8" />
    </Link>
))

Logo.displayName = 'Logo'

// Main cached search header component
const CachedSearchHeader = memo<CachedSearchHeaderProps>(({
    variant = 'search',
    showBackButton = false,
    backUrl = '/search',
    categories = [],
    className = ''
}) => {
    // Memoize header classes
    const headerClasses = useMemo(() => {
        return cn(
            'fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800',
            'transition-all duration-300',
            className
        )
    }, [className])

    // Determine whether to show back button
    const shouldShowBack = useMemo(() => {
        return variant === 'detail' || showBackButton
    }, [variant, showBackButton])

    // Memoize search bar props
    const searchBarProps = useMemo(() => ({
        categories,
        variant: 'mobile' as const
    }), [categories])

    return (
        <header className={headerClasses}>
            <div className="mx-auto max-w-[1400px] px-4 md:px-6">
                <div className="flex h-14 md:h-16 items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-2">
                        {shouldShowBack && (
                            <div className="md:hidden">
                                <BackButton url={backUrl} />
                            </div>
                        )}
                        <div className={cn(
                            shouldShowBack ? 'hidden md:block' : 'block'
                        )}>
                            <Logo />
                        </div>
                    </div>

                    {/* Center Section - Search Bar */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <MemoizedCompactSearchBar {...searchBarProps} />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center">
                        <MemoizedUserMenu />
                    </div>
                </div>
            </div>
        </header>
    )
}, (prevProps, nextProps) => {
    // Custom shallow comparison
    return (
        prevProps.variant === nextProps.variant &&
        prevProps.showBackButton === nextProps.showBackButton &&
        prevProps.backUrl === nextProps.backUrl &&
        prevProps.className === nextProps.className &&
        prevProps.categories?.length === nextProps.categories?.length
    )
})

CachedSearchHeader.displayName = 'CachedSearchHeader'

// Export hook for scroll-based styling
export const useCachedSearchHeaderScroll = () => {
    const [hasScrolled, setHasScrolled] = React.useState(false)

    React.useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setHasScrolled(window.scrollY > 20)
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

export default CachedSearchHeader