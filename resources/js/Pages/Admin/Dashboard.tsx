import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building2,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Stats {
  total_users: number
  total_providers: number
  pending_verifications: number
  total_revenue: number
  this_month_revenue: number
  total_bookings: number
  pending_reviews: number
  active_services: number
}

interface RecentUser {
  id: number
  name: string
  email: string
  role: string
  is_verified: boolean
  created_at: string
}

interface PendingProvider {
  id: number
  business_name: string
  owner_name: string
  email: string
  created_at: string
  days_waiting: number
}

interface RevenueData {
  date: string
  revenue: number
}

interface UserGrowthData {
  date: string
  count: number
}

interface BookingStat {
  status: string
  count: number
}

interface TopProvider {
  id: number
  business_name: string
  revenue: number
}

interface RecentPayment {
  id: number
  transaction_id: string | null
  amount: number
  currency: string
  payment_method: string
  status: string
  customer_name: string
  service_name: string
  created_at: string
}

interface Props {
  admin: Admin
  stats: Stats
  recent_users: RecentUser[]
  pending_providers: PendingProvider[]
  revenue_trend: RevenueData[]
  user_growth: UserGrowthData[]
  booking_stats: BookingStat[]
  top_providers: TopProvider[]
  recent_payments: RecentPayment[]
}

const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  success: 'rgb(34, 197, 94)', // green-500
  warning: 'rgb(234, 179, 8)', // yellow-500
  danger: 'rgb(239, 68, 68)', // red-500
  info: 'rgb(59, 130, 246)', // blue-500
  muted: 'hsl(var(--muted-foreground))',
}

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.info,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
]

export default function AdminDashboard({
  admin,
  stats,
  recent_users,
  pending_providers,
  revenue_trend,
  user_growth,
  booking_stats,
  top_providers,
  recent_payments,
}: Props) {
  const formatWaitingTime = (decimalDays: number): string => {
    const days = Math.floor(decimalDays)
    const hours = Math.round((decimalDays - days) * 24)

    if (days === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    } else if (hours === 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ${hours} ${hours === 1 ? 'hour' : 'hours'}`
    }
  }

  return (
    <AdminLayout title="Admin Dashboard" admin={admin}>
      <Head title="Admin Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview and key metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total_users.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Service Providers</p>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total_providers.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
                <ShieldCheck className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_verifications}</p>
              {stats.pending_verifications > 0 && (
                <Button size="sm" variant="link" className="px-0 h-auto mt-2" asChild>
                  <Link href={route('admin.verification-queue.index')}>
                    Review Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">MWK {stats.total_revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                This month: MWK {stats.this_month_revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total_bookings.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <MessageSquare className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_reviews}</p>
              {stats.pending_reviews > 0 && (
                <Button size="sm" variant="link" className="px-0 h-auto mt-2" asChild>
                  <Link href={route('admin.reviews.index')}>
                    Moderate <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active_services}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Avg per Booking</p>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">
                MWK {stats.total_bookings > 0 ? (stats.total_revenue / stats.total_bookings).toLocaleString() : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {revenue_trend && revenue_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenue_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis
                      tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue (MWK)"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.primary, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  <p>No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {user_growth && user_growth.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={user_growth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis
                      tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar
                      dataKey="count"
                      name="New Users"
                      fill={CHART_COLORS.info}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  <p>No user growth data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {booking_stats && booking_stats.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={booking_stats}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {booking_stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  <p>No booking data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Providers (This Month)</CardTitle>
              <CardDescription>Ranked by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top_providers.length > 0 ? (
                  top_providers.map((provider, index) => (
                    <div key={provider.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{provider.business_name}</span>
                      </div>
                      <span className="font-semibold">MWK {provider.revenue.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Provider Verifications */}
        {pending_providers.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>Pending Provider Verifications</CardTitle>
                </div>
                <Button size="sm" asChild>
                  <Link href={route('admin.verification-queue.index')}>
                    Review All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pending_providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <p className="font-medium">{provider.business_name}</p>
                      <p className="text-sm text-muted-foreground">{provider.owner_name} • {provider.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{formatWaitingTime(provider.days_waiting)} waiting</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Applied: {provider.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={route('admin.users.index')}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recent_users.length > 0 ? (
                  recent_users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{user.created_at}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent users</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Payments</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={route('admin.payments.index')}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recent_payments.length > 0 ? (
                  recent_payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{payment.service_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{payment.currency} {payment.amount.toLocaleString()}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent payments</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
