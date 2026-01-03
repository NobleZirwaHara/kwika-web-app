import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tag,
  Search,
  SquarePen,
  Percent,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Promotion {
  id: number
  title: string
  description: string | null
  code: string
  type: string
  discount_value: number
  discount_display: string
  min_booking_amount: number | null
  max_discount_amount: number | null
  applicable_to: string
  start_date: string
  end_date: string
  start_date_formatted: string
  end_date_formatted: string
  usage_limit: number | null
  usage_count: number
  remaining_uses: number | null
  per_customer_limit: number | null
  is_active: boolean
  is_expired: boolean
  is_upcoming: boolean
  is_exhausted: boolean
  status: string
  priority: number | null
  banner_image: string | null
  created_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
}

interface Stats {
  total: number
  active: number
  upcoming: number
  expired: number
  inactive: number
  total_uses: number
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Filters {
  search: string
  provider: string
  type: string
  status: string
  applicable_to: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Promotion[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  promotions: PaginatedData
  stats: Stats
  types: string[]
  applicableToOptions: string[]
  providers: Provider[]
  filters: Filters
}

export default function PromotionsIndex({ admin, promotions, stats, types, applicableToOptions, providers, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.promotions.index'), {
      ...filters,
      status,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleTypeChange(type: string) {
    router.get(route('admin.promotions.index'), {
      ...filters,
      type,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.promotions.index'), {
      ...filters,
      provider,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.promotions.index'), {
      ...filters,
      search: searchQuery,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(promotionId: number, currentStatus: boolean) {
    if (confirm(currentStatus ? 'Deactivate this promotion?' : 'Activate this promotion?')) {
      router.put(route('admin.promotions.toggle-active', promotionId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(promotionId: number, promotionTitle: string) {
    if (confirm(`Are you sure you want to permanently delete "${promotionTitle}"? This action cannot be undone.`)) {
      router.delete(route('admin.promotions.destroy', promotionId), {
        preserveScroll: true,
      })
    }
  }

  function getStatusBadge(promotion: Promotion) {
    switch (promotion.status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3 mr-1" />Upcoming</Badge>
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>
      case 'exhausted':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Exhausted</Badge>
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
      default:
        return <Badge variant="outline">{promotion.status}</Badge>
    }
  }

  return (
    <AdminLayout title="Promotions" admin={admin}>
      <Head title="Promotions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-muted-foreground mt-1">Manage discount codes and promotional campaigns</p>
          </div>
          <Button asChild>
            <Link href={route('admin.promotions.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Promos</p>
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.expired}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.total_uses}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <Tabs value={filters.status} onValueChange={handleStatusChange}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select value={filters.provider || 'all'} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <form onSubmit={handleSearch} className="col-span-2 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by title, code, description..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotion List */}
        <div className="space-y-4">
          {promotions.data.length > 0 ? (
            promotions.data.map((promotion) => (
              <Card key={promotion.id} className={cn(
                promotion.status === 'expired' && "border-gray-200 bg-gray-50/30",
                promotion.status === 'inactive' && "border-red-200 bg-red-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {promotion.banner_image && (
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          <img src={promotion.banner_image} alt={promotion.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold">{promotion.title}</h3>
                            {getStatusBadge(promotion)}
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {promotion.code}
                            </Badge>
                            {promotion.type === 'percentage' && (
                              <Badge variant="outline"><Percent className="h-3 w-3 mr-1" />{promotion.discount_display}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{promotion.service_provider.business_name}</p>
                        </div>

                        {promotion.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{promotion.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <strong>Discount:</strong> {promotion.discount_display}
                            {promotion.type === 'percentage' && promotion.max_discount_amount && (
                              <span className="text-muted-foreground"> (max: MWK {promotion.max_discount_amount})</span>
                            )}
                          </div>
                          <div>
                            <strong>Valid:</strong> {promotion.start_date_formatted} - {promotion.end_date_formatted}
                          </div>
                          <div>
                            <strong>Usage:</strong> {promotion.usage_count}
                            {promotion.usage_limit && ` / ${promotion.usage_limit}`}
                            {promotion.remaining_uses !== null && (
                              <span className="text-muted-foreground"> ({promotion.remaining_uses} remaining)</span>
                            )}
                          </div>
                          <div>
                            <strong>Applies to:</strong> {promotion.applicable_to.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[100px]">
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link href={route('admin.promotions.edit', promotion.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleToggleActive(promotion.id, promotion.is_active)}
                      >
                        {promotion.is_active ? 'Deactivate' : 'Activate'}
                      </Button>

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDelete(promotion.id, promotion.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.provider || filters.type || filters.status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first promotion'}
                </p>
                <Button asChild>
                  <Link href={route('admin.promotions.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promotion
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {promotions.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            {promotions.links.map((link, index) => (
              <Button
                key={index}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                disabled={!link.url}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
