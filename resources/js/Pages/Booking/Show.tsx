import { Head, Link, useForm } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  DollarSign,
  FileText,
  AlertCircle,
  CreditCard,
} from 'lucide-react'

interface Booking {
  id: number
  booking_number: string
  status: string
  payment_status: string
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  currency: string
  event_date: string
  event_location: string
  attendees: number | null
  special_requests: string | null
  service: {
    name: string
    description: string | null
  }
  provider: {
    business_name: string
    phone: string
    email: string
    location: string
  }
  payments: Array<{
    id: number
    amount: number
    method: string
    status: string
    created_at: string
  }>
}

interface Props {
  booking: Booking
}

export default function ShowBooking({ booking }: Props) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const cancelForm = useForm({
    cancellation_reason: '',
  })

  function handleCancel(e: FormEvent) {
    e.preventDefault()
    cancelForm.patch(`/bookings/${booking.id}/cancel`, {
      onSuccess: () => {
        setCancelDialogOpen(false)
      },
    })
  }

  const canCancel = !['cancelled', 'completed'].includes(booking.status)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  }

  const paymentMethodLabels: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Airtel Money / Mobile Money',
    card: 'Credit/Debit Card',
  }

  return (
    <>
      <Head title={`Booking ${booking.booking_number}`} />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Booking Details</h1>
                <p className="text-muted-foreground">
                  Reference: <span className="font-mono font-semibold">{booking.booking_number}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={statusColors[booking.status] || ''}>
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{booking.service.name}</h3>
                      {booking.service.description && (
                        <p className="text-muted-foreground">{booking.service.description}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Provided by</p>
                      <p className="font-semibold text-lg">{booking.provider.business_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {booking.provider.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Event Date & Time</p>
                          <p className="font-medium">{booking.event_date}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Event Location</p>
                          <p className="font-medium">{booking.event_location}</p>
                        </div>
                      </div>

                      {booking.attendees && (
                        <div className="flex gap-3">
                          <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Number of Attendees</p>
                            <p className="font-medium">{booking.attendees} guests</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.special_requests && (
                      <div className="pt-4 border-t">
                        <div className="flex gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                            <p className="text-sm">{booking.special_requests}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All payments for this booking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {booking.payments.length > 0 ? (
                      <div className="space-y-4">
                        {booking.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {paymentMethodLabels[payment.method] || payment.method}
                                </p>
                                <p className="text-sm text-muted-foreground">{payment.created_at}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {booking.currency} {payment.amount.toLocaleString()}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No payments recorded yet
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Provider Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Contact</CardTitle>
                    <CardDescription>Get in touch with the service provider</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`tel:${booking.provider.phone}`}
                        className="font-medium hover:text-primary"
                      >
                        {booking.provider.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`mailto:${booking.provider.email}`}
                        className="font-medium hover:text-primary"
                      >
                        {booking.provider.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Payment Summary */}
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-medium">
                          {booking.currency} {booking.total_amount.toLocaleString()}
                        </span>
                      </div>

                      {booking.deposit_amount > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deposit Paid</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {booking.currency} {booking.deposit_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-medium">
                              {booking.currency} {booking.remaining_amount.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold">Payment Status</span>
                          <Badge variant="outline">{booking.payment_status.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                    </div>

                    {booking.remaining_amount > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 text-sm">
                        <div className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-yellow-800 dark:text-yellow-200">
                            Outstanding balance of{' '}
                            <span className="font-semibold">
                              {booking.currency} {booking.remaining_amount.toLocaleString()}
                            </span>{' '}
                            due before event
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                {canCancel && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/">Book Another Service</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setCancelDialogOpen(true)}
                      >
                        Cancel Booking
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCancel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancellation_reason">Reason for Cancellation</Label>
              <Textarea
                id="cancellation_reason"
                value={cancelForm.data.cancellation_reason}
                onChange={(e) => cancelForm.setData('cancellation_reason', e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                rows={4}
                required
              />
              {cancelForm.errors.cancellation_reason && (
                <p className="text-sm text-destructive">
                  {cancelForm.errors.cancellation_reason}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
              >
                Keep Booking
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={cancelForm.processing}
              >
                {cancelForm.processing ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
