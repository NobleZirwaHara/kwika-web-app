import { useState, useCallback, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Filter, MapPin, Grid, List } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useSwipeGestures';
import { OptimizedImage } from '@/components/OptimizedImage';
import { StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileOptimizedListingProps {
    results: any;
    onRefresh?: () => void;
    onFilterOpen?: () => void;
    viewMode: 'grid' | 'list' | 'map';
    onViewModeChange: (mode: 'grid' | 'list' | 'map') => void;
    activeFilters: number;
}

export function MobileOptimizedListing({
    results,
    onRefresh,
    onFilterOpen,
    viewMode,
    onViewModeChange,
    activeFilters,
}: MobileOptimizedListingProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const haptic = useHapticFeedback();
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const scrollPosition = useRef(0);

    // Handle pull-to-refresh
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        scrollPosition.current = window.scrollY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (scrollPosition.current > 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = Math.max(0, currentY - touchStartY.current);

        if (distance > 0) {
            // Prevent default scroll when pulling down
            if (e.cancelable) {
                e.preventDefault();
            }
            setPullDistance(Math.min(distance * 0.5, 100)); // Max 100px pull
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > 60 && !isRefreshing) {
            // Trigger refresh
            setIsRefreshing(true);
            haptic.medium();

            // Call refresh handler or reload data
            if (onRefresh) {
                await onRefresh();
            } else {
                // Default refresh behavior
                router.reload({
                    preserveScroll: false,
                    preserveState: false,
                });
            }

            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
                haptic.success();
            }, 1500);
        } else {
            // Snap back
            setPullDistance(0);
        }
    };

    // Monitor scroll for "scroll to top" button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        haptic.light();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Mobile-optimized card component
    const MobileCard = ({ item }: { item: any }) => {
        const [isPressed, setIsPressed] = useState(false);

        return (
            <motion.div
                whileTap={{ scale: 0.98 }}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                onTouchCancel={() => setIsPressed(false)}
                className={cn(
                    'bg-white dark:bg-gray-800 rounded-2xl overflow-hidden',
                    'shadow-sm active:shadow-lg transition-shadow',
                    isPressed && 'ring-2 ring-primary/20'
                )}
            >
                <a
                    href={route('provider.show', item.slug)}
                    onClick={(e) => {
                        e.preventDefault();
                        haptic.light();
                        router.visit(route('provider.show', item.slug));
                    }}
                    className="block"
                >
                    {/* Image with aspect ratio */}
                    <div className="relative aspect-[4/3]">
                        <OptimizedImage
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-full h-full"
                            priority={false}
                        />

                        {/* Badge */}
                        {item.is_featured && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                                Featured
                            </div>
                        )}

                        {/* Wishlist button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                haptic.light();
                                // Handle wishlist toggle
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {item.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {item.average_rating || '4.5'} ({item.reviews_count || 0})
                            </span>
                        </div>

                        {/* Location */}
                        {item.city && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>{item.city}</span>
                            </div>
                        )}

                        {/* Price */}
                        {item.starting_price && (
                            <div className="mt-3">
                                <span className="text-lg font-bold text-primary">
                                    MK {item.starting_price.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500"> /event</span>
                            </div>
                        )}
                    </div>
                </a>
            </motion.div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull to refresh indicator */}
            <motion.div
                className="absolute -top-16 left-0 right-0 h-16 flex items-center justify-center z-10"
                animate={{
                    y: pullDistance,
                    opacity: pullDistance > 20 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
                <motion.div
                    animate={{
                        rotate: isRefreshing ? 360 : pullDistance * 2,
                    }}
                    transition={{
                        duration: isRefreshing ? 1 : 0,
                        repeat: isRefreshing ? Infinity : 0,
                        ease: 'linear',
                    }}
                >
                    <RefreshCw
                        className={cn(
                            'w-6 h-6',
                            pullDistance > 60 ? 'text-primary' : 'text-gray-400'
                        )}
                    />
                </motion.div>
            </motion.div>

            {/* Sticky header with filters and view toggle */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b">
                <div className="flex items-center justify-between p-4">
                    {/* Filter button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            haptic.light();
                            onFilterOpen?.();
                        }}
                        className="relative"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                        {activeFilters > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                {activeFilters}
                            </span>
                        )}
                    </Button>

                    {/* View mode toggle */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => {
                                haptic.light();
                                onViewModeChange('grid');
                            }}
                            className={cn(
                                'p-2 rounded transition-colors',
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                haptic.light();
                                onViewModeChange('list');
                            }}
                            className={cn(
                                'p-2 rounded transition-colors',
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                haptic.light();
                                onViewModeChange('map');
                            }}
                            className={cn(
                                'p-2 rounded transition-colors',
                                viewMode === 'map'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            <MapPin className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content with pull effect */}
            <motion.div
                animate={{
                    y: isRefreshing ? 40 : pullDistance * 0.3,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="px-4 py-4"
            >
                {/* Results */}
                <StaggerContainer
                    className={cn(
                        viewMode === 'grid' && 'grid grid-cols-2 gap-4',
                        viewMode === 'list' && 'space-y-4'
                    )}
                    delay={0.03}
                >
                    {results.data.map((item: any, index: number) => (
                        <StaggerItem key={item.id || index}>
                            <MobileCard item={item} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* Load more / Pagination */}
                {results.next_page_url && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={() => {
                                haptic.light();
                                router.visit(results.next_page_url, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                            variant="outline"
                            className="w-full max-w-xs"
                        >
                            Load More
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {results.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No results found
                        </h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs">
                            Try adjusting your filters or search criteria
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Scroll to top button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-4 z-30 p-3 bg-primary text-white rounded-full shadow-lg"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}