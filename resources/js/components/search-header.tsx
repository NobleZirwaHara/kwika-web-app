import { Link, usePage, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { CompactSearchBar } from "./compact-search-bar"
import { UserMenu } from "./user-menu"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface SearchHeaderProps {
  categories?: Category[]
  variant?: 'detail' | 'search'
}

export function SearchHeader({ categories = [], variant = 'search' }: SearchHeaderProps) {
  const { auth } = usePage().props as any
  const user = auth?.user
  const isProvider = auth?.user?.is_provider || false
  const isAdmin = auth?.user?.is_admin || false
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md md:shadow-md'
          : 'bg-white dark:bg-background shadow-sm md:shadow-none md:border-b'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-20">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/kwika-logo.png" alt="Logo" width={100} />
          </Link>

          {/* Search Bar - Desktop Only */}
          <CompactSearchBar
            categories={categories}
            className="hidden lg:block transition-all duration-300 absolute left-1/2 -translate-x-1/2 opacity-100 translate-y-0"
          />

          {/* Right Side - Desktop */}
          <div className="flex items-center gap-2 shrink-0">
            {!isProvider && !isAdmin && !user && (
              <Link href="/onboarding/welcome" className="cursor-pointer">
                <Button variant="ghost" className="text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  Become a provider
                </Button>
              </Link>
            )}

            <UserMenu user={user} isProvider={isProvider} isAdmin={isAdmin} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-3 py-3">
          {/* Top row: Back button, Logo (optional), and User Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {variant === 'search' && (
                <Link href="/" className="flex items-center shrink-0">
                  <img src="/kwika-logo.png" alt="Logo" width={70} />
                </Link>
              )}
            </div>
            <UserMenu user={user} isProvider={isProvider} isAdmin={isAdmin} />
          </div>

          {/* Search Bar - Mobile */}
          <CompactSearchBar
            categories={categories}
            className="w-full"
            isMobile={true}
          />
        </div>
      </div>
    </header>
  )
}
