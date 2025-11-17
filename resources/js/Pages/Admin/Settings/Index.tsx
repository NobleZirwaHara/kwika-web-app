import { Head, Link, useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Save, RefreshCw } from 'lucide-react'

interface Admin { id: number; name: string; email: string; admin_role: string }
interface Props {
  admin: Admin
  settings: Record<string, Record<string, { value: string; type: string; description: string }>>
  env: { app_name: string; app_env: string; app_debug: boolean }
}

export default function SettingsIndex({ admin, settings, env }: Props) {
  const { data, setData, post, processing } = useForm({ settings: {} })

  function handleClearCache() {
    if (confirm('Clear all application caches?')) {
      router.post(route('admin.settings.clear-cache'))
    }
  }

  return (
    <AdminLayout title="Settings" admin={admin}>
      <Head title="Settings" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage application configuration</p>
          </div>
          <Button onClick={handleClearCache} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment & Currency</TabsTrigger>
            <TabsTrigger value="email">Email & Notifications</TabsTrigger>
            <TabsTrigger value="seo">SEO & Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Application Name</Label>
                  <Input defaultValue={env.app_name} disabled />
                  <p className="text-sm text-muted-foreground">Configured in .env file</p>
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Input placeholder="Enter site description" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" placeholder="contact@example.com" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment gateways and currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Input placeholder="MWK" />
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email & Notification Settings</CardTitle>
                <CardDescription>
                  Configure email services. For API providers like Mailgun, use the Third Party Services module
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> For Mailgun, SendGrid, and other API-based email providers,
                    configure them in the <Link href={route('admin.third-party-services.index')} className="underline">Third Party Services</Link> module.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>SMTP Host</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input type="email" placeholder="noreply@example.com" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Integration</CardTitle>
                <CardDescription>Search engine optimization and third-party integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input placeholder="Site title for search engines" />
                </div>
                <div className="space-y-2">
                  <Label>Google Analytics ID</Label>
                  <Input placeholder="G-XXXXXXXXXX" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => post(route('admin.settings.update', data))} disabled={processing}>
            <Save className="h-4 w-4 mr-2" />
            {processing ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
