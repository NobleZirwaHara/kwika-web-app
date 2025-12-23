import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface CartItem {
  id: number
  product_id: number
  name: string
  slug: string
  image: string | null
  quantity: number
  unit_price: number
  total_price: number
  formatted_unit_price: string
  formatted_total_price: string
  in_stock: boolean
  stock_quantity: number
  provider: {
    id: number
    name: string
    slug: string
  } | null
}

interface Cart {
  id: number | null
  items: CartItem[]
  total_items: number
  subtotal: number
  formatted_subtotal: string
  currency: string
  is_empty: boolean
}

interface CartContextType {
  cart: Cart
  isLoading: boolean
  isAddingToCart: boolean
  addToCart: (productId: number, quantity?: number) => Promise<boolean>
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>
  removeItem: (itemId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refreshCart: () => Promise<void>
}

const defaultCart: Cart = {
  id: null,
  items: [],
  total_items: 0,
  subtotal: 0,
  formatted_subtotal: 'MWK 0',
  currency: 'MWK',
  is_empty: true,
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const refreshCart = useCallback(async () => {
    try {
      const response = await fetch('/cart/data', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(async (productId: number, quantity: number = 1): Promise<boolean> => {
    setIsAddingToCart(true)
    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ product_id: productId, quantity }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCart(data.cart)
        return true
      } else {
        console.error('Failed to add to cart:', data.message)
        return false
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      return false
    } finally {
      setIsAddingToCart(false)
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: number, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCart(data.cart)
        return true
      } else {
        console.error('Failed to update cart:', data.message)
        return false
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
      return false
    }
  }, [])

  const removeItem = useCallback(async (itemId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/cart/items/${itemId}`, {
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
        setCart(data.cart)
        return true
      } else {
        console.error('Failed to remove item:', data.message)
        return false
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      return false
    }
  }, [])

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/cart/clear', {
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
        setCart(data.cart)
        return true
      } else {
        console.error('Failed to clear cart:', data.message)
        return false
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      return false
    }
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isAddingToCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Helper to get CSRF token from cookie
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
