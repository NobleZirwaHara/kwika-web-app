import CustomerLayout from '@/components/CustomerLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Heart,
  Package,
  ArrowUpRight,
  Clock,
  MapPin,
  Search
} from 'lucide-react'
import { Link } from '@inertiajs/react'
import { formatDate } from '@/lib/utils'

interface Props {
  user: {
    id: number
    name: string
    email: string
    avatar?: string | null
  }
  stats: {
    total_bookings: number
    upcoming_bookings: number
    wishlist_items: number
    total_spent: number
  }
  upcoming_bookings: Array<{
    id: number
    booking_number: string
    service_name: string
    provider_name: string
    event_date: string
    event_time: string
    status: string
    service_image?: string | null
  }>
  recent_bookings: Array<{
    id: number
    booking_number: string
    service_name: string
    provider_name: string
    event_date: string
    total_amount: number
    status: string
    payment_status: string
  }>
}

export default function Dashboard({ user, stats, upcoming_bookings, recent_bookings }: Props) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.total_bookings.toString(),
      description: 'All time',
      icon: Calendar,
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcoming_bookings.toString(),
      description: 'Scheduled',
      icon: Clock,
      iconBg: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Wishlist Items',
      value: stats.wishlist_items.toString(),
      description: 'Saved services',
      icon: Heart,
      iconBg: 'bg-pink-500/10 text-pink-600',
    },
    {
      title: 'Total Spent',
      value: `MWK ${stats.total_spent.toLocaleString()}`,
      description: 'All time',
      icon: Package,
      iconBg: 'bg-green-500/10 text-green-600',
    },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-700',
      confirmed: 'bg-blue-500/10 text-blue-700',
      completed: 'bg-green-500/10 text-green-700',
      cancelled: 'bg-red-500/10 text-red-700',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-700'
  }

  return (
    <CustomerLayout title="Overview">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your bookings and events.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Explore services and manage your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Search className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Browse Services</p>
                    <p className="text-xs text-muted-foreground">Discover event providers</p>
                  </div>
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Heart className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">View Wishlist</p>
                    <p className="text-xs text-muted-foreground">Saved favorites</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className={`grid gap-6${upcoming_bookings.length > 0 ? ' lg:grid-cols-2' : ''}`}>
          {/* Upcoming Bookings */}
          {upcoming_bookings.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Your scheduled events</CardDescription>
                </div>
                <Link href="/user/bookings">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcoming_bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          By {booking.provider_name}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatDate(booking.event_date)} at {booking.event_time}
                        </p>
                        <Badge className={`${getStatusColor(booking.status)} mt-2`}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your booking history</CardDescription>
              </div>
              <Link href="/user/bookings">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recent_bookings.length > 0 ? (
                  recent_bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.provider_name} • {formatDate(booking.event_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="font-medium">MWK {booking.total_amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="mb-3">No bookings yet</p>
                    <Link href="/">
                      <Button variant="outline">
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  )
}
