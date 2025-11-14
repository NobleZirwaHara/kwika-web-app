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
  ShoppingBag,
  Search,
  SquarePen,
  Building2,
  DollarSign,
  Package,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string
  sku: string | null
  price: number
  sale_price: number | null
  currency: string
  stock_quantity: number
  track_inventory: boolean
  unit: string | null
  weight: number | null
  dimensions: string | null
  primary_image: string | null
  is_active: boolean
  is_featured: boolean
  is_on_sale: boolean
  is_in_stock: boolean
  display_price: string
  created_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
  catalogue: {
    id: number
    name: string
  } | null
}

interface Stats {
  total: number
  active: number
  inactive: number
  in_stock: number
  out_of_stock: number
  featured: number
}

interface Catalogue {
  id: number
  name: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Filters {
  search: string
  provider: string
  catalogue: string
  status: string
  stock: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  products: PaginatedData
  stats: Stats
  catalogues: Catalogue[]
  providers: Provider[]
  filters: Filters
}

export default function ProductsIndex({ admin, products, stats, catalogues, providers, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  function handleStatusChange(status: string) {
    router.get(route('admin.products.index'), {
      status,
      search: filters.search,
      provider: filters.provider,
      catalogue: filters.catalogue,
      stock: filters.stock,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleStockChange(stock: string) {
    router.get(route('admin.products.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      catalogue: filters.catalogue,
      stock,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleProviderChange(provider: string) {
    router.get(route('admin.products.index'), {
      status: filters.status,
      search: filters.search,
      provider,
      catalogue: filters.catalogue,
      stock: filters.stock,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleCatalogueChange(catalogue: string) {
    router.get(route('admin.products.index'), {
      status: filters.status,
      search: filters.search,
      provider: filters.provider,
      catalogue,
      stock: filters.stock,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.products.index'), {
      status: filters.status,
      search: searchQuery,
      provider: filters.provider,
      catalogue: filters.catalogue,
      stock: filters.stock,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleToggleActive(productId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Are you sure you want to deactivate this product?'
      : 'Are you sure you want to activate this product?'

    if (confirm(message)) {
      router.put(route('admin.products.toggle-active', productId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleToggleFeatured(productId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Remove this product from featured?'
      : 'Mark this product as featured?'

    if (confirm(message)) {
      router.put(route('admin.products.toggle-featured', productId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(productId: number, productName: string) {
    if (confirm(`Are you sure you want to permanently delete "${productName}"? This action cannot be undone.`)) {
      router.delete(route('admin.products.destroy', productId), {
        preserveScroll: true,
      })
    }
  }

  function formatPrice(product: Product) {
    if (product.is_on_sale && product.sale_price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">{product.currency} {product.sale_price.toFixed(2)}</span>
          <span className="text-muted-foreground line-through text-sm">{product.currency} {product.price.toFixed(2)}</span>
        </div>
      )
    }
    return `${product.currency} ${product.price.toFixed(2)}`
  }

  return (
    <AdminLayout title="Products" admin={admin}>
      <Head title="Products" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage all products offered by providers
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.products.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
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
                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.in_stock}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.out_of_stock}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <div className="flex gap-4">
                <Tabs value={filters.status} onValueChange={handleStatusChange}>
                  <TabsList>
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs value={filters.stock} onValueChange={handleStockChange}>
                  <TabsList>
                    <TabsTrigger value="all">All Stock</TabsTrigger>
                    <TabsTrigger value="in_stock">In Stock ({stats.in_stock})</TabsTrigger>
                    <TabsTrigger value="out_of_stock">Out ({stats.out_of_stock})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

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

                {/* Catalogue Filter */}
                <div className="w-64">
                  <Select value={filters.catalogue || 'all'} onValueChange={handleCatalogueChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Catalogues" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Catalogues</SelectItem>
                      {catalogues.map((catalogue) => (
                        <SelectItem key={catalogue.id} value={catalogue.id.toString()}>
                          {catalogue.name}
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
                      placeholder="Search by name, SKU, description, provider..."
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

        {/* Product List */}
        <div className="space-y-4">
          {products.data.length > 0 ? (
            products.data.map((product) => (
              <Card key={product.id} className={cn(
                !product.is_active && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Product Image & Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold">{product.name}</h3>

                            {product.is_active ? (
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

                            {product.is_featured && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}

                            {product.is_on_sale && (
                              <Badge variant="destructive">
                                SALE
                              </Badge>
                            )}

                            {!product.is_in_stock && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Out of Stock
                              </Badge>
                            )}

                            {product.sku && (
                              <Badge variant="secondary">
                                SKU: {product.sku}
                              </Badge>
                            )}
                          </div>

                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {product.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Building2 className="h-3.5 w-3.5" />
                              <Link
                                href={route('admin.service-providers.edit', product.service_provider.id)}
                                className="hover:underline"
                              >
                                {product.service_provider.business_name}
                              </Link>
                            </span>
                            {product.catalogue && (
                              <span className="text-muted-foreground">
                                Catalogue: {product.catalogue.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {formatPrice(product)}
                          </div>
                          {product.track_inventory && (
                            <div className="flex items-center gap-1.5">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className={cn(
                                "font-medium",
                                product.stock_quantity === 0 && "text-orange-600",
                                product.stock_quantity > 0 && product.stock_quantity <= 10 && "text-yellow-600"
                              )}>
                                Stock: {product.stock_quantity}
                              </span>
                              {product.unit && <span className="text-muted-foreground">{product.unit}</span>}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Created: {product.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.products.edit', product.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit Product
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                      >
                        {product.is_active ? (
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                      >
                        {product.is_featured ? (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Unfeature
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Feature
                          </>
                        )}
                      </Button>

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.name)}
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
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No products match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {products.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((products.current_page - 1) * products.per_page) + 1} to{' '}
                  {Math.min(products.current_page * products.per_page, products.total)} of{' '}
                  {products.total} results
                </p>

                <div className="flex gap-1">
                  {products.links.map((link, index) => (
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
