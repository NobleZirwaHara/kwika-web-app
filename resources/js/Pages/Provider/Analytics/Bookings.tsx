import { Head, Link } from '@inertiajs/react'
import ProviderLayout from '@/components/ProviderLayout'
import DateRangeSelector from '@/components/Analytics/DateRangeSelector'
import MetricCard from '@/components/Analytics/MetricCard'
import RevenueChart from '@/components/Analytics/RevenueChart'
import StatusPieChart from '@/components/Analytics/StatusPieChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface DateRange {
  start_date: string
  end_date: string
}

interface BookingVolumePoint {
  date: string
  count: number
}

interface StatusFunnelPoint {
  status: string
  count: number
}

interface AvgBookingValuePoint {
  date: string
  avg_value: number
}

interface BookingByDay {
  day: string
  count: number
}

interface Summary {
  total_bookings: number
  confirmed_bookings: number
  completed_bookings: number
  cancelled_bookings: number
  conversion_rate: number
  cancellation_rate: number
  avg_booking_value: number
}

interface Props {
  dateRange: DateRange
  booking_volume: BookingVolumePoint[]
  status_funnel: StatusFunnelPoint[]
  avg_booking_value: AvgBookingValuePoint[]
  booking_by_day: BookingByDay[]
  summary: Summary
  currency: string
}

export default function BookingsAnalytics({
  dateRange,
  booking_volume,
  status_funnel,
  avg_booking_value,
  booking_by_day,
  summary,
  currency,
}: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{payload[0].payload.date || payload[0].payload.day}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ProviderLayout title="Booking Analytics">
      <Head title="Booking Analytics" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/analytics">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Booking Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Booking trends, conversion rates, and patterns
              </p>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <DateRangeSelector
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
        />

        {/* Summary KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Total Bookings"
            value={summary.total_bookings}
            format="number"
          />
          <MetricCard
            title="Conversion Rate"
            value={summary.conversion_rate}
            format="percentage"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard
            title="Cancellation Rate"
            value={summary.cancellation_rate}
            format="percentage"
            icon={<TrendingDown className="h-5 w-5" />}
          />
          <MetricCard
            title="Avg Booking Value"
            value={summary.avg_booking_value}
            format="currency"
            currency={currency}
          />
        </div>

        {/* Booking Status Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{summary.confirmed_bookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{summary.completed_bookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{summary.cancelled_bookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {summary.total_bookings - summary.confirmed_bookings - summary.completed_bookings - summary.cancelled_bookings}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Volume Trend</CardTitle>
            <CardDescription>Number of bookings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={booking_volume}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Bookings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Funnel */}
          <StatusPieChart
            data={status_funnel}
            title="Booking Status Funnel"
            description="Distribution of bookings by status"
          />

          {/* Booking by Day of Week */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Day of Week</CardTitle>
              <CardDescription>Popular booking days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={booking_by_day}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Bookings"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Average Booking Value Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Average Booking Value Trend</CardTitle>
            <CardDescription>How your average booking value changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={avg_booking_value}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-medium mb-1">{payload[0].payload.date}</p>
                          <p className="text-sm" style={{ color: payload[0].color }}>
                            Avg Value: {currency} {payload[0].value.toLocaleString()}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avg_value"
                  name="Avg Booking Value"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Conversion Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.conversion_rate}% of bookings are confirmed - {
                      summary.conversion_rate >= 70 ? 'Excellent!' :
                      summary.conversion_rate >= 50 ? 'Good, but there\'s room for improvement.' :
                      'Consider reviewing your booking process.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Cancellation Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.cancellation_rate}% cancellation rate - {
                      summary.cancellation_rate <= 10 ? 'Very low, great job!' :
                      summary.cancellation_rate <= 20 ? 'Within acceptable range.' :
                      'Consider reviewing cancellation policies.'
                    }
                  </p>
                </div>
              </div>
              {booking_by_day.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Peak Booking Day</p>
                    <p className="text-sm text-muted-foreground">
                      Most bookings occur on{' '}
                      {booking_by_day.reduce((max, item) => item.count > max.count ? item : max, booking_by_day[0]).day}
                      {' '}with{' '}
                      {booking_by_day.reduce((max, item) => item.count > max.count ? item : max, booking_by_day[0]).count}
                      {' '}bookings
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  )
}
