import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from "@/components/wishlist-button"
import { Link, usePage } from "@inertiajs/react"
import { TimeSlotPicker } from "@/components/time-slot-picker"
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
  const { auth } = usePage().props as any
  const isAuthenticated = !!auth?.user
  const [selectedDates, setSelectedDates] = useState<{ [serviceId: number]: Date | undefined }>({})
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<{ [serviceId: number]: string[] }>({})
  const [selectedStartTimes, setSelectedStartTimes] = useState<{ [serviceId: number]: string | undefined }>({})
  const [selectedEndTimes, setSelectedEndTimes] = useState<{ [serviceId: number]: string | undefined }>({})
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [loadingTimeSlots, setLoadingTimeSlots] = useState<{ [serviceId: number]: boolean }>({})

  // Fetch provider's booked dates
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingAvailability(true)
        const response = await fetch(`/api/providers/${providerId}/availability`)
        const data = await response.json()

        // Convert string dates to Date objects, ensuring we parse them in local timezone
        const booked = data.booked_dates.map((dateStr: string) => {
          // Parse date as local timezone by adding time component
          const [year, month, day] = dateStr.split('-').map(Number)
          return new Date(year, month - 1, day)
        })
        setBookedDates(booked)
      } catch (error) {
        console.error('Failed to fetch availability:', error)
      } finally {
        setLoadingAvailability(false)
      }
    }

    fetchAvailability()
  }, [providerId])

  // Fetch booked time slots when a date is selected
  useEffect(() => {
    const fetchTimeSlotsForServices = async () => {
      for (const serviceId in selectedDates) {
        const selectedDate = selectedDates[serviceId]
        if (!selectedDate) continue

        try {
          setLoadingTimeSlots(prev => ({ ...prev, [serviceId]: true }))
          const dateStr = format(selectedDate, 'yyyy-MM-dd')
          const response = await fetch(`/api/providers/${providerId}/availability?date=${dateStr}`)
          const data = await response.json()

          setBookedTimeSlots(prev => ({
            ...prev,
            [serviceId]: data.booked_time_slots || []
          }))
        } catch (error) {
          console.error('Failed to fetch time slots:', error)
        } finally {
          setLoadingTimeSlots(prev => ({ ...prev, [serviceId]: false }))
        }
      }
    }

    fetchTimeSlotsForServices()
  }, [selectedDates, providerId])

  const handleDateSelect = (serviceId: number, date: Date | undefined) => {
    setSelectedDates(prev => ({
      ...prev,
      [serviceId]: date
    }))
    // Reset time selection when date changes
    if (!date) {
      setSelectedStartTimes(prev => ({ ...prev, [serviceId]: undefined }))
      setSelectedEndTimes(prev => ({ ...prev, [serviceId]: undefined }))
      setBookedTimeSlots(prev => ({ ...prev, [serviceId]: [] }))
    }
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
      <h2 className="text-2xl font-bold font-heading mb-6">Individual Services</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Book individual services or combine them into a custom package
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
            {/* Compact Header */}
            <CardHeader className="pb-3 bg-gradient-to-br from-muted/30 to-background">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1.5 text-xs">
                    {service.category}
                  </Badge>
                </div>
                <WishlistButton
                  itemType="service"
                  itemId={service.id}
                  variant="small"
                />
              </div>

              {/* Price - Prominent */}
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-primary">
                  {currency} {service.basePrice.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">/{service.priceType}</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 pt-3 pb-4 space-y-3">
              {/* Description - Compact */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              {/* Key Info - Icons Only */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {service.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration}</span>
                  </div>
                )}
                {service.inclusions && service.inclusions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{service.inclusions.length} items</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Simplified */}
              <div className="flex gap-2 pt-2">
                {service.slug && (
                  <Button variant="default" size="sm" asChild className="flex-1">
                    <Link href={`/services/${service.slug}`}>
                      View & Book
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
