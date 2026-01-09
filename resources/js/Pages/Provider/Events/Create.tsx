import { router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import EventWizardLayout from '@/components/EventWizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TicketPackage {
  id?: number
  name: string
  description: string
  price: string
  currency: string
  quantity_available: string
  min_per_order: string
  max_per_order: string
  sale_start: string
  sale_end: string
  features: string[]
  is_active: boolean
}

interface FormData {
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
  max_attendees: string
  status: string
  is_featured: boolean
  requires_approval: boolean
  cover_image: File | null
  terms_conditions: string
  agenda: string
  speakers: string
  sponsors: string
  tags: string
  ticket_packages: TicketPackage[]
}

const eventCategories = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'concert', label: 'Concert' },
  { value: 'festival', label: 'Festival' },
  { value: 'sports', label: 'Sports' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
]

export default function EventsCreate() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'public',
    category: '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_country: 'Malawi',
    venue_latitude: '',
    venue_longitude: '',
    venue_map_url: '',
    is_online: false,
    online_meeting_url: '',
    start_datetime: '',
    end_datetime: '',
    timezone: 'Africa/Blantyre',
    registration_start: '',
    registration_end: '',
    max_attendees: '',
    status: 'draft',
    is_featured: false,
    requires_approval: false,
    cover_image: null,
    terms_conditions: '',
    agenda: '',
    speakers: '',
    sponsors: '',
    tags: '',
    ticket_packages: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(field: keyof FormData, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, cover_image: file }))
      setCoverImagePreview(URL.createObjectURL(file))
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

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Event title is required'
      if (!formData.category) newErrors.category = 'Please select a category'
      if (!formData.description.trim()) newErrors.description = 'Description is required'
    }

    if (step === 2) {
      if (!formData.start_datetime) newErrors.start_datetime = 'Start date is required'
      if (!formData.end_datetime) newErrors.end_datetime = 'End date is required'
      if (formData.is_online && !formData.online_meeting_url) {
        newErrors.online_meeting_url = 'Meeting URL is required for online events'
      }
      if (!formData.is_online && !formData.venue_name) {
        newErrors.venue_name = 'Venue name is required for in-person events'
      }
    }

    if (step === 3) {
      formData.ticket_packages.forEach((pkg, index) => {
        if (!pkg.name.trim()) newErrors[`ticket_${index}_name`] = 'Ticket name is required'
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  function prevStep() {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  function handleSubmit(saveAsDraft: boolean = false) {
    if (!validateStep(currentStep)) return

    setProcessing(true)
    setErrors({})

    const submitData = new FormData()

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
    submitData.append('status', saveAsDraft ? 'draft' : 'published')
    submitData.append('is_featured', formData.is_featured ? '1' : '0')
    submitData.append('requires_approval', formData.requires_approval ? '1' : '0')

    // Media
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

    router.post('/provider/events', submitData, {
      onError: (errors) => {
        setErrors(errors)
        setProcessing(false)
      },
      onSuccess: () => {
        setProcessing(false)
      }
    })
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Event Details'
      case 2: return 'Venue & Schedule'
      case 3: return 'Ticket Packages'
      case 4: return 'Review & Publish'
      default: return 'Create Event'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Let's start with the basic information about your event"
      case 2: return 'Where and when will your event take place?'
      case 3: return 'Create ticket packages for your attendees'
      case 4: return 'Review your event details and publish'
      default: return ''
    }
  }

  return (
    <EventWizardLayout
      currentStep={currentStep}
      title={getStepTitle()}
      description={getStepDescription()}
    >
      {/* Step 1: Event Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Give your event a catchy name"
              className="h-12 text-lg"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Event Category <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {eventCategories.map((cat) => (
                <motion.button
                  key={cat.value}
                  type="button"
                  onClick={() => handleChange('category', cat.value)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    formData.category === cat.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm font-medium">{cat.label}</span>
                </motion.button>
              ))}
            </div>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Event Type</Label>
            <div className="flex gap-3">
              {['public', 'private', 'hybrid'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.type === type ? 'default' : 'outline'}
                  onClick={() => handleChange('type', type)}
                  className="flex-1 capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Cover Image</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50",
                coverImagePreview ? "border-primary" : "border-muted"
              )}
            >
              {coverImagePreview ? (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="mx-auto max-h-48 rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCoverImagePreview(null)
                      setFormData(prev => ({ ...prev, cover_image: null }))
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200x630px, Max 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell attendees what your event is about..."
              rows={5}
              className="resize-none"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">
              {formData.description.length} characters
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4">
            <Button onClick={nextStep} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Venue & Schedule */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Online/In-Person Toggle */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Event Location Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => handleChange('is_online', false)}
                className={cn(
                  "p-6 rounded-xl border-2 text-center transition-all",
                  !formData.is_online
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <span className="font-medium">In-Person</span>
                <p className="text-xs text-muted-foreground mt-1">Physical venue</p>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleChange('is_online', true)}
                className={cn(
                  "p-6 rounded-xl border-2 text-center transition-all",
                  formData.is_online
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                <span className="font-medium">Online</span>
                <p className="text-xs text-muted-foreground mt-1">Virtual event</p>
              </motion.button>
            </div>
          </div>

          {/* Venue Details (In-Person) */}
          <AnimatePresence mode="wait">
            {!formData.is_online ? (
              <motion.div
                key="venue"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">Venue Details</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue_name">Venue Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="venue_name"
                        value={formData.venue_name}
                        onChange={(e) => handleChange('venue_name', e.target.value)}
                        placeholder="e.g., Bingu Conference Centre"
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="venue_city">City</Label>
                        <Input
                          id="venue_city"
                          value={formData.venue_city}
                          onChange={(e) => handleChange('venue_city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue_country">Country</Label>
                        <Input
                          id="venue_country"
                          value={formData.venue_country}
                          onChange={(e) => handleChange('venue_country', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="online"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-primary" />
                    <span className="font-medium">Online Event Details</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="online_meeting_url">Meeting URL <span className="text-destructive">*</span></Label>
                    <Input
                      id="online_meeting_url"
                      type="url"
                      value={formData.online_meeting_url}
                      onChange={(e) => handleChange('online_meeting_url', e.target.value)}
                      placeholder="https://zoom.us/j/123456789"
                    />
                    {errors.online_meeting_url && <p className="text-sm text-destructive">{errors.online_meeting_url}</p>}
                    <p className="text-xs text-muted-foreground">
                      Attendees will receive this link after registration
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date & Time */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">Date & Time</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_datetime">Start <span className="text-destructive">*</span></Label>
                <Input
                  id="start_datetime"
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) => handleChange('start_datetime', e.target.value)}
                />
                {errors.start_datetime && <p className="text-sm text-destructive">{errors.start_datetime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_datetime">End <span className="text-destructive">*</span></Label>
                <Input
                  id="end_datetime"
                  type="datetime-local"
                  value={formData.end_datetime}
                  onChange={(e) => handleChange('end_datetime', e.target.value)}
                />
                {errors.end_datetime && <p className="text-sm text-destructive">{errors.end_datetime}</p>}
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="max_attendees" className="text-base font-medium">
              Maximum Attendees
            </Label>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <Input
                id="max_attendees"
                type="number"
                min="1"
                value={formData.max_attendees}
                onChange={(e) => handleChange('max_attendees', e.target.value)}
                placeholder="Leave empty for unlimited"
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Tickets */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Add Ticket Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ticket Packages</h3>
              <p className="text-sm text-muted-foreground">
                Create different ticket tiers for your event
              </p>
            </div>
            <Button onClick={addTicketPackage} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Ticket
            </Button>
          </div>

          {/* Ticket Packages */}
          <AnimatePresence mode="popLayout">
            {formData.ticket_packages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed rounded-xl"
              >
                <Ticket className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No ticket packages yet</p>
                <Button variant="outline" onClick={addTicketPackage} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Ticket
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {formData.ticket_packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="border rounded-xl overflow-hidden"
                  >
                    <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {pkg.name || `Ticket ${index + 1}`}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTicketPackage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name <span className="text-destructive">*</span></Label>
                          <Input
                            value={pkg.name}
                            onChange={(e) => updateTicketPackage(index, 'name', e.target.value)}
                            placeholder="e.g., Early Bird, VIP"
                          />
                          {errors[`ticket_${index}_name`] && (
                            <p className="text-sm text-destructive">{errors[`ticket_${index}_name`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Price</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={pkg.price}
                              onChange={(e) => updateTicketPackage(index, 'price', e.target.value)}
                              placeholder="0.00"
                              className="flex-1"
                            />
                            <Select
                              value={pkg.currency}
                              onValueChange={(value) => updateTicketPackage(index, 'currency', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MWK">MWK</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {parseFloat(pkg.price) === 0 && (
                            <Badge variant="secondary" className="text-xs">Free</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={pkg.description}
                          onChange={(e) => updateTicketPackage(index, 'description', e.target.value)}
                          placeholder="What's included with this ticket?"
                          rows={2}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={pkg.quantity_available}
                            onChange={(e) => updateTicketPackage(index, 'quantity_available', e.target.value)}
                            placeholder="Unlimited"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Min per order</Label>
                          <Input
                            type="number"
                            min="1"
                            value={pkg.min_per_order}
                            onChange={(e) => updateTicketPackage(index, 'min_per_order', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max per order</Label>
                          <Input
                            type="number"
                            min="1"
                            value={pkg.max_per_order}
                            onChange={(e) => updateTicketPackage(index, 'max_per_order', e.target.value)}
                            placeholder="Unlimited"
                          />
                        </div>
                      </div>

                      {/* Features */}
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
                              <Badge key={fi} variant="secondary" className="gap-1 pr-1">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index, fi)}
                                  className="ml-1 hover:text-destructive rounded-full"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id={`active-${index}`}
                          checked={pkg.is_active}
                          onCheckedChange={(checked) => updateTicketPackage(index, 'is_active', checked)}
                        />
                        <Label htmlFor={`active-${index}`} className="cursor-pointer text-sm">
                          Available for sale
                        </Label>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Event Summary */}
          <div className="space-y-4">
            {/* Cover Image Preview */}
            {coverImagePreview && (
              <div className="rounded-xl overflow-hidden border">
                <img
                  src={coverImagePreview}
                  alt="Event cover"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Event Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {eventCategories.find(c => c.value === formData.category)?.label}
                    </Badge>
                    <CardTitle className="text-xl">{formData.title || 'Untitled Event'}</CardTitle>
                  </div>
                  <Badge variant="outline" className="capitalize">{formData.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formData.description}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formData.start_datetime
                        ? new Date(formData.start_datetime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Date not set'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formData.start_datetime
                        ? new Date(formData.start_datetime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })
                        : 'Time not set'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {formData.is_online ? (
                      <>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>Online Event</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.venue_name || 'Venue not set'}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formData.max_attendees
                        ? `${formData.max_attendees} spots`
                        : 'Unlimited capacity'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Summary */}
            {formData.ticket_packages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Ticket Packages ({formData.ticket_packages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.ticket_packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{pkg.name || `Ticket ${index + 1}`}</p>
                          {pkg.quantity_available && (
                            <p className="text-xs text-muted-foreground">
                              {pkg.quantity_available} available
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {parseFloat(pkg.price) === 0
                              ? 'Free'
                              : `${pkg.currency} ${parseFloat(pkg.price).toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pre-publish Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { check: !!formData.title, label: 'Event title added' },
                    { check: !!formData.category, label: 'Category selected' },
                    { check: !!formData.description, label: 'Description written' },
                    { check: !!formData.start_datetime && !!formData.end_datetime, label: 'Date and time set' },
                    { check: formData.is_online ? !!formData.online_meeting_url : !!formData.venue_name, label: 'Venue/location configured' },
                    { check: formData.ticket_packages.length > 0, label: 'At least one ticket package created' },
                    { check: !!coverImagePreview, label: 'Cover image uploaded' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {item.check ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={cn(
                        "text-sm",
                        item.check ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation & Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button variant="outline" onClick={prevStep} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={processing}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={processing}
                className="gap-2"
              >
                {processing ? (
                  'Publishing...'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Publish Event
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </EventWizardLayout>
  )
}
