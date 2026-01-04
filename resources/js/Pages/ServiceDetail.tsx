import { Head, Link } from '@inertiajs/react'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import { TimeSlotPicker } from '@/components/time-slot-picker'
import { WishlistButton } from '@/components/wishlist-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Star,
  BadgeCheck,
  ArrowLeft,
  Shield,
  XCircle,
  Package as PackageIcon,
} from 'lucide-react'

interface Service {
  id: number
  slug: string
  name: string
  description: string
  base_price: number
  max_price: number | null
  price_type: string
  currency: string
  duration: number | null
  max_attendees: number | null
  inclusions: string[] | null
  requirements: string[] | null
  primary_image: string | null
  gallery_images: string[]
  requires_deposit: boolean
  deposit_percentage: number | null
  cancellation_hours: number | null
  category: {
    id: number
    name: string
    slug: string
  }
  provider: {
    id: number
    slug: string
    business_name: string
    description: string
    city: string
    location: string
    phone: string
    email: string
    rating: number
    total_reviews: number
    verification_status: string
    is_featured: boolean
    logo: string | null
  }
}

interface RelatedService {
  id: number
  slug: string
  name: string
  description: string
  base_price: number
  price_type: string
  currency: string
  primary_image: string | null
}

interface SimilarService extends RelatedService {
  provider: {
    business_name: string
    city: string
    rating: number
  }
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface ProviderPackage {
  id: number
  slug: string
  name: string
  description: string | null
  package_type: 'tier' | 'bundle'
  final_price: number
  currency: string
  is_featured: boolean
  primary_image: string | null
  items: {
    quantity: number
    service_name: string
  }[]
}

interface Props {
  service: Service
  relatedServices: RelatedService[]
  similarServices: SimilarService[]
  providerPackages: ProviderPackage[]
  categories?: Category[]
  auth?: {
    user?: any
  }
}

export default function ServiceDetail({ service, relatedServices, similarServices, providerPackages, categories = [], auth }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [selectedStartTime, setSelectedStartTime] = useState<string>()
  const [selectedEndTime, setSelectedEndTime] = useState<string>()

  // Combine primary image and gallery images
  const allImages = [
    service.primary_image,
    ...(service.gallery_images || []),
  ].filter((img): img is string => img !== null && img !== undefined)

  // Fetch provider's booked dates
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingAvailability(true)
        const response = await fetch(`/api/providers/${service.provider.id}/availability`)
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
  }, [service.provider.id])

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
        const response = await fetch(`/api/providers/${service.provider.id}/availability?date=${dateStr}`)
        const data = await response.json()

        setBookedTimeSlots(data.booked_time_slots || [])
      } catch (error) {
        console.error('Failed to fetch time slots:', error)
      } finally {
        setLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate, service.provider.id])

  const formatPrice = () => {
    if (service.max_price) {
      return `${service.currency} ${service.base_price.toLocaleString()} - ${service.max_price.toLocaleString()}`
    }
    return `${service.currency} ${service.base_price.toLocaleString()}`
  }

  return (
    <>
      <Head title={`${service.name} - ${service.provider.business_name}`} />
      <SearchHeader categories={categories} variant="detail" />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-20 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/providers/${service.provider.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              View Provider
            </Link>
          </Button>

          {/* Image Gallery Grid - Full Width Above Content */}
          {allImages.length > 0 && (
            <div className="relative mb-8">
              {allImages.length === 1 ? (
                /* Single Image - Full Width */
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <img
                    src={allImages[0]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : allImages.length === 2 ? (
                /* Two Images - Split 50/50 */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden">
                  {allImages.slice(0, 2).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setShowAllPhotos(true)}
                      className="relative overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={image}
                        alt={`${service.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : allImages.length === 3 ? (
                /* Three Images - One large left, two stacked right */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="relative overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={allImages[0]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="grid grid-rows-2 gap-2">
                    {allImages.slice(1, 3).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setShowAllPhotos(true)}
                        className="relative overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image}
                          alt={`${service.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : allImages.length === 4 ? (
                /* Four Images - One large left, three on right */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="relative overflow-hidden hover:opacity-90 transition-opacity md:row-span-2"
                  >
                    <img
                      src={allImages[0]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="grid grid-rows-2 gap-2">
                    {allImages.slice(1, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setShowAllPhotos(true)}
                        className="relative overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image}
                          alt={`${service.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Five or More Images - One large left, four in 2x2 grid on right */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="relative overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={allImages[0]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    {allImages.slice(1, 5).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setShowAllPhotos(true)}
                        className="relative overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image}
                          alt={`${service.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && allImages.length > 5 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              +{allImages.length - 5} more
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show All Photos Button */}
              {allImages.length > 1 && (
                <Button
                  onClick={() => setShowAllPhotos(true)}
                  variant="outline"
                  size="sm"
                  className="absolute bottom-4 right-4 bg-white hover:bg-white/90 cursor-pointer"
                >
                  Show all photos
                </Button>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{service.category.name}</Badge>
                        {service.provider.verification_status === 'approved' && (
                          <Badge variant="default" className="gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            Verified Provider
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-3xl mb-2">{service.name}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <WishlistButton
                        itemType="service"
                        itemId={service.id}
                        variant="detail"
                      />
                      <div className="text-right">
                        <div className="text-3xl font-bold">{formatPrice()}</div>
                        <p className="text-sm text-muted-foreground">per {service.price_type}</p>
                        {service.requires_deposit && service.deposit_percentage && (
                          <p className="text-sm text-primary mt-2">
                            {service.deposit_percentage}% deposit required at booking
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About This Service</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  {/* Key Details */}
                  <div className="grid sm:grid-cols-2 gap-4 py-4 border-t">
                    {service.duration && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{service.duration} minutes</p>
                        </div>
                      </div>
                    )}
                    {service.max_attendees && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Max Attendees</p>
                          <p className="font-medium">Up to {service.max_attendees} people</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{service.provider.city}</p>
                      </div>
                    </div>
                    {service.requires_deposit && service.deposit_percentage && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Deposit Required</p>
                          <p className="font-medium">{service.deposit_percentage}% upfront</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inclusions */}
                  {service.inclusions && service.inclusions.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {service.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {service.requirements && service.requirements.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {service.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cancellation Policy */}
                  {service.cancellation_hours && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Cancellation Policy
                      </h3>
                      <p className="text-muted-foreground">
                        Free cancellation up to {service.cancellation_hours} hours before the event.
                        Cancellations made after this period may be subject to fees.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Provider Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    About the Provider
                    {service.provider.verification_status === 'approved' && (
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    {service.provider.logo && (
                      <img
                        src={service.provider.logo}
                        alt={service.provider.business_name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <Link
                        href={`/providers/${service.provider.slug}`}
                        className="text-xl font-semibold hover:text-primary transition-colors"
                      >
                        {service.provider.business_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.provider.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({service.provider.total_reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {service.provider.description && (
                    <p className="text-muted-foreground">{service.provider.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{service.provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{service.provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{service.provider.email}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/providers/${service.provider.slug}`}>
                      View All Services from This Provider
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Service Packages */}
              {providerPackages.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <PackageIcon className="h-5 w-5 text-primary" />
                        Service Packages Including This Service
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Save money by booking one of these curated packages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {providerPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          href={`/packages/${pkg.slug}`}
                          className="group border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                        >
                          {pkg.is_featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                              Featured
                            </Badge>
                          )}
                          {pkg.primary_image && (
                            <img
                              src={pkg.primary_image}
                              alt={pkg.name}
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={pkg.package_type === 'bundle' ? 'default' : 'secondary'}>
                              {pkg.package_type === 'bundle' ? 'Bundle' : 'Tier'}
                            </Badge>
                          </div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors mb-1">
                            {pkg.name}
                          </h4>
                          {pkg.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {pkg.description}
                            </p>
                          )}
                          {pkg.items.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Includes:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {pkg.items.slice(0, 2).map((item, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1 flex-shrink-0" />
                                    <span>{item.quantity}x {item.service_name}</span>
                                  </li>
                                ))}
                                {pkg.items.length > 2 && (
                                  <li className="text-xs text-muted-foreground italic">
                                    +{pkg.items.length - 2} more...
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          <div className="pt-3 border-t">
                            <p className="text-lg font-bold text-primary">
                              {pkg.currency} {pkg.final_price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>More from {service.provider.business_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {relatedServices.map((related) => (
                        <Link
                          key={related.id}
                          href={`/services/${related.slug}`}
                          className="group border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {related.primary_image && (
                            <img
                              src={related.primary_image}
                              alt={related.name}
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                          )}
                          <h4 className="font-semibold group-hover:text-primary transition-colors mb-1">
                            {related.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {related.description}
                          </p>
                          <p className="text-sm font-medium">
                            {related.currency} {related.base_price.toLocaleString()} / {related.price_type}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book This Service</CardTitle>
                  <CardDescription>Select a date to continue with booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date and Time Selection */}
                  <div className="space-y-4">
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            calendarClassName="shadow-lg border rounded-lg"
                            wrapperClassName="w-full"
                            popperClassName="z-50"
                            inline
                          />
                        </div>

                        {selectedDate && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              Selected: <strong>{format(selectedDate, 'MMMM dd, yyyy')}</strong>
                            </p>
                          </div>
                        )}

                        {bookedDates.length > 0 && (
                          <div className="mt-3 flex items-start gap-2 p-3 bg-teal-50 border border-teal-200 rounded-md">
                            <AlertCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-teal-800">
                              Dates highlighted in teal have some bookings - check available time slots
                            </p>
                          </div>
                        )}

                        {/* Time Slot Picker */}
                        {selectedDate && (
                          <div className="border-t pt-4">
                            {loadingTimeSlots ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="text-sm text-muted-foreground">Loading time slots...</div>
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

                  {/* Book Button */}
                  <Button
                    asChild={selectedDate !== undefined && selectedStartTime !== undefined && selectedEndTime !== undefined}
                    disabled={!selectedDate || !selectedStartTime || !selectedEndTime}
                    className="w-full"
                    size="lg"
                  >
                    {selectedDate && selectedStartTime && selectedEndTime ? (
                      <Link
                        href={`/bookings/create?service_id=${service.id}&event_date=${format(selectedDate, 'yyyy-MM-dd')}&start_time=${selectedStartTime}&end_time=${selectedEndTime}`}
                      >
                        Continue to Booking
                      </Link>
                    ) : (
                      <span>
                        {!selectedDate ? 'Select a date to continue' : 'Select time range to continue'}
                      </span>
                    )}
                  </Button>

                  {/* Contact Provider */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      Have questions about this service?
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${service.provider.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Provider
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${service.provider.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email Provider
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Services */}
              {similarServices.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Similar Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {similarServices.map((similar) => (
                        <Link
                          key={similar.id}
                          href={`/services/${similar.slug}`}
                          className="group flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          {similar.primary_image && (
                            <img
                              src={similar.primary_image}
                              alt={similar.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium group-hover:text-primary transition-colors text-sm line-clamp-1 mb-1">
                              {similar.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-1">
                              {similar.provider.business_name}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{similar.provider.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-xs font-medium text-primary">
                                {similar.currency} {similar.base_price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Photo Lightbox Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm">
            <Button
              onClick={() => setShowAllPhotos(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Close
            </Button>
            <h2 className="text-white text-lg font-semibold">
              {service.name} - Photos
            </h2>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto grid gap-4">
              {allImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${service.name} ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
