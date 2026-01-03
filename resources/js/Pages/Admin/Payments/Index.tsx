import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  CreditCard,
  Search,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  Building2,
  User,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
  phone_number: string | null
  proof_of_payment: string | null
  notes: string | null
  paid_at: string | null
  created_at: string
  user: {
    id: number
    name: string
    email: string
  }
  booking: {
    id: number
    booking_number: string
    status: string
    service: {
      id: number
      name: string
    } | null
    service_provider: {
      id: number
      business_name: string
    } | null
  } | null
  provider_subscription: {
    id: number
  } | null
}

interface Stats {
  total: number
  pending: number
  completed: number
  failed: number
  refunded: number
  total_amount: number
  pending_amount: number
}

interface Filters {
  search: string
  status: string
  payment_method: string
  payment_type: string
  sort_by: string
  sort_order: string
}

interface PaginatedData {
  data: Payment[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  admin: Admin
  payments: PaginatedData
  stats: Stats
  filters: Filters
}

export default function PaymentsIndex({ admin, payments, stats, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [verifyNotes, setVerifyNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')

  function handleStatusChange(status: string) {
    router.get(route('admin.payments.index'), {
      status,
      search: filters.search,
      payment_method: filters.payment_method,
      payment_type: filters.payment_type,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handlePaymentMethodChange(paymentMethod: string) {
    router.get(route('admin.payments.index'), {
      status: filters.status,
      search: filters.search,
      payment_method: paymentMethod,
      payment_type: filters.payment_type,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handlePaymentTypeChange(paymentType: string) {
    router.get(route('admin.payments.index'), {
      status: filters.status,
      search: filters.search,
      payment_method: filters.payment_method,
      payment_type: paymentType,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get(route('admin.payments.index'), {
      status: filters.status,
      search: searchQuery,
      payment_method: filters.payment_method,
      payment_type: filters.payment_type,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }

  function openVerifyDialog(payment: Payment) {
    setSelectedPayment(payment)
    setVerifyNotes('')
    setVerifyDialogOpen(true)
  }

  function openRejectDialog(payment: Payment) {
    setSelectedPayment(payment)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  function openRefundDialog(payment: Payment) {
    setSelectedPayment(payment)
    setRefundAmount(payment.amount.toString())
    setRefundReason('')
    setRefundDialogOpen(true)
  }

  function handleVerify() {
    if (!selectedPayment) return

    router.post(route('admin.payments.verify', selectedPayment.id), {
      notes: verifyNotes,
    }, {
      preserveScroll: true,
      onSuccess: () => setVerifyDialogOpen(false),
    })
  }

  function handleReject() {
    if (!selectedPayment || !rejectReason) return

    router.post(route('admin.payments.reject', selectedPayment.id), {
      reason: rejectReason,
    }, {
      preserveScroll: true,
      onSuccess: () => setRejectDialogOpen(false),
    })
  }

  function handleRefund() {
    if (!selectedPayment || !refundAmount || !refundReason) return

    router.post(route('admin.payments.refund', selectedPayment.id), {
      refund_amount: parseFloat(refundAmount),
      reason: refundReason,
    }, {
      preserveScroll: true,
      onSuccess: () => setRefundDialogOpen(false),
    })
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: 'outline', icon: Clock, label: 'Pending' },
      completed: { variant: 'default', icon: CheckCircle, label: 'Completed' },
      failed: { variant: 'destructive', icon: XCircle, label: 'Failed' },
      refunded: { variant: 'secondary', icon: RotateCcw, label: 'Refunded' },
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

  function getPaymentMethodLabel(method: string) {
    const methods: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      mobile_money: 'Mobile Money',
      card: 'Card',
    }
    return methods[method] || method
  }

  return (
    <AdminLayout title="Payments" admin={admin}>
      <Head title="Payments" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage all payment transactions and process refunds
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Refunded</p>
                <RotateCcw className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.refunded}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                MWK {stats.total_amount.toLocaleString()}
              </p>
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
                  <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                  <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
                  <TabsTrigger value="refunded">Refunded ({stats.refunded})</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters Row */}
              <div className="flex gap-4">
                {/* Payment Method Filter */}
                <div className="w-56">
                  <Select value={filters.payment_method || 'all'} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Type Filter */}
                <div className="w-56">
                  <Select value={filters.payment_type || 'all'} onValueChange={handlePaymentTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="full_payment">Full Payment</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by transaction ID, user, booking..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment List */}
        <div className="space-y-4">
          {payments.data.length > 0 ? (
            payments.data.map((payment) => (
              <Card key={payment.id} className={cn(
                payment.status === 'pending' && "border-orange-200 bg-orange-50/30",
                payment.status === 'failed' && "border-red-200 bg-red-50/30",
                payment.status === 'refunded' && "border-gray-200 bg-gray-50/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Payment Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{payment.transaction_id}</h3>
                          {getStatusBadge(payment.status)}
                          <Badge variant="secondary">{getPaymentMethodLabel(payment.payment_method)}</Badge>
                          <Badge variant="outline">{payment.payment_type.replace('_', ' ')}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <Link
                              href={route('admin.users.edit', payment.user.id)}
                              className="hover:underline"
                            >
                              {payment.user.name}
                            </Link>
                          </span>
                          {payment.booking && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" />
                              Booking #{payment.booking.booking_number}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </span>
                        </div>
                        {payment.phone_number && (
                          <div className="flex items-center gap-1.5">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span>{payment.phone_number}</span>
                          </div>
                        )}
                        {payment.booking?.service_provider && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{payment.booking.service_provider.business_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Service & Timestamps */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {payment.booking?.service && (
                          <span>Service: {payment.booking.service.name}</span>
                        )}
                        <span>Created: {payment.created_at}</span>
                        {payment.paid_at && (
                          <span>Paid: {payment.paid_at}</span>
                        )}
                        {payment.gateway_transaction_id && (
                          <span>Gateway ID: {payment.gateway_transaction_id}</span>
                        )}
                      </div>

                      {/* Notes/Proof */}
                      {(payment.notes || payment.proof_of_payment) && (
                        <div className="mt-2 text-sm">
                          {payment.notes && (
                            <p className="text-muted-foreground italic">{payment.notes}</p>
                          )}
                          {payment.proof_of_payment && (
                            <a
                              href={payment.proof_of_payment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View proof of payment
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.payments.show', payment.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>

                      {payment.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openVerifyDialog(payment)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectDialog(payment)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {payment.status === 'completed' && admin.admin_role === 'super_admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRefundDialog(payment)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Refund
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
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No payments found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.search
                    ? 'Try adjusting your search criteria'
                    : 'No payments match the selected filters'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {payments.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((payments.current_page - 1) * payments.per_page) + 1} to{' '}
                  {Math.min(payments.current_page * payments.per_page, payments.total)} of{' '}
                  {payments.total} results
                </p>

                <div className="flex gap-1">
                  {payments.links.map((link, index) => (
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

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Confirm that this payment has been received and is valid.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Transaction ID:</strong> {selectedPayment.transaction_id}</p>
                <p className="text-sm"><strong>Amount:</strong> {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</p>
                <p className="text-sm"><strong>Customer:</strong> {selectedPayment.user.name}</p>
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
          )}

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

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Transaction ID:</strong> {selectedPayment.transaction_id}</p>
                <p className="text-sm"><strong>Amount:</strong> {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</p>
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
          )}

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

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Transaction ID:</strong> {selectedPayment.transaction_id}</p>
                <p className="text-sm"><strong>Original Amount:</strong> {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}</p>
              </div>

              <div>
                <Label htmlFor="refund-amount">Refund Amount *</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  max={selectedPayment.amount}
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
          )}

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
