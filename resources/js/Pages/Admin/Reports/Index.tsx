import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, FileSpreadsheet, FileText, Users, DollarSign, Calendar, Tag, TrendingUp } from 'lucide-react'

interface Admin { id: number; name: string; email: string; admin_role: string }
interface OverviewStats {
  total_users: number
  total_providers: number
  total_bookings: number
  total_events: number
  total_products: number
  total_promotions: number
}
interface RevenueDataPoint { date: string; revenue: number; bookings: number }
interface UserGrowthPoint { date: string; users: number }
interface BookingStatusPoint { name: string; value: number }
interface TopProvider { name: string; revenue: number; bookings: number }
interface PromotionStat { title: string; code: string; uses: number }
interface Props {
  admin: Admin
  overviewStats: OverviewStats
  revenueData: RevenueDataPoint[]
  userGrowth: UserGrowthPoint[]
  bookingsByStatus: BookingStatusPoint[]
  topProviders: TopProvider[]
  promotionStats: PromotionStat[]
  filters: { start_date: string; end_date: string }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function ReportsIndex({
  admin,
  overviewStats,
  revenueData,
  userGrowth,
  bookingsByStatus,
  topProviders,
  promotionStats,
  filters,
}: Props) {
  function handleDateFilter(startDate: string, endDate: string) {
    router.get(route('admin.reports.index'), { start_date: startDate, end_date: endDate }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleExport(format: 'excel' | 'pdf') {
    const route_name = format === 'excel' ? 'admin.reports.export.excel' : 'admin.reports.export.pdf'
    router.post(route(route_name), filters)
  }

  return (
    <AdminLayout title="Reports & Analytics" admin={admin}>
      <Head title="Reports & Analytics" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive platform insights and metrics</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleExport('excel')} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  defaultValue={filters.start_date}
                  onChange={(e) => handleDateFilter(e.target.value, filters.end_date)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  defaultValue={filters.end_date}
                  onChange={(e) => handleDateFilter(filters.start_date, e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_users}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Providers</p>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_providers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_bookings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Events</p>
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_events}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <Tag className="h-5 w-5 text-pink-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_products}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Promotions</p>
                <Tag className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold">{overviewStats.total_promotions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Bookings Trend</CardTitle>
            <CardDescription>Daily revenue and booking count over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Bookings by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Status</CardTitle>
              <CardDescription>Distribution of booking statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Providers by Revenue</CardTitle>
              <CardDescription>Top 10 performing service providers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProviders} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Promotion Stats Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Promotions by Usage</CardTitle>
            <CardDescription>Most frequently used promotional codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Code</th>
                    <th className="text-right p-2">Uses</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionStats.map((promo, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{promo.title}</td>
                      <td className="p-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{promo.code}</code>
                      </td>
                      <td className="text-right p-2 font-semibold">{promo.uses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
