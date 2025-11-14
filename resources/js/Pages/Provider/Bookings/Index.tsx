import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Badge } from '@/Components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'

interface Booking {
  id: number
  booking_number: string
  customer_name: string
  customer_email: string
  service_name: string
  event_date: string
  event_location: string
  attendees: number | null
  total_amount: number
  currency: string
  status: string
  payment_status: string
  created_at: string
  has_special_requests: boolean
}

interface Service {
  id: number
  name: string
}

interface Filters {
  status?: string
  payment_status?: string
  service_id?: string
  date_from?: string
  date_to?: string
  search?: string
  sort_by?: string
  sort_order?: string
}

interface StatusCounts {
  all: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

interface Props {
  bookings: {
    data: Booking[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  services: Service[]
  statusCounts: StatusCounts
  filters: Filters
}

export default function BookingsIndex({ bookings, services, statusCounts, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || '')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status || 'all')
  const [serviceFilter, setServiceFilter] = useState(filters.service_id || 'all')
  const [dateFrom, setDateFrom] = useState(filters.date_from || '')
  const [dateTo, setDateTo] = useState(filters.date_to || '')

  function handleFilter() {
    router.get('/provider/bookings', {
      search: search || undefined,
      status: statusFilter || undefined,
      payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
      service_id: serviceFilter !== 'all' ? serviceFilter : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('')
    setPaymentStatusFilter('all')
    setServiceFilter('all')
    setDateFrom('')
    setDateTo('')
    router.get('/provider/bookings')
  }

  function handleStatusTab(status: string) {
    router.get('/provider/bookings', {
      status: status || undefined,
      payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
      service_id: serviceFilter !== 'all' ? serviceFilter : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      search: search || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleExport() {
    const params = new URLSearchParams()
    if (statusFilter) params.append('status', statusFilter)
    if (paymentStatusFilter && paymentStatusFilter !== 'all') params.append('payment_status', paymentStatusFilter)
    if (serviceFilter && serviceFilter !== 'all') params.append('service_id', serviceFilter)
    if (dateFrom) params.append('date_from', dateFrom)
    if (dateTo) params.append('date_to', dateTo)

    window.location.href = `/provider/bookings/export?${params.toString()}`
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', icon: AlertCircle, label: 'Pending' },
      confirmed: { variant: 'default', icon: CheckCircle, label: 'Confirmed' },
      completed: { variant: 'outline', icon: CheckCircle, label: 'Completed' },
      cancelled: { variant: 'destructive', icon: XCircle, label: 'Cancelled' },
    }
    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  function getPaymentStatusBadge(status: string) {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', label: 'Pending' },
      pending_verification: { variant: 'secondary', label: 'Verifying' },
      deposit_paid: { variant: 'default', label: 'Deposit Paid' },
      fully_paid: { variant: 'default', label: 'Fully Paid' },
      refunded: { variant: 'destructive', label: 'Refunded' },
    }
    const config = variants[status] || variants.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <ProviderLayout title="Bookings">
      <Head title="Bookings" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookings Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your service bookings
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Status Tabs */}
        <Tabs value={filters.status || 'all'} onValueChange={handleStatusTab}>
          <TabsList>
            <TabsTrigger value="all">
              All <Badge variant="outline" className="ml-2">{statusCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending <Badge variant="outline" className="ml-2">{statusCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed <Badge variant="outline" className="ml-2">{statusCounts.confirmed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed <Badge variant="outline" className="ml-2">{statusCounts.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled <Badge variant="outline" className="ml-2">{statusCounts.cancelled}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-6">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Booking # or customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>

              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
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

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending_verification">Verifying</SelectItem>
                    <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
                    <SelectItem value="fully_paid">Fully Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        {bookings.data.length > 0 ? (
          <>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Booking #</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Event Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookings.data.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="font-mono text-sm font-medium">{booking.booking_number}</div>
                            <div className="text-xs text-muted-foreground">{booking.created_at}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{booking.service_name}</div>
                            {booking.has_special_requests && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Has Requests
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{booking.event_date}</div>
                            {booking.attendees && (
                              <div className="text-xs text-muted-foreground">{booking.attendees} attendees</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{booking.event_location}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 font-medium">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              {booking.currency} {booking.total_amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getPaymentStatusBadge(booking.payment_status)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(booking.status)}
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/bookings/${booking.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {bookings.last_page > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((bookings.current_page - 1) * bookings.per_page) + 1} to {Math.min(bookings.current_page * bookings.per_page, bookings.total)} of {bookings.total} bookings
                </div>
                <div className="flex gap-2">
                  {bookings.current_page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => router.get(`/provider/bookings?page=${bookings.current_page - 1}`, filters, { preserveState: true })}
                    >
                      Previous
                    </Button>
                  )}
                  {bookings.current_page < bookings.last_page && (
                    <Button
                      variant="outline"
                      onClick={() => router.get(`/provider/bookings?page=${bookings.current_page + 1}`, filters, { preserveState: true })}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {filters.search || filters.status || filters.payment_status || filters.service_id || filters.date_from
                  ? 'No bookings match your current filters. Try adjusting them.'
                  : 'You don\'t have any bookings yet. They will appear here when customers book your services.'}
              </p>
              {(filters.search || filters.status || filters.payment_status) && (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
