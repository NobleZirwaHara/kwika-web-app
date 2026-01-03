import { useForm, Head } from '@inertiajs/react'
import { FormEvent } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Booking {
  id: number
  booking_number: string
  total_amount: number
  deposit_amount: number
  currency: string
}

interface MobileMoneyDetails {
  provider: string
  business_number: string
  account_number: string
}

interface Props {
  booking: Booking
  mobileMoneyDetails: MobileMoneyDetails
}

export default function PaymentMobileMoney({ booking, mobileMoneyDetails }: Props) {
  const amountToPay = booking.deposit_amount > 0 ? booking.deposit_amount : booking.total_amount

  const { data, setData, post, processing, errors } = useForm({
    phone_number: '',
    mpesa_code: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post(`/bookings/${booking.id}/payment/mobile-money`)
  }

  return (
    <>
      <Head title="Mobile Money Payment" />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Mobile Money Payment</h1>
              <p className="text-muted-foreground">
                Pay instantly using Airtel Money or other mobile money services
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Payment Instructions & Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Instructions Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle>Payment Instructions</CardTitle>
                        <CardDescription>
                          Follow these steps to complete your payment
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Payment Details */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                      <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
                        Pay via {mobileMoneyDetails.provider}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Business Number:</span>
                          <span className="font-mono font-semibold text-green-900 dark:text-green-100">
                            {mobileMoneyDetails.business_number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Account Number:</span>
                          <span className="font-mono font-semibold text-green-900 dark:text-green-100">
                            {mobileMoneyDetails.account_number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Amount:</span>
                          <span className="font-semibold text-green-900 dark:text-green-100">
                            {booking.currency} {amountToPay.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-step Instructions */}
                    <div className="space-y-3">
                      <p className="font-medium">How to Pay:</p>
                      <ol className="space-y-3">
                        {[
                          {
                            step: 1,
                            text: 'Dial *115# on your phone',
                          },
                          {
                            step: 2,
                            text: 'Select "Make Payment" or "Send Money"',
                          },
                          {
                            step: 3,
                            text: `Enter Business Number: ${mobileMoneyDetails.business_number}`,
                          },
                          {
                            step: 4,
                            text: `Enter Reference: ${mobileMoneyDetails.account_number}`,
                          },
                          {
                            step: 5,
                            text: `Enter Amount: ${booking.currency} ${amountToPay.toLocaleString()}`,
                          },
                          {
                            step: 6,
                            text: 'Enter your mobile money PIN and confirm',
                          },
                          {
                            step: 7,
                            text: 'Wait for confirmation SMS with transaction code',
                          },
                          {
                            step: 8,
                            text: 'Enter the transaction code below',
                          },
                        ].map((item) => (
                          <li key={item.step} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                              {item.step}
                            </span>
                            <span className="text-sm text-muted-foreground pt-0.5">
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">Important</p>
                          <p className="text-blue-800 dark:text-blue-200">
                            You will receive a confirmation SMS after successful payment.
                            The SMS contains your transaction code which you need to enter below.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Confirmation Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Payment</CardTitle>
                    <CardDescription>
                      Enter your details to confirm the transaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">
                          Phone Number Used for Payment <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone_number"
                          type="tel"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                          placeholder="e.g., +265888123456 or 0888123456"
                          required
                        />
                        {errors.phone_number && (
                          <p className="text-sm text-destructive">{errors.phone_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Enter the phone number you used for the mobile money transaction
                        </p>
                      </div>

                      {/* Transaction Code */}
                      <div className="space-y-2">
                        <Label htmlFor="mpesa_code">
                          Transaction Code <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="mpesa_code"
                          type="text"
                          value={data.mpesa_code}
                          onChange={(e) => setData('mpesa_code', e.target.value.toUpperCase())}
                          placeholder="e.g., QAB1CD2EFG"
                          className="font-mono"
                          required
                        />
                        {errors.mpesa_code && (
                          <p className="text-sm text-destructive">{errors.mpesa_code}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          The transaction code from your mobile money confirmation SMS
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={processing}
                        >
                          {processing ? 'Verifying...' : 'Confirm Payment'}
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
                      <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
                      <p className="text-3xl font-bold text-primary">
                        {booking.currency} {amountToPay.toLocaleString()}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-900 dark:text-green-100">
                            Instant verification
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-900 dark:text-green-100">
                            Secure payment
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-900 dark:text-green-100">
                            SMS confirmation
                          </p>
                        </div>
                      </div>
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
