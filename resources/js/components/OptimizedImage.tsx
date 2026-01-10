import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    placeholder?: string; // Base64 blur placeholder
    aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
    priority?: boolean; // Load immediately without lazy loading
    sizes?: string; // Responsive sizes attribute
    srcSet?: string; // Responsive srcset
    onLoadingComplete?: () => void;
}

export function OptimizedImage({
    src,
    alt,
    placeholder,
    aspectRatio = 'auto',
    priority = false,
    sizes,
    srcSet,
    className,
    onLoadingComplete,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Aspect ratio classes
    const aspectRatioClasses = {
        square: 'aspect-square',
        '16/9': 'aspect-video',
        '4/3': 'aspect-4/3',
        '3/2': 'aspect-3/2',
        auto: '',
    };

    useEffect(() => {
        // Skip lazy loading for priority images
        if (priority) {
            setIsInView(true);
            return;
        }

        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before entering viewport
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    // Preload image when in view
    useEffect(() => {
        if (!isInView || isLoaded) return;

        const img = new Image();

        // Set sizes and srcSet if provided
        if (sizes) img.sizes = sizes;
        if (srcSet) img.srcset = srcSet;

        img.src = src;

        img.onload = () => {
            setIsLoaded(true);
            setError(false);
            onLoadingComplete?.();
        };

        img.onerror = () => {
            setError(true);
            setIsLoaded(true);
        };

        // For priority images, set loading="eager"
        if (imgRef.current && priority) {
            imgRef.current.loading = 'eager';
            imgRef.current.fetchPriority = 'high';
        }
    }, [isInView, src, srcSet, sizes, isLoaded, priority, onLoadingComplete]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
                aspectRatioClasses[aspectRatio],
                className
            )}
        >
            {/* Blur placeholder */}
            {placeholder && !isLoaded && (
                <div
                    className="absolute inset-0 scale-110 blur-xl"
                    style={{
                        backgroundImage: `url(${placeholder})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            {/* Skeleton loader if no placeholder */}
            {!placeholder && !isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center p-4">
                        <svg
                            className="w-12 h-12 mx-auto text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-xs text-gray-500">Failed to load image</p>
                    </div>
                </div>
            )}

            {/* Actual image */}
            {isInView && !error && (
                <motion.img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    sizes={sizes}
                    srcSet={srcSet}
                    loading={priority ? 'eager' : 'lazy'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn(
                        'w-full h-full object-cover',
                        isLoaded ? '' : 'invisible'
                    )}
                    {...props}
                />
            )}
        </div>
    );
}

// Component for responsive images with multiple sources
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'srcSet' | 'sizes'> {
    sources: {
        media?: string;
        srcSet: string;
        type?: string;
    }[];
}

export function ResponsiveImage({ sources, ...props }: ResponsiveImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate srcSet and sizes from sources
    const srcSet = sources.map(s => s.srcSet).join(', ');
    const sizes = sources
        .filter(s => s.media)
        .map(s => `${s.media} ${s.srcSet.split(' ')[0]}`)
        .join(', ');

    return (
        <picture>
            {sources.map((source, index) => (
                <source
                    key={index}
                    media={source.media}
                    srcSet={source.srcSet}
                    type={source.type}
                />
            ))}
            <OptimizedImage
                {...props}
                srcSet={srcSet}
                sizes={sizes}
                onLoadingComplete={() => setIsLoaded(true)}
            />
        </picture>
    );
}

// Hook for generating blur placeholders
export function useBlurPlaceholder(src: string): string | undefined {
    const [placeholder, setPlaceholder] = useState<string>();

    useEffect(() => {
        // This would typically be generated on the server
        // For now, we'll create a simple gradient placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Create a simple gradient based on the image URL hash
            const hash = src.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);

            const gradient = ctx.createLinearGradient(0, 0, 10, 10);
            gradient.addColorStop(0, `hsl(${Math.abs(hash) % 360}, 50%, 70%)`);
            gradient.addColorStop(1, `hsl(${Math.abs(hash * 2) % 360}, 50%, 50%)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 10, 10);

            setPlaceholder(canvas.toDataURL());
        }
    }, [src]);

    return placeholder;
}

// Gallery component with optimized loading
interface ImageGalleryProps {
    images: { src: string; alt: string }[];
    className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && selectedIndex < images.length - 1) {
                // Swipe left - next image
                setSelectedIndex(selectedIndex + 1);
            } else if (diff < 0 && selectedIndex > 0) {
                // Swipe right - previous image
                setSelectedIndex(selectedIndex - 1);
            }
        }
    };

    return (
        <div className={cn('relative', className)}>
            <div
                className="overflow-hidden rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <motion.div
                    className="flex"
                    animate={{ x: `-${selectedIndex * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                            <OptimizedImage
                                src={image.src}
                                alt={image.alt}
                                aspectRatio="16/9"
                                priority={index === 0}
                                className="w-full"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all',
                                index === selectedIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50'
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}