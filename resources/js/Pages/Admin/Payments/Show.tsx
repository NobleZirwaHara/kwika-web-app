import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  DollarSign,
  User,
  FileText,
  Building2,
  CreditCard,
  Smartphone,
  Eye,
} from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Payment {
  id: number
  transaction_id: string
  payment_type: string
  amount: number
  currency: string
  payment_method: string
  status: string
  payment_gateway: string | null
  gateway_transaction_id: string | null
  gateway_response: any
  phone_number: string | null
  proof_of_payment: string | null
  notes: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    phone: string | null
  }
  booking: {
    id: number
    booking_number: string
    status: string
    payment_status: string
    event_date: string
    total_amount: number
    deposit_amount: number
    remaining_amount: number
    service: {
      id: number
      name: string
    } | null
    service_provider: {
      id: number
      business_name: string
    } | null
  } | null
}

interface Props {
  admin: Admin
  payment: Payment
}

export default function PaymentsShow({ admin, payment }: Props) {
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [verifyNotes, setVerifyNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [refundAmount, setRefundAmount] = useState(payment.amount.toString())
  const [refundReason, setRefundReason] = useState('')

  function handleVerify() {
    router.post(route('admin.payments.verify', payment.id), {
      notes: verifyNotes,
    }, {
      onSuccess: () => setVerifyDialogOpen(false),
    })
  }

  function handleReject() {
    if (!rejectReason) return

    router.post(route('admin.payments.reject', payment.id), {
      reason: rejectReason,
    }, {
      onSuccess: () => setRejectDialogOpen(false),
    })
  }

  function handleRefund() {
    if (!refundAmount || !refundReason) return

    router.post(route('admin.payments.refund', payment.id), {
      refund_amount: parseFloat(refundAmount),
      reason: refundReason,
    }, {
      onSuccess: () => setRefundDialogOpen(false),
    })
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; icon: any; label: string; className: string }> = {
      pending: { variant: 'outline', icon: Clock, label: 'Pending', className: 'bg-orange-50 text-orange-700 border-orange-200' },
      completed: { variant: 'outline', icon: CheckCircle, label: 'Completed', className: 'bg-green-50 text-green-700 border-green-200' },
      failed: { variant: 'outline', icon: XCircle, label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200' },
      refunded: { variant: 'outline', icon: RotateCcw, label: 'Refunded', className: 'bg-gray-50 text-gray-700 border-gray-200' },
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  function getPaymentMethodLabel(method: string) {
    const methods: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      mobile_money: 'Mobile Money',
      card: 'Card',
    }
    return methods[method] || method
  }

  return (
    <AdminLayout title="Payment Details" admin={admin}>
      <Head title={`Payment: ${payment.transaction_id}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.payments.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payments
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{payment.transaction_id}</h1>
              <p className="text-muted-foreground mt-1">
                Payment details and transaction information
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {payment.status === 'pending' && (
              <>
                <Button onClick={() => setVerifyDialogOpen(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Payment
                </Button>
                <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {payment.status === 'completed' && admin.admin_role === 'super_admin' && (
              <Button variant="outline" onClick={() => setRefundDialogOpen(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Process Refund
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold mt-1">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium mt-1">{getPaymentMethodLabel(payment.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium mt-1 capitalize">{payment.payment_type.replace('_', ' ')}</p>
                  </div>
                </div>

                {payment.payment_gateway && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Gateway</p>
                    <p className="font-medium mt-1">{payment.payment_gateway}</p>
                  </div>
                )}

                {payment.gateway_transaction_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gateway Transaction ID</p>
                    <p className="font-mono text-sm mt-1">{payment.gateway_transaction_id}</p>
                  </div>
                )}

                {payment.phone_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium mt-1">{payment.phone_number}</p>
                  </div>
                )}

                {payment.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{payment.notes}</p>
                  </div>
                )}

                {payment.proof_of_payment && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Proof of Payment</p>
                    <a
                      href={payment.proof_of_payment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      View attached proof
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Information */}
            {payment.booking && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Number</p>
                      <Link
                        href={route('provider.bookings.show', payment.booking.id)}
                        className="font-medium mt-1 hover:underline inline-block"
                      >
                        {payment.booking.booking_number}
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Status</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {payment.booking.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium mt-1">{payment.booking.event_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {payment.booking.payment_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold mt-1">
                        {payment.currency} {payment.booking.total_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deposit</p>
                      <p className="font-semibold mt-1">
                        {payment.currency} {payment.booking.deposit_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="font-semibold mt-1">
                        {payment.currency} {payment.booking.remaining_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {payment.booking.service && (
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium mt-1">{payment.booking.service.name}</p>
                    </div>
                  )}

                  {payment.booking.service_provider && (
                    <div>
                      <p className="text-sm text-muted-foreground">Service Provider</p>
                      <Link
                        href={route('admin.service-providers.edit', payment.booking.service_provider.id)}
                        className="font-medium mt-1 hover:underline inline-block"
                      >
                        {payment.booking.service_provider.business_name}
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Gateway Response */}
            {payment.gateway_response && (
              <Card>
                <CardHeader>
                  <CardTitle>Gateway Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                    {JSON.stringify(payment.gateway_response, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <div className="flex-1">
                    <Link
                      href={route('admin.users.edit', payment.user.id)}
                      className="font-medium hover:underline"
                    >
                      {payment.user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                  </div>
                </div>
                {payment.user.phone && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{payment.user.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{payment.created_at}</p>
                </div>
                {payment.paid_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid At</p>
                    <p className="font-medium">{payment.paid_at}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{payment.updated_at}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {payment.booking && (
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={route('provider.bookings.show', payment.booking.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Booking
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={route('admin.users.edit', payment.user.id)}>
                    <User className="h-4 w-4 mr-2" />
                    View Customer
                  </Link>
                </Button>
                {payment.booking?.service_provider && (
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={route('admin.service-providers.edit', payment.booking.service_provider.id)}>
                      <Building2 className="h-4 w-4 mr-2" />
                      View Provider
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Confirm that this payment has been received and is valid.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>Transaction ID:</strong> {payment.transaction_id}</p>
              <p className="text-sm"><strong>Amount:</strong> {payment.currency} {payment.amount.toLocaleString()}</p>
              <p className="text-sm"><strong>Customer:</strong> {payment.user.name}</p>
            </div>

            <div>
              <Label htmlFor="verify-notes">Notes (optional)</Label>
              <Textarea
                id="verify-notes"
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Add any verification notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerify}>Verify Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>Transaction ID:</strong> {payment.transaction_id}</p>
              <p className="text-sm"><strong>Amount:</strong> {payment.currency} {payment.amount.toLocaleString()}</p>
            </div>

            <div>
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this payment is being rejected..."
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Issue a refund for this payment. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>Transaction ID:</strong> {payment.transaction_id}</p>
              <p className="text-sm"><strong>Original Amount:</strong> {payment.currency} {payment.amount.toLocaleString()}</p>
            </div>

            <div>
              <Label htmlFor="refund-amount">Refund Amount *</Label>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                max={payment.amount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="refund-reason">Refund Reason *</Label>
              <Textarea
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Explain the reason for this refund..."
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleRefund}
              disabled={!refundAmount || !refundReason}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
