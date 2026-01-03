import { Head, Link, usePage } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import {
  LayoutDashboard,
  Settings,
  Menu,
  LogOut,
  HelpCircle,
  Calendar,
  MessageSquare,
  Heart,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface CustomerLayoutProps {
  children: ReactNode
  title: string
}

const primaryNavigation = [
  // { name: 'Overview', href: '/user/dashboard', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/user/bookings', icon: Calendar },
  { name: 'Messages', href: '/user/messages', icon: MessageSquare },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
]

const menuNavigation = [
  { name: 'Profile Settings', href: '/user/profile', icon: Settings },
]

export default function CustomerLayout({ children, title }: CustomerLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const { auth } = usePage().props as any
  const user = auth?.user

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const isActive = (href: string) => {
    if (href === '/user/dashboard') {
      return currentPath === href
    }
    return currentPath.startsWith(href)
  }

  return (
    <>
      <Head title={title} />

      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex h-20 items-center justify-between">
              {/* Left: Logo */}
              <Link href="/" className="flex items-center cursor-pointer">
                <img src="/kwika-logo.png" alt="Kwika Events" className="h-10 w-auto" />
              </Link>

              {/* Center: Primary Navigation (Desktop) */}
              <nav className="hidden md:flex items-center gap-1">
                {primaryNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-semibold transition-colors hover:text-foreground cursor-pointer",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </div>
                      {active && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Right: User Controls */}
              <div className="flex items-center gap-4">
                {/* Role Switch Link */}
                {user?.is_provider ? (
                  <Link
                    href="/provider/dashboard"
                    className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    Switch to Provider
                  </Link>
                ) : (
                  <Link
                    href="/onboarding/welcome"
                    className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    Become a Provider
                  </Link>
                )}

                {/* User Avatar */}
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-border">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(true)}
                  className="cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-2 px-2">
              {primaryNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex-shrink-0 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </div>
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 lg:px-12 py-8">
          {children}
        </main>

        {/* Slide-out Menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="right" className="w-[400px] sm:w-[400px] rounded-l-2xl">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            </SheetHeader>

            {/* Featured Card - Optional promotional content */}
            <div className="mb-6 rounded-xl bg-muted p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <div className="w-20 h-20 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Discover Services</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Browse hundreds of event services and products for your next celebration.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/">Browse Services</Link>
              </Button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {menuNavigation.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                )
              })}

              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Help Center</span>
              </Link>

              <div className="border-t border-border my-4" />

              <Link
                href="/logout"
                method="post"
                as="button"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer w-full text-left"
                onClick={() => setMenuOpen(false)}
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Log out</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
