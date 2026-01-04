import CustomerLayout from '@/components/CustomerLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface Props {
  bookings: Array<{
    id: number
    booking_number: string
    service_name: string
    service_type: string
    provider_name: string
    provider_logo?: string | null
    event_date: string
    event_time?: string | null
    event_location?: string | null
    total_amount: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    payment_status: 'pending' | 'paid' | 'refunded'
    created_at: string
  }>
  filters: {
    status?: string
    date_from?: string
    date_to?: string
  }
}

export default function Bookings({ bookings, filters }: Props) {
  const [activeFilter, setActiveFilter] = useState(filters.status || 'all')

  const filterOptions = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-500/10 text-blue-700 border-blue-200',
      completed: 'bg-green-500/10 text-green-700 border-green-200',
      cancelled: 'bg-red-500/10 text-red-700 border-red-200',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-700 border-gray-200'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-700',
      paid: 'bg-green-500/10 text-green-700',
      refunded: 'bg-gray-500/10 text-gray-700',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-700'
  }

  const filteredBookings = activeFilter === 'all'
    ? bookings
    : activeFilter === 'upcoming'
    ? bookings.filter(b => b.status === 'confirmed')
    : bookings.filter(b => b.status === activeFilter)

  return (
    <CustomerLayout title="My Bookings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all your event bookings
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(option.value)}
                  className="whitespace-nowrap"
                >
                  {option.label}
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${activeFilter === option.value ? 'bg-primary-foreground/20' : ''}`}
                  >
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Booking Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {booking.service_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            By {booking.provider_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Booking #{booking.booking_number}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(booking.event_date)}</span>
                        </div>

                        {booking.event_time && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.event_time}</span>
                          </div>
                        )}

                        {booking.event_location && (
                          <div className="flex items-center gap-2 text-sm sm:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{booking.event_location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            MWK {booking.total_amount.toLocaleString()}
                          </span>
                          <Badge className={getPaymentStatusColor(booking.payment_status)} variant="outline">
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="border-t md:border-t-0 md:border-l border-border bg-muted/30 p-6 md:w-64 flex flex-col gap-3">
                      <Link href={`/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>

                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <Link href={`/messages?booking=${booking.id}`}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Provider
                          </Button>
                        </Link>
                      )}

                      {booking.status === 'pending' && (
                        <Link href={`/bookings/${booking.id}/cancel`} method="post" as="button">
                          <Button variant="destructive" size="sm" className="w-full">
                            Cancel Booking
                          </Button>
                        </Link>
                      )}

                      {booking.status === 'completed' && (
                        <Link href={`/bookings/${booking.id}/review`}>
                          <Button variant="default" size="sm" className="w-full">
                            Write Review
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="mb-6">
                    {activeFilter === 'all'
                      ? "You haven't made any bookings yet."
                      : `No ${activeFilter} bookings found.`}
                  </p>
                  <Link href="/">
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Browse Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
