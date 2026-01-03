import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import {
  Building2,
  Search,
  SquarePen,
  Star,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Phone,
  User,
  FileText,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface User {
  id: number
  name: string
  email: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
  city: string
  location: string
  email: string
  phone: string
  is_featured: boolean
  is_active: boolean
  verification_status: string
  status: string
  average_rating: number
  total_reviews: number
  total_bookings: number
  created_at: string
  verified_at: string | null
  user: User
  bookings_count: number
  reviews_count: number
  services_count: number
}

interface Stats {
  total: number
  active: number
  inactive: number
  verified: number
  featured: number
}

interface Filters {
  search: string
  status: string
  city: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Provider[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  providers: PaginatedData
  stats: Stats
  cities: string[]
  filters: Filters
}

export default function ServiceProvidersIndex({ admin, providers, stats, cities, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.service-providers.index'), {
      status,
      search: filters.search,
      city: filters.city,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.service-providers.index'), {
      status: filters.status,
      search: searchQuery,
      city: filters.city,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(providerId: number) {
    if (confirm('Are you sure you want to change this provider\'s active status?')) {
      router.put(route('admin.service-providers.toggle-active', providerId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleToggleFeatured(providerId: number) {
    if (confirm('Are you sure you want to change this provider\'s featured status?')) {
      router.put(route('admin.service-providers.toggle-featured', providerId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleApprove(providerId: number) {
    if (confirm('Are you sure you want to approve this service provider? This will allow them to access their provider dashboard.')) {
      router.post(route('admin.verification-queue.approve', providerId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleReject(providerId: number) {
    const reason = prompt('Please provide a reason for rejecting this provider:')
    if (reason) {
      router.post(route('admin.verification-queue.reject', providerId), {
        reason
      }, {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title="Service Providers" admin={admin}>
      <Head title="Service Providers" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Service Providers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all service providers on the platform
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Providers</p>
                <Building2 className="h-5 w-5 text-muted-foreground" />
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
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
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
                  <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
                  <TabsTrigger value="featured">Featured ({stats.featured})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and City Filter */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by business name, email, city, owner..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Provider List */}
        <div className="space-y-4">
          {providers.data.length > 0 ? (
            providers.data.map((provider) => (
              <Card key={provider.id} className={cn(
                !provider.is_active && "border-red-200 bg-red-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Provider Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{provider.business_name}</h3>

                          {provider.verification_status === 'approved' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}

                          {provider.is_featured && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Star className="h-3 w-3 mr-1 fill-purple-700" />
                              Featured
                            </Badge>
                          )}

                          <Badge variant={provider.is_active ? "default" : "secondary"}>
                            {provider.is_active ? 'Active' : 'Inactive'}
                          </Badge>

                          {provider.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Approval
                            </Badge>
                          )}

                          {provider.status === 'rejected' && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          )}

                          {provider.status === 'approved' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {provider.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {provider.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {provider.phone}
                          </span>
                        </div>
                      </div>

                      {/* Owner Info */}
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">Owner:</span>
                        <span>{provider.user.name}</span>
                        <span className="text-muted-foreground">({provider.user.email})</span>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{provider.services_count}</span>
                          <span className="text-muted-foreground">services</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{provider.bookings_count}</span>
                          <span className="text-muted-foreground">bookings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{provider.reviews_count}</span>
                          <span className="text-muted-foreground">reviews</span>
                        </div>
                        {provider.average_rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{provider.average_rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">rating</span>
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Joined: {provider.created_at}</span>
                        {provider.verified_at && (
                          <span>Verified: {provider.verified_at}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      {provider.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(provider.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(provider.id)}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.service-providers.edit', provider.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Details
                        </Link>
                      </Button>

                      {provider.status === 'approved' && (
                        <>
                          <Button
                            variant={provider.is_active ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleActive(provider.id)}
                          >
                            {provider.is_active ? (
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

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(provider.id)}
                          >
                            <Star className={cn(
                              "h-4 w-4 mr-2",
                              provider.is_featured && "fill-purple-700 text-purple-700"
                            )} />
                            {provider.is_featured ? 'Unfeature' : 'Feature'}
                          </Button>
                        </>
                      )}

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/providers/${provider.slug}`} target="_blank">
                          <Activity className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No providers found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No providers match the selected filter'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {providers.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((providers.current_page - 1) * providers.per_page) + 1} to{' '}
                  {Math.min(providers.current_page * providers.per_page, providers.total)} of{' '}
                  {providers.total} results
                </p>

                <div className="flex gap-1">
                  {providers.links.map((link, index) => (
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
