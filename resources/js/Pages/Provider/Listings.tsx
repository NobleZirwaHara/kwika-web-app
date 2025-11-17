import ProviderLayout from '@/Components/ProviderLayout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { Card, CardContent } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Plus, MoreVertical, Eye, Edit, Trash2, Package, Briefcase } from 'lucide-react'
import { useState } from 'react'

interface Service {
  id: number
  name: string
  category: string
  price: string
  status: 'active' | 'draft' | 'inactive'
  image?: string
  bookings: number
}

interface Product {
  id: number
  name: string
  category: string
  price: string
  status: 'active' | 'draft' | 'inactive'
  image?: string
  stock: number
}

export default function Listings({
  provider,
  services,
  products
}: {
  provider: any
  services?: Service[]
  products?: Product[]
}) {
  // Mock data - replace with actual data from backend
  const mockServices: Service[] = services || [
    {
      id: 1,
      name: 'Wedding Photography Package',
      category: 'Photography',
      price: '$2,500',
      status: 'active',
      bookings: 12
    },
    {
      id: 2,
      name: 'Corporate Event Catering',
      category: 'Catering',
      price: '$50/person',
      status: 'active',
      bookings: 8
    },
    {
      id: 3,
      name: 'Birthday Party DJ Service',
      category: 'Entertainment',
      price: '$500',
      status: 'draft',
      bookings: 0
    }
  ]

  const mockProducts: Product[] = products || [
    {
      id: 1,
      name: 'Premium Event Tent (20x20)',
      category: 'Equipment',
      price: '$300/day',
      status: 'active',
      stock: 5
    },
    {
      id: 2,
      name: 'LED Dance Floor',
      category: 'Equipment',
      price: '$200/day',
      status: 'active',
      stock: 3
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const EmptyState = ({ type }: { type: 'services' | 'products' }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        {type === 'services' ? (
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        No {type} yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        To get booked, you'll need to create and publish your first {type === 'services' ? 'service' : 'product'}.
      </p>
      <Link href={`/provider/${type}/create`}>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create your first {type === 'services' ? 'service' : 'product'}
        </Button>
      </Link>
    </div>
  )

  return (
    <ProviderLayout title="Listings" provider={provider}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your services and products
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/provider/products/create">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </Link>
            <Link href="/provider/services/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="services"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
            >
              Services ({mockServices.length})
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
            >
              Products ({mockProducts.length})
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            {mockServices.length === 0 ? (
              <EmptyState type="services" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <p className="text-lg font-bold text-primary">{service.price}</p>
                          <p className="text-xs text-muted-foreground">{service.bookings} bookings</p>
                        </div>

                        <div className="flex gap-1">
                          <Link href={`/provider/services/${service.id}`}>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/provider/services/${service.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" title="More options">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            {mockProducts.length === 0 ? (
              <EmptyState type="products" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <p className="text-lg font-bold text-primary">{product.price}</p>
                          <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                        </div>

                        <div className="flex gap-1">
                          <Link href={`/provider/products/${product.id}`}>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/provider/products/${product.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" title="More options">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  )
}
