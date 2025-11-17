import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  Calendar,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Trash2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Booking {
  id: number
  booking_number: string
  event_date: string
  event_date_formatted: string
  start_time: string
  end_time: string
  event_location: string | null
  attendees: number
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  status: string
  payment_status: string
  created_at: string
  user: {
    id: number
    name: string
    email: string
  }
  service: {
    id: number
    name: string
  } | null
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  total_revenue: number
  pending_amount: number
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Service {
  id: number
  name: string
}

interface Filters {
  search: string
  provider: string
  service: string
  status: string
  payment_status: string
  date_from: string
  date_to: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Booking[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  bookings: PaginatedData
  stats: Stats
  providers: Provider[]
  services: Service[]
  filters: Filters
}

export default function BookingsIndex({ admin, bookings, stats, providers, services, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      status,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handlePaymentStatusChange(payment_status: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      payment_status,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      provider,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleServiceChange(service: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      service,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleDateFromChange(date_from: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      date_from,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleDateToChange(date_to: string) {
    router.get(route('admin.bookings.index'), {
      ...filters,
      date_to,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.bookings.index'), {
      ...filters,
      search: searchQuery,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleDelete(bookingId: number, bookingNumber: string) {
    if (confirm(`Are you sure you want to permanently delete booking "${bookingNumber}"? This action cannot be undone.`)) {
      router.delete(route('admin.bookings.destroy', bookingId), {
        preserveScroll: true,
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getPaymentStatusBadge(paymentStatus: string) {
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'partial':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Partial</Badge>
      case 'refunded':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Refunded</Badge>
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>
    }
  }

  return (
    <AdminLayout title="Bookings" admin={admin}>
      <Head title="Bookings" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all service bookings</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">MWK {stats.total_revenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending $</p>
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">MWK {stats.pending_amount.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <div className="flex gap-4 flex-wrap">
                <Tabs value={filters.status} onValueChange={handleStatusChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs value={filters.payment_status} onValueChange={handlePaymentStatusChange}>
                  <TabsList>
                    <TabsTrigger value="all">All Payments</TabsTrigger>
                    <TabsTrigger value="pending">Payment Pending</TabsTrigger>
                    <TabsTrigger value="partial">Partial</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="refunded">Refunded</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label className="text-xs mb-1 block">Provider</Label>
                  <Select value={filters.provider || 'all'} onValueChange={handleProviderChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All" />
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
                  <Label className="text-xs mb-1 block">Service</Label>
                  <Select value={filters.service || 'all'} onValueChange={handleServiceChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">From Date</Label>
                  <Input
                    type="date"
                    className="h-9"
                    value={filters.date_from || ''}
                    onChange={(e) => handleDateFromChange(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1 block">To Date</Label>
                  <Input
                    type="date"
                    className="h-9"
                    value={filters.date_to || ''}
                    onChange={(e) => handleDateToChange(e.target.value)}
                  />
                </div>

                <form onSubmit={handleSearch} className="col-span-2">
                  <Label className="text-xs mb-1 block">Search</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Booking #, customer, provider..."
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking List */}
        <div className="space-y-4">
          {bookings.data.length > 0 ? (
            bookings.data.map((booking) => (
              <Card key={booking.id} className={cn(
                booking.status === 'cancelled' && "border-red-200 bg-red-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold">#{booking.booking_number}</h3>
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking.payment_status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {booking.service_provider.business_name}
                          {booking.service && ` • ${booking.service.name}`}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Customer:</span>
                          <p className="font-medium">{booking.user.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Event Date:</span>
                          <p className="font-medium">{booking.event_date_formatted}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-medium">{booking.start_time} - {booking.end_time}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attendees:</span>
                          <p className="font-medium">{booking.attendees}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Amount:</span>
                          <p className="font-semibold text-lg">MWK {booking.total_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deposit:</span>
                          <p className="font-medium">MWK {booking.deposit_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <p className="font-medium">MWK {booking.remaining_amount.toLocaleString()}</p>
                        </div>
                        {booking.event_location && (
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p className="font-medium">{booking.event_location}</p>
                          </div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Booked: {booking.created_at}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[100px]">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Link href={route('admin.bookings.show', booking.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDelete(booking.id, booking.booking_number)}
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
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {filters.search || filters.provider || filters.service || filters.status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No bookings have been made yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {bookings.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            {bookings.links.map((link, index) => (
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
