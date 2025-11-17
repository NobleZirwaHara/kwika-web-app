import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Checkbox } from '@/Components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'

interface Admin { id: number; name: string; email: string; admin_role: string }
interface Provider { id: number; business_name: string; slug: string }
interface Props { admin: Admin; providers: Provider[] }

export default function PromotionCreate({ admin, providers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    service_provider_id: '',
    type: 'percentage',
    title: '',
    description: '',
    code: '',
    discount_value: '',
    min_booking_amount: '',
    max_discount_amount: '',
    applicable_to: 'all',
    start_date: '',
    end_date: '',
    usage_limit: '',
    per_customer_limit: '',
    is_active: true,
    priority: '0',
    terms_conditions: '',
    banner_image: null as File | null,
  })

  return (
    <AdminLayout title="Create Promotion" admin={admin}>
      <Head title="Create Promotion" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href={route('admin.promotions.index')}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Promotion</h1>
            <p className="text-muted-foreground mt-1">Add a new promotional offer</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); post(route('admin.promotions.store')) }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider *</Label>
                  <Select value={data.service_provider_id} onValueChange={(v) => setData('service_provider_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>
                      {providers.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.business_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.service_provider_id && <p className="text-sm text-destructive">{errors.service_provider_id}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g., Summer Sale" />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Code *</Label>
                  <Input value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} placeholder="e.g., SAVE20" />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value *</Label>
                  <Input type="number" step="0.01" value={data.discount_value} onChange={(e) => setData('discount_value', e.target.value)} placeholder={data.type === 'percentage' ? '20' : '5000'} />
                  {errors.discount_value && <p className="text-sm text-destructive">{errors.discount_value}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Applicable To</Label>
                  <Select value={data.applicable_to} onValueChange={(v) => setData('applicable_to', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="specific_services">Specific Services</SelectItem>
                      <SelectItem value="specific_categories">Specific Categories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                  {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                  {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input type="number" value={data.usage_limit} onChange={(e) => setData('usage_limit', e.target.value)} placeholder="Unlimited if empty" />
                </div>
                <div className="space-y-2">
                  <Label>Per Customer Limit</Label>
                  <Input type="number" value={data.per_customer_limit} onChange={(e) => setData('per_customer_limit', e.target.value)} placeholder="Unlimited if empty" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-end gap-4">
            <Button asChild variant="outline" type="button"><Link href={route('admin.promotions.index')}>Cancel</Link></Button>
            <Button type="submit" disabled={processing}><Save className="h-4 w-4 mr-2" />{processing ? 'Creating...' : 'Create Promotion'}</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
