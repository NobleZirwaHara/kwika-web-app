import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, MapPin, Ticket, Download, Mail, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface TicketOrder {
  id: number
  order_number: string
  total_amount: number
  discount_amount: number
  currency: string
  status: string
  payment_status: string
  billing_email: string
  event: {
    id: number
    title: string
    cover_image: string
    start_datetime: string
    end_datetime: string
    venue_name: string
    venue_address: string
    venue_city: string
  }
  eventTickets: Array<{
    id: number
    ticket_number: string
    attendee_name: string
    attendee_email: string
    status: string
    qr_code: string
    ticketPackage: {
      id: number
      name: string
      price: number
    }
  }>
  payment: {
    id: number
    payment_method: string
    status: string
    paid_at: string
  }
}

interface Props {
  order: TicketOrder
}

export default function Confirmation({ order }: Props) {
  const finalAmount = order.total_amount - order.discount_amount

  const handleDownloadAll = () => {
    order.eventTickets.forEach((ticket) => {
      window.open(route('tickets.download', ticket.id), '_blank')
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: order.event.title,
        text: `I'm going to ${order.event.title}!`,
        url: window.location.href,
      })
    }
  }

  return (
    <>
      <Head title={`Order Confirmed - ${order.order_number}`} />

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background py-12">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6">
              <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase
            </p>
            <p className="text-muted-foreground">
              Order #{order.order_number}
            </p>
          </motion.div>

          {/* Email Confirmation Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-8"
          >
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">Tickets Sent to Your Email</p>
                <p>
                  We've sent your tickets to <strong>{order.billing_email}</strong>.
                  Check your inbox and spam folder.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Event Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-lg border overflow-hidden mb-8"
          >
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-1">
                <img
                  src={order.event.cover_image || '/placeholder-event.jpg'}
                  alt={order.event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 p-6">
                <h2 className="text-2xl font-bold mb-4">{order.event.title}</h2>

                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">
                        {format(new Date(order.event.start_datetime), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="text-sm">
                        {format(new Date(order.event.start_datetime), 'h:mm a')} -{' '}
                        {format(new Date(order.event.end_datetime), 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{order.event.venue_name}</div>
                      <div className="text-sm">{order.event.venue_address}</div>
                      <div className="text-sm">{order.event.venue_city}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">
                        {order.eventTickets.length}{' '}
                        {order.eventTickets.length === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {order.currency} {finalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total paid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tickets List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-lg border p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Tickets</h3>
              <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            <div className="space-y-3">
              {order.eventTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Ticket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{ticket.attendee_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.ticketPackage.name} • {ticket.ticket_number}
                      </div>
                    </div>
                  </div>
                  <Link href={route('tickets.download', ticket.id)}>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href={route('my-tickets')} className="flex-1">
              <Button className="w-full" size="lg">
                View All My Tickets
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleShare} className="flex-1">
              <Share2 className="w-5 h-5 mr-2" />
              Share Event
            </Button>
            <Link href={route('ticketing')} className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Browse More Events
              </Button>
            </Link>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-muted/50 rounded-lg p-6"
          >
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex gap-3">
                <div className="bg-primary/10 rounded-lg p-2 h-fit">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">Check Your Email</div>
                  <div className="text-muted-foreground">
                    Your tickets have been sent to your email address
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 rounded-lg p-2 h-fit">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">Save Your Tickets</div>
                  <div className="text-muted-foreground">
                    Download and save tickets to your device or print them
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 rounded-lg p-2 h-fit">
                  <Ticket className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">Bring Your Ticket</div>
                  <div className="text-muted-foreground">
                    Show your QR code at the event entrance for check-in
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
