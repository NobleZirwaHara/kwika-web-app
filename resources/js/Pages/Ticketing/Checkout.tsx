import { Head, router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

interface TicketPackage {
  id: number
  name: string
  price: number
  currency: string
}

interface Event {
  id: number
  title: string
  cover_image: string
  start_datetime: string
  venue_name: string
  venue_city: string
}

interface SelectedTicket {
  package_id: number
  quantity: number
  package: TicketPackage
}

interface Props {
  event: Event
  selectedTickets: SelectedTicket[]
  totalAmount: number
}

interface AttendeeData {
  name: string
  email: string
  phone: string
}

export default function Checkout({ event, selectedTickets, totalAmount }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    event_id: event.id,
    billing_name: '',
    billing_email: '',
    billing_phone: '',
    promo_code: '',
    tickets: selectedTickets.map(ticket => ({
      package_id: ticket.package_id,
      quantity: ticket.quantity,
      attendees: Array.from({ length: ticket.quantity }, () => ({
        name: '',
        email: '',
        phone: ''
      }))
    }))
  })

  const handleAttendeeChange = (ticketIndex: number, attendeeIndex: number, field: keyof AttendeeData, value: string) => {
    const updatedTickets = [...data.tickets]
    updatedTickets[ticketIndex].attendees[attendeeIndex][field] = value
    setData('tickets', updatedTickets)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('ticket-orders.create'))
  }

  const getTotalTickets = () => {
    return selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0)
  }

  return (
    <>
      <Head title={`Checkout - ${event.title}`} />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.visit(route('events.show', event.id))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                <p className="text-muted-foreground">Complete your ticket purchase</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Enter your billing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="billing_name">Full Name *</Label>
                      <Input
                        id="billing_name"
                        value={data.billing_name}
                        onChange={(e) => setData('billing_name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                      {errors.billing_name && (
                        <p className="text-sm text-destructive mt-1">{errors.billing_name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_email">Email Address *</Label>
                      <Input
                        id="billing_email"
                        type="email"
                        value={data.billing_email}
                        onChange={(e) => setData('billing_email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                      {errors.billing_email && (
                        <p className="text-sm text-destructive mt-1">{errors.billing_email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_phone">Phone Number *</Label>
                      <Input
                        id="billing_phone"
                        type="tel"
                        value={data.billing_phone}
                        onChange={(e) => setData('billing_phone', e.target.value)}
                        placeholder="+265 999 123 456"
                        required
                      />
                      {errors.billing_phone && (
                        <p className="text-sm text-destructive mt-1">{errors.billing_phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="promo_code">Promo Code (Optional)</Label>
                      <Input
                        id="promo_code"
                        value={data.promo_code}
                        onChange={(e) => setData('promo_code', e.target.value)}
                        placeholder="Enter promo code"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Attendee Information */}
                {data.tickets.map((ticket, ticketIndex) => {
                  const packageInfo = selectedTickets[ticketIndex].package
                  return (
                    <Card key={ticketIndex}>
                      <CardHeader>
                        <CardTitle>{packageInfo.name} - Attendee Details</CardTitle>
                        <CardDescription>
                          {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {ticket.attendees.map((attendee, attendeeIndex) => (
                          <div key={attendeeIndex} className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
                            <h4 className="font-semibold text-sm">Attendee {attendeeIndex + 1}</h4>
                            
                            <div>
                              <Label htmlFor={`attendee_${ticketIndex}_${attendeeIndex}_name`}>
                                Full Name *
                              </Label>
                              <Input
                                id={`attendee_${ticketIndex}_${attendeeIndex}_name`}
                                value={attendee.name}
                                onChange={(e) => handleAttendeeChange(ticketIndex, attendeeIndex, 'name', e.target.value)}
                                placeholder="Attendee full name"
                                required
                              />
                              {errors[`tickets.${ticketIndex}.attendees.${attendeeIndex}.name`] && (
                                <p className="text-sm text-destructive mt-1">
                                  {errors[`tickets.${ticketIndex}.attendees.${attendeeIndex}.name`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor={`attendee_${ticketIndex}_${attendeeIndex}_email`}>
                                Email Address *
                              </Label>
                              <Input
                                id={`attendee_${ticketIndex}_${attendeeIndex}_email`}
                                type="email"
                                value={attendee.email}
                                onChange={(e) => handleAttendeeChange(ticketIndex, attendeeIndex, 'email', e.target.value)}
                                placeholder="attendee@example.com"
                                required
                              />
                              {errors[`tickets.${ticketIndex}.attendees.${attendeeIndex}.email`] && (
                                <p className="text-sm text-destructive mt-1">
                                  {errors[`tickets.${ticketIndex}.attendees.${attendeeIndex}.email`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor={`attendee_${ticketIndex}_${attendeeIndex}_phone`}>
                                Phone Number
                              </Label>
                              <Input
                                id={`attendee_${ticketIndex}_${attendeeIndex}_phone`}
                                type="tel"
                                value={attendee.phone}
                                onChange={(e) => handleAttendeeChange(ticketIndex, attendeeIndex, 'phone', e.target.value)}
                                placeholder="+265 999 123 456"
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )
                })}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Event Info */}
                    <div className="space-y-3">
                      <img
                        src={event.cover_image || '/placeholder-event.jpg'}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.start_datetime), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue_city}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Tickets */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Tickets</h4>
                      {selectedTickets.map((ticket, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <div className="font-medium">{ticket.package.name}</div>
                            <div className="text-muted-foreground">Qty: {ticket.quantity}</div>
                          </div>
                          <div className="font-semibold">
                            {ticket.package.currency} {(ticket.package.price * ticket.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>MWK {totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Tickets</span>
                        <span>{getTotalTickets()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>MWK {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
