import { Head, Link, router, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog'
import {
  ArrowLeft,
  Save,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Hash,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Activity
} from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface User {
  id: number
  name: string
  email: string
  phone: string
}

interface Subscription {
  id: number
  plan: {
    name: string
    price: number
  }
  start_date: string
  end_date: string
  status: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
  description: string
  business_registration_number: string
  location: string
  city: string
  phone: string
  email: string
  website: string
  social_links: Record<string, string>
  is_verified: boolean
  is_featured: boolean
  is_active: boolean
  verification_status: string
  average_rating: number
  total_reviews: number
  total_bookings: number
  created_at: string
  verified_at: string | null
  user: User
  current_subscription: Subscription | null
}

interface Props {
  admin: Admin
  provider: Provider
  categories: Array<{ id: number; name: string; slug: string }>
}

export default function ServiceProviderEdit({ admin, provider, categories }: Props) {
  const [banDialogOpen, setBanDialogOpen] = useState(false)

  const form = useForm({
    business_name: provider.business_name,
    description: provider.description || '',
    business_registration_number: provider.business_registration_number,
    location: provider.location,
    city: provider.city,
    phone: provider.phone,
    email: provider.email,
    website: provider.website || '',
    social_links: provider.social_links || {},
  })

  const banForm = useForm({
    reason: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.put(route('admin.service-providers.update', provider.id), {
      preserveScroll: true,
    })
  }

  function handleBan(e: React.FormEvent) {
    e.preventDefault()
    banForm.post(route('admin.service-providers.ban', provider.id), {
      onSuccess: () => {
        setBanDialogOpen(false)
        banForm.reset()
      }
    })
  }

  function handleToggleActive() {
    if (confirm('Are you sure you want to change this provider\'s active status?')) {
      router.put(route('admin.service-providers.toggle-active', provider.id), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleToggleFeatured() {
    if (confirm('Are you sure you want to change this provider\'s featured status?')) {
      router.put(route('admin.service-providers.toggle-featured', provider.id), {}, {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout title={`Edit: ${provider.business_name}`} admin={admin}>
      <Head title={`Edit: ${provider.business_name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={route('admin.service-providers.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Provider</h1>
              <p className="text-muted-foreground mt-1">
                {provider.business_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {provider.is_verified && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {provider.is_featured && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Star className="h-3 w-3 mr-1 fill-purple-700" />
                Featured
              </Badge>
            )}
            <Badge variant={provider.is_active ? "default" : "secondary"}>
              {provider.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="business_name">Business Name *</Label>
                      <Input
                        id="business_name"
                        value={form.data.business_name}
                        onChange={e => form.setData('business_name', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.business_name && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.business_name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="business_registration_number">Registration Number *</Label>
                      <Input
                        id="business_registration_number"
                        value={form.data.business_registration_number}
                        onChange={e => form.setData('business_registration_number', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.business_registration_number && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.business_registration_number}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.data.description}
                      onChange={e => form.setData('description', e.target.value)}
                      rows={4}
                      className="mt-1.5"
                    />
                    {form.errors.description && (
                      <p className="text-sm text-red-600 mt-1">{form.errors.description}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={form.data.city}
                        onChange={e => form.setData('city', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.city && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Location/Address *</Label>
                      <Input
                        id="location"
                        value={form.data.location}
                        onChange={e => form.setData('location', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.location && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={e => form.setData('email', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={form.data.phone}
                        onChange={e => form.setData('phone', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={form.data.website}
                      onChange={e => form.setData('website', e.target.value)}
                      placeholder="https://example.com"
                      className="mt-1.5"
                    />
                    {form.errors.website && (
                      <p className="text-sm text-red-600 mt-1">{form.errors.website}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Button type="submit" disabled={form.processing}>
                      <Save className="h-4 w-4 mr-2" />
                      {form.processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.service-providers.index')}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{provider.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{provider.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{provider.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-medium">#{provider.user.id}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={route('admin.users.edit', provider.user.id)}>
                      Edit User Account
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            {provider.current_subscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-medium">{provider.current_subscription.plan.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={provider.current_subscription.status === 'active' ? 'default' : 'secondary'}>
                        {provider.current_subscription.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{provider.current_subscription.start_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{provider.current_subscription.end_date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={provider.is_active ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={handleToggleActive}
                >
                  {provider.is_active ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate Provider
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate Provider
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleToggleFeatured}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {provider.is_featured ? 'Remove Featured' : 'Make Featured'}
                </Button>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/providers/${provider.slug}`} target="_blank">
                    <Activity className="h-4 w-4 mr-2" />
                    View Public Profile
                  </Link>
                </Button>

                <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Ban Provider
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleBan}>
                      <DialogHeader>
                        <DialogTitle>Ban Provider</DialogTitle>
                        <DialogDescription>
                          This will deactivate and ban this provider. They will not be able to accept bookings. This action can be reversed.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reason">Ban Reason *</Label>
                        <Textarea
                          id="reason"
                          placeholder="e.g., Terms of service violation, fraudulent activity, etc."
                          value={banForm.data.reason}
                          onChange={e => banForm.setData('reason', e.target.value)}
                          required
                          className="mt-1.5"
                          rows={4}
                        />
                        {banForm.errors.reason && (
                          <p className="text-sm text-red-600 mt-1">{banForm.errors.reason}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setBanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={banForm.processing}>
                          {banForm.processing ? 'Banning...' : 'Ban Provider'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{provider.total_bookings}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{provider.total_reviews}</p>
                </div>
                {provider.average_rating > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{provider.average_rating.toFixed(1)}</p>
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Provider Details */}
            <Card>
              <CardHeader>
                <CardTitle>Provider Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Provider ID</p>
                  <p className="font-medium">#{provider.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Slug</p>
                  <p className="font-medium font-mono text-xs">{provider.slug}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verification Status</p>
                  <Badge variant="outline">{provider.verification_status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{provider.created_at}</p>
                </div>
                {provider.verified_at && (
                  <div>
                    <p className="text-muted-foreground">Verified</p>
                    <p className="font-medium">{provider.verified_at}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
