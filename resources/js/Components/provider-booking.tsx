import { Button } from "@/Components/ui/button"
import { Link } from "@inertiajs/react"
import { TimeSlotPicker } from "@/Components/time-slot-picker"
import { Calendar, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface ProviderBookingProps {
  price: number
  currency?: string
  priceType?: string
  serviceId?: number
  providerId: number | string
  cancellationPolicy: string
}

export function ProviderBooking({
  price,
  currency = 'MWK',
  priceType = 'event',
  serviceId,
  providerId,
  cancellationPolicy
}: ProviderBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)
  const [selectedStartTime, setSelectedStartTime] = useState<string>()
  const [selectedEndTime, setSelectedEndTime] = useState<string>()

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
    if (!selectedDate) {
      setBookedTimeSlots([])
      setSelectedStartTime(undefined)
      setSelectedEndTime(undefined)
      return
    }

    const fetchTimeSlots = async () => {
      try {
        setLoadingTimeSlots(true)
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const response = await fetch(`/api/providers/${providerId}/availability?date=${dateStr}`)
        const data = await response.json()

        setBookedTimeSlots(data.booked_time_slots || [])
      } catch (error) {
        console.error('Failed to fetch time slots:', error)
      } finally {
        setLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate, providerId])

  const bookingUrl = serviceId && selectedDate && selectedStartTime && selectedEndTime
    ? `/bookings/create?service_id=${serviceId}&event_date=${format(selectedDate, 'yyyy-MM-dd')}&start_time=${selectedStartTime}&end_time=${selectedEndTime}`
    : '#'

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

      {serviceId && (
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold">Select Date & Time</h4>

          {loadingAvailability ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date || undefined)}
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
                inline
              />

              {selectedDate && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                  Selected: <strong>{format(selectedDate, 'MMM dd, yyyy')}</strong>
                </div>
              )}

              {bookedDates.length > 0 && (
                <div className="flex items-start gap-2 p-2 bg-teal-50 border border-teal-200 rounded">
                  <AlertCircle className="h-3 w-3 text-teal-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-teal-800">Teal dates have bookings - check time slots</p>
                </div>
              )}

              {selectedDate && (
                <div className="border-t pt-4">
                  {loadingTimeSlots ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="text-sm text-muted-foreground">Loading times...</div>
                    </div>
                  ) : (
                    <TimeSlotPicker
                      bookedSlots={bookedTimeSlots}
                      onTimeRangeSelect={(start, end) => {
                        setSelectedStartTime(start)
                        setSelectedEndTime(end)
                      }}
                      selectedStartTime={selectedStartTime}
                      selectedEndTime={selectedEndTime}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {serviceId ? (
        <Button
          asChild={selectedDate !== undefined && selectedStartTime !== undefined && selectedEndTime !== undefined}
          disabled={!selectedDate || !selectedStartTime || !selectedEndTime}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mb-4"
        >
          {selectedDate && selectedStartTime && selectedEndTime ? (
            <Link href={bookingUrl}>
              <Calendar className="h-5 w-5 mr-2" />
              Request booking
            </Link>
          ) : (
            <span>
              <Calendar className="h-5 w-5 mr-2" />
              {!selectedDate ? 'Select date' : 'Select time'}
            </span>
          )}
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
