import { Button } from "@/components/ui/button"
import { Globe, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { CompactSearchBar } from "./compact-search-bar"
import { UserMenu } from "./user-menu"
import { Link, usePage } from '@inertiajs/react'
import MainTabs from "./MainTabs"
import MobileNavTabs from "./MobileNavTabs"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/CartContext"

export function Header() {
  const { auth } = usePage().props as any
  const user = auth?.user
  const isProvider = auth?.user?.is_provider || false
  const isAdmin = auth?.user?.is_admin || false
  const [isScrolled, setIsScrolled] = useState(false)
  const { cart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`hidden md:block sticky top-0 z-1500 w-full bg-background text-foreground transition-all duration-300 border-b ${
          isScrolled ? "shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-20">
          {/* Main navigation bar */}
          <div className="flex py-[24.5px] items-center justify-between gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/" className="flex items-center ">
                <img src="/kwika-logo.png" alt="Logo" width={100} />
              </a>
            </div>

            {/* Center: Animated transition between Tabs and Search */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <AnimatePresence mode="wait">
                {!isScrolled ? (
                  <motion.div
                    key="tabs"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <MainTabs />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="hidden lg:block"
                  >
                    <CompactSearchBar className="max-w-md" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isProvider && !isAdmin && !user && (
                <Link href="/onboarding/welcome" className="cursor-pointer">
                  <Button variant="ghost" className="hidden lg:flex text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    Become a provider
                  </Button>
                </Link>
              )}

              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.total_items > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {cart.total_items > 99 ? '99+' : cart.total_items}
                    </span>
                  )}
                </Button>
              </Link>

              <UserMenu user={user} isProvider={isProvider} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavTabs />
    </>
  )
}
