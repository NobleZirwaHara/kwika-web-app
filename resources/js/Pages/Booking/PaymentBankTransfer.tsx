import { useForm, Head } from '@inertiajs/react'
import { FormEvent, ChangeEvent, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, Upload, X, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Booking {
  id: number
  booking_number: string
  total_amount: number
  currency: string
}

interface BankDetails {
  bank_name: string
  account_name: string
  account_number: string
  swift_code: string
  branch: string
}

interface Props {
  booking: Booking
  bankDetails: BankDetails
}

export default function PaymentBankTransfer({ booking, bankDetails }: Props) {
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const { data, setData, post, processing, errors } = useForm({
    proof_of_payment: null as File | null,
    reference_number: '',
    notes: '',
  })

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('proof_of_payment', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeFile() {
    setData('proof_of_payment', null)
    setProofPreview(null)
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    if (data.proof_of_payment) {
      formData.append('proof_of_payment', data.proof_of_payment)
    }
    formData.append('reference_number', data.reference_number)
    if (data.notes) {
      formData.append('notes', data.notes)
    }

    post(`/bookings/${booking.id}/payment/bank-transfer`, {
      data: formData as any,
      forceFormData: true,
    })
  }

  return (
    <>
      <Head title="Bank Transfer Payment" />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Bank Transfer Payment</h1>
              <p className="text-muted-foreground">
                Transfer funds to our bank account and upload proof of payment
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Payment Instructions & Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Bank Details Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Bank Account Details</CardTitle>
                        <CardDescription>
                          Transfer the amount to this account
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {/* Bank Name */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">Bank Name</p>
                          <p className="font-semibold">{bankDetails.bank_name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankDetails.bank_name, 'bank')}
                        >
                          {copied === 'bank' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Account Name */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">Account Name</p>
                          <p className="font-semibold">{bankDetails.account_name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankDetails.account_name, 'name')}
                        >
                          {copied === 'name' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Account Number */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">Account Number</p>
                          <p className="font-semibold font-mono text-lg">
                            {bankDetails.account_number}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankDetails.account_number, 'account')}
                        >
                          {copied === 'account' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* SWIFT Code */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">SWIFT Code</p>
                          <p className="font-semibold">{bankDetails.swift_code}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankDetails.swift_code, 'swift')}
                        >
                          {copied === 'swift' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Branch */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">Branch</p>
                          <p className="font-semibold">{bankDetails.branch}</p>
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">Important Instructions</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                            <li>Include your booking number in the transfer reference</li>
                            <li>Upload clear proof of payment after transfer</li>
                            <li>Payment verification may take 1-2 business days</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Proof Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Proof of Payment</CardTitle>
                    <CardDescription>
                      Upload a screenshot or photo of your transfer receipt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="proof_of_payment">
                          Proof of Payment <span className="text-destructive">*</span>
                        </Label>
                        {proofPreview ? (
                          <div className="relative">
                            <img
                              src={proofPreview}
                              alt="Proof of payment"
                              className="w-full h-64 object-cover rounded-lg border-2 border-border"
                            />
                            <button
                              type="button"
                              onClick={removeFile}
                              className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground mb-1">
                              Click to upload proof of payment
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PNG, JPG or PDF (max 5MB)
                            </span>
                            <input
                              id="proof_of_payment"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                        {errors.proof_of_payment && (
                          <p className="text-sm text-destructive">{errors.proof_of_payment}</p>
                        )}
                      </div>

                      {/* Reference Number */}
                      <div className="space-y-2">
                        <Label htmlFor="reference_number">
                          Transaction Reference Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="reference_number"
                          type="text"
                          value={data.reference_number}
                          onChange={(e) => setData('reference_number', e.target.value)}
                          placeholder="Enter your bank reference/transaction number"
                          required
                        />
                        {errors.reference_number && (
                          <p className="text-sm text-destructive">{errors.reference_number}</p>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={data.notes}
                          onChange={(e) => setData('notes', e.target.value)}
                          placeholder="Any additional information..."
                          rows={3}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={processing || !data.proof_of_payment}
                        >
                          {processing ? 'Submitting...' : 'Submit Payment'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary Sidebar */}
              <div className="md:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Booking Number</p>
                      <p className="font-mono font-semibold">{booking.booking_number}</p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Amount to Transfer</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(booking.total_amount, booking.currency)}
                      </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 text-sm">
                      <p className="text-yellow-900 dark:text-yellow-100 font-medium mb-1">
                        Reference Format
                      </p>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        Please use: <br />
                        <span className="font-mono font-semibold">{booking.booking_number}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
