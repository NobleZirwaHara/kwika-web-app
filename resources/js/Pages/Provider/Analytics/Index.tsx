import { Head, Link } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import DateRangeSelector from '@/Components/Analytics/DateRangeSelector'
import MetricCard from '@/Components/Analytics/MetricCard'
import RevenueChart from '@/Components/Analytics/RevenueChart'
import StatusPieChart from '@/Components/Analytics/StatusPieChart'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
  Download,
  ChevronRight
} from 'lucide-react'

interface DateRange {
  start_date: string
  end_date: string
}

interface KPIs {
  total_revenue: number
  total_bookings: number
  conversion_rate: number
  average_rating: number
  average_booking_value: number
  cancellation_rate: number
  revenue_change: number
  bookings_change: number
}

interface DataPoint {
  date: string
  revenue: number
}

interface StatusPoint {
  status: string
  count: number
}

interface TopService {
  name: string
  revenue: number
  bookings: number
  currency: string
}

interface PaymentMethod {
  method: string
  count: number
  total: number
}

interface Props {
  dateRange: DateRange
  kpis: KPIs
  revenue_trend: DataPoint[]
  status_distribution: StatusPoint[]
  top_services: TopService[]
  payment_methods: PaymentMethod[]
  currency: string
}

export default function AnalyticsIndex({
  dateRange,
  kpis,
  revenue_trend,
  status_distribution,
  top_services,
  payment_methods,
  currency,
}: Props) {
  function handleExport(type: string) {
    const params = new URLSearchParams({
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      type,
    })
    window.location.href = `/provider/analytics/export?${params.toString()}`
  }

  return (
    <ProviderLayout title="Analytics">
      <Head title="Analytics" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your business performance
            </p>
          </div>
          <Button onClick={() => handleExport('overview')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Date Range Selector */}
        <DateRangeSelector
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={kpis.total_revenue}
            format="currency"
            currency={currency}
            change={kpis.revenue_change}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Bookings"
            value={kpis.total_bookings}
            format="number"
            change={kpis.bookings_change}
            icon={<Calendar className="h-5 w-5" />}
          />
          <MetricCard
            title="Conversion Rate"
            value={kpis.conversion_rate}
            format="percentage"
            icon={<TrendingUp className="h-5 w-5" />}
            description="Percentage of bookings confirmed"
          />
          <MetricCard
            title="Average Rating"
            value={kpis.average_rating}
            format="number"
            icon={<Star className="h-5 w-5" />}
            description="Out of 5.0 stars"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Avg Booking Value"
            value={kpis.average_booking_value}
            format="currency"
            currency={currency}
          />
          <MetricCard
            title="Cancellation Rate"
            value={kpis.cancellation_rate}
            format="percentage"
            description="Percentage of bookings cancelled"
          />
          <MetricCard
            title="Active Services"
            value={top_services.length}
            format="number"
            description="Services with bookings"
          />
        </div>

        {/* Revenue Trend Chart */}
        <RevenueChart
          data={revenue_trend}
          title="Revenue Trend"
          description="Daily revenue over the selected period"
          type="area"
          currency={currency}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Booking Status Distribution */}
          <StatusPieChart
            data={status_distribution}
            title="Booking Status Distribution"
            description="Breakdown of bookings by status"
          />

          {/* Payment Methods */}
          {payment_methods.length > 0 && (
            <StatusPieChart
              data={payment_methods}
              title="Payment Methods"
              description="Distribution by payment type"
              nameKey="method"
            />
          )}
        </div>

        {/* Top Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Performing Services</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ranked by revenue in the selected period
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/analytics/services">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {top_services.length > 0 ? (
              <div className="space-y-4">
                {top_services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.bookings} booking{service.bookings !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {service.currency} {service.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.currency} {(service.revenue / service.bookings).toLocaleString()} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No service data available for this period
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
            <Link href="/provider/analytics/revenue">
              <DollarSign className="h-6 w-6" />
              <span>Revenue Details</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
            <Link href="/provider/analytics/bookings">
              <Calendar className="h-6 w-6" />
              <span>Booking Analytics</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
            <Link href="/provider/analytics/services">
              <TrendingUp className="h-6 w-6" />
              <span>Service Performance</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
            <Link href="/provider/analytics/customers">
              <Star className="h-6 w-6" />
              <span>Customer Insights</span>
            </Link>
          </Button>
        </div>
      </div>
    </ProviderLayout>
  )
}
