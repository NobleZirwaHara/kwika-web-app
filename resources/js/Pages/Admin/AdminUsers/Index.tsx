import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import {
  Shield,
  Search,
  SquarePen,
  UserX,
  UserCheck,
  Trash2,
  Plus,
  Activity,
  Crown,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface AdminUser {
  id: number
  name: string
  email: string
  phone: string | null
  admin_role: string
  admin_role_label: string
  admin_permissions: string[]
  admin_logs_count: number
  is_suspended: boolean
  created_at: string
  deleted_at: string | null
}

interface Stats {
  total: number
  active: number
  suspended: number
  super_admins: number
}

interface AvailableRoles {
  [key: string]: string
}

interface Filters {
  search: string
  role: string
  status: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: AdminUser[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  adminUsers: PaginatedData
  stats: Stats
  availableRoles: AvailableRoles
  filters: Filters
}

export default function AdminUsersIndex({ admin, adminUsers, stats, availableRoles, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.admin-users.index'), {
      status,
      search: filters.search,
      role: filters.role,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleRoleChange(role: string) {
    router.get(route('admin.admin-users.index'), {
      status: filters.status,
      search: filters.search,
      role,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.admin-users.index'), {
      status: filters.status,
      search: searchQuery,
      role: filters.role,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleSuspend(userId: number, userName: string) {
    if (confirm(`Are you sure you want to suspend ${userName}? They will lose access immediately.`)) {
      router.post(route('admin.admin-users.suspend', userId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleRestore(userId: number, userName: string) {
    if (confirm(`Are you sure you want to restore ${userName}? They will regain access.`)) {
      router.post(route('admin.admin-users.restore', userId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(userId: number, userName: string) {
    if (confirm(`Are you sure you want to PERMANENTLY delete ${userName}? This action cannot be undone.`)) {
      router.delete(route('admin.admin-users.destroy', userId), {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title="Admin Users" admin={admin}>
      <Head title="Admin Users" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage administrator accounts and permissions
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.admin-users.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Admins</p>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.super_admins}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <Tabs value={filters.status} onValueChange={handleStatusChange}>
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                  <TabsTrigger value="suspended">Suspended ({stats.suspended})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters Row */}
              <div className="flex gap-4">
                {/* Role Filter */}
                <div className="w-64">
                  <Select value={filters.role || 'all'} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.entries(availableRoles).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
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

        {/* Admin Users List */}
        <div className="space-y-4">
          {adminUsers.data.length > 0 ? (
            adminUsers.data.map((adminUser) => (
              <Card key={adminUser.id} className={cn(
                adminUser.is_suspended && "border-red-200 bg-red-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Admin Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold">{adminUser.name}</h3>

                          {adminUser.admin_role === 'super_admin' ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Crown className="h-3 w-3 mr-1" />
                              {adminUser.admin_role_label}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              {adminUser.admin_role_label}
                            </Badge>
                          )}

                          {adminUser.is_suspended ? (
                            <Badge variant="destructive">
                              <UserX className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}

                          {admin.id === adminUser.id && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              You
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{adminUser.email}</span>
                          {adminUser.phone && <span>{adminUser.phone}</span>}
                        </div>
                      </div>

                      {/* Permissions */}
                      {adminUser.admin_permissions.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {adminUser.admin_permissions.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {adminUser.admin_logs_count} actions
                        </span>
                        <span>Created: {adminUser.created_at}</span>
                        {adminUser.deleted_at && (
                          <span className="text-red-600">Suspended: {adminUser.deleted_at}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.admin-users.edit', adminUser.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>

                      {!adminUser.is_suspended ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspend(adminUser.id, adminUser.name)}
                          disabled={admin.id === adminUser.id}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(adminUser.id, adminUser.name)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                      )}

                      {adminUser.is_suspended && admin.id !== adminUser.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(adminUser.id, adminUser.name)}
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
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No admin users found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No admin users match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {adminUsers.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((adminUsers.current_page - 1) * adminUsers.per_page) + 1} to{' '}
                  {Math.min(adminUsers.current_page * adminUsers.per_page, adminUsers.total)} of{' '}
                  {adminUsers.total} results
                </p>

                <div className="flex gap-1">
                  {adminUsers.links.map((link, index) => (
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
