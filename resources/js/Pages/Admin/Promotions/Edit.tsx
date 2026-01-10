import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Percent, Calendar, Building2, BarChart3 } from 'lucide-react'

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

interface Promotion {
  id: number
  service_provider_id: number
  type: string
  title: string
  description: string | null
  code: string
  discount_value: number
  min_booking_amount: number | null
  max_discount_amount: number | null
  applicable_to: string
  service_ids: number[] | null
  category_ids: number[] | null
  start_date: string
  end_date: string
  usage_limit: number | null
  usage_count: number
  per_customer_limit: number | null
  is_active: boolean
  priority: number | null
  terms_conditions: string | null
  banner_image: string | null
  created_at: string
  updated_at: string
  service_provider: {
    id: number
    business_name: string
    slug: string
  }
}

interface Props {
  admin: Admin
  promotion: Promotion
  providers: Provider[]
}

export default function PromotionEdit({ admin, promotion, providers }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    service_provider_id: promotion.service_provider_id.toString(),
    type: promotion.type,
    title: promotion.title,
    description: promotion.description || '',
    code: promotion.code,
    discount_value: promotion.discount_value.toString(),
    min_booking_amount: promotion.min_booking_amount?.toString() || '',
    max_discount_amount: promotion.max_discount_amount?.toString() || '',
    applicable_to: promotion.applicable_to,
    start_date: promotion.start_date,
    end_date: promotion.end_date,
    usage_limit: promotion.usage_limit?.toString() || '',
    per_customer_limit: promotion.per_customer_limit?.toString() || '',
    is_active: promotion.is_active,
    priority: promotion.priority?.toString() || '0',
    terms_conditions: promotion.terms_conditions || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(route('admin.promotions.update', promotion.id))
  }

  function getStatusBadge() {
    if (!promotion.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    const now = new Date()
    const start = new Date(promotion.start_date)
    const end = new Date(promotion.end_date)

    if (start > now) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">Upcoming</Badge>
    }
    if (end < now) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700">Expired</Badge>
    }
    if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700">Exhausted</Badge>
    }
    return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
  }

  return (
    <AdminLayout title={`Edit: ${promotion.title}`} admin={admin}>
      <Head title={`Edit: ${promotion.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href={route('admin.promotions.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Promotion</h1>
              <p className="text-muted-foreground mt-1">
                {promotion.title} ({promotion.code})
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Provider *</Label>
                      <Select value={data.service_provider_id} onValueChange={(v) => setData('service_provider_id', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.business_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service_provider_id && <p className="text-sm text-destructive">{errors.service_provider_id}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g., Summer Sale"
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Code *</Label>
                      <Input
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        placeholder="e.g., SAVE20"
                        className="uppercase"
                      />
                      {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Value *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={data.type === 'percentage' ? '100' : undefined}
                        value={data.discount_value}
                        onChange={(e) => setData('discount_value', e.target.value)}
                        placeholder={data.type === 'percentage' ? '20' : '5000'}
                      />
                      <p className="text-xs text-muted-foreground">
                        {data.type === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount in MWK'}
                      </p>
                      {errors.discount_value && <p className="text-sm text-destructive">{errors.discount_value}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Applicable To</Label>
                      <Select value={data.applicable_to} onValueChange={(v) => setData('applicable_to', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="specific_services">Specific Services</SelectItem>
                          <SelectItem value="specific_categories">Specific Categories</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.applicable_to && <p className="text-sm text-destructive">{errors.applicable_to}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Min Booking Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.min_booking_amount}
                        onChange={(e) => setData('min_booking_amount', e.target.value)}
                        placeholder="Minimum booking to qualify"
                      />
                      {errors.min_booking_amount && <p className="text-sm text-destructive">{errors.min_booking_amount}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Max Discount Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.max_discount_amount}
                        onChange={(e) => setData('max_discount_amount', e.target.value)}
                        placeholder="Cap for percentage discounts"
                      />
                      {errors.max_discount_amount && <p className="text-sm text-destructive">{errors.max_discount_amount}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={3}
                      placeholder="Describe the promotion..."
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Validity Period */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Validity Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                      />
                      {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData('end_date', e.target.value)}
                      />
                      {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Usage Limit</Label>
                      <Input
                        type="number"
                        min="1"
                        value={data.usage_limit}
                        onChange={(e) => setData('usage_limit', e.target.value)}
                        placeholder="Unlimited if empty"
                      />
                      <p className="text-xs text-muted-foreground">
                        Currently used: {promotion.usage_count} times
                      </p>
                      {errors.usage_limit && <p className="text-sm text-destructive">{errors.usage_limit}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Per Customer Limit</Label>
                      <Input
                        type="number"
                        min="1"
                        value={data.per_customer_limit}
                        onChange={(e) => setData('per_customer_limit', e.target.value)}
                        placeholder="Unlimited if empty"
                      />
                      {errors.per_customer_limit && <p className="text-sm text-destructive">{errors.per_customer_limit}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Input
                        type="number"
                        min="0"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">Higher priority promotions take precedence</p>
                      {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Terms & Conditions</Label>
                    <Textarea
                      value={data.terms_conditions}
                      onChange={(e) => setData('terms_conditions', e.target.value)}
                      rows={4}
                      placeholder="Enter terms and conditions..."
                    />
                    {errors.terms_conditions && <p className="text-sm text-destructive">{errors.terms_conditions}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4">
                <Button asChild variant="outline" type="button">
                  <Link href={route('admin.promotions.index')}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Times Used</p>
                  <p className="text-2xl font-bold">{promotion.usage_count}</p>
                </div>
                {promotion.usage_limit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Uses</p>
                    <p className="text-2xl font-bold">{Math.max(0, promotion.usage_limit - promotion.usage_count)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{promotion.service_provider.business_name}</p>
                <p className="text-sm text-muted-foreground">{promotion.service_provider.slug}</p>
              </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Promotion ID</p>
                  <p className="font-medium">#{promotion.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{promotion.created_at}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{promotion.updated_at}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
