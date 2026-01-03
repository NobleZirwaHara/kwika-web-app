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
  Building2,
  DollarSign,
  Clock,
  Users,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Service {
  id: number
  name: string
  slug: string
  description: string
  base_price: number
  max_price: number | null
  price_type: string
  currency: string
  duration: number | null
  max_attendees: number | null
  is_active: boolean
  requires_deposit: boolean
  deposit_percentage: number | null
  cancellation_hours: number | null
  bookings_count: number
  created_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
  category: {
    id: number
    name: string
    slug: string
  } | null
  catalogue: {
    id: number
    name: string
  } | null
}

interface Stats {
  total: number
  active: number
  inactive: number
  total_bookings: number
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Filters {
  search: string
  provider: string
  category: string
  status: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Service[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  services: PaginatedData
  stats: Stats
  categories: Category[]
  providers: Provider[]
  filters: Filters
}

export default function ServicesIndex({ admin, services, stats, categories, providers, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.services.index'), {
      status,
      search: filters.search,
      provider: filters.provider,
      category: filters.category,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.services.index'), {
      status: filters.status,
      search: filters.search,
      provider,
      category: filters.category,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleCategoryChange(category: string) {
    router.get(route('admin.services.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      category,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.services.index'), {
      status: filters.status,
      search: searchQuery,
      provider: filters.provider,
      category: filters.category,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(serviceId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Are you sure you want to deactivate this service?'
      : 'Are you sure you want to activate this service?'

    if (confirm(message)) {
      router.put(route('admin.services.toggle-active', serviceId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(serviceId: number, serviceName: string) {
    if (confirm(`Are you sure you want to permanently delete "${serviceName}"? This action cannot be undone.`)) {
      router.delete(route('admin.services.destroy', serviceId), {
        preserveScroll: true,
      })
    }
  }

  function formatPrice(service: Service): string {
    const basePrice = Number(service.base_price)
    const maxPrice = service.max_price ? Number(service.max_price) : null

    if (service.price_type === 'custom' && maxPrice) {
      return `${service.currency} ${basePrice.toFixed(2)} - ${maxPrice.toFixed(2)}`
    }
    return `${service.currency} ${basePrice.toFixed(2)} per ${service.price_type}`
  }

  return (
    <AdminLayout title="Services" admin={admin}>
      <Head title="Services" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage all services offered by providers
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Services</p>
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
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.total_bookings}</p>
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
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters Row */}
              <div className="flex gap-4">
                {/* Provider Filter */}
                <div className="w-64">
                  <Select value={filters.provider || 'all'} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Providers" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Providers</SelectItem>
                      {providers && providers.length > 0 ? (
                        providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.business_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-providers" disabled>No providers available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="w-64">
                  <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, description, provider..."
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

        {/* Service List */}
        <div className="space-y-4">
          {services.data.length > 0 ? (
            services.data.map((service) => (
              <Card key={service.id} className={cn(
                !service.is_active && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Service Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{service.name}</h3>

                          {service.is_active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}

                          {service.category && (
                            <Badge variant="secondary">
                              {service.category.name}
                            </Badge>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {service.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            <Link
                              href={route('admin.service-providers.edit', service.service_provider.id)}
                              className="hover:underline"
                            >
                              {service.service_provider.business_name}
                            </Link>
                          </span>
                          {service.catalogue && (
                            <span className="text-muted-foreground">
                              Catalogue: {service.catalogue.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatPrice(service)}</span>
                        </div>
                        {service.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{service.duration} min</span>
                          </div>
                        )}
                        {service.max_attendees && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Max {service.max_attendees}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{service.bookings_count}</span>
                          <span className="text-muted-foreground">bookings</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(service.requires_deposit || service.cancellation_hours) && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {service.requires_deposit && (
                            <span>
                              Requires {service.deposit_percentage}% deposit
                            </span>
                          )}
                          {service.cancellation_hours && (
                            <span>
                              Cancel {service.cancellation_hours}h before
                            </span>
                          )}
                          <span>Created: {service.created_at}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.services.edit', service.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Service
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(service.id, service.is_active)}
                      >
                        {service.is_active ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>

                      {admin.admin_role === 'super_admin' && service.bookings_count === 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(service.id, service.name)}
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
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No services found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No services match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {services.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((services.current_page - 1) * services.per_page) + 1} to{' '}
                  {Math.min(services.current_page * services.per_page, services.total)} of{' '}
                  {services.total} results
                </p>

                <div className="flex gap-1">
                  {services.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      disabled={!link.url}
                      onClick={() => link.url && router.visit(link.url)}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
