import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useState, useRef } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface Provider {
  id: number
  business_name: string
  slug: string
}

interface Company {
  id: number
  service_provider_id: number
  name: string
  slug: string
  description: string | null
  business_registration_number: string | null
  tax_id: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  postal_code: string | null
  phone: string | null
  email: string | null
  website: string | null
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  } | null
  logo: string | null
  cover_image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
  catalogues: Array<{
    id: number
    name: string
  }>
}

interface Props {
  admin: Admin
  company: Company
  providers: Provider[]
}

export default function CompaniesEdit({ admin, company, providers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    service_provider_id: company.service_provider_id.toString(),
    name: company.name,
    description: company.description || '',
    business_registration_number: company.business_registration_number || '',
    tax_id: company.tax_id || '',
    address: company.address || '',
    city: company.city || '',
    state: company.state || '',
    country: company.country,
    postal_code: company.postal_code || '',
    phone: company.phone || '',
    email: company.email || '',
    website: company.website || '',
    social_links: {
      facebook: company.social_links?.facebook || '',
      twitter: company.social_links?.twitter || '',
      instagram: company.social_links?.instagram || '',
      linkedin: company.social_links?.linkedin || '',
    },
    is_active: company.is_active,
    logo: null as File | null,
    cover_image: null as File | null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [keepExistingLogo, setKeepExistingLogo] = useState(true)
  const [keepExistingCover, setKeepExistingCover] = useState(true)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('admin.companies.update', company.id))
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('logo', file)
      setKeepExistingLogo(false)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('cover_image', file)
      setKeepExistingCover(false)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function removeNewLogo() {
    setData('logo', null)
    setLogoPreview(null)
    setKeepExistingLogo(true)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  function removeNewCover() {
    setData('cover_image', null)
    setCoverPreview(null)
    setKeepExistingCover(true)
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  return (
    <AdminLayout title="Edit Company" admin={admin}>
      <Head title="Edit Company" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={route('admin.companies.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Company</h1>
            <p className="text-muted-foreground mt-1">Update company information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="service_provider_id">Service Provider *</Label>
                <Select value={data.service_provider_id} onValueChange={(v) => setData('service_provider_id', v)}>
                  <SelectTrigger className={errors.service_provider_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id.toString()}>
                        {provider.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service_provider_id && <p className="text-sm text-red-500 mt-1">{errors.service_provider_id}</p>}
              </div>

              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Acme Event Services Ltd"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Company overview and services..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_registration_number">Business Registration Number</Label>
                  <Input
                    id="business_registration_number"
                    value={data.business_registration_number}
                    onChange={(e) => setData('business_registration_number', e.target.value)}
                    placeholder="e.g., BN-123456"
                  />
                </div>

                <div>
                  <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
                  <Input
                    id="tax_id"
                    value={data.tax_id}
                    onChange={(e) => setData('tax_id', e.target.value)}
                    placeholder="e.g., TIN-7891011"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="e.g., 123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    placeholder="e.g., Lilongwe"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State / Region</Label>
                  <Input
                    id="state"
                    value={data.state}
                    onChange={(e) => setData('state', e.target.value)}
                    placeholder="e.g., Central Region"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                    className={errors.country ? 'border-red-500' : ''}
                  />
                  {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={data.postal_code}
                    onChange={(e) => setData('postal_code', e.target.value)}
                    placeholder="e.g., 12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="e.g., +265 123 456 789"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="e.g., info@company.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={data.website}
                  onChange={(e) => setData('website', e.target.value)}
                  placeholder="https://www.company.com"
                  className={errors.website ? 'border-red-500' : ''}
                />
                {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={data.social_links.facebook}
                    onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={data.social_links.twitter}
                    onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={data.social_links.instagram}
                    onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
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
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div>
                <Label>Company Logo</Label>
                <div className="mt-2 space-y-4">
                  {company.logo && keepExistingLogo && !logoPreview && (
                    <div className="relative inline-block">
                      <img src={company.logo} alt={company.name} className="w-32 h-32 object-cover rounded-lg border" />
                      <Badge className="absolute top-2 left-2">Current</Badge>
                    </div>
                  )}

                  {logoPreview && (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="New logo" className="w-32 h-32 object-cover rounded-lg border" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeNewLogo}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Badge className="absolute top-2 left-2">New</Badge>
                    </div>
                  )}

                  {!logoPreview && (
                    <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                      <label htmlFor="logo" className="cursor-pointer text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{company.logo ? 'Change' : 'Upload'}</span>
                      </label>
                    </div>
                  )}

                  <input ref={logoInputRef} type="file" id="logo" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Square image recommended. Max 2MB</p>
              </div>

              {/* Cover Image */}
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2 space-y-4">
                  {company.cover_image && keepExistingCover && !coverPreview && (
                    <div className="relative inline-block">
                      <img src={company.cover_image} alt={`${company.name} cover`} className="w-full max-w-md h-48 object-cover rounded-lg border" />
                      <Badge className="absolute top-2 left-2">Current</Badge>
                    </div>
                  )}

                  {coverPreview && (
                    <div className="relative inline-block">
                      <img src={coverPreview} alt="New cover" className="w-full max-w-md h-48 object-cover rounded-lg border" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeNewCover}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Badge className="absolute top-2 left-2">New</Badge>
                    </div>
                  )}

                  {!coverPreview && (
                    <div className="flex items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                      <label htmlFor="cover_image" className="cursor-pointer text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{company.cover_image ? 'Change' : 'Upload'}</span>
                      </label>
                    </div>
                  )}

                  <input ref={coverInputRef} type="file" id="cover_image" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Wide format (16:9) recommended. Max 4MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-gray-300" />
                <Label htmlFor="is_active">Active (company is visible and operational)</Label>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
                <p>Created: {company.created_at}</p>
                <p>Last Updated: {company.updated_at}</p>
                <p>Slug: {company.slug}</p>
                {company.catalogues.length > 0 && (
                  <div className="pt-2">
                    <p className="font-medium">Catalogues ({company.catalogues.length}):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {company.catalogues.map((cat) => (
                        <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={route('admin.companies.index')}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Updating...' : 'Update Company'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
