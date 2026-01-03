import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Search,
  SquarePen,
  MapPin,
  Users,
  Trash2,
  Star,
  Plus,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Event {
  id: number
  title: string
  slug: string
  description: string | null
  type: string
  category: string
  venue_name: string | null
  venue_city: string | null
  venue_country: string | null
  is_online: boolean
  start_datetime: string
  end_datetime: string
  start_datetime_formatted: string
  end_datetime_formatted: string
  max_attendees: number | null
  registered_count: number
  checked_in_count: number
  status: string
  is_featured: boolean
  cover_image: string | null
  is_upcoming: boolean
  is_ongoing: boolean
  is_past: boolean
  is_full: boolean
  capacity_percentage: number | null
  spots_remaining: number | null
  price_range: string
  ticket_count: number
  created_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
}

interface Stats {
  total: number
  upcoming: number
  ongoing: number
  past: number
  published: number
  featured: number
  total_attendees: number
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Filters {
  search: string
  provider: string
  category: string
  type: string
  status: string
  timeframe: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Event[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  events: PaginatedData
  stats: Stats
  categories: string[]
  types: string[]
  providers: Provider[]
  filters: Filters
}

export default function EventsIndex({ admin, events, stats, categories, types, providers, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.events.index'), {
      status,
      search: filters.search,
      provider: filters.provider,
      category: filters.category,
      type: filters.type,
      timeframe: filters.timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleTimeframeChange(timeframe: string) {
    router.get(route('admin.events.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      category: filters.category,
      type: filters.type,
      timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.events.index'), {
      status: filters.status,
      search: filters.search,
      provider,
      category: filters.category,
      type: filters.type,
      timeframe: filters.timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleCategoryChange(category: string) {
    router.get(route('admin.events.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      category,
      type: filters.type,
      timeframe: filters.timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleTypeChange(type: string) {
    router.get(route('admin.events.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      category: filters.category,
      type,
      timeframe: filters.timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.events.index'), {
      status: filters.status,
      search: searchQuery,
      provider: filters.provider,
      category: filters.category,
      type: filters.type,
      timeframe: filters.timeframe,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleFeatured(eventId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Remove this event from featured?'
      : 'Mark this event as featured?'

    if (confirm(message)) {
      router.put(route('admin.events.toggle-featured', eventId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleStatusUpdate(eventId: number, currentStatus: string) {
    const newStatus = prompt(`Change status to (draft, published, cancelled):`, currentStatus)
    if (newStatus && ['draft', 'published', 'cancelled'].includes(newStatus.toLowerCase())) {
      router.put(route('admin.events.update-status', eventId), {
        status: newStatus.toLowerCase()
      }, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(eventId: number, eventTitle: string) {
    if (confirm(`Are you sure you want to permanently delete "${eventTitle}"? This action cannot be undone.`)) {
      router.delete(route('admin.events.destroy', eventId), {
        preserveScroll: true,
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'published':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </Badge>
        )
      case 'draft':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Draft
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getTimeframeBadge(event: Event) {
    if (event.is_upcoming) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
    } else if (event.is_ongoing) {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Ongoing</Badge>
    } else if (event.is_past) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Past</Badge>
    }
    return null
  }

  return (
    <AdminLayout title="Events" admin={admin}>
      <Head title="Events" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage all events offered by providers
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.events.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Ongoing</p>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.ongoing}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Past</p>
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.past}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Attendees</p>
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-indigo-600">{stats.total_attendees}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <div className="flex gap-4 flex-wrap">
                <Tabs value={filters.status} onValueChange={handleStatusChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs value={filters.timeframe} onValueChange={handleTimeframeChange}>
                  <TabsList>
                    <TabsTrigger value="all">All Times</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Provider Filter */}
                <div>
                  <Select value={filters.provider || 'all'} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="col-span-2 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by title, venue, city, provider..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event List */}
        <div className="space-y-4">
          {events.data.length > 0 ? (
            events.data.map((event) => (
              <Card key={event.id} className={cn(
                event.status === 'cancelled' && "border-red-200 bg-red-50/30",
                event.is_past && event.status !== 'cancelled' && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Event Image & Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Event Image */}
                      <div className="w-32 h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {event.cover_image ? (
                          <img
                            src={event.cover_image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            {getStatusBadge(event.status)}
                            {getTimeframeBadge(event)}
                            {event.is_featured && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {event.is_full && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Full
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.service_provider.business_name}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Start:</strong> {event.start_datetime_formatted}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Registered:</strong> {event.registered_count}
                              {event.max_attendees && ` / ${event.max_attendees}`}
                              {event.capacity_percentage && (
                                <span className="text-muted-foreground ml-1">
                                  ({event.capacity_percentage.toFixed(0)}%)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.is_online ? (
                              <>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span>Online Event</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {event.venue_name}
                                  {event.venue_city && `, ${event.venue_city}`}
                                  {event.venue_country && `, ${event.venue_country}`}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Price Range:</span>
                            <span className="font-semibold">{event.price_range}</span>
                            {event.ticket_count > 0 && (
                              <span className="text-muted-foreground">
                                ({event.ticket_count} ticket{event.ticket_count !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Type: {event.type}</span>
                          <span>•</span>
                          <span>Category: {event.category}</span>
                          <span>•</span>
                          <span>Created: {event.created_at}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[100px]">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Link href={route('admin.events.edit', event.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleToggleFeatured(event.id, event.is_featured)}
                      >
                        <Star className={cn(
                          "h-4 w-4 mr-2",
                          event.is_featured && "fill-yellow-500 text-yellow-500"
                        )} />
                        {event.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusUpdate(event.id, event.status)}
                      >
                        Status
                      </Button>

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDelete(event.id, event.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.provider || filters.category || filters.type || filters.status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first event'}
                </p>
                <Button asChild>
                  <Link href={route('admin.events.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {events.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            {events.links.map((link, index) => (
              <Button
                key={index}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                disabled={!link.url}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
