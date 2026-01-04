import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, MapPin, Ticket, Download, QrCode, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface EventTicket {
  id: number
  ticket_number: string
  attendee_name: string
  attendee_email: string
  status: string
  qr_code: string
  checked_in_at: string | null
  event: {
    id: number
    title: string
    slug: string
    cover_image: string
    start_datetime: string
    end_datetime: string
    venue_name: string
    venue_city: string
  }
  ticketPackage: {
    id: number
    name: string
    price: number
    currency: string
  }
  seat: {
    id: number
    seat_number: string
    section: {
      name: string
    }
  } | null
}

interface Props {
  upcomingTickets: EventTicket[]
  pastTickets: EventTicket[]
}

export default function MyTickets({ upcomingTickets, pastTickets }: Props) {
  const [selectedTicket, setSelectedTicket] = useState<EventTicket | null>(null)

  const TicketCard = ({ ticket }: { ticket: EventTicket }) => {
    const isCheckedIn = ticket.checked_in_at !== null
    const isPast = new Date(ticket.event.end_datetime) < new Date()

    return (
      <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all">
        <div className="grid md:grid-cols-4">
          {/* Event Image */}
          <div className="md:col-span-1 relative">
            <img
              src={ticket.event.cover_image || '/placeholder-event.jpg'}
              alt={ticket.event.title}
              className="w-full h-full min-h-[200px] object-cover"
            />
            {isCheckedIn && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Checked In
              </div>
            )}
            {ticket.status === 'cancelled' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CANCELLED</span>
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="md:col-span-3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link
                  href={route('events.show', ticket.event.slug)}
                  className="text-xl font-bold hover:text-primary transition-colors"
                >
                  {ticket.event.title}
                </Link>
                <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded mt-2">
                  {ticket.ticketPackage.name}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(ticket.event.start_datetime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{ticket.event.venue_name}, {ticket.event.venue_city}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Ticket Holder: </span>
                  <span className="font-medium">{ticket.attendee_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ticket #: </span>
                  <span className="font-mono text-xs">{ticket.ticket_number}</span>
                </div>
                {ticket.seat && (
                  <div>
                    <span className="text-muted-foreground">Seat: </span>
                    <span className="font-medium">
                      {ticket.seat.section.name} - {ticket.seat.seat_number}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(ticket)}
                disabled={ticket.status === 'cancelled'}
              >
                <QrCode className="w-4 h-4 mr-2" />
                View QR Code
              </Button>
              <Link href={route('tickets.download', ticket.id)}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={ticket.status === 'cancelled'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head title="My Tickets" />

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage your event tickets
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingTickets.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastTickets.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Tickets */}
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingTickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any tickets for upcoming events yet.
                  </p>
                  <Link href={route('ticketing')}>
                    <Button>
                      Browse Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Past Tickets */}
            <TabsContent value="past" className="space-y-6">
              {pastTickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Past Events</h3>
                  <p className="text-muted-foreground">
                    Your attended events will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* QR Code Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img
                    src={selectedTicket.qr_code}
                    alt="Ticket QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event:</span>
                  <span className="font-medium">{selectedTicket.event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Holder:</span>
                  <span className="font-medium">{selectedTicket.attendee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket #:</span>
                  <span className="font-mono text-xs">{selectedTicket.ticket_number}</span>
                </div>
                {selectedTicket.seat && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seat:</span>
                    <span className="font-medium">
                      {selectedTicket.seat.section.name} - {selectedTicket.seat.seat_number}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Important:</strong> Show this QR code at the event entrance for check-in.
                  One scan per ticket.
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={route('tickets.download', selectedTicket.id)} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </Link>
                <Button onClick={() => setSelectedTicket(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
