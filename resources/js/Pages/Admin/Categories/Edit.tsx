import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Switch } from '@/Components/ui/switch'
import { Badge } from '@/Components/ui/badge'
import { ArrowLeft, Save, Tag } from 'lucide-react'
import { FormEvent } from 'react'

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

interface Props {
  admin: Admin
  category: Category
}

export default function CategoriesEdit({ admin, category }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    sort_order: category.sort_order,
    is_active: category.is_active,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    put(route('admin.categories.update', category.id))
  }

  return (
    <AdminLayout title="Edit Category" admin={admin}>
      <Head title={`Edit ${category.name}`} />

      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={route('admin.categories.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">Edit Category</h1>
              {category.is_active ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Update category details and settings
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Slug</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Services</p>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{category.services_count}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Created</p>
                <p className="font-medium">{category.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Wedding Planning, Photography, Catering"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Changing the name will automatically update the slug
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Brief description of this category..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">
                  Icon (Emoji or Icon Name)
                </Label>
                <div className="flex gap-2">
                  {data.icon && (
                    <div className="flex items-center justify-center w-12 h-12 border rounded-lg text-2xl">
                      {data.icon}
                    </div>
                  )}
                  <Input
                    id="icon"
                    value={data.icon}
                    onChange={(e) => setData('icon', e.target.value)}
                    placeholder="e.g., 🎉 or camera"
                    className={errors.icon ? 'border-red-500' : ''}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use an emoji or icon identifier for visual representation
                </p>
                {errors.icon && (
                  <p className="text-sm text-red-500">{errors.icon}</p>
                )}
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sort_order">
                  Sort Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={data.sort_order}
                  onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                  className={errors.sort_order ? 'border-red-500' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first in the list
                </p>
                {errors.sort_order && (
                  <p className="text-sm text-red-500">{errors.sort_order}</p>
                )}
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active" className="text-base">
                    Active Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Active categories are visible to users and providers
                  </p>
                  {category.services_count > 0 && !data.is_active && (
                    <p className="text-sm text-amber-600">
                      Warning: This category has {category.services_count} services that may be affected
                    </p>
                  )}
                </div>
                <Switch
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.categories.index')}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Last Updated */}
        <p className="text-sm text-muted-foreground text-center">
          Last updated: {category.updated_at}
        </p>
      </div>
    </AdminLayout>
  )
}
