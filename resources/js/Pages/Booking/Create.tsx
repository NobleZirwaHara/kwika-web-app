import { useForm, Head, router } from '@inertiajs/react'
import { FormEvent, useEffect } from 'react'
import {Header} from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LocationPicker } from '@/components/location-picker'
import { Calendar, MapPin, Users, DollarSign, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Service {
  id: number
  name: string
  description: string
  base_price: number
  price_type: string
  max_price: number | null
  currency: string
  duration: number | null
  max_attendees: number | null
  category_name: string
  provider: {
    id: number
    business_name: string
    location: string
    city: string
  }
}

interface Props {
  service: Service
}

export default function CreateBooking({ service }: Props) {
  // Get pre-selected date and time from URL query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const preSelectedDate = urlParams.get('event_date')
  const preSelectedStartTime = urlParams.get('start_time')
  const preSelectedEndTime = urlParams.get('end_time')

  const { data, setData, post, processing, errors } = useForm({
    service_id: service.id,
    event_date: preSelectedDate || '',
    start_time: preSelectedStartTime || '',
    end_time: preSelectedEndTime || '',
    event_end_date: '',
    event_location: '',
    event_latitude: null as number | null,
    event_longitude: null as number | null,
    attendees: '',
    special_requests: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/bookings')
  }

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${period}`
  }

  return (
    <>
      <Head title={`Book ${service.name}`} />
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Book This Service</h1>
              <p className="text-muted-foreground">
                Complete the form below to request a booking
              </p>
            </div>

            {/* Warning if no date or time selected */}
            {(!preSelectedDate || !preSelectedStartTime || !preSelectedEndTime) && (
              <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-1">
                        {!preSelectedDate ? 'No Date Selected' : 'No Time Selected'}
                      </h3>
                      <p className="text-sm text-yellow-800 mb-3">
                        {!preSelectedDate
                          ? "You haven't selected a date for your booking. Please go back to the service page to select an available date and time."
                          : "You haven't selected a time range for your booking. Please go back to the service page to select your preferred time."
                        }
                      </p>
                      <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        Go Back to Service Page
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {/* Booking Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                      Provide information about your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Event Date */}
                      <div className="space-y-2">
                        <Label htmlFor="event_date">
                          Event Date <span className="text-destructive">*</span>
                        </Label>
                        {preSelectedDate ? (
                          /* Pre-selected and Confirmed Date */
                          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-green-900">
                                {formatDate(data.event_date)}
                              </p>
                              <p className="text-sm text-green-700">
                                This date is available for booking
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Manual Date Selection */
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="event_date"
                              type="date"
                              value={data.event_date}
                              onChange={(e) => setData('event_date', e.target.value)}
                              className="pl-10"
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                        )}
                        {errors.event_date && (
                          <p className="text-sm text-destructive">{errors.event_date}</p>
                        )}
                      </div>

                      {/* Event Time Range - Display Only */}
                      {(data.start_time && data.end_time) && (
                        <div className="space-y-2">
                          <Label>Event Time</Label>
                          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <Clock className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-green-900">
                                {formatTime(data.start_time)} - {formatTime(data.end_time)}
                              </p>
                              <p className="text-sm text-green-700">
                                Selected time range for your event
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Event End Date (Optional) */}
                      {service.price_type === 'daily' && (
                        <div className="space-y-2">
                          <Label htmlFor="event_end_date">
                            Event End Date (Optional)
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="event_end_date"
                              type="datetime-local"
                              value={data.event_end_date}
                              onChange={(e) => setData('event_end_date', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            For multi-day events
                          </p>
                        </div>
                      )}

                      {/* Event Location */}
                      <LocationPicker
                        label="Event Location"
                        value={data.event_location}
                        onChange={(location, coordinates) => {
                          setData('event_location', location)
                          if (coordinates) {
                            setData('event_latitude', coordinates.lat)
                            setData('event_longitude', coordinates.lng)
                          }
                        }}
                        placeholder="Enter event address or use the map (optional)"
                        error={errors.event_location}
                        required={false}
                        showCoordinates={false}
                      />

                      {/* Number of Attendees */}
                      {service.max_attendees && (
                        <div className="space-y-2">
                          <Label htmlFor="attendees">
                            Number of Attendees
                            {service.max_attendees && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (Max: {service.max_attendees})
                              </span>
                            )}
                          </Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="attendees"
                              type="number"
                              min="1"
                              max={service.max_attendees}
                              value={data.attendees}
                              onChange={(e) => setData('attendees', e.target.value)}
                              placeholder="Number of guests"
                              className="pl-10"
                            />
                          </div>
                          {errors.attendees && (
                            <p className="text-sm text-destructive">{errors.attendees}</p>
                          )}
                        </div>
                      )}

                      {/* Special Requests */}
                      <div className="space-y-2">
                        <Label htmlFor="special_requests">
                          Special Requests or Requirements
                        </Label>
                        <Textarea
                          id="special_requests"
                          value={data.special_requests}
                          onChange={(e) => setData('special_requests', e.target.value)}
                          placeholder="Any special requests, dietary requirements, or other details..."
                          rows={4}
                        />
                        {errors.special_requests && (
                          <p className="text-sm text-destructive">{errors.special_requests}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Optional: Help the provider prepare for your event
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
                          {processing ? 'Processing...' : 'Continue to Payment'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Service Summary Sidebar */}
              <div className="md:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Service Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.category_name}</p>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Provider</p>
                        <p className="font-medium">{service.provider.business_name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {service.provider.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Pricing</p>
                        <div className="flex items-baseline gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold">
                            {service.currency} {service.base_price.toLocaleString()}
                          </span>
                          {service.max_price && (
                            <span className="text-sm text-muted-foreground">
                              - {service.max_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Per {service.price_type}
                        </p>
                      </div>

                      {service.duration && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Duration</p>
                          <p className="font-medium">{service.duration} minutes</p>
                        </div>
                      )}
                    </div>

                    {service.description && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm line-clamp-4">{service.description}</p>
                      </div>
                    )}
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
