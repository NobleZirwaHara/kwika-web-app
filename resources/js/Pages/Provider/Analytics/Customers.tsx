import { Head, Link } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import DateRangeSelector from '@/Components/Analytics/DateRangeSelector'
import MetricCard from '@/Components/Analytics/MetricCard'
import StatusPieChart from '@/Components/Analytics/StatusPieChart'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { ArrowLeft, Users, TrendingUp, Award } from 'lucide-react'

interface DateRange {
  start_date: string
  end_date: string
}

interface TopCustomer {
  id: number
  name: string
  email: string
  total_bookings: number
  lifetime_value: number
}

interface NewVsReturning {
  type: string
  count: number
}

interface CLVDistribution {
  range: string
  count: number
}

interface Summary {
  total_customers: number
  new_customers: number
  returning_customers: number
  repeat_rate: number
  avg_customer_value: number
}

interface Props {
  dateRange: DateRange
  top_customers: TopCustomer[]
  new_vs_returning: NewVsReturning[]
  clv_distribution: CLVDistribution[]
  summary: Summary
  currency: string
}

export default function CustomersAnalytics({
  dateRange,
  top_customers,
  new_vs_returning,
  clv_distribution,
  summary,
  currency,
}: Props) {
  const vipCustomers = top_customers.filter(c => c.total_bookings >= 3)

  return (
    <ProviderLayout title="Customer Analytics">
      <Head title="Customer Analytics" />

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
              <h1 className="text-3xl font-bold">Customer Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Understand your customer base and loyalty
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
            title="Total Customers"
            value={summary.total_customers}
            format="number"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="New Customers"
            value={summary.new_customers}
            format="number"
            icon={<TrendingUp className="h-5 w-5" />}
            description="First-time customers"
          />
          <MetricCard
            title="Repeat Rate"
            value={summary.repeat_rate}
            format="percentage"
            icon={<Award className="h-5 w-5" />}
            description="Customers who book again"
          />
          <MetricCard
            title="Avg Customer Value"
            value={summary.avg_customer_value}
            format="currency"
            currency={currency}
            description="Average spending per customer"
          />
        </div>

        {/* VIP Customers Highlight */}
        {vipCustomers.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <h3 className="text-xl font-bold">VIP Customers</h3>
                <Badge variant="secondary">{vipCustomers.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Customers with 3 or more bookings - your most loyal supporters
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {vipCustomers.slice(0, 6).map((customer) => (
                  <div key={customer.id} className="p-3 bg-background border rounded-lg">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <div className="flex gap-3 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Bookings</p>
                        <p className="font-semibold">{customer.total_bookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="font-semibold">{currency} {customer.lifetime_value.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* New vs Returning */}
          <StatusPieChart
            data={new_vs_returning}
            title="New vs. Returning Customers"
            description="Customer acquisition and retention"
            nameKey="type"
          />

          {/* Customer Lifetime Value Distribution */}
          <StatusPieChart
            data={clv_distribution}
            title="Customer Value Distribution"
            description="Spending ranges across customers"
            nameKey="range"
          />
        </div>

        {/* Top Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Lifetime Value</CardTitle>
            <CardDescription>Your most valuable customers ranked by total spending</CardDescription>
          </CardHeader>
          <CardContent>
            {top_customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Total Bookings</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Lifetime Value</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Avg per Booking</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {top_customers.map((customer, index) => (
                      <tr key={customer.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && <span className="font-medium text-muted-foreground">#{index + 1}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {customer.total_bookings}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {currency} {customer.lifetime_value.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {currency} {(customer.lifetime_value / customer.total_bookings).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {customer.total_bookings >= 5 ? (
                            <Badge variant="default">Champion</Badge>
                          ) : customer.total_bookings >= 3 ? (
                            <Badge variant="secondary">VIP</Badge>
                          ) : customer.total_bookings >= 2 ? (
                            <Badge variant="outline">Returning</Badge>
                          ) : (
                            <Badge variant="outline">New</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No customer data available for this period
              </p>
            )}
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Customer Retention</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.repeat_rate}% of customers have made multiple bookings - {
                      summary.repeat_rate >= 40 ? 'Excellent retention!' :
                      summary.repeat_rate >= 25 ? 'Good retention, but there\'s room to grow.' :
                      'Focus on improving customer experience to increase repeat bookings.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Customer Acquisition</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.new_customers} new customers in this period{' '}
                    ({summary.total_customers > 0 ? ((summary.new_customers / summary.total_customers) * 100).toFixed(1) : 0}% of total) - {
                      summary.new_customers / Math.max((new Date(dateRange.end_date).getTime() - new Date(dateRange.start_date).getTime()) / (1000 * 60 * 60 * 24), 1) >= 1
                        ? 'Strong acquisition rate!'
                        : 'Consider marketing efforts to attract more customers.'
                    }
                  </p>
                </div>
              </div>
              {top_customers.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Top Spender</p>
                    <p className="text-sm text-muted-foreground">
                      {top_customers[0].name} is your most valuable customer with{' '}
                      {currency} {top_customers[0].lifetime_value.toLocaleString()} total spend across{' '}
                      {top_customers[0].total_bookings} booking{top_customers[0].total_bookings !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Average Customer Value</p>
                  <p className="text-sm text-muted-foreground">
                    Each customer spends an average of {currency} {summary.avg_customer_value.toLocaleString()} - {
                      summary.avg_customer_value >= 100000 ? 'High-value customer base!' :
                      summary.avg_customer_value >= 50000 ? 'Moderate customer value.' :
                      'Consider upselling or premium offerings to increase customer value.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  )
}
