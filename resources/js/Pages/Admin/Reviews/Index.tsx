import { Head, Link, router, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
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
  MessageSquare,
  Search,
  CheckCircle,
  XCircle,
  Star,
  User as UserIcon,
  Building2,
  Calendar,
  AlertCircle,
  Trash2,
  MessageCircle
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
}

interface ServiceProvider {
  id: number
  business_name: string
  slug: string
}

interface Service {
  id: number
  name: string
}

interface Review {
  id: number
  rating: number
  comment: string
  is_approved: boolean
  is_featured: boolean
  is_verified: boolean
  admin_response: string | null
  responded_at: string | null
  created_at: string
  user: User
  service_provider: ServiceProvider
  service: Service | null
  booking_id: number
}

interface Stats {
  total: number
  pending: number
  approved: number
  featured: number
  avg_rating: number
}

interface Filters {
  search: string
  status: string
  rating: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Review[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  reviews: PaginatedData
  stats: Stats
  filters: Filters
}

export default function ReviewsIndex({ admin, reviews, stats, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const rejectForm = useForm({
    reason: '',
  })

  const responseForm = useForm({
    response: '',
  })

  function handleStatusChange(status: string) {
    router.get(route('admin.reviews.index'), {
      status,
      search: filters.search,
      rating: filters.rating,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.reviews.index'), {
      status: filters.status,
      search: searchQuery,
      rating: filters.rating,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function handleApprove(reviewId: number) {
    if (confirm('Are you sure you want to approve this review?')) {
      router.post(route('admin.reviews.approve', reviewId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleReject(e: React.FormEvent) {
    e.preventDefault()
    if (selectedReview) {
      rejectForm.post(route('admin.reviews.reject', selectedReview.id), {
        onSuccess: () => {
          setRejectDialogOpen(false)
          setSelectedReview(null)
          rejectForm.reset()
        }
      })
    }
  }

  function handleToggleFeatured(reviewId: number) {
    router.put(route('admin.reviews.toggle-featured', reviewId), {}, {
      preserveScroll: true,
    })
  }

  function handleAddResponse(e: React.FormEvent) {
    e.preventDefault()
    if (selectedReview) {
      responseForm.post(route('admin.reviews.respond', selectedReview.id), {
        onSuccess: () => {
          setResponseDialogOpen(false)
          setSelectedReview(null)
          responseForm.reset()
        }
      })
    }
  }

  function handleDeleteResponse(reviewId: number) {
    if (confirm('Are you sure you want to delete your response?')) {
      router.delete(route('admin.reviews.delete-response', reviewId), {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(reviewId: number) {
    if (confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      router.delete(route('admin.reviews.destroy', reviewId), {
        preserveScroll: true,
      })
    }
  }

  function openRejectDialog(review: Review) {
    setSelectedReview(review)
    setRejectDialogOpen(true)
  }

  function openResponseDialog(review: Review) {
    setSelectedReview(review)
    responseForm.setData('response', review.admin_response || '')
    setResponseDialogOpen(true)
  }

  return (
    <AdminLayout title="Review Moderation" admin={admin}>
      <Head title="Review Moderation" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Review Moderation</h1>
          <p className="text-muted-foreground mt-1">
            Moderate and manage customer reviews
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold">{stats.avg_rating}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Status Tabs */}
              <Tabs value={filters.status} onValueChange={handleStatusChange}>
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                  <TabsTrigger value="featured">Featured ({stats.featured})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by comment, reviewer name, provider..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Review List */}
        <div className="space-y-4">
          {reviews.data.length > 0 ? (
            reviews.data.map((review) => (
              <Card key={review.id} className={cn(
                !review.is_approved && "border-yellow-200 bg-yellow-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {/* Star Rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          {review.is_approved ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}

                          {review.is_featured && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Star className="h-3 w-3 mr-1 fill-purple-700" />
                              Featured
                            </Badge>
                          )}

                          {review.is_verified && (
                            <Badge variant="outline">Verified Purchase</Badge>
                          )}
                        </div>

                        {/* Review Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" />
                            {review.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {review.service_provider.business_name}
                          </span>
                          {review.service && (
                            <span>Service: {review.service.name}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {review.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">{review.comment}</p>
                    </div>

                    {/* Admin Response */}
                    {review.admin_response && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-blue-900">Admin Response</p>
                          {review.responded_at && (
                            <span className="text-xs text-blue-700">{review.responded_at}</span>
                          )}
                        </div>
                        <p className="text-sm text-blue-900">{review.admin_response}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {!review.is_approved && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRejectDialog(review)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {review.is_approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(review.id)}
                        >
                          <Star className={cn(
                            "h-4 w-4 mr-2",
                            review.is_featured && "fill-purple-700 text-purple-700"
                          )} />
                          {review.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResponseDialog(review)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {review.admin_response ? 'Edit Response' : 'Add Response'}
                      </Button>

                      {review.admin_response && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResponse(review.id)}
                        >
                          Delete Response
                        </Button>
                      )}

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No reviews found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No reviews match the selected filter'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {reviews.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((reviews.current_page - 1) * reviews.per_page) + 1} to{' '}
                  {Math.min(reviews.current_page * reviews.per_page, reviews.total)} of{' '}
                  {reviews.total} results
                </p>

                <div className="flex gap-1">
                  {reviews.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      disabled={!link.url}
                      onClick={() => link.url && router.visit(link.url)}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <form onSubmit={handleReject}>
            <DialogHeader>
              <DialogTitle>Reject Review</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting this review (optional).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Violates community guidelines, spam, inappropriate content..."
                value={rejectForm.data.reason}
                onChange={e => rejectForm.setData('reason', e.target.value)}
                className="mt-1.5"
                rows={4}
              />
              {rejectForm.errors.reason && (
                <p className="text-sm text-red-600 mt-1">{rejectForm.errors.reason}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                {rejectForm.processing ? 'Rejecting...' : 'Reject Review'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddResponse}>
            <DialogHeader>
              <DialogTitle>
                {selectedReview?.admin_response ? 'Edit Admin Response' : 'Add Admin Response'}
              </DialogTitle>
              <DialogDescription>
                Respond to this review publicly as an admin.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="response">Response *</Label>
              <Textarea
                id="response"
                placeholder="Thank you for your feedback..."
                value={responseForm.data.response}
                onChange={e => responseForm.setData('response', e.target.value)}
                required
                className="mt-1.5"
                rows={5}
              />
              {responseForm.errors.response && (
                <p className="text-sm text-red-600 mt-1">{responseForm.errors.response}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={responseForm.processing}>
                {responseForm.processing ? 'Saving...' : 'Save Response'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
