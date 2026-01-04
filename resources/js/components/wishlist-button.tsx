import { Heart, Plus, Minus } from 'lucide-react'
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Check if item is in a specific wishlist
  const isInWishlist = (wishlistId: number): boolean => {
    const wishlist = wishlists.find(w => w.id === wishlistId)
    if (!wishlist) return false

    switch (itemType) {
      case 'provider':
        return wishlist.provider_ids?.includes(itemId) ?? false
      case 'package':
        return wishlist.package_ids?.includes(itemId) ?? false
      case 'service':
        return wishlist.service_ids?.includes(itemId) ?? false
      default:
        return false
    }
  }

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(target)
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target)

      if (isOutsideButton && isOutsideDropdown) {
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

    // If there are multiple wishlists, always show picker so user can add to other lists
    if (wishlists.length > 1) {
      setShowPicker(true)
      return
    }

    // With only one wishlist, use toggle behavior
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
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleInWishlist = async (wishlistId: number) => {
    setShowPicker(false)
    setIsLoading(true)

    try {
      let success = false
      switch (itemType) {
        case 'provider':
          success = await toggleProvider(itemId, wishlistId)
          break
        case 'package':
          success = await togglePackage(itemId, wishlistId)
          break
        case 'service':
          success = await toggleService(itemId, wishlistId)
          break
      }

      if (!success) {
        console.error('Failed to toggle wishlist item')
      }
    } catch (error) {
      console.error('Failed to toggle wishlist item:', error)
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
        ref={buttonRef}
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
          ref={dropdownRef}
          className="fixed z-[100] w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
          style={{
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
            right: buttonRef.current ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Save to wishlist</p>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {wishlists.map((wishlist) => {
              const isItemInThisWishlist = isInWishlist(wishlist.id)
              return (
                <button
                  key={wishlist.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleInWishlist(wishlist.id)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-center justify-between group transition-colors",
                    isItemInThisWishlist
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn(
                      "text-sm truncate",
                      isItemInThisWishlist ? "text-gray-400" : "text-gray-700"
                    )}>
                      {wishlist.name}
                    </span>
                    {isItemInThisWishlist && (
                      <span className="text-xs text-gray-400">Click to remove</span>
                    )}
                  </div>
                  {isItemInThisWishlist ? (
                    <Minus className="h-4 w-4 text-gray-400 group-hover:text-rose-500 transition-colors flex-shrink-0" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                  )}
                </button>
              )
            })}
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
