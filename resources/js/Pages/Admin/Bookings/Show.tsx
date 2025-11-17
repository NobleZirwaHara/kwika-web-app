import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Textarea } from '@/Components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, CreditCard, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Admin { id: number; name: string; email: string; admin_role: string }
interface Payment { id: number; amount: number; payment_method: string; status: string; transaction_id: string | null; created_at: string }
interface Review { id: number; rating: number; comment: string; created_at: string }
interface Booking {
  id: number
  booking_number: string
  event_date: string
  event_date_formatted: string
  start_time: string
  end_time: string
  event_end_date: string | null
  event_location: string
  event_latitude: number | null
  event_longitude: number | null
  attendees: number
  special_requests: string | null
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  status: string
  payment_status: string
  cancellation_reason: string | null
  cancelled_at: string | null
  confirmed_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  user: { id: number; name: string; email: string; phone: string | null }
  service: { id: number; name: string; category: string } | null
  service_provider: { id: number; business_name: string; email: string; phone: string | null; slug: string }
  payments: Payment[]
  review: Review | null
}
interface Props { admin: Admin; booking: Booking }

export default function BookingShow({ admin, booking }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(booking.status)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(booking.payment_status)
  const [cancellationReason, setCancellationReason] = useState('')

  function handleStatusUpdate() {
    if (selectedStatus === 'cancelled' && !cancellationReason.trim()) {
      alert('Please provide a cancellation reason')
      return
    }

    if (confirm(`Change booking status to ${selectedStatus}?`)) {
      router.put(route('admin.bookings.update-status', booking.id), {
        status: selectedStatus,
        cancellation_reason: cancellationReason || null,
      }, {
        preserveScroll: true,
      })
    }
  }

  function handlePaymentStatusUpdate() {
    if (confirm(`Change payment status to ${selectedPaymentStatus}?`)) {
      router.put(route('admin.bookings.update-payment-status', booking.id), {
        payment_status: selectedPaymentStatus,
      }, {
        preserveScroll: true,
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>
      case 'pending': return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'completed': return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'cancelled': return <Badge className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  function getPaymentBadge(status: string) {
    switch (status) {
      case 'paid': return <Badge className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
      case 'pending': return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'partial': return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Partial</Badge>
      case 'refunded': return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Refunded</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <AdminLayout title={`Booking #${booking.booking_number}`} admin={admin}>
      <Head title={`Booking #${booking.booking_number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href={route('admin.bookings.index')}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Booking #{booking.booking_number}</h1>
              {getStatusBadge(booking.status)}
              {getPaymentBadge(booking.payment_status)}
            </div>
            <p className="text-muted-foreground mt-1">Created {booking.created_at}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.user.email}</p>
              </div>
              {booking.user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.user.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Provider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Business Name</p>
                <p className="font-medium">{booking.service_provider.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.service_provider.email}</p>
              </div>
              {booking.service_provider.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.service_provider.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {booking.service && (
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.service.category}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-medium">{booking.event_date_formatted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{booking.start_time} - {booking.end_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attendees</p>
                    <p className="font-medium">{booking.attendees}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{booking.event_location}</p>
                  </div>
                </div>
                {booking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="font-medium text-sm">{booking.special_requests}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">MWK {booking.total_amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deposit Paid</p>
                <p className="text-2xl font-bold text-green-600">MWK {booking.deposit_amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-orange-600">MWK {booking.remaining_amount.toLocaleString()}</p>
              </div>
            </div>

            {booking.payments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Payment History</h4>
                <div className="space-y-2">
                  {booking.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">MWK {payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.payment_method} • {payment.created_at}
                        </p>
                      </div>
                      <Badge>{payment.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review */}
        {booking.review && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < booking.review!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-semibold">{booking.review.rating}/5</span>
              </div>
              <p className="text-sm">{booking.review.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">Posted {booking.review.created_at}</p>
            </CardContent>
          </Card>
        )}

        {/* Status Management */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Update Booking Status</CardTitle>
              <CardDescription>Change the status of this booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus === 'cancelled' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cancellation Reason</label>
                  <Textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                    rows={3}
                  />
                </div>
              )}

              {booking.confirmed_at && (
                <p className="text-sm text-muted-foreground">Confirmed: {booking.confirmed_at}</p>
              )}
              {booking.completed_at && (
                <p className="text-sm text-muted-foreground">Completed: {booking.completed_at}</p>
              )}
              {booking.cancelled_at && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Cancelled: {booking.cancelled_at}</p>
                  {booking.cancellation_reason && (
                    <p className="text-red-600 mt-1">Reason: {booking.cancellation_reason}</p>
                  )}
                </div>
              )}

              <Button onClick={handleStatusUpdate} className="w-full" disabled={selectedStatus === booking.status}>
                Update Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Payment Status</CardTitle>
              <CardDescription>Change the payment status of this booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handlePaymentStatusUpdate} className="w-full" disabled={selectedPaymentStatus === booking.payment_status}>
                Update Payment Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
