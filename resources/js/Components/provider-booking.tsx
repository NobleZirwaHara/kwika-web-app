import { Button } from "@/Components/ui/button"
import { Link } from "@inertiajs/react"
import { Calendar } from "lucide-react"

interface ProviderBookingProps {
  price: number
  currency?: string
  priceType?: string
  serviceId?: number
  cancellationPolicy: string
}

export function ProviderBooking({
  price,
  currency = 'MWK',
  priceType = 'event',
  serviceId,
  cancellationPolicy
}: ProviderBookingProps) {
  const bookingUrl = serviceId ? `/bookings/create?service_id=${serviceId}` : '#'

  return (
    <div className="sticky top-24 border rounded-2xl p-6 shadow-lg bg-card">
      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-semibold">
            {currency} {price.toLocaleString()}
          </span>
          <span className="text-muted-foreground">/ {priceType}</span>
        </div>
        <p className="text-sm text-muted-foreground">{cancellationPolicy}</p>
      </div>

      {serviceId ? (
        <Button asChild className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mb-4">
          <Link href={bookingUrl}>
            <Calendar className="h-5 w-5 mr-2" />
            Request booking
          </Link>
        </Button>
      ) : (
        <Button
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mb-4"
          disabled
        >
          <Calendar className="h-5 w-5 mr-2" />
          No services available
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        {serviceId ? "You won't be charged yet" : "Please contact the provider directly"}
      </p>
    </div>
  )
}
