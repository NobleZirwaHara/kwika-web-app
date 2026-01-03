import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface AvailableRoles {
  [key: string]: string
}

interface AvailablePermissions {
  [key: string]: string
}

interface Props {
  admin: Admin
  availableRoles: AvailableRoles
  availablePermissions: AvailablePermissions
}

export default function AdminUsersCreate({ admin, availableRoles, availablePermissions }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    admin_role: '',
    admin_permissions: [] as string[],
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('admin.admin-users.store'))
  }

  function togglePermission(permission: string) {
    if (data.admin_permissions.includes(permission)) {
      setData('admin_permissions', data.admin_permissions.filter(p => p !== permission))
    } else {
      setData('admin_permissions', [...data.admin_permissions, permission])
    }
  }

  return (
    <AdminLayout title="Create Admin User" admin={admin}>
      <Head title="Create Admin User" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={route('admin.admin-users.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Admin User</h1>
            <p className="text-muted-foreground mt-1">Add a new administrator account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="e.g., admin@kwika.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="e.g., +265 123 456 789"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters with mixed case and numbers
                </p>
              </div>

              <div>
                <Label htmlFor="password_confirmation">Confirm Password *</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="admin_role">Admin Role *</Label>
                <Select value={data.admin_role} onValueChange={(v) => setData('admin_role', v)}>
                  <SelectTrigger className={errors.admin_role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(availableRoles).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.admin_role && <p className="text-sm text-red-500 mt-1">{errors.admin_role}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Super Administrators have all permissions automatically
                </p>
              </div>

              {data.admin_role !== 'super_admin' && (
                <div>
                  <Label>Permissions</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(availablePermissions).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`perm-${key}`}
                          checked={data.admin_permissions.includes(key)}
                          onChange={() => togglePermission(key)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`perm-${key}`} className="font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.admin_permissions && <p className="text-sm text-red-500 mt-1">{errors.admin_permissions}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={route('admin.admin-users.index')}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Admin User'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
