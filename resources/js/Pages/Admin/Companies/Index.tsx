import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  Building2,
  Search,
  SquarePen,
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Company {
  id: number
  name: string
  slug: string
  description: string | null
  business_registration_number: string | null
  tax_id: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  postal_code: string | null
  phone: string | null
  email: string | null
  website: string | null
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  } | null
  logo: string | null
  cover_image: string | null
  is_active: boolean
  catalogues_count: number
  created_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
}

interface Stats {
  total: number
  active: number
  inactive: number
  with_catalogues: number
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Filters {
  search: string
  provider: string
  country: string
  status: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Company[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  companies: PaginatedData
  stats: Stats
  providers: Provider[]
  countries: string[]
  filters: Filters
}

export default function CompaniesIndex({ admin, companies, stats, providers, countries, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.companies.index'), {
      status,
      search: filters.search,
      provider: filters.provider,
      country: filters.country,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.companies.index'), {
      status: filters.status,
      search: filters.search,
      provider,
      country: filters.country,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleCountryChange(country: string) {
    router.get(route('admin.companies.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      country,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.companies.index'), {
      status: filters.status,
      search: searchQuery,
      provider: filters.provider,
      country: filters.country,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(companyId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Are you sure you want to deactivate this company?'
      : 'Are you sure you want to activate this company?'

    if (confirm(message)) {
      router.put(route('admin.companies.toggle-active', companyId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(companyId: number, companyName: string) {
    if (confirm(`Are you sure you want to permanently delete "${companyName}"? This action cannot be undone.`)) {
      router.delete(route('admin.companies.destroy', companyId), {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title="Companies" admin={admin}>
      <Head title="Companies" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Manage corporate entities and business profiles
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.companies.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                <Building2 className="h-5 w-5 text-muted-foreground" />
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
                <p className="text-sm font-medium text-muted-foreground">With Catalogues</p>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.with_catalogues}</p>
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

              {/* Filters Row */}
              <div className="flex gap-4">
                {/* Provider Filter */}
                <div className="w-64">
                  <Select value={filters.provider || 'all'} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <div className="w-48">
                  <Select value={filters.country || 'all'} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
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
                      placeholder="Search by name, email, registration number, city..."
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

        {/* Company List */}
        <div className="space-y-4">
          {companies.data.length > 0 ? (
            companies.data.map((company) => (
              <Card key={company.id} className={cn(
                !company.is_active && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Company Logo & Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Company Logo */}
                      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold">{company.name}</h3>

                            {company.is_active ? (
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

                            {company.business_registration_number && (
                              <Badge variant="secondary">
                                Reg: {company.business_registration_number}
                              </Badge>
                            )}

                            {company.catalogues_count > 0 && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Package className="h-3 w-3 mr-1" />
                                {company.catalogues_count} Catalogues
                              </Badge>
                            )}
                          </div>

                          {company.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {company.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Briefcase className="h-3.5 w-3.5" />
                              <Link
                                href={route('admin.service-providers.edit', company.service_provider.id)}
                                className="hover:underline"
                              >
                                {company.service_provider.business_name}
                              </Link>
                            </span>
                          </div>
                        </div>

                        {/* Contact & Location Info */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          {company.city && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {company.city}
                                {company.state && `, ${company.state}`}
                                {', ' + company.country}
                              </span>
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${company.email}`} className="hover:underline">
                                {company.email}
                              </a>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${company.phone}`} className="hover:underline">
                                {company.phone}
                              </a>
                            </div>
                          )}
                          {company.website && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Globe className="h-4 w-4" />
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Created: {company.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.companies.edit', company.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Company
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(company.id, company.is_active)}
                      >
                        {company.is_active ? (
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

                      {admin.admin_role === 'super_admin' && company.catalogues_count === 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(company.id, company.name)}
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
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No companies found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No companies match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {companies.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((companies.current_page - 1) * companies.per_page) + 1} to{' '}
                  {Math.min(companies.current_page * companies.per_page, companies.total)} of{' '}
                  {companies.total} results
                </p>

                <div className="flex gap-1">
                  {companies.links.map((link, index) => (
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
