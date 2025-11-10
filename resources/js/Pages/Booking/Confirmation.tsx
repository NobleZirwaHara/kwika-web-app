import { Head, Link } from '@inertiajs/react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Download,
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
  service: {
    name: string
  }
  provider: {
    business_name: string
    phone: string
    email: string
  }
  payment: {
    method: string
    status: string
    amount: number
  } | null
}

interface Props {
  booking: Booking
}

export default function Confirmation({ booking }: Props) {
  const isPaid = booking.payment_status === 'paid'
  const isPending = booking.payment_status === 'pending_verification'

  const paymentMethodLabels: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Airtel Money / Mobile Money',
    card: 'Credit/Debit Card',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    pending_verification: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  }

  return (
    <>
      <Head title="Booking Confirmation" />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">
                {isPaid ? 'Booking Confirmed!' : 'Payment Received'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {isPaid
                  ? 'Your booking has been confirmed and the provider has been notified'
                  : 'Your payment is being verified. You will receive confirmation shortly'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Booking Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Booking Details</CardTitle>
                      <CardDescription>Reference: {booking.booking_number}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={statusColors[booking.status] || ''}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={statusColors[booking.payment_status] || ''}>
                        {booking.payment_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{booking.service.name}</h3>
                    <p className="text-muted-foreground">{booking.provider.business_name}</p>
                  </div>

                  {/* Event Details */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Event Date</p>
                        <p className="font-medium">{booking.event_date}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{booking.event_location}</p>
                      </div>
                    </div>

                    {booking.attendees && (
                      <div className="flex gap-3">
                        <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Attendees</p>
                          <p className="font-medium">{booking.attendees} guests</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info Card */}
              {booking.payment && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-medium">
                          {paymentMethodLabels[booking.payment.method] || booking.payment.method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                        <Badge className={statusColors[booking.payment.status] || ''}>
                          {booking.payment.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-medium">
                          {booking.currency} {booking.total_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {booking.currency} {booking.payment.amount.toLocaleString()}
                        </span>
                      </div>
                      {booking.remaining_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining Balance</span>
                          <span className="font-medium">
                            {booking.currency} {booking.remaining_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Important Notices */}
              {isPending && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Payment Verification Pending
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          We're verifying your payment. This usually takes 1-2 business days. You'll
                          receive an email confirmation once verified.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {booking.remaining_amount > 0 && (
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          Remaining Balance Due
                        </p>
                        <p className="text-yellow-800 dark:text-yellow-200">
                          You have paid the deposit of {booking.currency}{' '}
                          {booking.deposit_amount.toLocaleString()}. The remaining balance of{' '}
                          {booking.currency} {booking.remaining_amount.toLocaleString()} must be paid
                          before the event date.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Provider Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Provider Contact</CardTitle>
                  <CardDescription>
                    Reach out to the provider for any questions
                  </CardDescription>
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

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1" size="lg">
                  <Link href={`/bookings/${booking.id}`}>View Full Booking Details</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" size="lg">
                  <Link href="/">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Link>
                </Button>
              </div>

              {/* Next Steps */}
              <Card className="bg-muted/50 border-muted">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Check your email</p>
                        <p className="text-sm text-muted-foreground">
                          We've sent a confirmation email with all the details
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Provider will confirm</p>
                        <p className="text-sm text-muted-foreground">
                          The service provider will reach out to finalize details
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Enjoy your event</p>
                        <p className="text-sm text-muted-foreground">
                          Relax and let the professionals handle everything
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
