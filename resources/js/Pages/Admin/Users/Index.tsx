import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  Users,
  Search,
  SquarePen,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  Building2,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  national_id: string
  role: string
  is_verified: boolean
  email_verified_at: string | null
  phone_verified_at: string | null
  created_at: string
  deleted_at: string | null
  is_banned: boolean
  bookings_count: number
  reviews_count: number
  has_provider_account: boolean
  provider_id: number | null
}

interface Stats {
  total: number
  customers: number
  providers: number
  verified: number
  banned: number
}

interface Filters {
  search: string
  role: string
  status: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: User[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  users: PaginatedData
  stats: Stats
  filters: Filters
}

export default function UsersIndex({ admin, users, stats, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleRoleChange(role: string) {
    router.get(route('admin.users.index'), {
      role,
      search: filters.search,
      status: filters.status,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleStatusChange(status: string) {
    router.get(route('admin.users.index'), {
      role: filters.role,
      search: filters.search,
      status,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.users.index'), {
      role: filters.role,
      search: searchQuery,
      status: filters.status,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleVerifyToggle(userId: number, currentStatus: boolean) {
    const action = currentStatus ? 'unverify' : 'verify'
    const message = currentStatus
      ? 'Are you sure you want to revoke this user\'s verification?'
      : 'Are you sure you want to verify this user?'

    if (confirm(message)) {
      router.post(route(`admin.users.${action}`, userId), {}, {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title="Users" admin={admin}>
      <Head title="Users" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage all user accounts on the platform
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.customers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Providers</p>
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.providers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Banned</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.banned}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Role Tabs */}
              <Tabs value={filters.role} onValueChange={handleRoleChange}>
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="customer">Customers ({stats.customers})</TabsTrigger>
                  <TabsTrigger value="provider">Providers ({stats.providers})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-4">
                {/* Status Tabs */}
                <Tabs value={filters.status} onValueChange={handleStatusChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="unverified">Unverified</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, email, phone, national ID..."
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

        {/* User List */}
        <div className="space-y-4">
          {users.data.length > 0 ? (
            users.data.map((user) => (
              <Card key={user.id} className={cn(
                user.is_banned && "border-red-200 bg-red-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{user.name}</h3>

                          <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>

                          {user.is_verified ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Unverified
                            </Badge>
                          )}

                          {user.is_banned && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Banned
                            </Badge>
                          )}

                          {user.has_provider_account && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Building2 className="h-3 w-3 mr-1" />
                              Has Provider Account
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {user.phone}
                            </span>
                          )}
                          {user.national_id && (
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              ID: {user.national_id}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.bookings_count}</span>
                          <span className="text-muted-foreground">bookings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.reviews_count}</span>
                          <span className="text-muted-foreground">reviews</span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Joined: {user.created_at}
                        </span>
                        {user.email_verified_at && (
                          <span>Email verified: {user.email_verified_at}</span>
                        )}
                        {user.is_banned && user.deleted_at && (
                          <span className="text-red-600">Banned: {user.deleted_at}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.users.edit', user.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Details
                        </Link>
                      </Button>

                      {!user.is_banned && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyToggle(user.id, user.is_verified)}
                        >
                          {user.is_verified ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Revoke Verification
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify User
                            </>
                          )}
                        </Button>
                      )}

                      {user.has_provider_account && user.provider_id && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('admin.service-providers.edit', user.provider_id)}>
                            <Building2 className="h-4 w-4 mr-2" />
                            View Provider
                          </Link>
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
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No users match the selected filter'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {users.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((users.current_page - 1) * users.per_page) + 1} to{' '}
                  {Math.min(users.current_page * users.per_page, users.total)} of{' '}
                  {users.total} results
                </p>

                <div className="flex gap-1">
                  {users.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      disabled={!link.url}
                      onClick={() => link.url && router.visit(link.url)}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
