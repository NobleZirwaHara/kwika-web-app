import { Head, router } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Label } from '@/Components/ui/label'
import { useState } from 'react'
import { CreditCard, Smartphone, Building2, Loader2, Calendar, MapPin, Ticket } from 'lucide-react'
import { format } from 'date-fns'

interface TicketOrder {
  id: number
  order_number: string
  total_amount: number
  discount_amount: number
  currency: string
  status: string
  payment_status: string
  event: {
    id: number
    title: string
    cover_image: string
    start_datetime: string
    venue_name: string
    venue_city: string
  }
  eventTickets: Array<{
    id: number
    attendee_name: string
    ticket_package: {
      name: string
      price: number
    }
  }>
}

interface Props {
  order: TicketOrder
  paymentMethods: Record<string, string>
}

export default function Payment({ order, paymentMethods }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card')
  const [processing, setProcessing] = useState(false)

  const finalAmount = order.total_amount - order.discount_amount

  const handlePayment = () => {
    setProcessing(true)

    router.post(
      route('ticket-orders.process-payment', order.id),
      {
        payment_method: selectedMethod,
        payment_gateway: 'flutterwave', // Default to Flutterwave
      },
      {
        onError: () => {
          setProcessing(false)
        },
      }
    )
  }

  const paymentMethodIcons: Record<string, any> = {
    card: CreditCard,
    mobile_money: Smartphone,
    bank_transfer: Building2,
  }

  return (
    <>
      <Head title={`Payment - Order ${order.order_number}`} />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Order #{order.order_number}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Methods */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  <div className="space-y-4">
                    {Object.entries(paymentMethods).map(([key, label]) => {
                      const Icon = paymentMethodIcons[key] || CreditCard
                      return (
                        <div
                          key={key}
                          className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedMethod === key
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedMethod(key)}
                        >
                          <RadioGroupItem value={key} id={key} />
                          <Label
                            htmlFor={key}
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                          >
                            <div className={`p-2 rounded-lg ${
                              selectedMethod === key ? 'bg-primary/10' : 'bg-muted'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">{label}</div>
                              {key === 'mobile_money' && (
                                <div className="text-sm text-muted-foreground">
                                  M-Pesa, Airtel Money, TNM Mpamba
                                </div>
                              )}
                              {key === 'card' && (
                                <div className="text-sm text-muted-foreground">
                                  Visa, Mastercard
                                </div>
                              )}
                            </div>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p>
                      Your payment is processed securely through our payment partner. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Event Info */}
                <div className="bg-card rounded-lg border overflow-hidden">
                  <img
                    src={order.event.cover_image || '/placeholder-event.jpg'}
                    alt={order.event.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {order.event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(order.event.start_datetime), 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.event.venue_name}, {order.event.venue_city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3">
                    {/* Ticket Count by Package */}
                    {Object.entries(
                      order.eventTickets.reduce((acc, ticket) => {
                        const pkgName = ticket.ticket_package.name
                        const price = ticket.ticket_package.price
                        if (!acc[pkgName]) {
                          acc[pkgName] = { count: 0, price }
                        }
                        acc[pkgName].count++
                        return acc
                      }, {} as Record<string, { count: number; price: number }>)
                    ).map(([packageName, { count, price }]) => (
                      <div key={packageName} className="flex justify-between text-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-muted-foreground" />
                            <span>{packageName}</span>
                          </div>
                          <span className="text-muted-foreground ml-6">x {count}</span>
                        </div>
                        <span className="font-medium">
                          {order.currency} {(price * count).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{order.currency} {order.total_amount.toLocaleString()}</span>
                      </div>

                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{order.currency} {order.discount_amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">
                          {order.currency} {finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Count */}
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{order.eventTickets.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.eventTickets.length === 1 ? 'Ticket' : 'Tickets'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
