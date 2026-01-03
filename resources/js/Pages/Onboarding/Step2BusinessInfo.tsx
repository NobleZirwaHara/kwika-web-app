import { useForm, router } from '@inertiajs/react'
import { FormEvent } from 'react'
import WizardLayout from '@/components/WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LocationPicker } from '@/components/location-picker'
import { Building2, FileText, Phone, Mail, Globe, Hash } from 'lucide-react'

interface Props {
  provider: {
    business_name: string
    description: string | null
    business_registration_number: string | null
    location: string
    city: string
    phone: string
    email: string
    website: string | null
    social_links: {
      facebook?: string
      instagram?: string
      twitter?: string
      linkedin?: string
    }
  }
  categories: Array<{
    id: number
    name: string
    slug: string
    icon: string | null
  }>
}

export default function Step2BusinessInfo({ provider, categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    business_name: provider.business_name || '',
    description: provider.description || '',
    business_registration_number: provider.business_registration_number || '',
    location: provider.location || '',
    city: provider.city || '',
    latitude: null as number | null,
    longitude: null as number | null,
    phone: provider.phone || '',
    email: provider.email || '',
    website: provider.website || '',
    social_links: {
      facebook: provider.social_links?.facebook || '',
      instagram: provider.social_links?.instagram || '',
      twitter: provider.social_links?.twitter || '',
      linkedin: provider.social_links?.linkedin || '',
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/onboarding/step2')
  }

  return (
    <WizardLayout
      currentStep={2}
      title="Business Information"
      description="Tell us about your business"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="business_name">
            Business Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="business_name"
              type="text"
              value={data.business_name}
              onChange={(e) => setData('business_name', e.target.value)}
              placeholder="Your Business Name"
              className="pl-10"
              required
            />
          </div>
          {errors.business_name && <p className="text-sm text-destructive">{errors.business_name}</p>}
        </div>

        {/* Business Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Business Description <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Describe your business, services, and what makes you unique..."
              className="pl-10 min-h-32"
              required
            />
          </div>
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          <p className="text-xs text-muted-foreground">
            Minimum 50 characters. Current: {data.description.length}
          </p>
        </div>

        {/* Business Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="business_registration_number">
            Business Registration Number <span className="text-muted-foreground text-xs">(Optional)</span>
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="business_registration_number"
              type="text"
              value={data.business_registration_number}
              onChange={(e) => setData('business_registration_number', e.target.value)}
              placeholder="Enter your registration number"
              className="pl-10"
            />
          </div>
          {errors.business_registration_number && (
            <p className="text-sm text-destructive">{errors.business_registration_number}</p>
          )}
        </div>

        {/* Location & City */}
        <div className="space-y-4">
          <LocationPicker
            label="Business Location"
            value={data.location}
            onChange={(location, coordinates) => {
              setData('location', location)
              if (coordinates) {
                setData('latitude', coordinates.lat)
                setData('longitude', coordinates.lng)
              }
            }}
            placeholder="Enter your business address or use the map"
            error={errors.location}
            required
            showCoordinates={true}
          />

          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              value={data.city}
              onChange={(e) => setData('city', e.target.value)}
              placeholder="City"
              required
            />
            {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Business Phone <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
                required
              />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Business Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="contact@business.com"
                className="pl-10"
                required
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">
            Website <span className="text-muted-foreground text-xs">(Optional)</span>
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => setData('website', e.target.value)}
              placeholder="https://yourbusiness.com"
              className="pl-10"
            />
          </div>
          {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">Social Media Links (Optional)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={data.social_links.facebook}
                onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={data.social_links.instagram}
                onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })}
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                type="url"
                value={data.social_links.twitter}
                onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={data.social_links.linkedin}
                onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/yourpage"
              />
            </div>
          </div>
        </div>

        {/* General Errors */}
        {errors.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errors.error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => router.visit('/onboarding/step1')}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Continue to Services'}
          </Button>
        </div>
      </form>
    </WizardLayout>
  )
}
