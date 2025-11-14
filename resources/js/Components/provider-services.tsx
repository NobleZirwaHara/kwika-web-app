import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Link } from "@inertiajs/react"
import { Calendar as CalendarIcon, Clock, DollarSign, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Service {
  id: number
  slug?: string
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
  providerId: string | number
}

export function ProviderServices({ services, currency = 'MWK', providerId }: ProviderServicesProps) {
  const [selectedDates, setSelectedDates] = useState<{ [serviceId: number]: Date | undefined }>({})
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  // Fetch provider's booked dates
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingAvailability(true)
        const response = await fetch(`/api/providers/${providerId}/availability`)
        const data = await response.json()

        // Convert string dates to Date objects
        const booked = data.booked_dates.map((dateStr: string) => new Date(dateStr))
        setBookedDates(booked)
      } catch (error) {
        console.error('Failed to fetch availability:', error)
      } finally {
        setLoadingAvailability(false)
      }
    }

    fetchAvailability()
  }, [providerId])

  const handleDateSelect = (serviceId: number, date: Date | undefined) => {
    setSelectedDates(prev => ({
      ...prev,
      [serviceId]: date
    }))
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate =>
      bookedDate.toDateString() === date.toDateString()
    )
  }

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

                {/* Date Selection */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select Your Event Date
                  </h4>

                  {loadingAvailability ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-muted-foreground">Loading availability...</div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <DatePicker
                          selected={selectedDates[service.id]}
                          onChange={(date: Date | null) => handleDateSelect(service.id, date || undefined)}
                          minDate={new Date()}
                          excludeDates={bookedDates}
                          placeholderText="Pick a date"
                          dateFormat="MMMM dd, yyyy"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          calendarClassName="shadow-lg border rounded-lg"
                          wrapperClassName="w-full"
                          popperClassName="z-50"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>

                      {selectedDates[service.id] && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">
                            Selected Date: <strong>{format(selectedDates[service.id]!, 'MMMM dd, yyyy')}</strong>
                          </p>
                        </div>
                      )}

                      {bookedDates.length > 0 && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-xs text-yellow-800">
                            Grayed out dates are already booked and unavailable
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap gap-3">
                  <Button
                    asChild={selectedDates[service.id] !== undefined}
                    disabled={!selectedDates[service.id]}
                    className="flex-1 sm:flex-initial"
                  >
                    {selectedDates[service.id] ? (
                      <Link
                        href={`/bookings/create?service_id=${service.id}&event_date=${format(selectedDates[service.id]!, 'yyyy-MM-dd')}`}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book This Service
                      </Link>
                    ) : (
                      <span>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Select a date to continue
                      </span>
                    )}
                  </Button>
                  {service.slug && (
                    <Button variant="outline" asChild>
                      <Link href={`/services/${service.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
