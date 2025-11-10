import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Checkbox } from '@/Components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Badge } from '@/Components/ui/badge'
import { Plus, Trash2, Calendar, MapPin, Globe, DollarSign, Users, Settings, Image } from 'lucide-react'

interface TicketPackage {
  id?: number
  name: string
  description: string
  price: string
  currency: string
  quantity_available: string
  quantity_sold?: number
  min_per_order: string
  max_per_order: string
  sale_start: string
  sale_end: string
  features: string[]
  is_active: boolean
  display_order?: number
}

interface Event {
  id: number
  title: string
  description: string
  type: string
  category: string
  venue_name: string
  venue_address: string
  venue_city: string
  venue_country: string
  venue_latitude: string
  venue_longitude: string
  venue_map_url: string
  is_online: boolean
  online_meeting_url: string
  start_datetime: string
  end_datetime: string
  timezone: string
  registration_start: string
  registration_end: string
  max_attendees: number | null
  status: string
  is_featured: boolean
  requires_approval: boolean
  cover_image: string | null
  terms_conditions: string
  agenda: string
  speakers: any
  sponsors: any
  tags: any
  ticket_packages: TicketPackage[]
}

interface Props {
  event: Event
}

export default function EventsEdit({ event }: Props) {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    type: event.type || 'public',
    category: event.category || 'conference',
    venue_name: event.venue_name || '',
    venue_address: event.venue_address || '',
    venue_city: event.venue_city || '',
    venue_country: event.venue_country || 'Malawi',
    venue_latitude: event.venue_latitude || '',
    venue_longitude: event.venue_longitude || '',
    venue_map_url: event.venue_map_url || '',
    is_online: event.is_online || false,
    online_meeting_url: event.online_meeting_url || '',
    start_datetime: event.start_datetime || '',
    end_datetime: event.end_datetime || '',
    timezone: event.timezone || 'Africa/Blantyre',
    registration_start: event.registration_start || '',
    registration_end: event.registration_end || '',
    max_attendees: event.max_attendees?.toString() || '',
    status: event.status || 'draft',
    is_featured: event.is_featured || false,
    requires_approval: event.requires_approval || false,
    cover_image: null as File | null,
    terms_conditions: event.terms_conditions || '',
    agenda: event.agenda || '',
    speakers: Array.isArray(event.speakers) ? event.speakers.join(', ') : '',
    sponsors: Array.isArray(event.sponsors) ? event.sponsors.join(', ') : '',
    tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
    ticket_packages: event.ticket_packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      currency: pkg.currency,
      quantity_available: pkg.quantity_available || '',
      quantity_sold: pkg.quantity_sold,
      min_per_order: pkg.min_per_order || '1',
      max_per_order: pkg.max_per_order || '',
      sale_start: pkg.sale_start || '',
      sale_end: pkg.sale_end || '',
      features: pkg.features || [],
      is_active: pkg.is_active,
      display_order: pkg.display_order,
    }))
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)

  function handleChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cover_image: e.target.files![0] }))
    }
  }

  function addTicketPackage() {
    const newPackage: TicketPackage = {
      name: '',
      description: '',
      price: '0',
      currency: 'MWK',
      quantity_available: '',
      min_per_order: '1',
      max_per_order: '',
      sale_start: '',
      sale_end: '',
      features: [],
      is_active: true
    }
    setFormData(prev => ({
      ...prev,
      ticket_packages: [...prev.ticket_packages, newPackage]
    }))
  }

  function removeTicketPackage(index: number) {
    setFormData(prev => ({
      ...prev,
      ticket_packages: prev.ticket_packages.filter((_, i) => i !== index)
    }))
  }

  function updateTicketPackage(index: number, field: keyof TicketPackage, value: any) {
    setFormData(prev => ({
      ...prev,
      ticket_packages: prev.ticket_packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  function addFeature(packageIndex: number, feature: string) {
    if (!feature.trim()) return

    setFormData(prev => ({
      ...prev,
      ticket_packages: prev.ticket_packages.map((pkg, i) =>
        i === packageIndex
          ? { ...pkg, features: [...pkg.features, feature.trim()] }
          : pkg
      )
    }))
  }

  function removeFeature(packageIndex: number, featureIndex: number) {
    setFormData(prev => ({
      ...prev,
      ticket_packages: prev.ticket_packages.map((pkg, i) =>
        i === packageIndex
          ? { ...pkg, features: pkg.features.filter((_, fi) => fi !== featureIndex) }
          : pkg
      )
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    const submitData = new FormData()
    submitData.append('_method', 'PUT')

    // Basic fields
    submitData.append('title', formData.title)
    submitData.append('description', formData.description)
    submitData.append('type', formData.type)
    submitData.append('category', formData.category)

    // Venue fields
    if (formData.venue_name) submitData.append('venue_name', formData.venue_name)
    if (formData.venue_address) submitData.append('venue_address', formData.venue_address)
    if (formData.venue_city) submitData.append('venue_city', formData.venue_city)
    if (formData.venue_country) submitData.append('venue_country', formData.venue_country)
    if (formData.venue_latitude) submitData.append('venue_latitude', formData.venue_latitude)
    if (formData.venue_longitude) submitData.append('venue_longitude', formData.venue_longitude)
    if (formData.venue_map_url) submitData.append('venue_map_url', formData.venue_map_url)
    submitData.append('is_online', formData.is_online ? '1' : '0')
    if (formData.online_meeting_url) submitData.append('online_meeting_url', formData.online_meeting_url)

    // Date/time fields
    submitData.append('start_datetime', formData.start_datetime)
    submitData.append('end_datetime', formData.end_datetime)
    if (formData.timezone) submitData.append('timezone', formData.timezone)
    if (formData.registration_start) submitData.append('registration_start', formData.registration_start)
    if (formData.registration_end) submitData.append('registration_end', formData.registration_end)

    // Capacity
    if (formData.max_attendees) submitData.append('max_attendees', formData.max_attendees)

    // Status
    submitData.append('status', formData.status)
    submitData.append('is_featured', formData.is_featured ? '1' : '0')
    submitData.append('requires_approval', formData.requires_approval ? '1' : '0')

    // Media (only if new image uploaded)
    if (formData.cover_image) {
      submitData.append('cover_image', formData.cover_image)
    }

    // Additional info
    if (formData.terms_conditions) submitData.append('terms_conditions', formData.terms_conditions)
    if (formData.agenda) submitData.append('agenda', formData.agenda)
    if (formData.speakers) submitData.append('speakers', formData.speakers)
    if (formData.sponsors) submitData.append('sponsors', formData.sponsors)
    if (formData.tags) submitData.append('tags', formData.tags)

    // Ticket packages
    formData.ticket_packages.forEach((pkg, index) => {
      if (pkg.id) submitData.append(`ticket_packages[${index}][id]`, pkg.id.toString())
      submitData.append(`ticket_packages[${index}][name]`, pkg.name)
      submitData.append(`ticket_packages[${index}][description]`, pkg.description)
      submitData.append(`ticket_packages[${index}][price]`, pkg.price)
      submitData.append(`ticket_packages[${index}][currency]`, pkg.currency)
      if (pkg.quantity_available) submitData.append(`ticket_packages[${index}][quantity_available]`, pkg.quantity_available)
      submitData.append(`ticket_packages[${index}][min_per_order]`, pkg.min_per_order)
      if (pkg.max_per_order) submitData.append(`ticket_packages[${index}][max_per_order]`, pkg.max_per_order)
      if (pkg.sale_start) submitData.append(`ticket_packages[${index}][sale_start]`, pkg.sale_start)
      if (pkg.sale_end) submitData.append(`ticket_packages[${index}][sale_end]`, pkg.sale_end)
      pkg.features.forEach((feature, fi) => {
        submitData.append(`ticket_packages[${index}][features][${fi}]`, feature)
      })
      submitData.append(`ticket_packages[${index}][is_active]`, pkg.is_active ? '1' : '0')
    })

    router.post(`/provider/events/${event.id}`, submitData, {
      onError: (errors) => {
        setErrors(errors)
        setProcessing(false)
      },
      onSuccess: () => {
        setProcessing(false)
      }
    })
  }

  return (
    <ProviderLayout title="Edit Event">
      <Head title="Edit Event" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <p className="text-muted-foreground mt-1">
              Update your event details and ticket packages
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/provider/events')}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="venue">Venue</TabsTrigger>
              <TabsTrigger value="datetime">Date & Time</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter event title"
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your event"
                      rows={5}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="concert">Concert</SelectItem>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="exhibition">Exhibition</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Venue Details */}
            <TabsContent value="venue">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Details</CardTitle>
                  <CardDescription>Where will your event take place?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_online"
                      checked={formData.is_online}
                      onCheckedChange={(checked) => handleChange('is_online', checked)}
                    />
                    <Label htmlFor="is_online" className="cursor-pointer">
                      This is an online event
                    </Label>
                  </div>

                  {formData.is_online ? (
                    <div className="space-y-2">
                      <Label htmlFor="online_meeting_url">Meeting URL *</Label>
                      <Input
                        id="online_meeting_url"
                        type="url"
                        value={formData.online_meeting_url}
                        onChange={(e) => handleChange('online_meeting_url', e.target.value)}
                        placeholder="https://zoom.us/j/123456789"
                      />
                      {errors.online_meeting_url && <p className="text-sm text-destructive">{errors.online_meeting_url}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="venue_name">Venue Name</Label>
                        <Input
                          id="venue_name"
                          value={formData.venue_name}
                          onChange={(e) => handleChange('venue_name', e.target.value)}
                          placeholder="e.g., Grand Ballroom, City Convention Center"
                        />
                        {errors.venue_name && <p className="text-sm text-destructive">{errors.venue_name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="venue_address">Address</Label>
                        <Textarea
                          id="venue_address"
                          value={formData.venue_address}
                          onChange={(e) => handleChange('venue_address', e.target.value)}
                          placeholder="Street address"
                          rows={2}
                        />
                        {errors.venue_address && <p className="text-sm text-destructive">{errors.venue_address}</p>}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="venue_city">City</Label>
                          <Input
                            id="venue_city"
                            value={formData.venue_city}
                            onChange={(e) => handleChange('venue_city', e.target.value)}
                            placeholder="City"
                          />
                          {errors.venue_city && <p className="text-sm text-destructive">{errors.venue_city}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="venue_country">Country</Label>
                          <Input
                            id="venue_country"
                            value={formData.venue_country}
                            onChange={(e) => handleChange('venue_country', e.target.value)}
                            placeholder="Country"
                          />
                          {errors.venue_country && <p className="text-sm text-destructive">{errors.venue_country}</p>}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="venue_latitude">Latitude</Label>
                          <Input
                            id="venue_latitude"
                            type="number"
                            step="any"
                            value={formData.venue_latitude}
                            onChange={(e) => handleChange('venue_latitude', e.target.value)}
                            placeholder="-13.9626"
                          />
                          {errors.venue_latitude && <p className="text-sm text-destructive">{errors.venue_latitude}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="venue_longitude">Longitude</Label>
                          <Input
                            id="venue_longitude"
                            type="number"
                            step="any"
                            value={formData.venue_longitude}
                            onChange={(e) => handleChange('venue_longitude', e.target.value)}
                            placeholder="33.7741"
                          />
                          {errors.venue_longitude && <p className="text-sm text-destructive">{errors.venue_longitude}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="venue_map_url">Google Maps URL</Label>
                        <Input
                          id="venue_map_url"
                          type="url"
                          value={formData.venue_map_url}
                          onChange={(e) => handleChange('venue_map_url', e.target.value)}
                          placeholder="https://maps.google.com/..."
                        />
                        {errors.venue_map_url && <p className="text-sm text-destructive">{errors.venue_map_url}</p>}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Date & Time */}
            <TabsContent value="datetime">
              <Card>
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                  <CardDescription>When will your event happen?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_datetime">Start Date & Time *</Label>
                      <Input
                        id="start_datetime"
                        type="datetime-local"
                        value={formData.start_datetime}
                        onChange={(e) => handleChange('start_datetime', e.target.value)}
                      />
                      {errors.start_datetime && <p className="text-sm text-destructive">{errors.start_datetime}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_datetime">End Date & Time *</Label>
                      <Input
                        id="end_datetime"
                        type="datetime-local"
                        value={formData.end_datetime}
                        onChange={(e) => handleChange('end_datetime', e.target.value)}
                      />
                      {errors.end_datetime && <p className="text-sm text-destructive">{errors.end_datetime}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      placeholder="Africa/Blantyre"
                    />
                    {errors.timezone && <p className="text-sm text-destructive">{errors.timezone}</p>}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-4">Registration Period (Optional)</h4>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="registration_start">Registration Opens</Label>
                        <Input
                          id="registration_start"
                          type="datetime-local"
                          value={formData.registration_start}
                          onChange={(e) => handleChange('registration_start', e.target.value)}
                        />
                        {errors.registration_start && <p className="text-sm text-destructive">{errors.registration_start}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registration_end">Registration Closes</Label>
                        <Input
                          id="registration_end"
                          type="datetime-local"
                          value={formData.registration_end}
                          onChange={(e) => handleChange('registration_end', e.target.value)}
                        />
                        {errors.registration_end && <p className="text-sm text-destructive">{errors.registration_end}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_attendees">Maximum Attendees (leave empty for unlimited)</Label>
                    <Input
                      id="max_attendees"
                      type="number"
                      min="1"
                      value={formData.max_attendees}
                      onChange={(e) => handleChange('max_attendees', e.target.value)}
                      placeholder="e.g., 100"
                    />
                    {errors.max_attendees && <p className="text-sm text-destructive">{errors.max_attendees}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ticket Packages */}
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ticket Packages</CardTitle>
                      <CardDescription>Manage ticket options for your event</CardDescription>
                    </div>
                    <Button type="button" onClick={addTicketPackage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.ticket_packages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No ticket packages yet. Click "Add Package" to create one.</p>
                    </div>
                  ) : (
                    formData.ticket_packages.map((pkg, index) => (
                      <Card key={pkg.id || index} className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeTicketPackage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            Package #{index + 1}
                            {pkg.id && <Badge variant="outline" className="text-xs">Existing</Badge>}
                          </CardTitle>
                          {pkg.quantity_sold && pkg.quantity_sold > 0 && (
                            <CardDescription>
                              {pkg.quantity_sold} ticket{pkg.quantity_sold !== 1 ? 's' : ''} already sold
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Package Name *</Label>
                              <Input
                                value={pkg.name}
                                onChange={(e) => updateTicketPackage(index, 'name', e.target.value)}
                                placeholder="e.g., Early Bird, VIP, General Admission"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label>Price *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={pkg.price}
                                  onChange={(e) => updateTicketPackage(index, 'price', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select
                                  value={pkg.currency}
                                  onValueChange={(value) => updateTicketPackage(index, 'currency', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="MWK">MWK</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={pkg.description}
                              onChange={(e) => updateTicketPackage(index, 'description', e.target.value)}
                              placeholder="Describe what's included in this package"
                              rows={2}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label>Quantity Available</Label>
                              <Input
                                type="number"
                                min="1"
                                value={pkg.quantity_available}
                                onChange={(e) => updateTicketPackage(index, 'quantity_available', e.target.value)}
                                placeholder="Unlimited"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Min Per Order</Label>
                              <Input
                                type="number"
                                min="1"
                                value={pkg.min_per_order}
                                onChange={(e) => updateTicketPackage(index, 'min_per_order', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Max Per Order</Label>
                              <Input
                                type="number"
                                min="1"
                                value={pkg.max_per_order}
                                onChange={(e) => updateTicketPackage(index, 'max_per_order', e.target.value)}
                                placeholder="Unlimited"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Sale Start Date</Label>
                              <Input
                                type="datetime-local"
                                value={pkg.sale_start}
                                onChange={(e) => updateTicketPackage(index, 'sale_start', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Sale End Date</Label>
                              <Input
                                type="datetime-local"
                                value={pkg.sale_end}
                                onChange={(e) => updateTicketPackage(index, 'sale_end', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Features</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a feature and press Enter"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addFeature(index, e.currentTarget.value)
                                    e.currentTarget.value = ''
                                  }
                                }}
                              />
                            </div>
                            {pkg.features.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {pkg.features.map((feature, fi) => (
                                  <Badge key={fi} variant="secondary" className="gap-1">
                                    {feature}
                                    <button
                                      type="button"
                                      onClick={() => removeFeature(index, fi)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`active-${index}`}
                              checked={pkg.is_active}
                              onCheckedChange={(checked) => updateTicketPackage(index, 'is_active', checked)}
                            />
                            <Label htmlFor={`active-${index}`} className="cursor-pointer">
                              Active (available for sale)
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media & Additional Information</CardTitle>
                  <CardDescription>Images and extra details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.cover_image && (
                    <div className="space-y-2">
                      <Label>Current Cover Image</Label>
                      <img
                        src={event.cover_image}
                        alt="Current cover"
                        className="w-full max-w-md rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="cover_image">
                      {event.cover_image ? 'Replace Cover Image' : 'Cover Image'}
                    </Label>
                    <Input
                      id="cover_image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image}</p>}
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x630px, Max size: 5MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agenda">Agenda</Label>
                    <Textarea
                      id="agenda"
                      value={formData.agenda}
                      onChange={(e) => handleChange('agenda', e.target.value)}
                      placeholder="Event schedule and agenda"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speakers">Speakers (comma-separated)</Label>
                    <Textarea
                      id="speakers"
                      value={formData.speakers}
                      onChange={(e) => handleChange('speakers', e.target.value)}
                      placeholder="John Doe, Jane Smith, etc."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsors">Sponsors (comma-separated)</Label>
                    <Textarea
                      id="sponsors"
                      value={formData.sponsors}
                      onChange={(e) => handleChange('sponsors', e.target.value)}
                      placeholder="Company A, Company B, etc."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      placeholder="networking, technology, business"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                    <Textarea
                      id="terms_conditions"
                      value={formData.terms_conditions}
                      onChange={(e) => handleChange('terms_conditions', e.target.value)}
                      placeholder="Terms and conditions for attendees"
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                  <CardDescription>Status and visibility options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="postponed">Postponed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    <p className="text-xs text-muted-foreground">
                      Only published events are visible to the public
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleChange('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                      Feature this event (shown prominently on homepage)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requires_approval"
                      checked={formData.requires_approval}
                      onCheckedChange={(checked) => handleChange('requires_approval', checked)}
                    />
                    <Label htmlFor="requires_approval" className="cursor-pointer">
                      Require approval for registrations
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/provider/events')}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ProviderLayout>
  )
}
