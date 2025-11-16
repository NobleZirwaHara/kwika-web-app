import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Switch } from '@/Components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'
import { FormEvent } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Props {
  admin: Admin
  nextSortOrder: number
}

export default function CategoriesCreate({ admin, nextSortOrder }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    icon: '',
    sort_order: nextSortOrder,
    is_active: true,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post(route('admin.categories.store'))
  }

  return (
    <AdminLayout title="Create Category" admin={admin}>
      <Head title="Create Category" />

      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={route('admin.categories.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Category</h1>
            <p className="text-muted-foreground mt-1">
              Add a new service category to the system
            </p>
          </div>
        </div>

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
                <Input
                  id="icon"
                  value={data.icon}
                  onChange={(e) => setData('icon', e.target.value)}
                  placeholder="e.g., 🎉 or camera"
                  className={errors.icon ? 'border-red-500' : ''}
                />
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
                  {processing ? 'Creating...' : 'Create Category'}
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
      </div>
    </AdminLayout>
  )
}
