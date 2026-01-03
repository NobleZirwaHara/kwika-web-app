import { Head, Link, useForm } from '@inertiajs/react'
import { FormEvent, ChangeEvent, useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, Upload, X, ArrowLeft } from 'lucide-react'

export default function CreateCompany() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    business_registration_number: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    country: 'Malawi',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    logo: null as File | null,
    cover_image: null as File | null,
    is_active: true,
  })

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('logo', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('cover_image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeLogo() {
    setData('logo', null)
    setLogoPreview(null)
  }

  function removeCover() {
    setData('cover_image', null)
    setCoverPreview(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/provider/companies')
  }

  return (
    <ProviderLayout title="Create Company">
      <Head title="Create Company" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/provider/companies">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Company</h1>
            <p className="text-muted-foreground mt-1">
              Add a new company or brand to your portfolio
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Elegant Events Ltd"
                  required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Brief description of your company..."
                  rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Registration Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_registration_number">Business Registration Number</Label>
                  <Input
                    id="business_registration_number"
                    value={data.business_registration_number}
                    onChange={(e) => setData('business_registration_number', e.target.value)}
                    placeholder="e.g., BN-12345"
                  />
                  {errors.business_registration_number && (
                    <p className="text-sm text-destructive">{errors.business_registration_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    value={data.tax_id}
                    onChange={(e) => setData('tax_id', e.target.value)}
                    placeholder="e.g., TPIN-123456"
                  />
                  {errors.tax_id && <p className="text-sm text-destructive">{errors.tax_id}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Where is your company based?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="e.g., 123 Main Street"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              {/* City, State, Country */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    placeholder="e.g., Lilongwe"
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Region</Label>
                  <Input
                    id="state"
                    value={data.state}
                    onChange={(e) => setData('state', e.target.value)}
                    placeholder="e.g., Central Region"
                  />
                  {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                  />
                  {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  placeholder="e.g., 12345"
                />
                {errors.postal_code && <p className="text-sm text-destructive">{errors.postal_code}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can clients reach your company?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+265 888 123 456"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="info@company.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={data.website}
                  onChange={(e) => setData('website', e.target.value)}
                  placeholder="https://www.company.com"
                />
                {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={data.social_links.facebook}
                    onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={data.social_links.twitter}
                    onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={data.social_links.instagram}
                    onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourcompany"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={data.social_links.linkedin}
                    onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Company Images</CardTitle>
              <CardDescription>Upload logo and cover image for your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Company Logo (Max 2MB)</Label>
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image (Max 5MB)</Label>
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload cover image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={processing} className="min-w-32">
              {processing ? 'Creating...' : 'Create Company'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/provider/companies">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  )
}
