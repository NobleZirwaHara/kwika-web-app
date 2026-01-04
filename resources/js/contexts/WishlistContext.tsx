import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// ==================== Types ====================

interface WishlistProvider {
  id: number
  type: 'provider'
  item_id: number
  business_name: string
  slug: string
  logo: string | null
  city: string | null
  average_rating: number | null
  total_reviews: number
  is_verified: boolean
  notes: string | null
  added_at: string
  exists: boolean
}

interface WishlistPackage {
  id: number
  type: 'package'
  item_id: number
  name: string
  slug: string
  description: string | null
  final_price: number
  currency: string
  primary_image: string | null
  package_type: 'tier' | 'bundle'
  provider: {
    id: number
    business_name: string
    slug: string
  } | null
  notes: string | null
  added_at: string
  exists: boolean
}

interface WishlistService {
  id: number
  type: 'service'
  item_id: number
  name: string
  slug: string
  description: string | null
  base_price: number
  price_type: string
  currency: string
  primary_image: string | null
  provider: {
    id: number
    business_name: string
    slug: string
  } | null
  notes: string | null
  added_at: string
  exists: boolean
}

interface WishlistData {
  id: number
  name: string
  slug: string
  is_default: boolean
  provider_count: number
  package_count: number
  service_count: number
  total_items: number
  total_package_price: number
  formatted_total: string
  created_at: string
  // Item IDs for quick lookup
  provider_ids: number[]
  package_ids: number[]
  service_ids: number[]
  // Full item details (only when loaded)
  providers?: WishlistProvider[]
  packages?: WishlistPackage[]
  services?: WishlistService[]
}

interface WishlistIds {
  providerIds: number[]
  packageIds: number[]
  serviceIds: number[]
  customPackageIds: number[]
}

interface CustomPackageService {
  service_id: number
  service_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface AddCustomPackageData {
  wishlist_id: number
  provider_id: number
  name?: string
  services: CustomPackageService[]
  total_amount: number
  currency?: string
}

interface WishlistContextType {
  wishlists: WishlistData[]
  defaultWishlist: WishlistData | null
  isLoading: boolean
  isGuest: boolean
  wishlistIds: WishlistIds

  // Check methods
  isProviderWishlisted: (id: number) => boolean
  isPackageWishlisted: (id: number) => boolean
  isServiceWishlisted: (id: number) => boolean

  // Toggle methods (add if not present, remove if present)
  toggleProvider: (id: number, wishlistId?: number) => Promise<boolean>
  togglePackage: (id: number, wishlistId?: number) => Promise<boolean>
  toggleService: (id: number, wishlistId?: number) => Promise<boolean>

  // Add methods
  addProvider: (id: number, wishlistId?: number) => Promise<boolean>
  addPackage: (id: number, wishlistId?: number) => Promise<boolean>
  addService: (id: number, wishlistId?: number) => Promise<boolean>
  addCustomPackage: (data: AddCustomPackageData) => Promise<{ success: boolean; customPackageId?: number }>

  // Management
  removeItem: (itemId: number) => Promise<boolean>
  moveItem: (itemId: number, wishlistId: number) => Promise<boolean>
  createWishlist: (name: string) => Promise<WishlistData | null>
  deleteWishlist: (wishlistId: number) => Promise<boolean>
  renameWishlist: (wishlistId: number, name: string) => Promise<boolean>

  refreshWishlists: () => Promise<void>
  refreshIds: () => Promise<void>
}

const defaultIds: WishlistIds = {
  providerIds: [],
  packageIds: [],
  serviceIds: [],
  customPackageIds: [],
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// ==================== Provider ====================

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<WishlistData[]>([])
  const [wishlistIds, setWishlistIds] = useState<WishlistIds>(defaultIds)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(true)

  const refreshIds = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist/ids', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      })

      if (response.ok) {
        const data = await response.json()
        // Ensure arrays (PHP can return objects if array keys are non-sequential)
        const toArray = (val: unknown): number[] => Array.isArray(val) ? val : Object.values(val || {})
        setWishlistIds({
          providerIds: toArray(data.providerIds),
          packageIds: toArray(data.packageIds),
          serviceIds: toArray(data.serviceIds),
          customPackageIds: toArray(data.customPackageIds),
        })
      }
    } catch (error) {
      console.error('Failed to fetch wishlist IDs:', error)
    }
  }, [])

  const refreshWishlists = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist/data', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      })

      if (response.ok) {
        const data = await response.json()
        setWishlists(data.wishlists || [])
        setIsGuest(data.isGuest ?? true)
      }
    } catch (error) {
      console.error('Failed to fetch wishlists:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.all([refreshWishlists(), refreshIds()])
  }, [refreshWishlists, refreshIds])

  // Get default wishlist
  const defaultWishlist = wishlists.find(w => w.is_default) || wishlists[0] || null

  // Check methods
  const isProviderWishlisted = useCallback((id: number) => {
    return wishlistIds.providerIds.includes(id)
  }, [wishlistIds.providerIds])

  const isPackageWishlisted = useCallback((id: number) => {
    return wishlistIds.packageIds.includes(id)
  }, [wishlistIds.packageIds])

  const isServiceWishlisted = useCallback((id: number) => {
    return wishlistIds.serviceIds.includes(id)
  }, [wishlistIds.serviceIds])

  // Toggle methods
  const toggleProvider = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/toggle/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state
        if (data.isWishlisted) {
          setWishlistIds(prev => ({
            ...prev,
            providerIds: [...prev.providerIds, id],
          }))
        } else {
          setWishlistIds(prev => ({
            ...prev,
            providerIds: prev.providerIds.filter(pid => pid !== id),
          }))
        }
        // Refresh wishlists to get updated counts
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to toggle provider:', error)
      return false
    }
  }, [refreshWishlists])

  const togglePackage = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/toggle/package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.isWishlisted) {
          setWishlistIds(prev => ({
            ...prev,
            packageIds: [...prev.packageIds, id],
          }))
        } else {
          setWishlistIds(prev => ({
            ...prev,
            packageIds: prev.packageIds.filter(pid => pid !== id),
          }))
        }
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to toggle package:', error)
      return false
    }
  }, [refreshWishlists])

  const toggleService = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/toggle/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.isWishlisted) {
          setWishlistIds(prev => ({
            ...prev,
            serviceIds: [...prev.serviceIds, id],
          }))
        } else {
          setWishlistIds(prev => ({
            ...prev,
            serviceIds: prev.serviceIds.filter(sid => sid !== id),
          }))
        }
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to toggle service:', error)
      return false
    }
  }, [refreshWishlists])

  // Add methods
  const addProvider = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setWishlistIds(prev => ({
          ...prev,
          providerIds: [...prev.providerIds, id],
        }))
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add provider:', error)
      return false
    }
  }, [refreshWishlists])

  const addPackage = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setWishlistIds(prev => ({
          ...prev,
          packageIds: [...prev.packageIds, id],
        }))
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add package:', error)
      return false
    }
  }, [refreshWishlists])

  const addService = useCallback(async (id: number, wishlistId?: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id, wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setWishlistIds(prev => ({
          ...prev,
          serviceIds: [...prev.serviceIds, id],
        }))
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add service:', error)
      return false
    }
  }, [refreshWishlists])

  const addCustomPackage = useCallback(async (data: AddCustomPackageData): Promise<{ success: boolean; customPackageId?: number }> => {
    try {
      const response = await fetch('/api/wishlist/custom-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setWishlistIds(prev => ({
          ...prev,
          customPackageIds: [...prev.customPackageIds, result.custom_package_id],
        }))
        refreshWishlists()
        return { success: true, customPackageId: result.custom_package_id }
      }
      return { success: false }
    } catch (error) {
      console.error('Failed to add custom package:', error)
      return { success: false }
    }
  }, [refreshWishlists])

  // Management methods
  const removeItem = useCallback(async (itemId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/wishlist/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await Promise.all([refreshWishlists(), refreshIds()])
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove item:', error)
      return false
    }
  }, [refreshWishlists, refreshIds])

  const moveItem = useCallback(async (itemId: number, wishlistId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/wishlist/item/${itemId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ wishlist_id: wishlistId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to move item:', error)
      return false
    }
  }, [refreshWishlists])

  const createWishlist = useCallback(async (name: string): Promise<WishlistData | null> => {
    try {
      const response = await fetch('/wishlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        refreshWishlists()
        return data.wishlist
      }
      return null
    } catch (error) {
      console.error('Failed to create wishlist:', error)
      return null
    }
  }, [refreshWishlists])

  const deleteWishlist = useCallback(async (wishlistId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/wishlist/${wishlistId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await Promise.all([refreshWishlists(), refreshIds()])
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to delete wishlist:', error)
      return false
    }
  }, [refreshWishlists, refreshIds])

  const renameWishlist = useCallback(async (wishlistId: number, name: string): Promise<boolean> => {
    try {
      const response = await fetch(`/wishlist/${wishlistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        refreshWishlists()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to rename wishlist:', error)
      return false
    }
  }, [refreshWishlists])

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        defaultWishlist,
        isLoading,
        isGuest,
        wishlistIds,
        isProviderWishlisted,
        isPackageWishlisted,
        isServiceWishlisted,
        toggleProvider,
        togglePackage,
        toggleService,
        addProvider,
        addPackage,
        addService,
        addCustomPackage,
        removeItem,
        moveItem,
        createWishlist,
        deleteWishlist,
        renameWishlist,
        refreshWishlists,
        refreshIds,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// ==================== Hook ====================

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

// ==================== Helper ====================

function getCsrfToken(): string {
  const name = 'XSRF-TOKEN='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length)
    }
  }
  return ''
}
