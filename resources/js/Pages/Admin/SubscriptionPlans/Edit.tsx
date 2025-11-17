import { Head, Link, useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
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
import { Badge } from '@/Components/ui/badge'
import { ArrowLeft, Save, Plus, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Admin {
  id: number
  name: string
  email: string
  admin_role: string
}

interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  description: string
  price: number
  billing_cycle: string
  features: string[]
  max_services: number | null
  max_images: number | null
  featured_listing: boolean
  priority_support: boolean
  analytics_access: boolean
  is_active: boolean
  sort_order: number
  subscribers_count: number
  created_at: string
  updated_at: string
}

interface Props {
  admin: Admin
  plan: SubscriptionPlan
}

export default function SubscriptionPlansEdit({ admin, plan }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: plan.name,
    description: plan.description || '',
    price: plan.price.toString(),
    billing_cycle: plan.billing_cycle,
    features: plan.features || [],
    max_services: plan.max_services?.toString() || '',
    max_images: plan.max_images?.toString() || '',
    featured_listing: plan.featured_listing,
    priority_support: plan.priority_support,
    analytics_access: plan.analytics_access,
    is_active: plan.is_active,
    sort_order: plan.sort_order.toString(),
  })

  const [featureInput, setFeatureInput] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(route('admin.subscription-plans.update', plan.id))
  }

  function addFeature() {
    if (featureInput.trim()) {
      setData('features', [...data.features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  function removeFeature(index: number) {
    setData('features', data.features.filter((_, i) => i !== index))
  }

  function handleToggleActive() {
    if (confirm(`Are you sure you want to ${plan.is_active ? 'deactivate' : 'activate'} this plan?`)) {
      router.put(route('admin.subscription-plans.toggle-active', plan.id))
    }
  }

  return (
    <AdminLayout title="Edit Subscription Plan" admin={admin}>
      <Head title={`Edit Plan: ${plan.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.subscription-plans.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Subscription Plan</h1>
              <p className="text-muted-foreground mt-1">
                Modify subscription tier settings
              </p>
            </div>
          </div>

          <Button
            variant={plan.is_active ? "outline" : "default"}
            onClick={handleToggleActive}
          >
            {plan.is_active ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate Plan
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate Plan
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="e.g., Starter, Professional, Enterprise"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe what this plan offers..."
                      rows={3}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (MWK) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_cycle">Billing Cycle *</Label>
                      <Select value={data.billing_cycle} onValueChange={(value) => setData('billing_cycle', value)}>
                        <SelectTrigger className={errors.billing_cycle ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.billing_cycle && (
                        <p className="text-sm text-red-600 mt-1">{errors.billing_cycle}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limits */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max_services">Max Services</Label>
                      <Input
                        id="max_services"
                        type="number"
                        min="0"
                        value={data.max_services}
                        onChange={(e) => setData('max_services', e.target.value)}
                        placeholder="Unlimited if blank"
                        className={errors.max_services ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank for unlimited
                      </p>
                      {errors.max_services && (
                        <p className="text-sm text-red-600 mt-1">{errors.max_services}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="max_images">Max Images</Label>
                      <Input
                        id="max_images"
                        type="number"
                        min="0"
                        value={data.max_images}
                        onChange={(e) => setData('max_images', e.target.value)}
                        placeholder="Unlimited if blank"
                        className={errors.max_images ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank for unlimited
                      </p>
                      {errors.max_images && (
                        <p className="text-sm text-red-600 mt-1">{errors.max_images}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Boolean Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured_listing"
                        checked={data.featured_listing}
                        onChange={(e) => setData('featured_listing', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured_listing" className="cursor-pointer">
                        Featured listing in search results
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="priority_support"
                        checked={data.priority_support}
                        onChange={(e) => setData('priority_support', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="priority_support" className="cursor-pointer">
                        Priority customer support
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="analytics_access"
                        checked={data.analytics_access}
                        onChange={(e) => setData('analytics_access', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="analytics_access" className="cursor-pointer">
                        Access to advanced analytics
                      </Label>
                    </div>
                  </div>

                  {/* Custom Features */}
                  <div>
                    <Label>Custom Features</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a custom feature..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {data.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeFeature(index)}
                          >
                            {feature} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sort_order">Display Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      min="0"
                      value={data.sort_order}
                      onChange={(e) => setData('sort_order', e.target.value)}
                      className={errors.sort_order ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower numbers appear first
                    </p>
                    {errors.sort_order && (
                      <p className="text-sm text-red-600 mt-1">{errors.sort_order}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Plan is active and available for subscription
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.subscription-plans.index')}>Cancel</Link>
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
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Status</span>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Subscribers</span>
                  <Badge variant="outline">{plan.subscribers_count}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">{plan.created_at}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <p className="font-medium">{plan.updated_at}</p>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            {plan.subscribers_count > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> This plan has {plan.subscribers_count} active {plan.subscribers_count === 1 ? 'subscriber' : 'subscribers'}. Changes may affect existing subscriptions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
