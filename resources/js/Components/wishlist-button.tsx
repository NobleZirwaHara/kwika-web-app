import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  serviceId: number
  isAuthenticated?: boolean
  variant?: 'default' | 'small' | 'detail'
  className?: string
}

export function WishlistButton({
  serviceId,
  isAuthenticated = false,
  variant = 'default',
  className
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus()
    }
  }, [serviceId, isAuthenticated])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${serviceId}`)
      const data = await response.json()
      setIsWishlisted(data.isWishlisted)
    } catch (error) {
      console.error('Failed to check wishlist status:', error)
    }
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login
      router.visit('/login', {
        data: {
          redirect: window.location.pathname
        },
      })
      return
    }

    setIsLoading(true)

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/wishlist/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          setIsWishlisted(false)
          // Show success message (you can add a toast notification here)
        }
      } else {
        // Add to wishlist
        const response = await fetch('/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ service_id: serviceId }),
        })

        if (response.ok) {
          setIsWishlisted(true)
          // Show success message (you can add a toast notification here)
        }
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Variant styles
  const variants = {
    default: cn(
      "h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg",
      "hover:bg-white hover:scale-110",
      "transition-all duration-200 cursor-pointer",
      "flex items-center justify-center"
    ),
    small: cn(
      "h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md",
      "hover:bg-white hover:scale-105",
      "transition-all duration-200 cursor-pointer",
      "flex items-center justify-center"
    ),
    detail: cn(
      "h-12 w-12 rounded-full bg-white border-2 border-gray-200",
      "hover:border-primary hover:scale-105",
      "transition-all duration-200 cursor-pointer",
      "flex items-center justify-center shadow-md"
    ),
  }

  const iconSizes = {
    default: "h-5 w-5",
    small: "h-4 w-4",
    detail: "h-6 w-6",
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={cn(
        variants[variant],
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          iconSizes[variant],
          isWishlisted
            ? "text-rose-500 fill-rose-500"
            : "text-gray-600 hover:text-rose-500"
        )}
      />
    </button>
  )
}
