import { Head, Link, router } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Images,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Building2,
  FolderOpen,
  ShoppingBag,
  Briefcase,
  Box,
  ClipboardList,
  BarChart
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface ProviderLayoutProps {
  children: ReactNode
  title: string
  provider?: {
    business_name: string
    logo?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
  }
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'Companies', href: '/provider/companies', icon: Building2 },
  { name: 'Service Catalogues', href: '/provider/service-catalogues', icon: FolderOpen },
  { name: 'Product Catalogues', href: '/provider/product-catalogues', icon: ShoppingBag },
  { name: 'Products', href: '/provider/products', icon: Box },
  { name: 'Services', href: '/provider/services', icon: Briefcase },
  { name: 'Promotions', href: '/provider/promotions', icon: Package },
  { name: 'Events', href: '/provider/events', icon: Calendar },
  { name: 'Media Gallery', href: '/provider/media', icon: Images },
  { name: 'Pricing', href: '/provider/pricing', icon: DollarSign },
  { name: 'Availability', href: '/provider/availability', icon: Calendar },
  { name: 'Bookings', href: '/provider/bookings', icon: ClipboardList },
  { name: 'Analytics', href: '/provider/analytics', icon: BarChart },
  { name: 'Reviews', href: '/provider/reviews', icon: MessageSquare },
  { name: 'Profile Settings', href: '/provider/settings', icon: Settings },
]

export default function ProviderLayout({ children, title, provider }: ProviderLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <>
      <Head title={title} />

      <div className="min-h-screen bg-background">
        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex h-16 items-center px-4 border-b relative">
                <Link href="/" className="flex items-center justify-center gap-2 flex-1 cursor-pointer">
                  <img src="/kwika-logo.png" alt="Kwika Events" className="h-8 w-auto" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath.startsWith(item.href)

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="border-t p-4">
                <button
                  onClick={() => router.post('/logout')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
            {/* Logo */}
            <Link href="/" className="flex h-16 shrink-0 items-center justify-center gap-2 border-b -mx-6 px-6 cursor-pointer">
              <img src="/kwika-logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            {/* Provider Info */}
            {provider && (
              <div className="flex items-center gap-3 -mx-2 px-2 py-3 rounded-lg bg-muted/50">
                {provider.logo ? (
                  <img
                    src={`/storage/${provider.logo}`}
                    alt="Business logo"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{provider.business_name}</p>
                  <Badge
                    variant={
                      provider.verification_status === 'approved'
                        ? 'default'
                        : provider.verification_status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-xs"
                  >
                    {provider.verification_status}
                  </Badge>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath.startsWith(item.href)

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="border-t -mx-6 px-6 py-4">
              <button
                onClick={() => router.post('/logout')}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Breadcrumb or Title */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <h1 className="text-lg font-semibold">{title}</h1>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>

              <Link href="/" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
            </div>
          </div>

          {/* Page Content */}
          <main className="py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
