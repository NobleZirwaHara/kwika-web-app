import { Heart, Check, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/contexts/WishlistContext'

type ItemType = 'provider' | 'package' | 'service'

interface WishlistButtonProps {
  itemType: ItemType
  itemId: number
  variant?: 'default' | 'small' | 'detail'
  className?: string
}

export function WishlistButton({
  itemType,
  itemId,
  variant = 'default',
  className,
}: WishlistButtonProps) {
  const {
    wishlists,
    isProviderWishlisted,
    isPackageWishlisted,
    isServiceWishlisted,
    toggleProvider,
    togglePackage,
    toggleService,
    addProvider,
    addPackage,
    addService,
  } = useWishlist()

  const [isLoading, setIsLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLButtonElement>(null)

  // Check if item is wishlisted based on type
  const isWishlisted = (() => {
    switch (itemType) {
      case 'provider':
        return isProviderWishlisted(itemId)
      case 'package':
        return isPackageWishlisted(itemId)
      case 'service':
        return isServiceWishlisted(itemId)
      default:
        return false
    }
  })()

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    // If already wishlisted, just remove it (toggle off)
    if (isWishlisted) {
      setIsLoading(true)
      try {
        switch (itemType) {
          case 'provider':
            await toggleProvider(itemId)
            break
          case 'package':
            await togglePackage(itemId)
            break
          case 'service':
            await toggleService(itemId)
            break
        }
      } catch (error) {
        console.error('Failed to remove from wishlist:', error)
      } finally {
        setIsLoading(false)
      }
      return
    }

    // If adding and there are multiple wishlists, show picker
    if (wishlists.length > 1) {
      setShowPicker(true)
      return
    }

    // Otherwise, add to default wishlist
    setIsLoading(true)
    try {
      switch (itemType) {
        case 'provider':
          await toggleProvider(itemId)
          break
        case 'package':
          await togglePackage(itemId)
          break
        case 'service':
          await toggleService(itemId)
          break
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async (wishlistId: number) => {
    setShowPicker(false)
    setIsLoading(true)

    try {
      let success = false
      switch (itemType) {
        case 'provider':
          success = await addProvider(itemId, wishlistId)
          break
        case 'package':
          success = await addPackage(itemId, wishlistId)
          break
        case 'service':
          success = await addService(itemId, wishlistId)
          break
      }

      if (!success) {
        console.error('Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
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
    <>
      <button
        ref={pickerRef}
        onClick={handleClick}
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
            "transition-all duration-200",
            isWishlisted
              ? "text-rose-500 fill-rose-500"
              : "text-gray-600 hover:text-rose-500"
          )}
        />
      </button>

      {/* Wishlist Picker Dropdown */}
      {showPicker && (
        <div
          className="fixed z-[100] w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
          style={{
            top: pickerRef.current ? pickerRef.current.getBoundingClientRect().bottom + 8 : 0,
            right: pickerRef.current ? window.innerWidth - pickerRef.current.getBoundingClientRect().right : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Save to wishlist</p>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {wishlists.map((wishlist) => (
              <button
                key={wishlist.id}
                onClick={() => handleAddToWishlist(wishlist.id)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
              >
                <span className="text-sm truncate flex-1">{wishlist.name}</span>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Legacy export for backward compatibility - maps old serviceId prop to new format
interface LegacyWishlistButtonProps {
  serviceId: number
  isAuthenticated?: boolean
  variant?: 'default' | 'small' | 'detail'
  className?: string
}

export function LegacyWishlistButton({
  serviceId,
  isAuthenticated,
  variant = 'default',
  className
}: LegacyWishlistButtonProps) {
  return (
    <WishlistButton
      itemType="service"
      itemId={serviceId}
      variant={variant}
      className={className}
    />
  )
}
