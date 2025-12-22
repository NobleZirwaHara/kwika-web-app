import { Button } from "@/Components/ui/button"
import { Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { CompactSearchBar } from "./compact-search-bar"
import { UserMenu } from "./user-menu"
import { Link, usePage } from '@inertiajs/react'
import MainTabs from "./MainTabs"

export function Header() {
  const { auth } = usePage().props as any
  const user = auth?.user
  const isProvider = auth?.user?.is_provider || false
  const isAdmin = auth?.user?.is_admin || false
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-1500 w-full bg-background transition-all duration-300 ${
        isScrolled ? "border-b shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-6 lg:px-20">
        {/* Main navigation bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img src="/kwika-logo.png" alt="Logo" width={80} />
            </a>
          </div>

          {/* Center: Main Tabs (hide when scrolled) */}
          <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
            isScrolled ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
          }`}>
            <MainTabs />
          </div>

          {/* Center: Search (when scrolled) - replaces tabs */}
          <CompactSearchBar
            className={`hidden lg:block transition-all duration-300 absolute left-1/2 -translate-x-1/2 max-w-md ${
              isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isProvider && !isAdmin && !user && (
              <Link href="/onboarding/welcome" className="cursor-pointer">
                <Button variant="ghost" className="hidden lg:flex text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  Become a provider
                </Button>
              </Link>
            )}
            <UserMenu user={user} isProvider={isProvider} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </header>
  )
}
