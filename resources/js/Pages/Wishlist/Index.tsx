import { Head, Link } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Plus,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/contexts/WishlistContext'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import CustomerLayout from '@/components/CustomerLayout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WishlistData {
  id: number
  name: string
  slug: string
  is_default: boolean
  provider_count: number
  package_count: number
  service_count: number
  custom_package_count?: number
  total_items: number
  total_package_price: number
  formatted_total: string
  created_at: string
}

interface Props {
  wishlists: WishlistData[]
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

export default function WishlistIndex({ wishlists: initialWishlists, isGuest, categories = [], auth }: Props) {
  const { wishlists, createWishlist, deleteWishlist, isLoading } = useWishlist()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Use context wishlists if available, otherwise fall back to props
  const displayWishlists = wishlists.length > 0 ? wishlists : initialWishlists

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) return

    setIsCreating(true)
    const result = await createWishlist(newWishlistName.trim())
    setIsCreating(false)

    if (result) {
      setNewWishlistName('')
      setIsCreateDialogOpen(false)
    }
  }

  const handleDeleteWishlist = async (wishlistId: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all items in this wishlist.`)) {
      return
    }
    await deleteWishlist(wishlistId)
  }

  const totalItems = displayWishlists.reduce((sum, w) => sum + w.total_items, 0)

  const content = (
    <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Wishlists</h1>
              <p className="text-sm text-muted-foreground">
                {displayWishlists.length} {displayWishlists.length === 1 ? 'wishlist' : 'wishlists'} with {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Wishlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Wishlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {isGuest && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Named wishlists are saved for 7 days.{' '}
                        <Link href="/login" className="underline font-medium">
                          Sign in
                        </Link>{' '}
                        to keep them forever.
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="wishlist-name">Wishlist Name</Label>
                    <Input
                      id="wishlist-name"
                      placeholder="e.g., Wedding 2025, Corporate Event"
                      value={newWishlistName}
                      onChange={(e) => setNewWishlistName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateWishlist()
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateWishlist}
                      disabled={!newWishlistName.trim() || isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Guest Banner - only show if they have multiple wishlists (named wishlists) */}
          {isGuest && displayWishlists.length > 1 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">
                    Your named wishlists are saved for 7 days
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    <Link href="/login" className="underline font-medium">
                      Sign in
                    </Link>{' '}
                    or{' '}
                    <Link href="/register" className="underline font-medium">
                      create an account
                    </Link>{' '}
                    to keep your wishlists forever and access them from any device.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wishlists Grid */}
          {displayWishlists.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayWishlists.map((wishlist) => (
                <Link
                  key={wishlist.id}
                  href={`/wishlist/${wishlist.slug}`}
                  className="block group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {wishlist.name}
                          </CardTitle>
                          {wishlist.is_default && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Item counts */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg bg-primary/10">
                          <div className="text-lg font-bold text-primary">
                            {wishlist.provider_count}
                          </div>
                          <div className="text-xs text-muted-foreground">Providers</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-primary/10">
                          <div className="text-lg font-bold text-primary">
                            {wishlist.package_count + (wishlist.custom_package_count || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Packages</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-primary/10">
                          <div className="text-lg font-bold text-primary">
                            {wishlist.service_count}
                          </div>
                          <div className="text-xs text-muted-foreground">Services</div>
                        </div>
                      </div>

                      {/* Package total if any */}
                      {(wishlist.package_count + (wishlist.custom_package_count || 0)) > 0 && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Package Total:</span>
                            <span className="font-bold text-primary">
                              {wishlist.formatted_total}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <img src="/icons/wishlist.png" alt="Wishlist" className="h-24 w-24 mb-6" />
                <h2 className="text-2xl font-bold mb-2">No wishlists yet</h2>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Create a wishlist to start saving your favorite service providers,
                  packages, and services for your upcoming events!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Wishlist
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/search">Browse Services</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
  )

  return (
    <>
      <Head title="My Wishlists" />
      {isGuest ? (
        <>
          <SearchHeader variant="back" />
          <main className="min-h-screen bg-gray-50 pt-32 md:pt-28 pb-6 md:pb-8">
            {content}
          </main>
          <Footer />
        </>
      ) : (
        <CustomerLayout title="My Wishlists">
          {content}
        </CustomerLayout>
      )}
    </>
  )
}
