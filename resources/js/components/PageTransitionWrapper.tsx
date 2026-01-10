import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

interface PageTransitionWrapperProps {
    children: ReactNode;
    mode?: 'slide' | 'fade' | 'scale' | 'none';
    className?: string;
}

// Production-grade transition variants
const transitions = {
    slide: {
        initial: { x: 30, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -30, opacity: 0 },
        transition: {
            type: 'spring',
            stiffness: 380,
            damping: 30,
        }
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: {
            duration: 0.2,
            ease: 'easeInOut'
        }
    },
    scale: {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.05, opacity: 0 },
        transition: {
            type: 'spring',
            stiffness: 380,
            damping: 25,
        }
    },
    none: {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 }
    }
};

// Mobile-optimized transitions (faster, snappier)
const mobileTransitions = {
    slide: {
        initial: { x: '100%', opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-20%', opacity: 0.8 },
        transition: {
            type: 'spring',
            stiffness: 450,
            damping: 40,
            mass: 0.8,
        }
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: {
            duration: 0.15,
            ease: 'easeInOut'
        }
    },
    scale: {
        initial: { scale: 0.92, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.95, opacity: 0, y: -10 },
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 35,
        }
    },
    none: {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 }
    }
};

export function PageTransitionWrapper({
    children,
    mode = 'slide',
    className = ''
}: PageTransitionWrapperProps) {
    const [isNavigating, setIsNavigating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Listen to Inertia navigation events
        const removeStartListener = router.on('start', () => {
            setIsNavigating(true);
        });

        const removeFinishListener = router.on('finish', () => {
            setIsNavigating(false);
            // Trigger haptic feedback on mobile
            if ('vibrate' in navigator && isMobile) {
                navigator.vibrate(10);
            }
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            removeStartListener();
            removeFinishListener();
        };
    }, [isMobile]);

    const selectedTransitions = isMobile ? mobileTransitions : transitions;
    const variant = selectedTransitions[mode];

    return (
        <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={variant.transition}
            className={className}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
}

// Hook to programmatically trigger transitions
export function usePageTransition() {
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        const removeStartListener = router.on('start', () => {
            setTransitioning(true);
        });

        const removeFinishListener = router.on('finish', () => {
            setTransitioning(false);
        });

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return { transitioning };
}

// Shared element transition for hero images
interface SharedImageTransitionProps {
    src: string;
    alt: string;
    layoutId: string;
    className?: string;
    priority?: boolean;
}

export function SharedImageTransition({
    src,
    alt,
    layoutId,
    className = '',
    priority = false
}: SharedImageTransitionProps) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (priority) {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoaded(true);
        }
    }, [src, priority]);

    return (
        <motion.div
            layoutId={layoutId}
            className={`relative ${className}`}
            transition={{
                type: 'spring',
                stiffness: 380,
                damping: 25,
            }}
        >
            <AnimatePresence>
                {!loaded && priority && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
                    />
                )}
            </AnimatePresence>
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
}