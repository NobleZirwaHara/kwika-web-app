import { useForm, Head } from '@inertiajs/react'
import { FormEvent } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Lock, Shield } from 'lucide-react'

interface Booking {
  id: number
  booking_number: string
  total_amount: number
  deposit_amount: number
  currency: string
}

interface Props {
  booking: Booking
}

export default function PaymentCard({ booking }: Props) {
  const amountToPay = booking.deposit_amount > 0 ? booking.deposit_amount : booking.total_amount

  const { data, setData, post, processing, errors } = useForm({
    card_number: '',
    card_holder: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
  })

  function formatCardNumber(value: string) {
    const numbers = value.replace(/\s/g, '')
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers
    return formatted
  }

  function handleCardNumberChange(value: string) {
    const numbers = value.replace(/\s/g, '')
    if (numbers.length <= 16) {
      setData('card_number', numbers)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post(`/bookings/${booking.id}/payment/card`)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i)

  return (
    <>
      <Head title="Card Payment" />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Card Payment</h1>
              <p className="text-muted-foreground">
                Pay securely with your credit or debit card
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Card Preview */}
                <Card className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground border-0">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Card Number Display */}
                      <div>
                        <div className="flex justify-between items-start mb-8">
                          <CreditCard className="h-10 w-10" />
                          <div className="flex gap-2">
                            <div className="w-8 h-6 bg-white/20 rounded"></div>
                            <div className="w-8 h-6 bg-white/20 rounded"></div>
                          </div>
                        </div>
                        <p className="font-mono text-2xl tracking-wider mb-6">
                          {formatCardNumber(data.card_number) || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      {/* Card Holder & Expiry */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-primary-foreground/70 mb-1">Card Holder</p>
                          <p className="font-medium text-sm">
                            {data.card_holder.toUpperCase() || 'YOUR NAME'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-foreground/70 mb-1 text-right">Expires</p>
                          <p className="font-medium text-sm font-mono">
                            {data.expiry_month && data.expiry_year
                              ? `${data.expiry_month}/${data.expiry_year.slice(-2)}`
                              : 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Form Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                    <CardDescription>
                      Enter your card information to complete payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Card Number */}
                      <div className="space-y-2">
                        <Label htmlFor="card_number">
                          Card Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="card_number"
                            type="text"
                            value={formatCardNumber(data.card_number)}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="pl-10 font-mono"
                            maxLength={19}
                            required
                          />
                        </div>
                        {errors.card_number && (
                          <p className="text-sm text-destructive">{errors.card_number}</p>
                        )}
                      </div>

                      {/* Card Holder Name */}
                      <div className="space-y-2">
                        <Label htmlFor="card_holder">
                          Card Holder Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="card_holder"
                          type="text"
                          value={data.card_holder}
                          onChange={(e) => setData('card_holder', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                        {errors.card_holder && (
                          <p className="text-sm text-destructive">{errors.card_holder}</p>
                        )}
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Expiry Month */}
                        <div className="space-y-2">
                          <Label htmlFor="expiry_month">
                            Month <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={data.expiry_month}
                            onValueChange={(value) => setData('expiry_month', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0')
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          {errors.expiry_month && (
                            <p className="text-sm text-destructive">{errors.expiry_month}</p>
                          )}
                        </div>

                        {/* Expiry Year */}
                        <div className="space-y-2">
                          <Label htmlFor="expiry_year">
                            Year <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={data.expiry_year}
                            onValueChange={(value) => setData('expiry_year', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiry_year && (
                            <p className="text-sm text-destructive">{errors.expiry_year}</p>
                          )}
                        </div>

                        {/* CVV */}
                        <div className="space-y-2">
                          <Label htmlFor="cvv">
                            CVV <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cvv"
                            type="text"
                            value={data.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              if (value.length <= 4) {
                                setData('cvv', value)
                              }
                            }}
                            placeholder="123"
                            className="font-mono"
                            maxLength={4}
                            required
                          />
                          {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium mb-1">Your payment is secure</p>
                            <p className="text-muted-foreground">
                              Your card information is encrypted and securely processed through our
                              payment gateway. We never store your card details.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={processing}
                        >
                          {processing ? (
                            'Processing...'
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Pay {booking.currency} {amountToPay.toLocaleString()}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Accepted Cards */}
                <Card className="bg-muted/50 border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Accepted Cards</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 px-3 bg-background rounded flex items-center text-xs font-semibold">
                          VISA
                        </div>
                        <div className="h-8 px-3 bg-background rounded flex items-center text-xs font-semibold">
                          MC
                        </div>
                        <div className="h-8 px-3 bg-background rounded flex items-center text-xs font-semibold">
                          AMEX
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary Sidebar */}
              <div className="md:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
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

                    {booking.deposit_amount > 0 && (
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          This is a deposit payment. Remaining balance:{' '}
                          <span className="font-semibold text-foreground">
                            {booking.currency}{' '}
                            {(booking.total_amount - booking.deposit_amount).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        SSL Encrypted
                      </p>
                      <p className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        PCI DSS Compliant
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
