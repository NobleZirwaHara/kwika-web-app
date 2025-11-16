import { Head, Link, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Image as ImageIcon,
  Star,
  Clock
} from 'lucide-react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  bookings_count: number
}

interface Service {
  id: number
  name: string
  description: string
  base_price: number
  price_type: string
  duration: string
  inclusions: string[] | null
}

interface Payment {
  id: number
  transaction_id: string | null
  amount: number
  currency: string
  payment_method: string
  payment_gateway: string | null
  status: string
  proof_of_payment: string | null
  phone_number: string | null
  paid_at: string | null
  created_at: string
  notes: string | null
}

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
}

interface Booking {
  id: number
  booking_number: string
  status: string
  payment_status: string
  customer: Customer
  service: Service
  event_date: string
  event_date_formatted: string
  event_end_date: string | null
  event_end_date_formatted: string | null
  event_location: string
  attendees: number | null
  special_requests: string | null
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  currency: string
  created_at: string
  confirmed_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  payments: Payment[]
  review: Review | null
}

interface Props {
  booking: Booking
}

export default function BookingShow({ booking }: Props) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [verifyPaymentDialogOpen, setVerifyPaymentDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [proofImageOpen, setProofImageOpen] = useState(false)
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const cancelForm = useForm({
    cancellation_reason: '',
  })

  const verifyForm = useForm({
    action: '',
    rejection_reason: '',
  })

  function handleConfirm() {
    router.post(`/provider/bookings/${booking.id}/confirm`, {}, {
      onSuccess: () => {
        setConfirmDialogOpen(false)
      }
    })
  }

  function handleComplete() {
    router.post(`/provider/bookings/${booking.id}/complete`, {}, {
      onSuccess: () => {
        setCompleteDialogOpen(false)
      }
    })
  }

  function handleCancel() {
    cancelForm.post(`/provider/bookings/${booking.id}/cancel`, {
      onSuccess: () => {
        setCancelDialogOpen(false)
      }
    })
  }

  function handleVerifyPayment(action: 'approve' | 'reject') {
    if (!selectedPayment || isVerifying) return

    // Prepare data to send - only include rejection_reason when rejecting
    const data: { action: string; rejection_reason?: string } = {
      action: action
    }

    if (action === 'reject') {
      data.rejection_reason = verifyForm.data.rejection_reason
    }

    setIsVerifying(true)

    // Use router.post directly instead of form
    router.post(`/provider/bookings/${booking.id}/payments/${selectedPayment.id}/verify`, data, {
      preserveScroll: true,
      onSuccess: () => {
        setIsVerifying(false)
        closeVerifyDialog()
      },
      onError: (errors) => {
        console.error('Payment verification failed:', errors)
        setIsVerifying(false)
      }
    })
  }

  function openVerifyDialog(payment: Payment) {
    setSelectedPayment(payment)
    verifyForm.reset() // Reset form when opening dialog
    setVerifyPaymentDialogOpen(true)
  }

  function closeVerifyDialog() {
    setVerifyPaymentDialogOpen(false)
    setSelectedPayment(null)
    setIsVerifying(false)
    verifyForm.reset()
  }

  function viewProofOfPayment(url: string) {
    setProofImageUrl(url)
    setProofImageOpen(true)
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', icon: AlertCircle, label: 'Pending' },
      confirmed: { variant: 'default', icon: CheckCircle, label: 'Confirmed' },
      completed: { variant: 'outline', icon: CheckCircle, label: 'Completed' },
      cancelled: { variant: 'destructive', icon: XCircle, label: 'Cancelled' },
    }
    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  function getPaymentStatusBadge(status: string) {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', label: 'Pending' },
      pending_verification: { variant: 'secondary', label: 'Verifying' },
      deposit_paid: { variant: 'default', label: 'Deposit Paid' },
      fully_paid: { variant: 'default', label: 'Fully Paid' },
      refunded: { variant: 'destructive', label: 'Refunded' },
    }
    const config = variants[status] || variants.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  function getPaymentMethodBadge(method: string, status: string) {
    const statusColor = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'
    return <Badge variant={statusColor}>{method.replace('_', ' ').toUpperCase()}</Badge>
  }

  return (
    <ProviderLayout title={`Booking ${booking.booking_number}`}>
      <Head title={`Booking ${booking.booking_number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/bookings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Booking {booking.booking_number}</h1>
              <p className="text-muted-foreground mt-1">Created on {booking.created_at}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(booking.status)}
            {getPaymentStatusBadge(booking.payment_status)}
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status === 'pending' && (
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Pending Confirmation</h3>
                <p className="text-sm text-muted-foreground">Review the booking details and confirm or cancel</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setConfirmDialogOpen(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
                <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.status === 'confirmed' && (
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Confirmed Booking</h3>
                <p className="text-sm text-muted-foreground">Mark as completed after the event</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setCompleteDialogOpen(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
                <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.status === 'cancelled' && booking.cancellation_reason && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <h3 className="font-semibold text-destructive mb-2">Booking Cancelled</h3>
              <p className="text-sm text-muted-foreground">Cancelled on {booking.cancelled_at}</p>
              <p className="text-sm mt-2"><strong>Reason:</strong> {booking.cancellation_reason}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="font-medium">{booking.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </p>
                <p className="font-medium">{booking.customer.phone}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Total Bookings from this Customer</p>
                <p className="font-medium">{booking.customer.bookings_count}</p>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{booking.service.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Event Date & Time
                </p>
                <p className="font-medium">{booking.event_date_formatted}</p>
                {booking.event_end_date_formatted && (
                  <p className="text-sm text-muted-foreground">Until: {booking.event_end_date_formatted}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </p>
                <p className="font-medium">{booking.event_location}</p>
              </div>
              {booking.attendees && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Expected Attendees
                  </p>
                  <p className="font-medium">{booking.attendees}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{booking.service.description}</p>
            </div>
            {booking.service.inclusions && booking.service.inclusions.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Inclusions</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {booking.service.inclusions.map((inclusion, index) => (
                    <li key={index} className="text-sm">{inclusion}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="font-medium">{booking.currency} {booking.service.base_price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.service.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        {booking.special_requests && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Special Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{booking.special_requests}</p>
            </CardContent>
          </Card>
        )}

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">{booking.currency} {booking.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit Required</span>
              <span className="font-medium">{booking.currency} {booking.deposit_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-muted-foreground">Remaining Balance</span>
              <span className="font-semibold text-lg">{booking.currency} {booking.remaining_amount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>
              {booking.payments.length} payment{booking.payments.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {booking.payments.length > 0 ? (
              <div className="space-y-4">
                {booking.payments.map((payment) => (
                  <div key={payment.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getPaymentMethodBadge(payment.payment_method, payment.status)}
                          <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="font-semibold text-lg">{payment.currency} {payment.amount.toLocaleString()}</p>
                        {payment.transaction_id && (
                          <p className="text-sm text-muted-foreground">TX: {payment.transaction_id}</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Created</p>
                        <p>{payment.created_at}</p>
                        {payment.paid_at && (
                          <>
                            <p className="text-muted-foreground mt-1">Paid</p>
                            <p>{payment.paid_at}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {payment.phone_number && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="text-sm font-medium">{payment.phone_number}</p>
                      </div>
                    )}

                    {payment.proof_of_payment && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Proof of Payment</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProofOfPayment(payment.proof_of_payment!)}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                      </div>
                    )}

                    {payment.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm">{payment.notes}</p>
                      </div>
                    )}

                    {payment.status === 'pending' && (
                      <div className="pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={() => openVerifyDialog(payment)}
                        >
                          Verify Payment
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No payments recorded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Review */}
        {booking.review && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < booking.review!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{booking.review.rating} / 5</span>
              </div>
              <p className="text-muted-foreground">{booking.review.comment}</p>
              <p className="text-sm text-muted-foreground">Reviewed on {booking.review.created_at}</p>
            </CardContent>
          </Card>
        )}

        {/* Booking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-muted-foreground">{booking.created_at}</p>
                </div>
              </div>

              {booking.confirmed_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">Booking Confirmed</p>
                    <p className="text-sm text-muted-foreground">{booking.confirmed_at}</p>
                  </div>
                </div>
              )}

              {booking.completed_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">Booking Completed</p>
                    <p className="text-sm text-muted-foreground">{booking.completed_at}</p>
                  </div>
                </div>
              )}

              {booking.cancelled_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Booking Cancelled</p>
                    <p className="text-sm text-muted-foreground">{booking.cancelled_at}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm this booking? The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Completed</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this booking as completed? This indicates the event has been successfully delivered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this booking. The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancellation_reason">Cancellation Reason</Label>
              <Textarea
                id="cancellation_reason"
                value={cancelForm.data.cancellation_reason}
                onChange={(e) => cancelForm.setData('cancellation_reason', e.target.value)}
                placeholder="Explain why this booking is being cancelled..."
                rows={4}
              />
              {cancelForm.errors.cancellation_reason && (
                <p className="text-sm text-destructive">{cancelForm.errors.cancellation_reason}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelForm.processing || !cancelForm.data.cancellation_reason}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Payment Dialog */}
      <Dialog open={verifyPaymentDialogOpen} onOpenChange={(open) => !open && closeVerifyDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Review the payment details and approve or reject this payment.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">{selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{selectedPayment.payment_method.replace('_', ' ').toUpperCase()}</p>
              </div>
              {selectedPayment.transaction_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{selectedPayment.transaction_id}</p>
                </div>
              )}
              {selectedPayment.phone_number && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{selectedPayment.phone_number}</p>
                </div>
              )}

              {verifyForm.data.action === 'reject' && (
                <div className="space-y-2">
                  <Label htmlFor="rejection_reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection_reason"
                    value={verifyForm.data.rejection_reason}
                    onChange={(e) => verifyForm.setData('rejection_reason', e.target.value)}
                    placeholder="Explain why this payment is being rejected..."
                    rows={3}
                  />
                  {verifyForm.errors.rejection_reason && (
                    <p className="text-sm text-destructive">{verifyForm.errors.rejection_reason}</p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {verifyForm.data.action === 'reject' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    verifyForm.setData('action', '')
                    verifyForm.setData('rejection_reason', '')
                  }}
                  disabled={isVerifying}
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleVerifyPayment('reject')}
                  disabled={isVerifying || !verifyForm.data.rejection_reason}
                >
                  {isVerifying ? 'Rejecting...' : 'Reject Payment'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeVerifyDialog} disabled={isVerifying}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => verifyForm.setData('action', 'reject')}
                  disabled={isVerifying}
                >
                  Reject
                </Button>
                <Button onClick={() => handleVerifyPayment('approve')} disabled={isVerifying}>
                  {isVerifying ? 'Approving...' : 'Approve Payment'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof of Payment Image Dialog */}
      <Dialog open={proofImageOpen} onOpenChange={setProofImageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proof of Payment</DialogTitle>
          </DialogHeader>
          {proofImageUrl && (
            <div className="mt-4">
              <img src={proofImageUrl} alt="Proof of Payment" className="w-full h-auto rounded-lg" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProofImageOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderLayout>
  )
}
