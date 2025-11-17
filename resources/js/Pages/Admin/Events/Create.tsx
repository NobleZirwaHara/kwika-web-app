import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { Checkbox } from '@/Components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'

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

interface Props {
  admin: Admin
  providers: Provider[]
  categories: string[]
  types: string[]
}

export default function EventCreate({ admin, providers, categories, types }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    service_provider_id: '',
    title: '',
    description: '',
    type: types[0] || '',
    category: categories[0] || '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_country: '',
    venue_latitude: '',
    venue_longitude: '',
    venue_map_url: '',
    is_online: false,
    online_meeting_url: '',
    start_datetime: '',
    end_datetime: '',
    timezone: 'UTC',
    registration_start: '',
    registration_end: '',
    max_attendees: '',
    status: 'draft',
    is_featured: false,
    requires_approval: false,
    cover_image: null as File | null,
    terms_conditions: '',
    agenda: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('admin.events.store'))
  }

  return (
    <AdminLayout title="Create Event" admin={admin}>
      <Head title="Create Event" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href={route('admin.events.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Event</h1>
            <p className="text-muted-foreground mt-1">Add a new event to the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential event details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_provider_id">Service Provider *</Label>
                  <Select
                    value={data.service_provider_id}
                    onValueChange={(value) => setData('service_provider_id', value)}
                  >
                    <SelectTrigger>
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
                  {errors.service_provider_id && (
                    <p className="text-sm text-destructive">{errors.service_provider_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Event Type *</Label>
                  <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.length > 0 ? (
                        types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Seminar">Seminar</SelectItem>
                          <SelectItem value="Webinar">Webinar</SelectItem>
                          <SelectItem value="Festival">Festival</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Event description"
                  rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>Event schedule information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_datetime">Start Date & Time *</Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    value={data.start_datetime}
                    onChange={(e) => setData('start_datetime', e.target.value)}
                  />
                  {errors.start_datetime && <p className="text-sm text-destructive">{errors.start_datetime}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_datetime">End Date & Time *</Label>
                  <Input
                    id="end_datetime"
                    type="datetime-local"
                    value={data.end_datetime}
                    onChange={(e) => setData('end_datetime', e.target.value)}
                  />
                  {errors.end_datetime && <p className="text-sm text-destructive">{errors.end_datetime}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_start">Registration Start</Label>
                  <Input
                    id="registration_start"
                    type="datetime-local"
                    value={data.registration_start}
                    onChange={(e) => setData('registration_start', e.target.value)}
                  />
                  {errors.registration_start && <p className="text-sm text-destructive">{errors.registration_start}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_end">Registration End</Label>
                  <Input
                    id="registration_end"
                    type="datetime-local"
                    value={data.registration_end}
                    onChange={(e) => setData('registration_end', e.target.value)}
                  />
                  {errors.registration_end && <p className="text-sm text-destructive">{errors.registration_end}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={data.timezone}
                    onChange={(e) => setData('timezone', e.target.value)}
                    placeholder="e.g., UTC, America/New_York"
                  />
                  {errors.timezone && <p className="text-sm text-destructive">{errors.timezone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={data.max_attendees}
                    onChange={(e) => setData('max_attendees', e.target.value)}
                    placeholder="Leave empty for unlimited"
                  />
                  {errors.max_attendees && <p className="text-sm text-destructive">{errors.max_attendees}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
              <CardDescription>Event location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_online"
                  checked={data.is_online}
                  onCheckedChange={(checked) => setData('is_online', checked as boolean)}
                />
                <Label htmlFor="is_online">This is an online event</Label>
              </div>

              {data.is_online ? (
                <div className="space-y-2">
                  <Label htmlFor="online_meeting_url">Online Meeting URL *</Label>
                  <Input
                    id="online_meeting_url"
                    type="url"
                    value={data.online_meeting_url}
                    onChange={(e) => setData('online_meeting_url', e.target.value)}
                    placeholder="https://zoom.us/j/..."
                  />
                  {errors.online_meeting_url && <p className="text-sm text-destructive">{errors.online_meeting_url}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue_name">Venue Name *</Label>
                    <Input
                      id="venue_name"
                      value={data.venue_name}
                      onChange={(e) => setData('venue_name', e.target.value)}
                      placeholder="Enter venue name"
                    />
                    {errors.venue_name && <p className="text-sm text-destructive">{errors.venue_name}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue_address">Venue Address</Label>
                    <Input
                      id="venue_address"
                      value={data.venue_address}
                      onChange={(e) => setData('venue_address', e.target.value)}
                      placeholder="Street address"
                    />
                    {errors.venue_address && <p className="text-sm text-destructive">{errors.venue_address}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue_city">City</Label>
                    <Input
                      id="venue_city"
                      value={data.venue_city}
                      onChange={(e) => setData('venue_city', e.target.value)}
                      placeholder="City"
                    />
                    {errors.venue_city && <p className="text-sm text-destructive">{errors.venue_city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue_country">Country</Label>
                    <Input
                      id="venue_country"
                      value={data.venue_country}
                      onChange={(e) => setData('venue_country', e.target.value)}
                      placeholder="Country"
                    />
                    {errors.venue_country && <p className="text-sm text-destructive">{errors.venue_country}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue_map_url">Google Maps URL</Label>
                    <Input
                      id="venue_map_url"
                      type="url"
                      value={data.venue_map_url}
                      onChange={(e) => setData('venue_map_url', e.target.value)}
                      placeholder="https://maps.google.com/..."
                    />
                    {errors.venue_map_url && <p className="text-sm text-destructive">{errors.venue_map_url}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Event configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_image">Cover Image</Label>
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                  />
                  {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                  />
                  <Label htmlFor="is_featured">Feature this event</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires_approval"
                    checked={data.requires_approval}
                    onCheckedChange={(checked) => setData('requires_approval', checked as boolean)}
                  />
                  <Label htmlFor="requires_approval">Require approval for registrations</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button asChild variant="outline" type="button">
              <Link href={route('admin.events.index')}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
