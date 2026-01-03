import { Head, Link, router, useForm } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Star,
  Image as ImageIcon,
  Briefcase,
  DollarSign,
  Clock,
  Hash
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
  national_id: string
  is_verified: boolean
  created_at: string
}

interface Service {
  id: number
  name: string
  description: string
  base_price: number
  currency: string
  duration: number
  category: {
    id: number
    name: string
  } | null
  is_active: boolean
}

interface Company {
  id: number
  name: string
  registration_number: string
  tax_id: string
  address: string
  phone: string
  email: string
}

interface PortfolioImage {
  id: number
  file_path: string
  file_name: string
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
  verification_status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  is_verified: boolean
  is_featured: boolean
  is_active: boolean
  verified_at: string | null
  created_at: string
  days_waiting: number
  hours_waiting: number
  onboarding_completed: boolean
  onboarding_step: number
  onboarding_data: any
  user: User
  services: Service[]
  companies: Company[]
  logo_url: string | null
  cover_image_url: string | null
  portfolio_images: PortfolioImage[]
}

interface Props {
  admin: Admin
  provider: Provider
}

export default function VerificationQueueShow({ admin, provider }: Props) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [changesDialogOpen, setChangesDialogOpen] = useState(false)

  const rejectForm = useForm({
    reason: '',
    notes: '',
  })

  const changesForm = useForm({
    message: '',
  })

  function handleApprove() {
    if (confirm('Are you sure you want to approve this provider? They will be able to accept bookings immediately.')) {
      router.post(route('admin.verification-queue.approve', provider.id), {
        notes: 'Approved after detailed review'
      }, {
        onSuccess: () => {
          // Success message handled by backend
        }
      })
    }
  }

  function handleReject(e: React.FormEvent) {
    e.preventDefault()
    rejectForm.post(route('admin.verification-queue.reject', provider.id), {
      onSuccess: () => {
        setRejectDialogOpen(false)
        rejectForm.reset()
      }
    })
  }

  function handleRequestChanges(e: React.FormEvent) {
    e.preventDefault()
    changesForm.post(route('admin.verification-queue.request-changes', provider.id), {
      onSuccess: () => {
        setChangesDialogOpen(false)
        changesForm.reset()
      }
    })
  }

  function formatWaitingTime(hoursWaiting: number): string {
    const days = Math.floor(hoursWaiting / 24)
    const hours = Math.round(hoursWaiting % 24)

    if (days === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    } else if (hours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AdminLayout title={`Review: ${provider.business_name}`} admin={admin}>
      <Head title={`Review: ${provider.business_name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={route('admin.verification-queue.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{provider.business_name}</h1>
              <p className="text-muted-foreground mt-1">
                Provider Verification Review
              </p>
            </div>
          </div>

          {getStatusBadge(provider.verification_status)}
        </div>

        {/* Urgency Alert */}
        {provider.verification_status === 'pending' && provider.days_waiting > 7 && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-900">
                  URGENT: This application has been waiting for {formatWaitingTime(provider.hours_waiting)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {provider.rejection_reason && (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="h-5 w-5" />
                Rejection Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-900">{provider.rejection_reason}</p>
              {provider.verified_at && (
                <p className="text-xs text-red-700 mt-2">
                  Rejected on {provider.verified_at}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {provider.verification_status === 'pending' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApprove}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Provider
                </Button>

                <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="lg">
                      <XCircle className="h-5 w-5 mr-2" />
                      Reject Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleReject}>
                      <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejecting this application. This will be sent to the provider.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="reason">Rejection Reason *</Label>
                          <Textarea
                            id="reason"
                            placeholder="e.g., Incomplete documentation, Invalid business registration, etc."
                            value={rejectForm.data.reason}
                            onChange={e => rejectForm.setData('reason', e.target.value)}
                            required
                            className="mt-1.5"
                            rows={4}
                          />
                          {rejectForm.errors.reason && (
                            <p className="text-sm text-red-600 mt-1">{rejectForm.errors.reason}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="notes">Internal Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Internal notes for admin records..."
                            value={rejectForm.data.notes}
                            onChange={e => rejectForm.setData('notes', e.target.value)}
                            className="mt-1.5"
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setRejectDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                          {rejectForm.processing ? 'Rejecting...' : 'Reject Application'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={changesDialogOpen} onOpenChange={setChangesDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Request Changes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleRequestChanges}>
                      <DialogHeader>
                        <DialogTitle>Request Changes</DialogTitle>
                        <DialogDescription>
                          Ask the provider to make specific changes or provide additional information.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="message">Message to Provider *</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide: more portfolio images, business license copy, etc."
                          value={changesForm.data.message}
                          onChange={e => changesForm.setData('message', e.target.value)}
                          required
                          className="mt-1.5"
                          rows={5}
                        />
                        {changesForm.errors.message && (
                          <p className="text-sm text-red-600 mt-1">{changesForm.errors.message}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setChangesDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={changesForm.processing}>
                          {changesForm.processing ? 'Sending...' : 'Send Request'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-medium">{provider.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Number</p>
                    <p className="font-medium">{provider.business_registration_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{provider.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{provider.location}</p>
                  </div>
                </div>

                {provider.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{provider.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.phone}</span>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {provider.website}
                    </a>
                  </div>
                )}
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
                    <p className="text-sm text-muted-foreground">National ID</p>
                    <p className="font-medium">{provider.user.national_id || 'Not provided'}</p>
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
                    <p className="text-sm text-muted-foreground">User Status</p>
                    <Badge variant={provider.user.is_verified ? "default" : "secondary"}>
                      {provider.user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">{provider.user.created_at}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Services ({provider.services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {provider.services.length > 0 ? (
                  <div className="space-y-3">
                    {provider.services.map((service) => (
                      <div key={service.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{service.name}</h4>
                              {service.category && (
                                <Badge variant="outline" className="text-xs">
                                  {service.category.name}
                                </Badge>
                              )}
                              <Badge variant={service.is_active ? "default" : "secondary"} className="text-xs">
                                {service.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            {service.description && (
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {service.currency} {service.base_price.toLocaleString()}
                              </span>
                              {service.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {service.duration} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No services added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Companies */}
            {provider.companies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Registered Companies ({provider.companies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {provider.companies.map((company) => (
                      <div key={company.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{company.name}</h4>
                        <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3.5 w-3.5" />
                            Reg: {company.registration_number}
                          </span>
                          {company.tax_id && (
                            <span className="flex items-center gap-1">
                              <Hash className="h-3.5 w-3.5" />
                              Tax: {company.tax_id}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {company.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {company.phone}
                          </span>
                          {company.address && (
                            <span className="flex items-center gap-1 md:col-span-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {company.address}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Images */}
            {provider.portfolio_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Portfolio Images ({provider.portfolio_images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {provider.portfolio_images.map((image) => (
                      <a
                        key={image.id}
                        href={image.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-lg overflow-hidden border hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image.file_path}
                          alt={image.file_name}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary & Media */}
          <div className="space-y-6">
            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(provider.verification_status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied</p>
                  <p className="font-medium">{provider.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waiting Time</p>
                  <p className="font-medium">{formatWaitingTime(provider.hours_waiting)}</p>
                </div>
                {provider.verified_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Verified At</p>
                    <p className="font-medium">{provider.verified_at}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Onboarding</p>
                  <Badge variant={provider.onboarding_completed ? "default" : "secondary"}>
                    {provider.onboarding_completed ? 'Completed' : `Step ${provider.onboarding_step}/4`}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <Badge variant={provider.is_featured ? "default" : "secondary"}>
                    {provider.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <Badge variant={provider.is_active ? "default" : "secondary"}>
                    {provider.is_active ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            {provider.logo_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Logo</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={provider.logo_url}
                    alt={`${provider.business_name} logo`}
                    className="w-full rounded-lg border"
                  />
                </CardContent>
              </Card>
            )}

            {/* Cover Image */}
            {provider.cover_image_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={provider.cover_image_url}
                    alt={`${provider.business_name} cover`}
                    className="w-full rounded-lg border"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
