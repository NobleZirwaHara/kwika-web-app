import { Heart, Plus, Minus } from 'lucide-react'
import { useState, useRef, useEffect, memo } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/contexts/WishlistContext'

type ItemType = 'provider' | 'package' | 'service'

interface WishlistButtonProps {
  itemType: ItemType
  itemId: number
  variant?: 'default' | 'small' | 'detail'
  className?: string
}

function WishlistButtonInner({
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
  } = useWishlist()

  const [isLoading, setIsLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
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
    if (!showPicker) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(target)
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target)

      if (isOutsideButton && isOutsideDropdown) {
        setShowPicker(false)
      }
    }

    const handleScroll = () => {
      setShowPicker(false)
    }

    // Add listeners after a short delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showPicker])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    // If there are multiple wishlists, always show picker so user can add to other lists
    if (wishlists.length > 1) {
      // Calculate position before showing dropdown
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        // Position dropdown below button, aligned to right edge (dropdown extends left)
        const dropdownWidth = 224 // w-56 = 14rem = 224px
        let left = rect.right - dropdownWidth
        // Ensure dropdown doesn't go off-screen on the left
        if (left < 8) left = 8
        setDropdownPosition({
          top: rect.bottom + 8,
          left: left,
        })
      }
      setShowPicker(!showPicker)
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

      {/* Wishlist Picker Dropdown - rendered via Portal to avoid z-index/transform issues */}
      {showPicker && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 99999,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
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
        </div>,
        document.body
      )}
    </>
  )
}

// Memoize to prevent re-renders when context changes but props don't
export const WishlistButton = memo(WishlistButtonInner, (prevProps, nextProps) => {
  return prevProps.itemType === nextProps.itemType &&
         prevProps.itemId === nextProps.itemId &&
         prevProps.variant === nextProps.variant &&
         prevProps.className === nextProps.className
})

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
