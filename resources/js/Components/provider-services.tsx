import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { WishlistButton } from "@/Components/wishlist-button"
import { Link, usePage } from "@inertiajs/react"
import { TimeSlotPicker } from "@/Components/time-slot-picker"
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
      <h2 className="text-2xl font-bold font-heading mb-6">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <WishlistButton
                      serviceId={service.id}
                      isAuthenticated={isAuthenticated}
                      variant="small"
                    />
                  </div>
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
            <CardContent className="flex-1">
              <div className="space-y-4 h-full flex flex-col">
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

                {/* Date & Time Selection */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select Your Event Date & Time
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
                          dayClassName={(date) => {
                            const isBooked = bookedDates.some(
                              (bookedDate) => {
                                // Compare year, month, and day directly to avoid timezone issues
                                return (
                                  bookedDate.getFullYear() === date.getFullYear() &&
                                  bookedDate.getMonth() === date.getMonth() &&
                                  bookedDate.getDate() === date.getDate()
                                )
                              }
                            )
                            return isBooked ? 'booked-date' : ''
                          }}
                          placeholderText="Pick a date"
                          dateFormat="MMMM dd, yyyy"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          calendarClassName="shadow-lg border rounded-lg"
                          wrapperClassName="w-full"
                          popperClassName="z-50"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>

                      {selectedDates[service.id] && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                          Selected: <strong>{format(selectedDates[service.id]!, 'MMM dd, yyyy')}</strong>
                        </div>
                      )}

                      {bookedDates.length > 0 && (
                        <div className="flex items-start gap-2 p-2 bg-teal-50 border border-teal-200 rounded mt-3">
                          <AlertCircle className="h-3 w-3 text-teal-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-teal-800">
                            Teal dates have bookings - check time slots
                          </p>
                        </div>
                      )}

                      {selectedDates[service.id] && (
                        <div className="border-t pt-4 mt-4">
                          {loadingTimeSlots[service.id] ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="text-sm text-muted-foreground">Loading times...</div>
                            </div>
                          ) : (
                            <TimeSlotPicker
                              bookedSlots={bookedTimeSlots[service.id] || []}
                              onTimeRangeSelect={(start, end) => {
                                setSelectedStartTimes(prev => ({ ...prev, [service.id]: start }))
                                setSelectedEndTimes(prev => ({ ...prev, [service.id]: end }))
                              }}
                              selectedStartTime={selectedStartTimes[service.id]}
                              selectedEndTime={selectedEndTimes[service.id]}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap gap-3 mt-auto">
                  <Button
                    asChild={selectedDates[service.id] !== undefined && selectedStartTimes[service.id] !== undefined && selectedEndTimes[service.id] !== undefined}
                    disabled={!selectedDates[service.id] || !selectedStartTimes[service.id] || !selectedEndTimes[service.id]}
                    className="flex-1 sm:flex-initial"
                  >
                    {selectedDates[service.id] && selectedStartTimes[service.id] && selectedEndTimes[service.id] ? (
                      <Link
                        href={`/bookings/create?service_id=${service.id}&event_date=${format(selectedDates[service.id]!, 'yyyy-MM-dd')}&start_time=${selectedStartTimes[service.id]}&end_time=${selectedEndTimes[service.id]}`}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Request Booking
                      </Link>
                    ) : (
                      <span>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {!selectedDates[service.id] ? 'Select date' : 'Select time'}
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
