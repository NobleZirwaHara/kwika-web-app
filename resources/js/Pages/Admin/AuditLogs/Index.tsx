import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Label } from '@/Components/ui/label'
import {
  Activity,
  Search,
  Eye,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Filter,
} from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface LogEntry {
  id: number
  admin: {
    id: number
    name: string
    email: string
    admin_role: string
  }
  action: string
  resource_type: string
  resource_type_full: string
  resource_id: number
  old_values: any
  new_values: any
  ip_address: string | null
  user_agent: string | null
  notes: string | null
  created_at: string
  created_at_human: string
}

interface Stats {
  total: number
  today: number
  this_week: number
  this_month: number
}

interface ResourceType {
  full: string
  short: string
}

interface AdminUser {
  id: number
  name: string
  email: string
}

interface Filters {
  search: string
  admin: string
  action: string
  resource_type: string
  date_from: string
  date_to: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: LogEntry[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  logs: PaginatedData
  stats: Stats
  actions: string[]
  resourceTypes: ResourceType[]
  admins: AdminUser[]
  filters: Filters
}

export default function AuditLogsIndex({ admin, logs, stats, actions, resourceTypes, admins, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleAdminChange(adminId: string) {
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      admin: adminId,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleActionChange(action: string) {
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      action,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleResourceTypeChange(resourceType: string) {
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      resource_type: resourceType,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      date_from: e.target.value,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      date_to: e.target.value,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.audit-logs.index'), {
      ...filters,
      search: searchQuery,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function getActionBadgeColor(action: string) {
    const colors: { [key: string]: string } = {
      created: 'bg-green-50 text-green-700 border-green-200',
      updated: 'bg-blue-50 text-blue-700 border-blue-200',
      deleted: 'bg-red-50 text-red-700 border-red-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-orange-50 text-orange-700 border-orange-200',
      suspended: 'bg-purple-50 text-purple-700 border-purple-200',
      restored: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    }
    return colors[action] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <AdminLayout title="Audit Logs" admin={admin}>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track all administrative actions and changes
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.this_week}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.this_month}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* First Row - Dropdowns */}
              <div className="grid grid-cols-3 gap-4">
                {/* Admin Filter */}
                <div>
                  <Label className="text-xs mb-1">Admin User</Label>
                  <Select value={filters.admin || 'all'} onValueChange={handleAdminChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Admins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Admins</SelectItem>
                      {admins.map((a) => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Filter */}
                <div>
                  <Label className="text-xs mb-1">Action</Label>
                  <Select value={filters.action || 'all'} onValueChange={handleActionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Resource Type Filter */}
                <div>
                  <Label className="text-xs mb-1">Resource Type</Label>
                  <Select value={filters.resource_type || 'all'} onValueChange={handleResourceTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Resources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.full} value={type.short}>
                          {type.short}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Row - Dates and Search */}
              <div className="flex gap-4">
                {/* Date From */}
                <div className="w-48">
                  <Label className="text-xs mb-1">From Date</Label>
                  <Input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={handleDateFromChange}
                  />
                </div>

                {/* Date To */}
                <div className="w-48">
                  <Label className="text-xs mb-1">To Date</Label>
                  <Input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={handleDateToChange}
                  />
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="flex-1">
                    <Label className="text-xs mb-1">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search notes, resource ID, admin..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit">Search</Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs List */}
        <div className="space-y-3">
          {logs.data.length > 0 ? (
            logs.data.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                          {log.action.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">
                          {log.resource_type} #{log.resource_id}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by <span className="font-medium">{log.admin.name}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.created_at_human}
                        </span>
                      </div>

                      {/* Notes */}
                      {log.notes && (
                        <p className="text-sm">{log.notes}</p>
                      )}

                      {/* Changes Summary */}
                      {(log.old_values || log.new_values) && (
                        <div className="text-xs text-muted-foreground">
                          {log.old_values && Object.keys(log.old_values).length > 0 && (
                            <span>
                              Changed: {Object.keys(log.old_values).join(', ')}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.admin.email}
                        </span>
                        {log.ip_address && (
                          <span>IP: {log.ip_address}</span>
                        )}
                        <span>{log.created_at}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('admin.audit-logs.show', log.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No audit logs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No logs match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {logs.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((logs.current_page - 1) * logs.per_page) + 1} to{' '}
                  {Math.min(logs.current_page * logs.per_page, logs.total)} of{' '}
                  {logs.total} results
                </p>

                <div className="flex gap-1">
                  {logs.links.map((link, index) => (
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
