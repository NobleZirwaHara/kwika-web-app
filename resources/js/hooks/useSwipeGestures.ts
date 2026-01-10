import { useRef, useEffect, RefObject } from 'react';
import { router } from '@inertiajs/react';

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

interface UseSwipeOptions {
    threshold?: number; // Minimum distance for swipe
    velocity?: number; // Minimum velocity for swipe
    preventDefaultOnSwipe?: boolean;
    enableHapticFeedback?: boolean;
}

export function useSwipe(
    handlers: SwipeHandlers,
    options: UseSwipeOptions = {}
): RefObject<HTMLDivElement> {
    const {
        threshold = 50,
        velocity = 0.3,
        preventDefaultOnSwipe = true,
        enableHapticFeedback = true,
    } = options;

    const ref = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            touchStartRef.current = {
                x: touchStartX,
                y: touchStartY,
                time: touchStartTime,
            };
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartRef.current) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const dx = touchEndX - touchStartRef.current.x;
            const dy = touchEndY - touchStartRef.current.y;

            // Prevent default scrolling for horizontal swipes
            if (Math.abs(dx) > Math.abs(dy) && preventDefaultOnSwipe) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const dx = touchEndX - touchStartRef.current.x;
            const dy = touchEndY - touchStartRef.current.y;
            const dt = touchEndTime - touchStartRef.current.time;
            const vx = Math.abs(dx) / dt;
            const vy = Math.abs(dy) / dt;

            const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
            const isVerticalSwipe = Math.abs(dy) > Math.abs(dx);

            // Check if swipe meets threshold and velocity
            if (isHorizontalSwipe && Math.abs(dx) > threshold && vx > velocity) {
                if (dx > 0 && handlers.onSwipeRight) {
                    if (enableHapticFeedback && 'vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                    handlers.onSwipeRight();
                } else if (dx < 0 && handlers.onSwipeLeft) {
                    if (enableHapticFeedback && 'vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                    handlers.onSwipeLeft();
                }
            }

            if (isVerticalSwipe && Math.abs(dy) > threshold && vy > velocity) {
                if (dy > 0 && handlers.onSwipeDown) {
                    if (enableHapticFeedback && 'vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                    handlers.onSwipeDown();
                } else if (dy < 0 && handlers.onSwipeUp) {
                    if (enableHapticFeedback && 'vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                    handlers.onSwipeUp();
                }
            }

            touchStartRef.current = null;
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handlers, threshold, velocity, preventDefaultOnSwipe, enableHapticFeedback]);

    return ref;
}

// Hook for swipe-to-go-back navigation
export function useSwipeBack() {
    const ref = useSwipe({
        onSwipeRight: () => {
            if (window.history.length > 1) {
                router.visit(window.history.back() as any);
            }
        },
    }, {
        threshold: 75,
        velocity: 0.5,
    });

    return ref;
}

// Hook for swipe-to-delete with animation
interface UseSwipeToDeleteOptions {
    onDelete: () => void;
    deleteThreshold?: number;
}

export function useSwipeToDelete({ onDelete, deleteThreshold = 100 }: UseSwipeToDeleteOptions) {
    const ref = useRef<HTMLDivElement>(null);
    const translateXRef = useRef(0);
    const isDeletedRef = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let touchStartX = 0;
        let currentTranslateX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            currentTranslateX = translateXRef.current;
            element.style.transition = 'none';
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touchX = e.touches[0].clientX;
            const dx = touchX - touchStartX;
            const newTranslateX = currentTranslateX + dx;

            // Only allow swiping left
            if (newTranslateX <= 0 && newTranslateX >= -deleteThreshold * 2) {
                translateXRef.current = newTranslateX;
                element.style.transform = `translateX(${newTranslateX}px)`;

                // Show delete background
                const deleteProgress = Math.min(Math.abs(newTranslateX) / deleteThreshold, 1);
                element.style.backgroundColor = `rgba(239, 68, 68, ${deleteProgress * 0.2})`;
            }
        };

        const handleTouchEnd = () => {
            element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

            if (Math.abs(translateXRef.current) > deleteThreshold) {
                // Trigger delete
                if (!isDeletedRef.current) {
                    isDeletedRef.current = true;
                    element.style.transform = `translateX(-100%)`;
                    element.style.opacity = '0';

                    // Haptic feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate([20, 10, 20]);
                    }

                    setTimeout(() => {
                        onDelete();
                    }, 300);
                }
            } else {
                // Snap back
                translateXRef.current = 0;
                element.style.transform = 'translateX(0)';
                element.style.backgroundColor = 'transparent';
            }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onDelete, deleteThreshold]);

    return ref;
}

// Hook for long press
interface UseLongPressOptions {
    onLongPress: () => void;
    delay?: number;
    enableHapticFeedback?: boolean;
}

export function useLongPress({
    onLongPress,
    delay = 500,
    enableHapticFeedback = true,
}: UseLongPressOptions) {
    const ref = useRef<HTMLElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleTouchStart = () => {
            timeoutRef.current = setTimeout(() => {
                if (enableHapticFeedback && 'vibrate' in navigator) {
                    navigator.vibrate(50);
                }
                onLongPress();
            }, delay);
        };

        const handleTouchEnd = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        const handleTouchMove = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);
        element.addEventListener('touchmove', handleTouchMove);
        element.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('touchmove', handleTouchMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [onLongPress, delay, enableHapticFeedback]);

    return ref;
}

// Hook for pinch-to-zoom
interface UsePinchToZoomOptions {
    minScale?: number;
    maxScale?: number;
}

export function usePinchToZoom({
    minScale = 1,
    maxScale = 3,
}: UsePinchToZoomOptions = {}) {
    const ref = useRef<HTMLElement>(null);
    const scaleRef = useRef(1);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let initialDistance = 0;
        let initialScale = 1;

        const getDistance = (touches: TouchList) => {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches);
                initialScale = scaleRef.current;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches);
                const scale = (currentDistance / initialDistance) * initialScale;

                // Clamp scale
                scaleRef.current = Math.min(Math.max(scale, minScale), maxScale);
                element.style.transform = `scale(${scaleRef.current})`;
            }
        };

        const handleTouchEnd = () => {
            // Snap back to normal if close to 1
            if (Math.abs(scaleRef.current - 1) < 0.1) {
                scaleRef.current = 1;
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'scale(1)';
                setTimeout(() => {
                    element.style.transition = '';
                }, 300);
            }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [minScale, maxScale]);

    return ref;
}

// Hook for haptic feedback on interactions
export function useHapticFeedback() {
    const light = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const medium = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    };

    const heavy = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([20, 10, 20]);
        }
    };

    const success = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([10, 10, 10, 10, 30]);
        }
    };

    const error = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 20, 50, 20, 50]);
        }
    };

    return { light, medium, heavy, success, error };
}