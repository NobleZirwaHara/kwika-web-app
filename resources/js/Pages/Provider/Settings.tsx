import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Globe, Mail, MapPin, Phone, Hash } from 'lucide-react'

interface Props {
  provider: {
    id: number
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
    } | null
    logo?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
  }
  user: {
    name: string
    email: string
    phone: string
  }
}

export default function Settings({ provider, user }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    business_name: provider.business_name || '',
    description: provider.description || '',
    business_registration_number: provider.business_registration_number || '',
    location: provider.location || '',
    city: provider.city || '',
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

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    put('/provider/settings')
  }

  function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    passwordForm.put('/provider/settings/password', {
      onSuccess: () => {
        passwordForm.reset()
      },
    })
  }

  return (
    <ProviderLayout title="Profile Settings" provider={provider}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your business profile and account settings
          </p>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList>
            <TabsTrigger value="business">Business Information</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Business Information Tab */}
          <TabsContent value="business">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your business name and description
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">
                      Business Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="business_name"
                        value={data.business_name}
                        onChange={(e) => setData('business_name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {errors.business_name && (
                      <p className="text-sm text-destructive">{errors.business_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Business Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={5}
                      placeholder="Describe your business and services..."
                      required
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {data.description.length} characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_registration_number">
                      Business Registration Number
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="business_registration_number"
                        value={data.business_registration_number}
                        onChange={(e) => setData('business_registration_number', e.target.value)}
                        className="pl-10"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Location & Contact</CardTitle>
                  <CardDescription>
                    Where your business is located and how to reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Street Address <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={data.location}
                          onChange={(e) => setData('location', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        required
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city}</p>
                      )}
                    </div>
                  </div>

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
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
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
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        className="pl-10"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>
                    Connect your social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your account details (Contact support to update)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="mt-1 text-sm font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1 text-sm font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="mt-1 text-sm font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <p className="mt-1 text-sm font-medium">Service Provider</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordForm.data.current_password}
                      onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                    />
                    {passwordForm.errors.current_password && (
                      <p className="text-sm text-destructive">{passwordForm.errors.current_password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={passwordForm.data.password}
                      onChange={(e) => passwordForm.setData('password', e.target.value)}
                    />
                    {passwordForm.errors.password && (
                      <p className="text-sm text-destructive">{passwordForm.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={passwordForm.data.password_confirmation}
                      onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={passwordForm.processing}>
                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  )
}
