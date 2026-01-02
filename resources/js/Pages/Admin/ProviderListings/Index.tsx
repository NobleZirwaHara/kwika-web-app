import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  Search,
  Package,
  Briefcase,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Provider {
  id: number
  name: string
  slug: string
}

interface Category {
  id: number
  name: string
}

interface Listing {
  id: number
  type: 'service' | 'product'
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  is_active: boolean
  stock?: number | null
  provider: Provider | null
  category?: Category | null
  catalogue?: Category | null
  created_at: string
}

interface Stats {
  total_services: number
  total_products: number
  active_services: number
  active_products: number
  total: number
  active: number
}

interface Filters {
  search: string
  provider: string
  type: string
  status: string
}

interface Props {
  admin?: Admin
  listings: Listing[]
  stats: Stats
  providers: Provider[]
  categories: Category[]
  filters: Filters
}

export default function ProviderListingsIndex({
  admin,
  listings,
  stats,
  providers,
  categories,
  filters,
}: Props) {
  const [searchValue, setSearchValue] = useState(filters.search || '')

  const handleFilterChange = (key: string, value: string) => {
    router.get('/admin/provider-listings', {
      ...filters,
      [key]: value === 'all' ? '' : value,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilterChange('search', searchValue)
  }

  const toggleStatus = (listing: Listing) => {
    const route = listing.type === 'service'
      ? `/admin/provider-listings/services/${listing.id}/toggle-status`
      : `/admin/provider-listings/products/${listing.id}/toggle-status`

    router.put(route, {}, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <AdminLayout title="Provider Listings" admin={admin}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Provider Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage all services and products from providers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="text-2xl font-bold">{stats.total_services}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{stats.total_products}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{stats.total - stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search listings..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Type Filter */}
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Provider Filter */}
              <Select
                value={filters.provider || 'all'}
                onValueChange={(value) => handleFilterChange('provider', value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id.toString()}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Table */}
        <Card>
          <CardContent className="p-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Listing</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Provider</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {listings.map((listing) => (
                      <tr key={`${listing.type}-${listing.id}`} className="hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{listing.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {listing.category?.name || listing.catalogue?.name || 'Uncategorized'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              listing.type === 'service'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            )}
                          >
                            {listing.type === 'service' ? (
                              <Briefcase className="h-3 w-3 mr-1" />
                            ) : (
                              <Package className="h-3 w-3 mr-1" />
                            )}
                            {listing.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {listing.provider ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.provider.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {listing.currency} {listing.price.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              listing.is_active
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-700'
                            )}
                          >
                            {listing.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {listing.created_at}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(listing)}
                            title={listing.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {listing.is_active ? (
                              <ToggleRight className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
