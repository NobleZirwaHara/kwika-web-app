import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Link } from "@inertiajs/react"
import { Calendar, Clock, Users, DollarSign } from "lucide-react"

interface Service {
  id: number
  name: string
  description: string
  category: string
  price: string
  basePrice: number
  priceType: string
  duration?: string
  inclusions?: string[]
}

interface ProviderServicesProps {
  services: Service[]
  currency?: string
}

export function ProviderServices({ services, currency = 'MWK' }: ProviderServicesProps) {
  if (services.length === 0) {
    return (
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold font-heading mb-6">Services</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No services available at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please contact the provider directly for service inquiries.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="border-t pt-6">
      <h2 className="text-2xl font-bold font-heading mb-6">Available Services</h2>
      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                  <Badge variant="outline" className="mb-3">
                    {service.category}
                  </Badge>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {currency} {service.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">per {service.priceType}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Service Details */}
                {service.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {service.duration}</span>
                  </div>
                )}

                {/* Inclusions */}
                {service.inclusions && service.inclusions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {service.inclusions.map((inclusion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Book Button */}
                <div className="pt-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/bookings/create?service_id=${service.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Service
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
