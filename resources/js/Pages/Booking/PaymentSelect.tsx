import { Head, Link } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Building2, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Booking {
  id: number
  booking_number: string
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  currency: string
  event_date: string
  service: {
    name: string
  }
  provider: {
    business_name: string
  }
}

interface Props {
  booking: Booking
}

export default function PaymentSelect({ booking }: Props) {
  const amountToPay = booking.deposit_amount > 0 ? booking.deposit_amount : booking.total_amount

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Pay via bank transfer and upload proof of payment',
      icon: Building2,
      route: `/bookings/${booking.id}/payment/bank-transfer`,
      recommended: false,
    },
    {
      id: 'mobile_money',
      name: 'Airtel Money / Mobile Money',
      description: 'Pay instantly using Airtel Money or other mobile money',
      icon: Smartphone,
      route: `/bookings/${booking.id}/payment/mobile-money`,
      recommended: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      description: 'Pay securely with Visa, Mastercard, or other cards',
      icon: CreditCard,
      route: `/bookings/${booking.id}/payment/card`,
      recommended: false,
    },
  ]

  return (
    <>
      <Head title="Select Payment Method" />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Select Payment Method</h1>
              <p className="text-muted-foreground">
                Choose how you'd like to pay for your booking
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Payment Methods */}
              <div className="md:col-span-2 space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Card
                      key={method.id}
                      className="relative hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      {method.recommended && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                      )}
                      <Link href={method.route}>
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                {method.name}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {method.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Link>
                    </Card>
                  )
                })}

                {/* Security Notice */}
                <Card className="bg-muted/50 border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Secure Payment</p>
                        <p className="text-muted-foreground">
                          All payments are processed securely. Your payment information is encrypted
                          and never stored on our servers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Summary Sidebar */}
              <div className="md:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Booking Number</p>
                      <p className="font-mono font-semibold">{booking.booking_number}</p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Service</p>
                      <p className="font-medium">{booking.service.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.provider.business_name}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                      <p className="font-medium">{booking.event_date}</p>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-medium">
                          {formatPrice(booking.total_amount, booking.currency)}
                        </span>
                      </div>

                      {booking.deposit_amount > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Deposit Required</span>
                            <span className="font-medium">
                              {formatPrice(booking.deposit_amount, booking.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining Balance</span>
                            <span className="font-medium">
                              {formatPrice(booking.remaining_amount, booking.currency)}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold">Amount to Pay Now</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(amountToPay, booking.currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {booking.remaining_amount > 0 && (
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          Remaining balance of{' '}
                          <span className="font-semibold text-foreground">
                            {formatPrice(booking.remaining_amount, booking.currency)}
                          </span>{' '}
                          will be due before the event.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
