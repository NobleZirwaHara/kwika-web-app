import { Head, Link, router, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
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
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Calendar,
  Trash2,
  Building2,
  FileText,
  MessageSquare,
  Star,
  Key
} from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface ServiceProvider {
  id: number
  business_name: string
  slug: string
  verification_status: string
  is_active: boolean
}

interface Booking {
  id: number
  service_name: string
  status: string
  total_amount: number
  booking_date: string
  created_at: string
}

interface Review {
  id: number
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  national_id: string
  role: string
  is_verified: boolean
  email_verified_at: string | null
  phone_verified_at: string | null
  created_at: string
  deleted_at: string | null
  is_banned: boolean
  bookings_count: number
  reviews_count: number
  service_provider: ServiceProvider | null
  recent_bookings: Booking[]
  recent_reviews: Review[]
}

interface Props {
  admin: Admin
  user: User
}

export default function UserEdit({ admin, user }: Props) {
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const form = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    national_id: user.national_id || '',
  })

  const banForm = useForm({
    reason: '',
  })

  const passwordForm = useForm({
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.put(route('admin.users.update', user.id), {
      preserveScroll: true,
    })
  }

  function handleBan(e: React.FormEvent) {
    e.preventDefault()
    banForm.post(route('admin.users.ban', user.id), {
      onSuccess: () => {
        setBanDialogOpen(false)
        banForm.reset()
      }
    })
  }

  function handleUnban() {
    if (confirm('Are you sure you want to unban this user?')) {
      router.post(route('admin.users.unban', user.id), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleVerifyToggle() {
    const action = user.is_verified ? 'unverify' : 'verify'
    const message = user.is_verified
      ? 'Are you sure you want to revoke this user\'s verification?'
      : 'Are you sure you want to verify this user?'

    if (confirm(message)) {
      router.post(route(`admin.users.${action}`, user.id), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    passwordForm.post(route('admin.users.reset-password', user.id), {
      onSuccess: () => {
        setPasswordDialogOpen(false)
        passwordForm.reset()
      }
    })
  }

  return (
    <AdminLayout title={`Edit: ${user.name}`} admin={admin}>
      <Head title={`Edit: ${user.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={route('admin.users.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit User</h1>
              <p className="text-muted-foreground mt-1">
                {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
            {user.is_verified ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Unverified
              </Badge>
            )}
            {user.is_banned && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Banned
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Edit Form & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={form.data.name}
                        onChange={e => form.setData('name', e.target.value)}
                        required
                        className="mt-1.5"
                      />
                      {form.errors.name && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.name}</p>
                      )}
                    </div>

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
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.data.phone}
                        onChange={e => form.setData('phone', e.target.value)}
                        className="mt-1.5"
                      />
                      {form.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="national_id">National ID</Label>
                      <Input
                        id="national_id"
                        value={form.data.national_id}
                        onChange={e => form.setData('national_id', e.target.value)}
                        className="mt-1.5"
                      />
                      {form.errors.national_id && (
                        <p className="text-sm text-red-600 mt-1">{form.errors.national_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Button type="submit" disabled={form.processing}>
                      <Save className="h-4 w-4 mr-2" />
                      {form.processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.users.index')}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Provider Account */}
            {user.service_provider && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Service Provider Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p className="font-medium">{user.service_provider.business_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex gap-2">
                          <Badge variant={user.service_provider.is_active ? 'default' : 'secondary'}>
                            {user.service_provider.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.service_provider.verification_status === 'approved' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.service-providers.edit', user.service_provider.id)}>
                          View Provider Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Bookings */}
            {user.recent_bookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.recent_bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.service_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Booking Date: {booking.booking_date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">MWK {booking.total_amount.toLocaleString()}</p>
                          <Badge variant="outline" className="mt-1">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Reviews */}
            {user.recent_reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.recent_reviews.map((review) => (
                      <div key={review.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{review.created_at}</p>
                      </div>
                    ))}
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
                {!user.is_banned && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleVerifyToggle}
                  >
                    {user.is_verified ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoke Verification
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify User
                      </>
                    )}
                  </Button>
                )}

                {admin.admin_role === 'super_admin' && (
                  <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleResetPassword}>
                        <DialogHeader>
                          <DialogTitle>Reset User Password</DialogTitle>
                          <DialogDescription>
                            Set a new password for this user. The user will not be notified.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="password">New Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={passwordForm.data.password}
                              onChange={e => passwordForm.setData('password', e.target.value)}
                              required
                              className="mt-1.5"
                            />
                            {passwordForm.errors.password && (
                              <p className="text-sm text-red-600 mt-1">{passwordForm.errors.password}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="password_confirmation">Confirm Password *</Label>
                            <Input
                              id="password_confirmation"
                              type="password"
                              value={passwordForm.data.password_confirmation}
                              onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                              required
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={passwordForm.processing}>
                            {passwordForm.processing ? 'Resetting...' : 'Reset Password'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}

                {user.is_banned ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={handleUnban}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unban User
                  </Button>
                ) : (
                  <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Ban User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleBan}>
                        <DialogHeader>
                          <DialogTitle>Ban User</DialogTitle>
                          <DialogDescription>
                            This will ban the user from accessing the platform. This action can be reversed.
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
                            {banForm.processing ? 'Banning...' : 'Ban User'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
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
                  <p className="text-2xl font-bold">{user.bookings_count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{user.reviews_count}</p>
                </div>
              </CardContent>
            </Card>

            {/* User Details */}
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">#{user.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <Badge>{user.role}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Created</p>
                  <p className="font-medium">{user.created_at}</p>
                </div>
                {user.email_verified_at && (
                  <div>
                    <p className="text-muted-foreground">Email Verified</p>
                    <p className="font-medium">{user.email_verified_at}</p>
                  </div>
                )}
                {user.phone_verified_at && (
                  <div>
                    <p className="text-muted-foreground">Phone Verified</p>
                    <p className="font-medium">{user.phone_verified_at}</p>
                  </div>
                )}
                {user.deleted_at && (
                  <div>
                    <p className="text-muted-foreground">Banned On</p>
                    <p className="font-medium text-red-600">{user.deleted_at}</p>
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
