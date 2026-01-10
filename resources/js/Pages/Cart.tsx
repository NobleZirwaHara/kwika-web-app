import { Head, Link } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import AnimatedLayout from '@/layouts/AnimatedLayout'
import {
  ShoppingCart,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

interface CartPageProps {
  cart: {
    id: number | null
    items: Array<{
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
    }>
    total_items: number
    subtotal: number
    formatted_subtotal: string
    currency: string
    is_empty: boolean
  }
}

export default function Cart({ cart: initialCart }: CartPageProps) {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  const displayCart = cart.id ? cart : initialCart

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    await updateQuantity(itemId, newQuantity)
    setUpdatingItems(prev => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    await removeItem(itemId)
    setUpdatingItems(prev => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  return (
    <AnimatedLayout>
      <Head title="Shopping Cart - Kwika Events" />
      <Header />

      <main className="min-h-screen bg-muted/30 pt-8 pb-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Shopping Cart
            {displayCart.total_items > 0 && (
              <span className="text-lg font-normal text-muted-foreground">
                ({displayCart.total_items} {displayCart.total_items === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>

          {displayCart.is_empty ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any products yet.
                </p>
                <Button asChild size="lg">
                  <Link href="/products">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                {displayCart.items.map((item) => (
                  <Card key={item.id} className={`overflow-hidden ${updatingItems.has(item.id) ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.slug}`} className="shrink-0">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-semibold hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          {item.provider && (
                            <Link
                              href={`/providers/${item.provider.slug}`}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              by {item.provider.name}
                            </Link>
                          )}

                          <p className="text-sm text-muted-foreground mt-1">
                            {item.formatted_unit_price} each
                          </p>

                          {!item.in_stock && (
                            <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                              <AlertCircle className="h-4 w-4" />
                              Out of stock
                            </div>
                          )}
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-lg">
                            {item.formatted_total_price}
                          </span>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock_quantity || updatingItems.has(item.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{displayCart.formatted_subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-muted-foreground">Calculated at checkout</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{displayCart.formatted_subtotal}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tax included where applicable
                      </p>
                    </div>

                    <Button className="w-full" size="lg" disabled>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Checkout coming soon. Contact sellers directly for now.
                    </p>

                    <div className="border-t pt-4">
                      <Link href="/products">
                        <Button variant="outline" className="w-full">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </AnimatedLayout>
  )
}
