import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { SearchHeader } from '@/components/search-header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ErrorDisplay, FieldError } from '@/components/ui/error-display'
import { InspirationUpload } from '@/components/InspirationUpload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useWishlist } from '@/contexts/WishlistContext'
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  Calendar,
  Package as PackageIcon,
  ImageIcon,
  Heart,
  FolderPlus,
  Check,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatPrice } from '@/lib/utils'

interface Service {
  id: number
  slug: string
  name: string
  description: string
  base_price: number
  price_type: string
  currency: string
  primary_image: string | null
  max_attendees: number | null
  minimum_quantity: number
}

interface Provider {
  id: number
  slug: string
  business_name: string
  description: string
  city: string
  location: string
  phone: string
  email: string
  rating: number
  logo: string | null
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface Props {
  provider: Provider
  services: Service[]
  categories?: Category[]
  auth?: {
    user?: any
  }
  errors?: Record<string, string>
}

interface SelectedService {
  service: Service
  quantity: number
  notes: string
}

export default function CreateCustom({ provider, services, categories = [], auth, errors }: Props) {
  const [selectedServices, setSelectedServices] = useState<Map<number, SelectedService>>(new Map())
  const [eventDate, setEventDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [inspirationImages, setInspirationImages] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false)
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('')
  const [newWishlistName, setNewWishlistName] = useState('')
  const [savingToWishlist, setSavingToWishlist] = useState(false)
  const [creatingWishlist, setCreatingWishlist] = useState(false)
  const [wishlistSaved, setWishlistSaved] = useState(false)

  const { wishlists, addCustomPackage, createWishlist, defaultWishlist } = useWishlist()

  const addService = (service: Service) => {
    const newSelected = new Map(selectedServices)
    const minimumQuantity = service.minimum_quantity || 1
    newSelected.set(service.id, {
      service,
      quantity: minimumQuantity,
      notes: '',
    })
    setSelectedServices(newSelected)
  }

  const removeService = (serviceId: number) => {
    const newSelected = new Map(selectedServices)
    newSelected.delete(serviceId)
    setSelectedServices(newSelected)
  }

  const updateQuantity = (serviceId: number, delta: number) => {
    const newSelected = new Map(selectedServices)
    const item = newSelected.get(serviceId)
    if (item) {
      const minimumQuantity = item.service.minimum_quantity || 1
      const newQuantity = Math.max(minimumQuantity, item.quantity + delta)
      newSelected.set(serviceId, { ...item, quantity: newQuantity })
      setSelectedServices(newSelected)
    }
  }

  const updateNotes = (serviceId: number, notes: string) => {
    const newSelected = new Map(selectedServices)
    const item = newSelected.get(serviceId)
    if (item) {
      newSelected.set(serviceId, { ...item, notes })
      setSelectedServices(newSelected)
    }
  }

  const calculateTotal = () => {
    let total = 0
    selectedServices.forEach(({ service, quantity }) => {
      total += service.base_price * quantity
    })
    return total
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (selectedServices.size === 0) {
      setFormError('Please select at least one service')
      return
    }

    if (!eventDate || !startTime || !endTime || !eventLocation) {
      setFormError('Please fill in all required fields (event date, start time, end time, and location)')
      return
    }

    setProcessing(true)

    const servicesData = Array.from(selectedServices.values()).map(({ service, quantity, notes }) => ({
      service_id: service.id,
      quantity,
      notes,
    }))

    // Use FormData to support file uploads
    const formData = new FormData()
    formData.append('provider_id', provider.id.toString())
    formData.append('event_date', format(eventDate, 'yyyy-MM-dd'))
    formData.append('start_time', startTime)
    formData.append('end_time', endTime)
    formData.append('event_location', eventLocation)
    formData.append('special_requests', specialRequests)
    formData.append('services', JSON.stringify(servicesData))

    // Append inspiration images
    inspirationImages.forEach((file, index) => {
      formData.append(`inspiration_images[${index}]`, file)
    })

    router.post('/bookings/custom', formData, {
      forceFormData: true,
      preserveScroll: true,
      onFinish: () => setProcessing(false),
      onError: (errors) => {
        // Check if it's a 419 CSRF token error (session expired)
        if (errors && Object.keys(errors).length === 0) {
          setFormError('Your session has expired. The page will refresh - please try again.')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
          return
        }
        setFormError('There was an error submitting your booking request. Please check the form and try again.')
      },
    })
  }

  const openWishlistDialog = () => {
    if (selectedServices.size === 0) return
    // Pre-select default wishlist if available
    if (defaultWishlist) {
      setSelectedWishlistId(defaultWishlist.id.toString())
    }
    setWishlistDialogOpen(true)
  }

  const handleCreateNewWishlist = async () => {
    if (!newWishlistName.trim()) return

    setCreatingWishlist(true)
    try {
      const newWishlist = await createWishlist(newWishlistName.trim())
      if (newWishlist) {
        setSelectedWishlistId(newWishlist.id.toString())
        setNewWishlistName('')
      }
    } catch (error) {
      console.error('Failed to create wishlist:', error)
    } finally {
      setCreatingWishlist(false)
    }
  }

  const handleSaveToWishlist = async () => {
    if (selectedServices.size === 0 || !selectedWishlistId) return

    setSavingToWishlist(true)
    setWishlistSaved(false)

    try {
      // Build the services data for the custom package
      const servicesData = Array.from(selectedServices.values()).map(({ service, quantity }) => ({
        service_id: service.id,
        service_name: service.name,
        quantity,
        unit_price: service.base_price,
        subtotal: service.base_price * quantity,
      }))

      const result = await addCustomPackage({
        wishlist_id: parseInt(selectedWishlistId),
        provider_id: provider.id,
        name: `Custom Package from ${provider.business_name}`,
        services: servicesData,
        total_amount: calculateTotal(),
        currency: currency,
      })

      if (result.success) {
        setWishlistSaved(true)
        setWishlistDialogOpen(false)
        // Reset after 3 seconds
        setTimeout(() => setWishlistSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save to wishlist:', error)
    } finally {
      setSavingToWishlist(false)
    }
  }

  const currency = services[0]?.currency || 'MWK'
  const selectedCount = selectedServices.size

  return (
    <>
      <Head title={`Build Custom Package - ${provider.business_name}`} />
      <SearchHeader categories={categories} variant="detail" />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/providers/${provider.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Provider
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <PackageIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Build Your Custom Package</h1>
            </div>
            <p className="text-muted-foreground">
              Select services from <span className="font-semibold">{provider.business_name}</span> and customize quantities to create your perfect package
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error Display */}
            {(formError || errors) && (
              <ErrorDisplay
                errors={errors || formError || undefined}
                title="Booking Request Error"
                className="mb-6"
              />
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Service Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Available Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Services</CardTitle>
                    <CardDescription>
                      Click "Add" to include a service in your custom package
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {services.map((service) => {
                        const isSelected = selectedServices.has(service.id)

                        return (
                          <div
                            key={service.id}
                            className={`border rounded-lg p-4 transition-all ${
                              isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                            }`}
                          >
                            {service.primary_image && (
                              <img
                                src={service.primary_image}
                                alt={service.name}
                                className="w-full h-32 object-cover rounded-md mb-3"
                              />
                            )}
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{service.name}</h4>
                              {service.minimum_quantity > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  Min: {service.minimum_quantity}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-primary">
                                {formatPrice(service.base_price, service.currency)}
                                <span className="text-xs text-muted-foreground font-normal">
                                  /{service.price_type}
                                </span>
                              </p>
                              {isSelected ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeService(service.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                  Added
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="default"
                                  size="sm"
                                  onClick={() => addService(service)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Services */}
                {selectedCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Selected Services ({selectedCount})
                      </CardTitle>
                      <CardDescription>
                        Adjust quantities and add notes for each service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array.from(selectedServices.values()).map(({ service, quantity, notes }) => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatPrice(service.base_price, service.currency)} / {service.price_type}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeService(service.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              {/* Quantity Controls */}
                              <div>
                                <Label className="text-xs text-muted-foreground mb-2">
                                  Quantity
                                  {service.minimum_quantity > 1 && (
                                    <span className="ml-1 text-amber-600">(Min: {service.minimum_quantity})</span>
                                  )}
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(service.id, -1)}
                                    disabled={quantity <= (service.minimum_quantity || 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                      const minQty = service.minimum_quantity || 1
                                      const val = Math.max(minQty, parseInt(e.target.value) || minQty)
                                      updateQuantity(service.id, val - quantity)
                                    }}
                                    className="w-20 text-center"
                                    min={service.minimum_quantity || 1}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(service.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm font-medium ml-2">
                                    = {formatPrice(service.base_price * quantity, service.currency)}
                                  </span>
                                </div>
                              </div>

                              {/* Notes */}
                              <div>
                                <Label htmlFor={`notes-${service.id}`} className="text-xs text-muted-foreground mb-2">
                                  Special Notes (Optional)
                                </Label>
                                <Input
                                  id={`notes-${service.id}`}
                                  placeholder="e.g., color preferences, specific requirements"
                                  value={notes}
                                  onChange={(e) => updateNotes(service.id, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Inspiration Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Inspiration Photos (Optional)
                    </CardTitle>
                    <CardDescription>
                      Upload reference images to show the provider what you're envisioning for your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InspirationUpload
                      images={inspirationImages}
                      onChange={setInspirationImages}
                      maxImages={5}
                      maxSizeMB={5}
                    />
                  </CardContent>
                </Card>

                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Details
                    </CardTitle>
                    <CardDescription>
                      When and where do you need these services?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Event Date */}
                    <div>
                      <Label htmlFor="event_date">Event Date *</Label>
                      <DatePicker
                        selected={eventDate}
                        onChange={(date: Date | null) => setEventDate(date || undefined)}
                        minDate={new Date()}
                        placeholderText="Select event date"
                        dateFormat="MMMM dd, yyyy"
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <FieldError error={errors?.event_date} />
                    </div>

                    {/* Time Range */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_time">Start Time *</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                        <FieldError error={errors?.start_time} />
                      </div>
                      <div>
                        <Label htmlFor="end_time">End Time *</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                        <FieldError error={errors?.end_time} />
                      </div>
                    </div>

                    {/* Event Location */}
                    <div>
                      <Label htmlFor="event_location">Event Location *</Label>
                      <Input
                        id="event_location"
                        placeholder="e.g., Area 47, Lilongwe"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        required
                      />
                      <FieldError error={errors?.event_location} />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                      <Textarea
                        id="special_requests"
                        placeholder="Any additional information or special requirements..."
                        rows={4}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                      />
                      <FieldError error={errors?.special_requests} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Package Summary</CardTitle>
                    <CardDescription>Review your custom package</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Provider Info */}
                    <div className="pb-4 border-b">
                      <p className="text-sm text-muted-foreground mb-1">Provider</p>
                      <p className="font-semibold">{provider.business_name}</p>
                      <p className="text-sm text-muted-foreground">{provider.city}</p>
                    </div>

                    {/* Selected Items */}
                    {selectedCount > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Items ({selectedCount})</p>
                        {Array.from(selectedServices.values()).map(({ service, quantity }) => (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {quantity}x {service.name}
                            </span>
                            <span className="font-medium">
                              {formatPrice(service.base_price * quantity, currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No services selected yet</p>
                      </div>
                    )}

                    {/* Total */}
                    {selectedCount > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">Total</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(calculateTotal(), currency)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          Estimated total based on selected services
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={selectedCount === 0 || processing}
                    >
                      {processing ? 'Submitting...' : 'Request Booking'}
                    </Button>

                    {/* Save to Wishlist Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      size="lg"
                      disabled={selectedCount === 0}
                      onClick={openWishlistDialog}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${wishlistSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {wishlistSaved ? 'Saved to Wishlist!' : 'Save Package to Wishlist'}
                    </Button>

                    {!auth?.user && (
                      <p className="text-xs text-center text-muted-foreground">
                        You'll need to{' '}
                        <Link href="/login" className="text-primary hover:underline">
                          sign in
                        </Link>{' '}
                        to complete your booking request
                      </p>
                    )}

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800">
                      <p className="font-semibold mb-1">📋 How it works:</p>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>Select the services you need</li>
                        <li>Adjust quantities as needed</li>
                        <li>Fill in event details</li>
                        <li>Submit your booking request</li>
                        <li>Provider will review and confirm</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* Wishlist Picker Dialog */}
      <Dialog open={wishlistDialogOpen} onOpenChange={setWishlistDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Save Custom Package
            </DialogTitle>
            <DialogDescription>
              Choose which wishlist to save your custom package to
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Package Preview */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{provider.business_name}</span>
                <Badge variant="secondary">{selectedCount} services</Badge>
              </div>
              <div className="text-lg font-bold text-primary">
                {formatPrice(calculateTotal(), currency)}
              </div>
            </div>

            {/* Wishlist Selection */}
            {wishlists.length > 0 ? (
              <RadioGroup
                value={selectedWishlistId}
                onValueChange={setSelectedWishlistId}
                className="space-y-2"
              >
                {wishlists.map((wishlist) => (
                  <div
                    key={wishlist.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWishlistId === wishlist.id.toString()
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedWishlistId(wishlist.id.toString())}
                  >
                    <RadioGroupItem value={wishlist.id.toString()} id={`wishlist-${wishlist.id}`} />
                    <div className="flex-1">
                      <Label
                        htmlFor={`wishlist-${wishlist.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {wishlist.name}
                        {wishlist.is_default && (
                          <Badge variant="outline" className="ml-2 text-xs">Default</Badge>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {wishlist.total_items} items
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No wishlists yet. Create one below!
              </p>
            )}

            {/* Create New Wishlist */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">
                Or create a new wishlist
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="New wishlist name"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateNewWishlist()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateNewWishlist}
                  disabled={!newWishlistName.trim() || creatingWishlist}
                >
                  {creatingWishlist ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setWishlistDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveToWishlist}
              disabled={!selectedWishlistId || savingToWishlist}
            >
              {savingToWishlist ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save to Wishlist
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
