import { Button } from "@/Components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  productId: number
  quantity?: number
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  disabled?: boolean
  inStock?: boolean
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  variant = "default",
  size = "default",
  showText = true,
  disabled = false,
  inStock = true,
}: AddToCartButtonProps) {
  const { addToCart, isAddingToCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled || !inStock || isAddingToCart) return

    const success = await addToCart(productId, quantity)

    if (success) {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    }
  }

  if (!inStock) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={cn("cursor-not-allowed opacity-60", className)}
        disabled
      >
        Out of Stock
      </Button>
    )
  }

  return (
    <Button
      variant={justAdded ? "secondary" : variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        justAdded && "bg-green-500 hover:bg-green-500 text-white",
        className
      )}
      onClick={handleAddToCart}
      disabled={disabled || isAddingToCart}
    >
      {isAddingToCart ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && <span className="ml-2">Adding...</span>}
        </>
      ) : justAdded ? (
        <>
          <Check className="h-4 w-4" />
          {showText && <span className="ml-2">Added!</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {showText && <span className="ml-2">Add to Cart</span>}
        </>
      )}
    </Button>
  )
}
