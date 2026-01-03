import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Plus, Edit, Trash2, Search, MapPin, Users, Clock, Globe } from 'lucide-react'

interface Event {
  id: number
  title: string
  slug: string
  description: string | null
  type: string
  category: string
  venue_name: string | null
  venue_city: string | null
  is_online: boolean
  start_datetime: string
  end_datetime: string
  status: string
  is_featured: boolean
  is_upcoming: boolean
  is_ongoing: boolean
  is_past: boolean
  registered_count: number
  max_attendees: number | null
  capacity_percentage: number | null
  spots_remaining: number | null
  ticket_packages_count: number
  cover_image: string | null
  created_at: string
}

interface Filters {
  status?: string
  category?: string
  period?: string
  search?: string
}

interface Props {
  events: Event[]
  filters: Filters
}

export default function EventsIndex({ events, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all')
  const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all')
  const [periodFilter, setPeriodFilter] = useState(filters.period || 'all')

  function handleFilter() {
    router.get('/provider/events', {
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      period: periodFilter !== 'all' ? periodFilter : undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setPeriodFilter('all')
    router.get('/provider/events')
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      router.delete(`/provider/events/${id}`)
    }
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'postponed': return 'outline'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
      conference: 'Conference',
      workshop: 'Workshop',
      concert: 'Concert',
      festival: 'Festival',
      sports: 'Sports',
      exhibition: 'Exhibition',
      networking: 'Networking',
      other: 'Other',
    }
    return labels[category] || category
  }

  return (
    <ProviderLayout title="Events">
      <Head title="Events" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage your events and ticket packages
            </p>
          </div>
          <Button asChild>
            <Link href="/provider/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Input
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>

              <div className="space-y-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Periods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {event.cover_image && (
                  <div className="h-40 overflow-hidden">
                    <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(event.category)}
                        </Badge>
                        {event.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {event.description && (
                    <CardDescription className="line-clamp-2 mb-4">
                      {event.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    {/* Date & Time */}
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div>{event.start_datetime}</div>
                        <div className="text-muted-foreground text-xs">to {event.end_datetime}</div>
                      </div>
                    </div>

                    {/* Location */}
                    {event.is_online ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>Online Event</span>
                      </div>
                    ) : event.venue_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue_name}, {event.venue_city}</span>
                      </div>
                    )}

                    {/* Attendance */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Registered:
                      </span>
                      <span className="font-medium">
                        {event.registered_count}
                        {event.max_attendees && ` / ${event.max_attendees}`}
                      </span>
                    </div>

                    {/* Capacity Bar */}
                    {event.capacity_percentage !== null && (
                      <div className="space-y-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(event.capacity_percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {event.spots_remaining} spots remaining
                        </div>
                      </div>
                    )}

                    {/* Tickets */}
                    <div className="text-xs text-muted-foreground">
                      {event.ticket_packages_count} ticket package{event.ticket_packages_count !== 1 ? 's' : ''}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/provider/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {filters.search || filters.status || filters.category || filters.period
                  ? 'No events match your current filters. Try adjusting them.'
                  : 'Create your first event to start selling tickets and managing registrations.'}
              </p>
              <Button asChild>
                <Link href="/provider/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
