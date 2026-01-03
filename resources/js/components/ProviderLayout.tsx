import { Head, Link, usePage } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Settings,
  Menu,
  LogOut,
  Building2,
  HelpCircle,
  Calendar,
  MessageSquare,
  ListChecks,
  Boxes
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

interface ProviderLayoutProps {
  children: ReactNode
  title: string
  provider?: {
    business_name: string
    logo?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
  }
}

const primaryNavigation = [
  { name: 'Overview', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/provider/listings', icon: ListChecks },
  { name: 'Packages', href: '/provider/packages', icon: Boxes },
  { name: 'Bookings', href: '/provider/bookings', icon: Calendar },
  { name: 'Messages', href: '/provider/messages', icon: MessageSquare },
]

const menuNavigation = [
  { name: 'Companies', href: '/provider/companies', icon: Building2 },
  { name: 'Promotions', href: '/provider/promotions', icon: Package },
  { name: 'Profile Settings', href: '/provider/settings', icon: Settings },
]

export default function ProviderLayout({ children, title, provider }: ProviderLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const { auth } = usePage().props as any
  const user = auth?.user

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const isActive = (href: string) => {
    if (href === '/provider/dashboard') {
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
              <Link href="/provider/dashboard" className="flex items-center cursor-pointer">
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
                {/* Switch to Customer Link */}
                <Link
                  href="/"
                  className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Switch to Customer
                </Link>

                {/* User Avatar */}
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-border">
                  <AvatarImage src={user?.avatar || provider?.logo || undefined} alt={user?.name || provider?.business_name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getInitials(user.name) : provider?.business_name ? getInitials(provider.business_name) : 'PR'}
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
                  <LayoutDashboard className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">New to Kwika?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Discover tips and best practices to grow your business.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Get started
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

              {/* Additional Menu Items */}
              <Link
                href="/provider/settings"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Account settings</span>
              </Link>

              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Get help</span>
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
