import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Badge } from '@/Components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Plus, Edit, Trash2, Search, Package, DollarSign } from 'lucide-react'

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  sku: string | null
  price: number
  sale_price: number | null
  currency: string
  display_price: string
  is_on_sale: boolean
  stock_quantity: number
  track_inventory: boolean
  is_in_stock: boolean
  unit: string | null
  is_active: boolean
  is_featured: boolean
  primary_image: string | null
  catalogue: {
    id: number
    name: string
  }
  created_at: string
}

interface Catalogue {
  id: number
  name: string
}

interface Filters {
  catalogue_id?: string
  stock_status?: string
  is_active?: string
  search?: string
}

interface Props {
  products: Product[]
  catalogues: Catalogue[]
  filters: Filters
}

export default function ProductsIndex({ products, catalogues, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [catalogueFilter, setCatalogueFilter] = useState(filters.catalogue_id || 'all')
  const [stockStatusFilter, setStockStatusFilter] = useState(filters.stock_status || 'all')
  const [activeFilter, setActiveFilter] = useState(filters.is_active || 'all')

  function handleFilter() {
    router.get('/provider/products', {
      search: search || undefined,
      catalogue_id: catalogueFilter !== 'all' ? catalogueFilter : undefined,
      stock_status: stockStatusFilter !== 'all' ? stockStatusFilter : undefined,
      is_active: activeFilter !== 'all' ? activeFilter : undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function clearFilters() {
    setSearch('')
    setCatalogueFilter('all')
    setStockStatusFilter('all')
    setActiveFilter('all')
    router.get('/provider/products')
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      router.delete(`/provider/products/${id}`)
    }
  }

  function toggleActive(id: number) {
    router.put(`/provider/products/${id}/toggle`)
  }

  return (
    <ProviderLayout title="Products">
      <Head title="Products" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory and pricing
            </p>
          </div>
          <Button asChild>
            <Link href="/provider/products/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>

              <div className="space-y-2">
                <Select value={catalogueFilter} onValueChange={setCatalogueFilter}>
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

              <div className="space-y-2">
                <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {product.primary_image && (
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {product.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                        {product.is_on_sale && (
                          <Badge variant="destructive">On Sale</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {product.description && (
                    <CardDescription className="line-clamp-2 mb-4">
                      {product.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    {/* SKU */}
                    {product.sku && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-medium font-mono">{product.sku}</span>
                      </div>
                    )}

                    {/* Catalogue */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Catalogue:</span>
                      <Badge variant="outline" className="text-xs">
                        {product.catalogue.name}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Price:
                      </span>
                      <div className="flex items-center gap-2">
                        {product.is_on_sale && product.sale_price && (
                          <span className="line-through text-muted-foreground">
                            {product.currency} {product.price.toFixed(2)}
                          </span>
                        )}
                        <span className="font-medium">
                          {product.display_price}
                        </span>
                      </div>
                    </div>

                    {/* Stock */}
                    {product.track_inventory && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Stock:
                        </span>
                        <Badge variant={product.is_in_stock ? 'default' : 'destructive'}>
                          {product.stock_quantity} {product.unit || 'units'}
                        </Badge>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleActive(product.id)}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/provider/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {filters.search || filters.catalogue_id || filters.stock_status || filters.is_active
                  ? 'No products match your current filters. Try adjusting them.'
                  : 'Start adding products to your catalogues to showcase your inventory.'}
              </p>
              <Button asChild>
                <Link href="/provider/products/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
