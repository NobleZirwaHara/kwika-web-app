import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  Tag,
  Search,
  SquarePen,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  GripVertical,
  ArrowUpDown,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  services_count: number
  created_at: string
  updated_at: string
}

interface Stats {
  total: number
  active: number
  inactive: number
  total_services: number
}

interface Filters {
  search: string
  status: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Category[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  categories: PaginatedData
  stats: Stats
  filters: Filters
}

export default function CategoriesIndex({ admin, categories, stats, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.categories.index'), {
      status,
      search: filters.search,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.categories.index'), {
      status: filters.status,
      search: searchQuery,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(categoryId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Are you sure you want to deactivate this category?'
      : 'Are you sure you want to activate this category?'

    if (confirm(message)) {
      router.put(route('admin.categories.toggle-active', categoryId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(categoryId: number, categoryName: string) {
    if (confirm(`Are you sure you want to permanently delete "${categoryName}"? This action cannot be undone.`)) {
      router.delete(route('admin.categories.destroy', categoryId), {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title="Categories" admin={admin}>
      <Head title="Categories" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage service categories and their organization
            </p>
          </div>
          {admin.admin_role !== 'viewer' && (
            <Button asChild>
              <Link href={route('admin.categories.create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                <ArrowUpDown className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.total_services}</p>
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
                  <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or description..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <div className="space-y-4">
          {categories.data.length > 0 ? (
            categories.data.map((category) => (
              <Card key={category.id} className={cn(
                !category.is_active && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Category Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />

                          {category.icon && (
                            <span className="text-2xl">{category.icon}</span>
                          )}

                          <h3 className="text-lg font-semibold">{category.name}</h3>

                          {category.is_active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}

                          <Badge variant="secondary">
                            Order: {category.sort_order}
                          </Badge>
                        </div>

                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2 ml-10">
                            {category.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm ml-10">
                          <span className="text-muted-foreground">
                            Slug: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{category.slug}</code>
                          </span>
                          <span className="text-muted-foreground">
                            {category.services_count} {category.services_count === 1 ? 'service' : 'services'}
                          </span>
                          <span className="text-muted-foreground">
                            Created: {category.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.categories.edit', category.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Category
                        </Link>
                      </Button>

                      {admin.admin_role !== 'viewer' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(category.id, category.is_active)}
                        >
                          {category.is_active ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                      )}

                      {admin.admin_role === 'super_admin' && category.services_count === 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.name)}
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
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No categories found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No categories match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {categories.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((categories.current_page - 1) * categories.per_page) + 1} to{' '}
                  {Math.min(categories.current_page * categories.per_page, categories.total)} of{' '}
                  {categories.total} results
                </p>

                <div className="flex gap-1">
                  {categories.links.map((link, index) => (
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
