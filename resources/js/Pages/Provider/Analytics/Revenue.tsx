import { Head, Link, router } from '@inertiajs/react'
import ProviderLayout from '@/components/ProviderLayout'
import DateRangeSelector from '@/components/Analytics/DateRangeSelector'
import RevenueChart from '@/components/Analytics/RevenueChart'
import ServiceBarChart from '@/components/Analytics/ServiceBarChart'
import StatusPieChart from '@/components/Analytics/StatusPieChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Download, DollarSign } from 'lucide-react'

interface DateRange {
  start_date: string
  end_date: string
}

interface RevenueTrendPoint {
  period: string
  revenue: number
  bookings: number
}

interface ServiceRevenue {
  name: string
  revenue: number
  bookings: number
  avg_value: number
}

interface DepositVsFull {
  deposit_only: number
  fully_paid: number
}

interface Summary {
  total_revenue: number
  pending_revenue: number
  refunded_revenue: number
}

interface Props {
  dateRange: DateRange
  groupBy: string
  revenue_trend: RevenueTrendPoint[]
  revenue_by_service: ServiceRevenue[]
  deposit_vs_full: DepositVsFull
  summary: Summary
  currency: string
}

export default function RevenueAnalytics({
  dateRange,
  groupBy,
  revenue_trend,
  revenue_by_service,
  deposit_vs_full,
  summary,
  currency,
}: Props) {
  function handleGroupByChange(value: string) {
    router.get('/provider/analytics/revenue', {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      group_by: value,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleExport() {
    const params = new URLSearchParams({
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      type: 'revenue',
    })
    window.location.href = `/provider/analytics/export?${params.toString()}`
  }

  const depositVsFullData = [
    { name: 'Deposit Only', value: deposit_vs_full.deposit_only },
    { name: 'Fully Paid', value: deposit_vs_full.fully_paid },
  ]

  return (
    <ProviderLayout title="Revenue Analytics">
      <Head title="Revenue Analytics" />

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
              <h1 className="text-3xl font-bold">Revenue Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Detailed revenue breakdown and trends
              </p>
            </div>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Date Range Selector */}
        <DateRangeSelector
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
        />

        {/* Revenue Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              </div>
              <p className="text-3xl font-bold">
                {currency} {summary.total_revenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Fully paid and deposit paid bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-medium text-muted-foreground">Pending Revenue</p>
              </div>
              <p className="text-3xl font-bold">
                {currency} {summary.pending_revenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Remaining balance on deposit-paid bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-muted-foreground">Refunded Revenue</p>
              </div>
              <p className="text-3xl font-bold">
                {currency} {summary.refunded_revenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Cancelled bookings (potential refunds)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart with Group By */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Revenue and booking volume over time</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Group by:</Label>
                <Select value={groupBy} onValueChange={handleGroupByChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart
              data={revenue_trend}
              type="area"
              currency={currency}
              showBookings
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue by Service */}
          <ServiceBarChart
            data={revenue_by_service}
            title="Revenue by Service"
            description="Compare revenue across your services"
            currency={currency}
            showRevenue
            showBookings={false}
          />

          {/* Deposit vs Full Payment */}
          <StatusPieChart
            data={depositVsFullData}
            title="Payment Structure"
            description="Deposit vs. full payment breakdown"
            valueKey="value"
          />
        </div>

        {/* Revenue by Service Table */}
        <Card>
          <CardHeader>
            <CardTitle>Service Revenue Breakdown</CardTitle>
            <CardDescription>Detailed revenue analysis for each service</CardDescription>
          </CardHeader>
          <CardContent>
            {revenue_by_service.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Bookings</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Total Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Avg Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {revenue_by_service.map((service, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{service.name}</td>
                        <td className="px-4 py-3 text-right">{service.bookings}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {currency} {service.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {currency} {service.avg_value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50 font-semibold">
                    <tr>
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right">
                        {revenue_by_service.reduce((sum, s) => sum + s.bookings, 0)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currency} {revenue_by_service.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currency}{' '}
                        {revenue_by_service.length > 0
                          ? (
                              revenue_by_service.reduce((sum, s) => sum + s.revenue, 0) /
                              revenue_by_service.reduce((sum, s) => sum + s.bookings, 0)
                            ).toLocaleString()
                          : 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No revenue data available for this period
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  )
}
