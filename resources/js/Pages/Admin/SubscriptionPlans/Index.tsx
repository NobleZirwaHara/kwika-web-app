import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Plus,
  SquarePen,
  CheckCircle,
  XCircle,
  Users,
  Trash2,
  GripVertical,
  DollarSign,
  Star,
  TrendingUp,
  BarChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
}

interface Stats {
  total: number
  active: number
  inactive: number
  total_subscribers: number
}

interface Props {
  admin: Admin
  plans: SubscriptionPlan[]
  stats: Stats
}

export default function SubscriptionPlansIndex({ admin, plans, stats }: Props) {
  function handleToggleActive(planId: number, currentStatus: boolean) {
    const message = currentStatus
      ? 'Are you sure you want to deactivate this plan?'
      : 'Are you sure you want to activate this plan?'

    if (confirm(message)) {
      router.put(route('admin.subscription-plans.toggle-active', planId), {}, {
        preserveScroll: true,
      })
    }
  }

  function handleDelete(planId: number, planName: string, subscribersCount: number) {
    if (subscribersCount > 0) {
      alert(`Cannot delete plan with ${subscribersCount} active subscriptions`)
      return
    }

    if (confirm(`Are you sure you want to permanently delete "${planName}"? This action cannot be undone.`)) {
      router.delete(route('admin.subscription-plans.destroy', planId), {
        preserveScroll: true,
      })
    }
  }

  function getBillingCycleLabel(cycle: string): string {
    const labels: Record<string, string> = {
      monthly: 'Monthly',
      yearly: 'Yearly',
      lifetime: 'Lifetime',
    }
    return labels[cycle] || cycle
  }

  return (
    <AdminLayout title="Subscription Plans" admin={admin}>
      <Head title="Subscription Plans" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-muted-foreground mt-1">
              Manage provider subscription tiers and pricing
            </p>
          </div>

          <Button asChild>
            <Link href={route('admin.subscription-plans.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.total_subscribers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <Card key={plan.id} className={cn(
                "relative overflow-hidden",
                !plan.is_active && "border-gray-200 bg-gray-50/30"
              )}>
                {/* Drag Handle */}
                <div className="absolute top-4 left-4 cursor-move text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>

                <CardContent className="p-6 pl-12">
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        {plan.is_active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {plan.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-b py-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          MWK {plan.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          / {getBillingCycleLabel(plan.billing_cycle).toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Features:</p>
                      <div className="space-y-1.5">
                        {plan.max_services !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Up to {plan.max_services} services</span>
                          </div>
                        )}
                        {plan.max_images !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Up to {plan.max_images} images</span>
                          </div>
                        )}
                        {plan.featured_listing && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span>Featured listing</span>
                          </div>
                        )}
                        {plan.priority_support && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>Priority support</span>
                          </div>
                        )}
                        {plan.analytics_access && (
                          <div className="flex items-center gap-2 text-sm">
                            <BarChart className="h-4 w-4 text-purple-600" />
                            <span>Analytics access</span>
                          </div>
                        )}
                        {plan.features && plan.features.length > 0 && plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subscribers */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{plan.subscribers_count}</span>
                      <span>active {plan.subscribers_count === 1 ? 'subscriber' : 'subscribers'}</span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={route('admin.subscription-plans.edit', plan.id)}>
                          <SquarePen className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(plan.id, plan.is_active)}
                        className="w-full"
                      >
                        {plan.is_active ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>

                      {admin.admin_role === 'super_admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(plan.id, plan.name, plan.subscribers_count)}
                          disabled={plan.subscribers_count > 0}
                          className="w-full col-span-2"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Plan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No subscription plans</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first subscription plan to get started
                </p>
                <Button asChild className="mt-4">
                  <Link href={route('admin.subscription-plans.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Text */}
        {plans.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <GripVertical className="h-4 w-4 mt-0.5" />
                <p>
                  <strong>Tip:</strong> Drag and drop plans to reorder them. The order determines how they appear to providers when choosing a subscription.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
