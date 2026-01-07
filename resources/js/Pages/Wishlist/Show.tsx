import { Head, Link, router, useForm } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  ArrowLeft,
  Store,
  Package,
  Briefcase,
  Star,
  MapPin,
  Trash2,
  MoreHorizontal,
  Pencil,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Send,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import { useWishlist } from '@/contexts/WishlistContext'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import CustomerLayout from '@/components/CustomerLayout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

interface ProviderItem {
  id: number
  type: 'provider'
  item_id: number
  business_name: string
  slug: string
  logo: string | null
  city: string | null
  average_rating: number | null
  total_reviews: number
  is_verified: boolean
  notes: string | null
  added_at: string
  exists: boolean
}

interface PackageItem {
  id: number
  type: 'package'
  item_id: number
  name: string
  slug: string
  description: string | null
  final_price: number
  currency: string
  primary_image: string | null
  package_type: 'tier' | 'bundle'
  provider: {
    id: number
    business_name: string
    slug: string
  } | null
  notes: string | null
  added_at: string
  exists: boolean
}

interface ServiceItem {
  id: number
  type: 'service'
  item_id: number
  name: string
  slug: string
  description: string | null
  base_price: number
  price_type: string
  currency: string
  primary_image: string | null
  provider: {
    id: number
    business_name: string
    slug: string
  } | null
  notes: string | null
  added_at: string
  exists: boolean
}

interface CustomPackageService {
  service_id: number
  service_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface CustomPackageItem {
  id: number
  type: 'custom_package'
  item_id: number
  name: string
  provider_id: number | null
  provider_name: string | null
  provider_slug: string | null
  services: CustomPackageService[]
  total_amount: number
  currency: string
  notes: string | null
  added_at: string
  exists: boolean
}

interface WishlistData {
  id: number
  name: string
  slug: string
  is_default: boolean
  provider_count: number
  package_count: number
  service_count: number
  custom_package_count: number
  total_items: number
  total_package_price: number
  formatted_total: string
  created_at: string
  providers: ProviderItem[]
  packages: PackageItem[]
  services: ServiceItem[]
  custom_packages: CustomPackageItem[]
}

interface Props {
  wishlist: WishlistData
  isGuest: boolean
  categories?: Array<{ id: number; name: string; slug: string }>
  auth?: {
    user?: {
      id: number
      name: string
      email: string
    }
  }
}

export default function WishlistShow({ wishlist, isGuest, categories = [], auth }: Props) {
  const { removeItem, renameWishlist, deleteWishlist } = useWishlist()
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(wishlist.name)
  const [isRenaming, setIsRenaming] = useState(false)

  // Bulk booking state
  const [bulkBookingType, setBulkBookingType] = useState<'packages' | 'services' | null>(null)
  const bulkBookingForm = useForm({
    type: '' as 'packages' | 'services',
    items: [] as Array<{ id: number; provider_id: number; item_type: string }>,
    event_date: '',
    start_time: '09:00',
    end_time: '17:00',
    event_location: '',
    attendees: '',
    special_requests: '',
  })

  const openBulkBookingDialog = (type: 'packages' | 'services') => {
    let items: Array<{ id: number; provider_id: number; item_type: string }> = []

    if (type === 'packages') {
      // Regular packages
      const regularPackages = wishlist.packages?.filter(p => p.exists).map(p => ({
        id: p.item_id,
        provider_id: p.provider?.id || 0,
        item_type: 'package' as const
      })) || []

      // Custom packages
      const customPkgs = wishlist.custom_packages?.filter(p => p.exists).map(p => ({
        id: p.id, // wishlist item id for custom packages
        provider_id: p.provider_id || 0,
        item_type: 'custom_package' as const
      })) || []

      items = [...regularPackages, ...customPkgs]
    } else {
      items = wishlist.services?.filter(s => s.exists).map(s => ({
        id: s.item_id,
        provider_id: s.provider?.id || 0,
        item_type: 'service' as const
      })) || []
    }

    bulkBookingForm.setData({
      type,
      items,
      event_date: '',
      start_time: '09:00',
      end_time: '17:00',
      event_location: '',
      attendees: '',
      special_requests: '',
    })
    setBulkBookingType(type)
  }

  const handleBulkBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bulkBookingForm.post(route('bookings.bulk.store'), {
      onSuccess: () => {
        setBulkBookingType(null)
      },
    })
  }

  const getBookablePackagesCount = () => {
    const regularCount = wishlist.packages?.filter(p => p.exists).length || 0
    const customCount = wishlist.custom_packages?.filter(p => p.exists).length || 0
    return regularCount + customCount
  }
  const getBookableServicesCount = () => wishlist.services?.filter(s => s.exists).length || 0

  const handleRemoveItem = async (itemId: number) => {
    setRemovingId(itemId)
    await removeItem(itemId)
    router.reload()
  }

  const handleRename = async () => {
    if (!newName.trim() || newName === wishlist.name) {
      setIsRenameDialogOpen(false)
      return
    }

    setIsRenaming(true)
    const success = await renameWishlist(wishlist.id, newName.trim())
    setIsRenaming(false)

    if (success) {
      setIsRenameDialogOpen(false)
      router.reload()
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${wishlist.name}"? This will remove all items.`)) {
      return
    }

    const success = await deleteWishlist(wishlist.id)
    if (success) {
      router.visit('/wishlist')
    }
  }

  // Determine initial tab based on content
  const getInitialTab = () => {
    if (wishlist.providers?.length > 0) return 'providers'
    if (wishlist.packages?.length > 0 || wishlist.custom_packages?.length > 0) return 'packages'
    if (wishlist.services?.length > 0) return 'services'
    return 'providers'
  }

  const customPackages = wishlist.custom_packages || []
  const hasPackages = (wishlist.packages?.length || 0) > 0 || customPackages.length > 0

  const content = (
    <div className={isGuest ? "min-h-screen bg-gray-50 pt-32 md:pt-28 pb-6 md:pb-8" : ""}>
      <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Link
                href="/wishlist"
                className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{wishlist.name}</h1>
                  {wishlist.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {wishlist.total_items} {wishlist.total_items === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  {!wishlist.is_default && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Guest Banner - only show for non-default wishlists (named wishlists) */}
          {isGuest && !wishlist.is_default && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">
                    This wishlist is saved for 7 days
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    <Link href="/login" className="underline font-medium">
                      Sign in
                    </Link>{' '}
                    to keep your wishlists forever.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Package Total Summary */}
          {wishlist.package_count > 0 && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">Package Total</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {wishlist.formatted_total}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for different sections */}
          {wishlist.total_items > 0 ? (
            <Tabs defaultValue={getInitialTab()} className="space-y-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="providers" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Providers</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {wishlist.provider_count}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Packages</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {wishlist.package_count + (wishlist.custom_package_count || 0)}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Services</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {wishlist.service_count}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Providers Tab */}
              <TabsContent value="providers">
                {(wishlist.providers?.length || 0) > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.providers.map((provider) => (
                      <Card
                        key={provider.id}
                        className={cn(
                          'group overflow-hidden hover:shadow-lg transition-all',
                          !provider.exists && 'opacity-60'
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {provider.logo ? (
                                <img
                                  src={provider.logo}
                                  alt={provider.business_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Store className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Link
                                    href={provider.exists ? `/providers/${provider.slug}` : '#'}
                                    className={cn(
                                      'font-semibold hover:text-primary transition-colors line-clamp-1',
                                      !provider.exists && 'pointer-events-none'
                                    )}
                                  >
                                    {provider.business_name}
                                  </Link>
                                  {provider.is_verified && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                                      <CheckCircle className="h-3 w-3" />
                                      Verified
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(provider.id)}
                                  disabled={removingId === provider.id}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                                </button>
                              </div>
                              {provider.city && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {provider.city}
                                </div>
                              )}
                              {provider.average_rating != null && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">
                                    {Number(provider.average_rating).toFixed(1)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({provider.total_reviews} reviews)
                                  </span>
                                </div>
                              )}
                              {!provider.exists && (
                                <Badge variant="destructive" className="mt-2 text-xs">
                                  No longer available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptySection type="providers" />
                )}
              </TabsContent>

              {/* Packages Tab */}
              <TabsContent value="packages">
                {hasPackages ? (
                  <div className="space-y-4">
                    {/* Request All Packages Button */}
                    {getBookablePackagesCount() > 0 && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Send className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Request All Packages</p>
                              <p className="text-sm text-muted-foreground">
                                Send booking requests for all {getBookablePackagesCount()} available packages
                              </p>
                            </div>
                          </div>
                          {isGuest ? (
                            <Button
                              asChild
                              className="whitespace-nowrap"
                            >
                              <Link href="/login">
                                <Send className="h-4 w-4 mr-2" />
                                Login to Request
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              onClick={() => openBulkBookingDialog('packages')}
                              className="whitespace-nowrap"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Request All
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Regular Packages */}
                    {wishlist.packages?.map((pkg) => (
                      <Card
                        key={`pkg-${pkg.id}`}
                        className={cn(
                          'group overflow-hidden hover:shadow-lg transition-all',
                          !pkg.exists && 'opacity-60'
                        )}
                      >
                        <div className="relative h-40 bg-gray-100">
                          {pkg.primary_image ? (
                            <img
                              src={pkg.primary_image}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveItem(pkg.id)}
                            disabled={removingId === pkg.id}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          </button>
                          <Badge
                            className={cn(
                              'absolute bottom-2 left-2',
                              pkg.package_type === 'tier' ? 'bg-blue-500' : 'bg-purple-500'
                            )}
                          >
                            {pkg.package_type === 'tier' ? 'Tier' : 'Bundle'}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <Link
                            href={pkg.exists ? `/packages/${pkg.slug}` : '#'}
                            className={cn(
                              'font-semibold hover:text-primary transition-colors line-clamp-1',
                              !pkg.exists && 'pointer-events-none'
                            )}
                          >
                            {pkg.name}
                          </Link>
                          {pkg.provider && (
                            <p className="text-sm text-muted-foreground mt-1">
                              by {pkg.provider.business_name}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(pkg.final_price, pkg.currency)}
                            </div>
                            {pkg.exists && (
                              <Button size="sm" asChild>
                                <Link href={`/packages/${pkg.slug}`}>View</Link>
                              </Button>
                            )}
                          </div>
                          {!pkg.exists && (
                            <Badge variant="destructive" className="mt-2 text-xs">
                              No longer available
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Custom Packages */}
                    {customPackages.map((pkg) => (
                      <Card
                        key={`custom-${pkg.id}`}
                        className="group overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-rose-100 to-pink-100">
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="h-12 w-12 text-rose-400" />
                          </div>
                          <button
                            onClick={() => handleRemoveItem(pkg.id)}
                            disabled={removingId === pkg.id}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          </button>
                          <Badge className="absolute bottom-2 left-2 bg-rose-500">
                            Custom
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <p className="font-semibold line-clamp-1">
                            {pkg.name}
                          </p>
                          {pkg.provider_name && (
                            <Link
                              href={pkg.provider_slug ? `/providers/${pkg.provider_slug}` : '#'}
                              className="text-sm text-muted-foreground hover:text-primary mt-1 block"
                            >
                              by {pkg.provider_name}
                            </Link>
                          )}
                          <div className="mt-2 mb-3">
                            <p className="text-xs text-muted-foreground">
                              {pkg.services?.length || 0} services included
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(pkg.total_amount, pkg.currency)}
                            </div>
                            {pkg.provider_slug && (
                              <Button size="sm" asChild>
                                <Link href={`/providers/${pkg.provider_slug}/custom`}>
                                  Book
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    </div>
                  </div>
                ) : (
                  <EmptySection type="packages" />
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                {(wishlist.services?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    {/* Request All Services Button */}
                    {getBookableServicesCount() > 0 && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Send className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Request All Services</p>
                              <p className="text-sm text-muted-foreground">
                                Send booking requests for all {getBookableServicesCount()} available services
                              </p>
                            </div>
                          </div>
                          {isGuest ? (
                            <Button
                              asChild
                              className="whitespace-nowrap"
                            >
                              <Link href="/login">
                                <Send className="h-4 w-4 mr-2" />
                                Login to Request
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              onClick={() => openBulkBookingDialog('services')}
                              className="whitespace-nowrap"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Request All
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.services.map((service) => (
                      <Card
                        key={service.id}
                        className={cn(
                          'group overflow-hidden hover:shadow-lg transition-all',
                          !service.exists && 'opacity-60'
                        )}
                      >
                        <div className="relative h-40 bg-gray-100">
                          {service.primary_image ? (
                            <img
                              src={service.primary_image}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveItem(service.id)}
                            disabled={removingId === service.id}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <Link
                            href={service.exists ? `/services/${service.slug}` : '#'}
                            className={cn(
                              'font-semibold hover:text-primary transition-colors line-clamp-1',
                              !service.exists && 'pointer-events-none'
                            )}
                          >
                            {service.name}
                          </Link>
                          {service.provider && (
                            <p className="text-sm text-muted-foreground mt-1">
                              by {service.provider.business_name}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div>
                              <div className="text-lg font-bold text-primary">
                                {formatPrice(service.base_price, service.currency)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                per {service.price_type}
                              </div>
                            </div>
                            {service.exists && (
                              <Button size="sm" asChild>
                                <Link href={`/services/${service.slug}`}>View</Link>
                              </Button>
                            )}
                          </div>
                          {!service.exists && (
                            <Badge variant="destructive" className="mt-2 text-xs">
                              No longer available
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    </div>
                  </div>
                ) : (
                  <EmptySection type="services" />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-6">
                  <Heart className="h-12 w-12 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">This wishlist is empty</h2>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start adding your favorite providers, packages, and services to this wishlist!
                </p>
                <Button asChild>
                  <Link href="/search">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
  )

  return (
    <>
      <Head title={wishlist.name} />
      {isGuest ? (
        <>
          <SearchHeader variant="back" />
          <main className="min-h-screen bg-gray-50 pt-32 md:pt-28 pb-6 md:pb-8">
            {content}
          </main>
          <Footer />
        </>
      ) : (
        <CustomerLayout title={wishlist.name}>
          {content}
        </CustomerLayout>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Wishlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="rename-wishlist">Wishlist Name</Label>
              <Input
                id="rename-wishlist"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={!newName.trim() || newName === wishlist.name || isRenaming}
              >
                {isRenaming ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Booking Dialog */}
      <Dialog open={bulkBookingType !== null} onOpenChange={(open) => !open && setBulkBookingType(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Request All {bulkBookingType === 'packages' ? 'Packages' : 'Services'}
            </DialogTitle>
            <DialogDescription>
              Send booking requests for all {bulkBookingForm.data.items.length}{' '}
              {bulkBookingType === 'packages' ? 'packages' : 'services'} in your wishlist.
              Each provider will receive a separate booking request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBulkBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={bulkBookingForm.data.event_date}
                  onChange={(e) => bulkBookingForm.setData('event_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {bulkBookingForm.errors.event_date && (
                  <p className="text-sm text-destructive">{bulkBookingForm.errors.event_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Number of Guests</Label>
                <Input
                  id="attendees"
                  type="number"
                  placeholder="e.g., 100"
                  value={bulkBookingForm.data.attendees}
                  onChange={(e) => bulkBookingForm.setData('attendees', e.target.value)}
                  min="1"
                />
                {bulkBookingForm.errors.attendees && (
                  <p className="text-sm text-destructive">{bulkBookingForm.errors.attendees}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={bulkBookingForm.data.start_time}
                  onChange={(e) => bulkBookingForm.setData('start_time', e.target.value)}
                  required
                />
                {bulkBookingForm.errors.start_time && (
                  <p className="text-sm text-destructive">{bulkBookingForm.errors.start_time}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={bulkBookingForm.data.end_time}
                  onChange={(e) => bulkBookingForm.setData('end_time', e.target.value)}
                  required
                />
                {bulkBookingForm.errors.end_time && (
                  <p className="text-sm text-destructive">{bulkBookingForm.errors.end_time}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_location">Event Location</Label>
              <Input
                id="event_location"
                placeholder="e.g., Lilongwe, Area 43"
                value={bulkBookingForm.data.event_location}
                onChange={(e) => bulkBookingForm.setData('event_location', e.target.value)}
                required
              />
              {bulkBookingForm.errors.event_location && (
                <p className="text-sm text-destructive">{bulkBookingForm.errors.event_location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_requests">Special Requests (Optional)</Label>
              <Textarea
                id="special_requests"
                placeholder="Any special requirements or notes for the providers..."
                value={bulkBookingForm.data.special_requests}
                onChange={(e) => bulkBookingForm.setData('special_requests', e.target.value)}
                rows={3}
              />
            </div>

            {/* Items Preview */}
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {bulkBookingForm.data.items.length} {bulkBookingType === 'packages' ? 'packages' : 'services'} will be requested
              </p>
              <div className="text-xs text-muted-foreground">
                {bulkBookingType === 'packages'
                  ? [
                      ...(wishlist.packages?.filter(p => p.exists).map(p => p.name) || []),
                      ...(wishlist.custom_packages?.filter(p => p.exists).map(p => p.name) || [])
                    ].join(', ')
                  : wishlist.services?.filter(s => s.exists).map(s => s.name).join(', ')
                }
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBulkBookingType(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bulkBookingForm.processing}
              >
                {bulkBookingForm.processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send {bulkBookingForm.data.items.length} Requests
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EmptySection({ type }: { type: 'providers' | 'packages' | 'services' }) {
  const config = {
    providers: {
      icon: Store,
      title: 'No providers saved',
      description: 'Save your favorite service providers to quickly find them later.',
      link: '/search?listing_type=providers',
      buttonText: 'Browse Providers',
    },
    packages: {
      icon: Package,
      title: 'No packages saved',
      description: 'Save packages to compare prices and track your favorites.',
      link: '/search',
      buttonText: 'Browse Packages',
    },
    services: {
      icon: Briefcase,
      title: 'No services saved',
      description: 'Save services you\'re interested in booking.',
      link: '/search?listing_type=services',
      buttonText: 'Browse Services',
    },
  }

  const { icon: Icon, title, description, link, buttonText } = config[type]

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
          {description}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={link}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
