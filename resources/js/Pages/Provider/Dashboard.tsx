import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  Users,
  Package,
  Eye,
  ArrowUpRight,
  Clock
} from 'lucide-react'
import { Link } from '@inertiajs/react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatDate, formatPrice } from '@/lib/utils'

interface Props {
  provider: {
    id: number
    business_name: string
    logo?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
    average_rating: number
    total_reviews: number
    total_bookings: number
  }
  stats: {
    total_revenue: number
    pending_bookings: number
    active_services: number
    profile_views: number
    this_month_revenue: number
    this_month_bookings: number
    revenue_change: number
    bookings_change: number
  }
  recent_bookings: Array<{
    id: number
    booking_number: string
    user_name: string
    service_name: string
    event_date: string
    total_amount: number
    status: string
    payment_status: string
  }>
  upcoming_events: Array<{
    id: number
    service_name: string
    event_date: string
    event_time: string
    client_name: string
  }>
  revenue_trend: Array<{
    month: string
    revenue: number
  }>
  booking_distribution: Array<{
    status: string
    count: number
  }>
}

// Chart colors matching design system
const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'rgb(34, 197, 94)', // green-500
  warning: 'rgb(234, 179, 8)', // yellow-500
  danger: 'rgb(239, 68, 68)', // red-500
  info: 'rgb(59, 130, 246)', // blue-500
  muted: 'hsl(var(--muted-foreground))',
}

const STATUS_COLORS = {
  Pending: CHART_COLORS.warning,
  Confirmed: CHART_COLORS.info,
  Completed: CHART_COLORS.success,
  Cancelled: CHART_COLORS.danger,
}

export default function Dashboard({ provider, stats, recent_bookings, upcoming_events, revenue_trend, booking_distribution }: Props) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.total_revenue),
      change: `+${stats.revenue_change}% from last month`,
      changeType: stats.revenue_change >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
      iconBg: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Pending Bookings',
      value: stats.pending_bookings.toString(),
      description: 'Awaiting confirmation',
      icon: Calendar,
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Active Services',
      value: stats.active_services.toString(),
      description: 'Live on platform',
      icon: Package,
      iconBg: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Profile Views',
      value: stats.profile_views.toString(),
      change: 'This month',
      icon: Eye,
      iconBg: 'bg-orange-500/10 text-orange-600',
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
    <ProviderLayout title="Overview" provider={provider}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {provider.business_name}!</h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Verification Alert */}
        {provider.verification_status === 'pending' && (
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Profile Under Review</CardTitle>
                  <CardDescription className="text-yellow-700">
                    Your profile is currently being reviewed by our team. You'll be notified once it's approved.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

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
                  {stat.change && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {stat.changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  )}
                  {stat.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/provider/services">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Package className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Add Service</p>
                    <p className="text-xs text-muted-foreground">Create new offering</p>
                  </div>
                </Button>
              </Link>
              <Link href="/provider/settings">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Users className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Update Profile</p>
                    <p className="text-xs text-muted-foreground">Edit business info</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className={`grid gap-6${upcoming_events.length > 0 ? ' lg:grid-cols-2' : ''}`}>
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests</CardDescription>
              </div>
              <Link href="/provider/bookings">
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
                          {booking.user_name} • {formatDate(booking.event_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(booking.total_amount)}</p>
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
                    <p>No recent bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events - Only show if there are events */}
          {upcoming_events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcoming_events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Client: {event.client_name}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatDate(event.event_date)} at {event.event_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Your revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {revenue_trend && revenue_trend.length > 0 && revenue_trend.some(d => d.revenue > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenue_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatPrice(value), 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_COLORS.success}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.success, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No revenue data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Breakdown of your bookings by status</CardDescription>
            </CardHeader>
            <CardContent>
              {booking_distribution && booking_distribution.length > 0 && booking_distribution.some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={booking_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count, percent }) =>
                        count > 0 ? `${status}: ${(percent * 100).toFixed(0)}%` : ''
                      }
                      outerRadius={80}
                      fill={CHART_COLORS.primary}
                      dataKey="count"
                    >
                      {booking_distribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || CHART_COLORS.muted}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry: any) => {
                        const item = booking_distribution.find(d => d.status === value)
                        return `${value} (${item?.count || 0})`
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No booking data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your business metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Star className="h-4 w-4" />
                  <span>Average Rating</span>
                </div>
                <p className="text-3xl font-bold">{provider.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  From {provider.total_reviews} reviews
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Total Bookings</span>
                </div>
                <p className="text-3xl font-bold">{provider.total_bookings}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.bookings_change}% this month
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>This Month</span>
                </div>
                <p className="text-3xl font-bold">
                  {formatPrice(stats.this_month_revenue)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.this_month_bookings} bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  )
}
