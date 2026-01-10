import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';

interface PageTransitionProps {
    children: ReactNode;
}

// Different transition variants for different types of navigation
const pageVariants = {
    initial: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 20 : -20,
        scale: 0.98,
    }),
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -20 : 20,
        scale: 0.98,
    }),
};

// Faster transitions for mobile
const mobileTransition = {
    type: 'spring',
    stiffness: 350,
    damping: 30,
    mass: 0.8,
};

const desktopTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
};

export function PageTransition({ children }: PageTransitionProps) {
    // Try to get the page data, but provide a fallback
    let url = '/';
    try {
        const pageData = usePage();
        url = pageData.url || '/';
    } catch (error) {
        // If usePage throws (e.g., outside Inertia context), use current URL
        if (typeof window !== 'undefined') {
            url = window.location.pathname;
        }
    }

    const [direction, setDirection] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Track navigation direction
        let previousUrl = url;
        const handleNavigate = () => {
            const currentUrl = router?.page?.url || window.location.pathname;
            // Simple heuristic: if going to a "deeper" page, direction is forward
            setDirection(currentUrl.length > previousUrl.length ? 1 : -1);
            previousUrl = currentUrl;
        };

        // Only add router listeners if router is available
        if (router && router.on) {
            router.on('navigate', handleNavigate);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (router && router.off) {
                router.off('navigate', handleNavigate);
            }
        };
    }, [url]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={url}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={isMobile ? mobileTransition : desktopTransition}
                style={{ width: '100%' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Shared element transition component for images
interface SharedElementProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export function SharedElement({ id, children, className }: SharedElementProps) {
    return (
        <motion.div
            layoutId={id}
            className={className}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
            }}
        >
            {children}
        </motion.div>
    );
}

// Hero image transition for detail pages
interface HeroTransitionProps {
    src: string;
    alt: string;
    layoutId?: string;
}

export function HeroTransition({ src, alt, layoutId }: HeroTransitionProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            layoutId={layoutId}
            className="relative w-full h-full overflow-hidden"
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
            }}
        >
            {/* Blur placeholder */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: imageLoaded ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
            />

            {/* Actual image */}
            <motion.img
                src={src}
                alt={alt}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 1.1
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
}

// Stagger children animation for lists
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function StaggerContainer({ children, className, delay = 0.05 }: StaggerContainerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: delay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Stagger item for use with StaggerContainer
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: {
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                    }
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Pull to refresh animation container
interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let startY = 0;
        let currentY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                setIsPulling(true);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling) return;

            currentY = e.touches[0].clientY;
            const distance = Math.max(0, currentY - startY);

            if (distance > 0 && window.scrollY === 0) {
                e.preventDefault();
                setPullDistance(Math.min(distance, 150));
            }
        };

        const handleTouchEnd = async () => {
            if (!isPulling) return;

            setIsPulling(false);

            if (pullDistance > 80) {
                setIsRefreshing(true);

                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate([20, 10, 20]);
                }

                await onRefresh();
                setIsRefreshing(false);
            }

            setPullDistance(0);
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, pullDistance, onRefresh]);

    return (
        <div className="relative">
            {/* Pull indicator */}
            <motion.div
                className="absolute -top-12 left-0 right-0 flex justify-center"
                animate={{
                    y: pullDistance,
                    opacity: pullDistance > 20 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
                <motion.div
                    animate={{
                        rotate: isRefreshing ? 360 : pullDistance * 3,
                    }}
                    transition={{
                        duration: isRefreshing ? 1 : 0,
                        repeat: isRefreshing ? Infinity : 0,
                        ease: 'linear',
                    }}
                    className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                />
            </motion.div>

            {/* Content */}
            <motion.div
                animate={{
                    y: isRefreshing ? 40 : pullDistance * 0.5,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
                {children}
            </motion.div>
        </div>
    );
}