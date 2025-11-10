import { Head, Link, router } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Package, Plus, Edit, Trash2, Building2 } from 'lucide-react'

interface Company {
  id: number
  name: string
  logo: string | null
}

interface ProductCatalogue {
  id: number
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  is_active: boolean
  is_featured: boolean
  display_order: number
  products_count: number
  company: Company
  created_at: string
}

interface Props {
  catalogues: ProductCatalogue[]
}

export default function ProductCataloguesIndex({ catalogues }: Props) {
  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this product catalogue? This action cannot be undone.')) {
      router.delete(`/provider/product-catalogues/${id}`)
    }
  }

  return (
    <ProviderLayout title="Product Catalogues">
      <Head title="Product Catalogues" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Catalogues</h1>
            <p className="text-muted-foreground mt-1">
              Organize your products into catalogues for better presentation
            </p>
          </div>
          <Button asChild>
            <Link href="/provider/product-catalogues/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Product Catalogue
            </Link>
          </Button>
        </div>

        {/* Catalogues Grid */}
        {catalogues.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {catalogues.map((catalogue) => (
              <Card key={catalogue.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {catalogue.cover_image && (
                    <div className="mb-4 -mt-6 -mx-6 h-32 overflow-hidden rounded-t-lg">
                      <img
                        src={catalogue.cover_image}
                        alt={catalogue.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {!catalogue.cover_image && (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{catalogue.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={catalogue.is_active ? 'default' : 'secondary'}>
                            {catalogue.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {catalogue.is_featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {catalogue.description && (
                    <CardDescription className="line-clamp-2 mb-4">
                      {catalogue.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    {/* Company Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {catalogue.company.logo ? (
                        <img
                          src={catalogue.company.logo}
                          alt={catalogue.company.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                      <span>{catalogue.company.name}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {catalogue.products_count} product{catalogue.products_count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-muted-foreground">{catalogue.created_at}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/provider/product-catalogues/${catalogue.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(catalogue.id)}
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
              <h3 className="text-xl font-semibold mb-2">No Product Catalogues Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create your first product catalogue to start organizing your products.
              </p>
              <Button asChild>
                <Link href="/provider/product-catalogues/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product Catalogue
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
