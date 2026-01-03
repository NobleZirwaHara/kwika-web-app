import { Head, Link, useForm } from '@inertiajs/react'
import { FormEvent, ChangeEvent, useState } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tag, Upload, X, ArrowLeft } from 'lucide-react'

interface Service {
  id: number
  name: string
  category: string | null
}

interface Category {
  id: number
  name: string
}

interface Promotion {
  id: number
  title: string
  description: string | null
  code: string | null
  type: string
  discount_value: number
  min_booking_amount: number | null
  max_discount_amount: number | null
  applicable_to: string
  service_ids: number[]
  category_ids: number[]
  start_date: string
  end_date: string
  usage_limit: number | null
  per_customer_limit: number
  is_active: boolean
  priority: number
  terms_conditions: string | null
  banner_image: string | null
}

interface Props {
  promotion: Promotion
  services: Service[]
  categories: Category[]
}

export default function EditPromotion({ promotion, services, categories }: Props) {
  const [bannerPreview, setBannerPreview] = useState<string | null>(promotion.banner_image)

  const { data, setData, post, processing, errors } = useForm({
    type: promotion.type,
    title: promotion.title,
    description: promotion.description || '',
    code: promotion.code || '',
    discount_value: promotion.discount_value,
    min_booking_amount: promotion.min_booking_amount || '',
    max_discount_amount: promotion.max_discount_amount || '',
    applicable_to: promotion.applicable_to,
    service_ids: promotion.service_ids,
    category_ids: promotion.category_ids,
    start_date: promotion.start_date,
    end_date: promotion.end_date,
    usage_limit: promotion.usage_limit || '',
    per_customer_limit: promotion.per_customer_limit,
    is_active: promotion.is_active,
    priority: promotion.priority,
    terms_conditions: promotion.terms_conditions || '',
    banner_image: null as File | null,
    _method: 'PUT',
  })

  function handleBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('banner_image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeBanner() {
    setData('banner_image', null)
    setBannerPreview(null)
  }

  function toggleService(serviceId: number) {
    const current = data.service_ids
    if (current.includes(serviceId)) {
      setData('service_ids', current.filter(id => id !== serviceId))
    } else {
      setData('service_ids', [...current, serviceId])
    }
  }

  function toggleCategory(categoryId: number) {
    const current = data.category_ids
    if (current.includes(categoryId)) {
      setData('category_ids', current.filter(id => id !== categoryId))
    } else {
      setData('category_ids', [...current, categoryId])
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post(`/provider/promotions/${promotion.id}`)
  }

  return (
    <ProviderLayout title="Edit Promotion">
      <Head title="Edit Promotion" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/provider/promotions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Promotion</h1>
            <p className="text-muted-foreground mt-1">Update your promotional offer details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Promotion Title *</Label>
                  <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code (optional)</Label>
                  <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Discount Details */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type *</Label>
                  <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                      <SelectItem value="bundle">Bundle Deal</SelectItem>
                      <SelectItem value="early_bird">Early Bird</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    {data.type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount (MWK) *'}
                  </Label>
                  <Input id="discount_value" type="number" step="0.01" value={data.discount_value} onChange={(e) => setData('discount_value', parseFloat(e.target.value))} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min_booking_amount">Min Booking Amount (MWK)</Label>
                  <Input id="min_booking_amount" type="number" step="0.01" value={data.min_booking_amount} onChange={(e) => setData('min_booking_amount', e.target.value)} />
                </div>

                {data.type === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="max_discount_amount">Max Discount Cap (MWK)</Label>
                    <Input id="max_discount_amount" type="number" step="0.01" value={data.max_discount_amount} onChange={(e) => setData('max_discount_amount', e.target.value)} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Applicable Services */}
          <Card>
            <CardHeader>
              <CardTitle>Applicable Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Apply To *</Label>
                <Select value={data.applicable_to} onValueChange={(value) => setData('applicable_to', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_services">All Services</SelectItem>
                    <SelectItem value="specific_services">Specific Services</SelectItem>
                    <SelectItem value="specific_categories">Specific Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {data.applicable_to === 'specific_services' && (
                <div className="space-y-2">
                  <Label>Select Services</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox id={`service-${service.id}`} checked={data.service_ids.includes(service.id)} onCheckedChange={() => toggleService(service.id)} />
                        <label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">
                          {service.name} {service.category && `(${service.category})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.applicable_to === 'specific_categories' && (
                <div className="space-y-2">
                  <Label>Select Categories</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category.id}`} checked={data.category_ids.includes(category.id)} onCheckedChange={() => toggleCategory(category.id)} />
                        <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validity & Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Validity & Usage Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Total Usage Limit</Label>
                  <Input id="usage_limit" type="number" value={data.usage_limit} onChange={(e) => setData('usage_limit', e.target.value)} placeholder="Unlimited" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="per_customer_limit">Per Customer Limit *</Label>
                  <Input id="per_customer_limit" type="number" value={data.per_customer_limit} onChange={(e) => setData('per_customer_limit', parseInt(e.target.value) || 1)} min="1" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
            </CardHeader>
            <CardContent>
              {bannerPreview ? (
                <div className="relative">
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeBanner}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="banner_image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Click to upload banner (max 5MB)</p>
                  <Input id="banner_image" type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Terms & Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                <Textarea id="terms_conditions" value={data.terms_conditions} onChange={(e) => setData('terms_conditions', e.target.value)} rows={4} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                <label htmlFor="is_active" className="text-sm font-medium">Promotion is active</label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={processing}>Update Promotion</Button>
            <Button variant="outline" asChild><Link href="/provider/promotions">Cancel</Link></Button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  )
}
