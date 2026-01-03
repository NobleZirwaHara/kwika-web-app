import { useState } from 'react'
import { router, Head } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Plus, Edit, Trash2, Package as PackageIcon, Eye, EyeOff, DollarSign } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog'

interface Service {
  id: number
  name: string
}

interface PackageItem {
  id: number
  service_id: number
  quantity: number
  unit_price: number
  subtotal: number
  service?: Service
}

interface ServicePackage {
  id: number
  name: string
  slug: string
  description: string | null
  package_type: 'tier' | 'bundle'
  base_price: number
  final_price: number
  currency: string
  is_active: boolean
  is_featured: boolean
  items?: PackageItem[]
}

interface Props {
  packages: ServicePackage[]
}

export default function PackagesIndex({ packages }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<number | null>(null)

  const handleDelete = () => {
    if (packageToDelete) {
      router.delete(route('provider.packages.destroy', packageToDelete), {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPackageToDelete(null)
        },
      })
    }
  }

  const handleToggle = (packageId: number) => {
    router.put(
      route('provider.packages.toggle', packageId),
      {},
      {
        preserveScroll: true,
      }
    )
  }

  const formatPrice = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`
  }

  return (
    <ProviderLayout>
      <Head title="My Packages" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Packages</h1>
              <p className="text-gray-600 mt-1">
                Create and manage service packages for your customers
              </p>
            </div>
            <Button onClick={() => router.get(route('provider.packages.create'))}>
              <Plus className="w-4 h-4 mr-2" />
              New Package
            </Button>
          </div>

          {/* Packages Grid */}
          {packages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PackageIcon className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Create service packages to offer bundled services or tier options to your customers.
                </p>
                <Button onClick={() => router.get(route('provider.packages.create'))}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={pkg.package_type === 'bundle' ? 'default' : 'secondary'}>
                            {pkg.package_type === 'bundle' ? 'Bundle' : 'Tier'}
                          </Badge>
                          {pkg.is_featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Featured
                            </Badge>
                          )}
                          {!pkg.is_active && (
                            <Badge variant="outline" className="text-gray-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {pkg.description || 'No description'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(pkg.final_price, pkg.currency)}
                      </span>
                    </div>

                    {/* Included Services */}
                    {pkg.items && pkg.items.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pkg.items.slice(0, 3).map((item) => (
                            <li key={item.id} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>
                                {item.quantity}x {item.service?.name || 'Service'}
                              </span>
                            </li>
                          ))}
                          {pkg.items.length > 3 && (
                            <li className="text-gray-500 italic">
                              +{pkg.items.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(pkg.id)}
                        className="flex-1"
                      >
                        {pkg.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get(route('provider.packages.edit', pkg.id))}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPackageToDelete(pkg.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this package. This action cannot be undone.
              Existing bookings using this package will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPackageToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProviderLayout>
  )
}
