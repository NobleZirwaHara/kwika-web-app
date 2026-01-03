import { Head, Link, router } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  MessageSquare,
  Package,
  Calendar,
  ShoppingBag,
  Briefcase,
  CreditCard,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  BarChart,
  Tag,
  Crown,
  Shield,
  Activity,
  Layers,
  Mail,
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface AdminLayoutProps {
  children: ReactNode
  title: string
  admin?: {
    id: number
    name: string
    email: string
    admin_role: string
  }
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Service Providers', href: '/admin/service-providers', icon: Building2 },
  { name: 'Verification Queue', href: '/admin/verification-queue', icon: ShieldCheck },
  { name: 'Provider Listings', href: '/admin/provider-listings', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Bookings', href: '/admin/bookings', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag },
  { name: 'Subscription Plans', href: '/admin/subscription-plans', icon: Crown },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  { name: 'Admin Users', href: '/admin/admin-users', icon: Shield },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
  { name: 'Third Party Services', href: '/admin/third-party-services', icon: Server },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children, title, admin }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  function handleLogout() {
    router.post('/logout')
  }

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
              <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')

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
                      <span className="flex-1">{item.name}</span>
                      {item.badge !== undefined && (
                        <Badge variant={isActive ? "secondary" : "outline"}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile User Section */}
              {admin && (
                <div className="border-t p-4">
                  <div className="mb-3">
                    <p className="text-sm font-medium">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {admin.admin_role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
            {/* Logo */}
            <Link href="/" className="flex h-16 items-center justify-center gap-2 px-4 border-b cursor-pointer">
              <img src="/kwika-logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')

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
                    <span className="flex-1">{item.name}</span>
                    {item.badge !== undefined && (
                      <Badge variant={isActive ? "secondary" : "outline"}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop User Section */}
            {admin && (
              <div className="border-t p-4">
                <div className="mb-3">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {admin.admin_role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
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

          {/* Page content */}
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
