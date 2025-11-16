import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Calendar,
  Star
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
  phone: string
  is_verified: boolean
}

interface Provider {
  id: number
  business_name: string
  slug: string
  description: string
  business_registration_number: string
  location: string
  city: string
  phone: string
  email: string
  website: string
  verification_status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  is_verified: boolean
  is_featured: boolean
  is_active: boolean
  verified_at: string | null
  created_at: string
  days_waiting: number
  hours_waiting: number
  user: User
  services_count: number
  logo_url: string | null
  cover_image_url: string | null
  onboarding_completed: boolean
  onboarding_step: number
}

interface Stats {
  pending: number
  approved: number
  rejected: number
  total: number
}

interface Filters {
  status: string
  search: string
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
  filters: Filters
}

export default function VerificationQueueIndex({ admin, providers, stats, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.verification-queue.index'), {
      status,
      search: filters.search,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.verification-queue.index'), {
      status: filters.status,
      search: searchQuery,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleQuickApprove(providerId: number) {
    if (confirm('Are you sure you want to approve this provider?')) {
      router.post(route('admin.verification-queue.approve', providerId), {}, {
        preserveScroll: true,
        onSuccess: () => {
          // Success message handled by backend
        }
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatWaitingTime(hoursWaiting: number): string {
    const days = Math.floor(hoursWaiting / 24)
    const hours = Math.round(hoursWaiting % 24)

    if (days === 0) {
      return `${hours}h`
    } else if (hours === 0) {
      return `${days}d`
    } else {
      return `${days}d ${hours}h`
    }
  }

  function getUrgencyIndicator(daysWaiting: number, hoursWaiting: number) {
    const waitingText = formatWaitingTime(hoursWaiting)

    if (daysWaiting > 7) {
      return <Badge variant="destructive" className="ml-2">Urgent - {waitingText}</Badge>
    } else if (daysWaiting > 3) {
      return <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
        {waitingText} waiting
      </Badge>
    }
    return <span className="text-xs text-muted-foreground ml-2">{waitingText} ago</span>
  }

  return (
    <AdminLayout title="Verification Queue" admin={admin}>
      <Head title="Verification Queue" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Verification Queue</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve service provider applications
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
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
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by business name, registration number, email..."
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

        {/* Urgent Applications Alert */}
        {stats.pending > 0 && providers.data.some(p => p.days_waiting > 7 && p.verification_status === 'pending') && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-900">
                  {providers.data.filter(p => p.days_waiting > 7 && p.verification_status === 'pending').length} applications waiting more than 7 days
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider List */}
        <div className="space-y-4">
          {providers.data.length > 0 ? (
            providers.data.map((provider) => (
              <Card key={provider.id} className={cn(
                provider.days_waiting > 7 && provider.verification_status === 'pending' && "border-yellow-200 bg-yellow-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Provider Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        {provider.logo_url ? (
                          <img
                            src={provider.logo_url}
                            alt={provider.business_name}
                            className="h-16 w-16 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center border">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{provider.business_name}</h3>
                            {getStatusBadge(provider.verification_status)}
                            {provider.is_featured && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                <Star className="h-3 w-3 mr-1 fill-purple-700" />
                                Featured
                              </Badge>
                            )}
                            {provider.verification_status === 'pending' && getUrgencyIndicator(provider.days_waiting, provider.hours_waiting)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {provider.business_registration_number}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {provider.city || provider.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Applied {provider.created_at}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {provider.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {provider.description}
                        </p>
                      )}

                      {/* Owner Info */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Owner:</span>
                          <span>{provider.user.name}</span>
                          {provider.user.is_verified && (
                            <Badge variant="outline" className="text-xs">Verified User</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {provider.user.email}
                        </div>
                        {provider.user.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {provider.user.phone}
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{provider.services_count} services</span>
                        {!provider.onboarding_completed && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Onboarding incomplete (Step {provider.onboarding_step}/4)
                          </Badge>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {provider.rejection_reason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-900">
                            <span className="font-medium">Rejection reason: </span>
                            {provider.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.verification-queue.show', provider.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>

                      {provider.verification_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleQuickApprove(provider.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quick Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={route('admin.verification-queue.show', provider.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Link>
                          </Button>
                        </>
                      )}

                      {provider.verification_status === 'approved' && (
                        <Badge variant="outline" className="justify-center bg-green-50 text-green-700 border-green-200">
                          ✓ Approved {provider.verified_at}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : filters.status === 'pending'
                    ? 'All applications have been reviewed'
                    : 'No applications match the selected filter'}
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
