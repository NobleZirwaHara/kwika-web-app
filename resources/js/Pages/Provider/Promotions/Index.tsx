import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tag, Plus, Edit, Trash2, Search, Power, Calendar, Users } from 'lucide-react'

interface Promotion {
  id: number
  title: string
  description: string | null
  code: string | null
  type: string
  discount_value: number
  discount_display: string
  applicable_to: string
  start_date: string
  end_date: string
  usage_count: number
  usage_limit: number | null
  remaining_uses: number | null
  status: string
  is_active: boolean
  banner_image: string | null
  created_at: string
}

interface Filters {
  status?: string
  type?: string
  search?: string
}

interface Props {
  promotions: Promotion[]
  filters: Filters
}

export default function PromotionsIndex({ promotions, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all')
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all')

  function handleFilter() {
    router.get('/provider/promotions', {
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setTypeFilter('all')
    router.get('/provider/promotions')
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      router.delete(`/provider/promotions/${id}`)
    }
  }

  function toggleStatus(id: number) {
    router.put(`/provider/promotions/${id}/toggle`, {}, {
      preserveScroll: true,
    })
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'active': return 'default'
      case 'upcoming': return 'secondary'
      case 'expired': return 'outline'
      case 'exhausted': return 'destructive'
      case 'inactive': return 'outline'
      default: return 'secondary'
    }
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      percentage: 'Percentage Off',
      fixed_amount: 'Fixed Amount',
      bundle: 'Bundle Deal',
      early_bird: 'Early Bird',
    }
    return labels[type] || type
  }

  return (
    <ProviderLayout title="Promotions">
      <Head title="Promotions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-muted-foreground mt-1">
              Manage discounts and promotional offers
            </p>
          </div>
          <Button asChild>
            <Link href="/provider/promotions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <Input
                  placeholder="Search by title or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    <SelectItem value="bundle">Bundle Deal</SelectItem>
                    <SelectItem value="early_bird">Early Bird</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotions Grid */}
        {promotions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {promotion.banner_image && (
                    <div className="mb-4 -mt-6 -mx-6 h-32 overflow-hidden rounded-t-lg">
                      <img
                        src={promotion.banner_image}
                        alt={promotion.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {!promotion.banner_image && (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{promotion.title}</CardTitle>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant={getStatusBadgeVariant(promotion.status)}>
                            {promotion.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(promotion.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {promotion.description && (
                    <CardDescription className="line-clamp-2 mb-4">
                      {promotion.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    {/* Discount */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Discount:</span>
                      <span className="font-semibold text-primary text-lg">
                        {promotion.discount_display}
                      </span>
                    </div>

                    {/* Code */}
                    {promotion.code && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Code:</span>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {promotion.code}
                        </code>
                      </div>
                    )}

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{promotion.start_date} - {promotion.end_date}</span>
                    </div>

                    {/* Usage */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Usage:
                      </span>
                      <span className="font-medium">
                        {promotion.usage_count}
                        {promotion.usage_limit && ` / ${promotion.usage_limit}`}
                        {promotion.remaining_uses !== null && (
                          <span className="text-muted-foreground ml-1">
                            ({promotion.remaining_uses} left)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(promotion.id)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/provider/promotions/${promotion.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(promotion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Promotions Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {filters.search || filters.status || filters.type
                  ? 'No promotions match your current filters. Try adjusting them.'
                  : 'Create your first promotion to attract more customers with special offers.'}
              </p>
              <Button asChild>
                <Link href="/provider/promotions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promotion
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
