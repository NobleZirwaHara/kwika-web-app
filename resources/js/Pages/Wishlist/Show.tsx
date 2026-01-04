import { Head, Link, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'
import { useState } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import { useWishlist } from '@/contexts/WishlistContext'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface WishlistData {
  id: number
  name: string
  slug: string
  is_default: boolean
  provider_count: number
  package_count: number
  service_count: number
  total_items: number
  total_package_price: number
  formatted_total: string
  created_at: string
  providers: ProviderItem[]
  packages: PackageItem[]
  services: ServiceItem[]
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
    if (wishlist.providers.length > 0) return 'providers'
    if (wishlist.packages.length > 0) return 'packages'
    if (wishlist.services.length > 0) return 'services'
    return 'providers'
  }

  return (
    <>
      <Head title={wishlist.name} />
      <SearchHeader variant="back" />

      <main className="min-h-screen bg-gray-50 pt-32 md:pt-28 pb-6 md:pb-8">
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
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Package Total</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">
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
                    {wishlist.package_count}
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
                {wishlist.providers.length > 0 ? (
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
                {wishlist.packages.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.packages.map((pkg) => (
                      <Card
                        key={pkg.id}
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
                  </div>
                ) : (
                  <EmptySection type="packages" />
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                {wishlist.services.length > 0 ? (
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
      </main>

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

      <Footer />
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
