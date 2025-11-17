import { useState } from 'react'
import AdminLayout from '@/Components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Badge } from '@/Components/ui/badge'
import { CheckCircle2, XCircle, Loader2, Play, Server, Edit2, Save, X } from 'lucide-react'
import axios from 'axios'

interface Service {
  id: string
  name: string
  description: string
  category: string
  configured: boolean
  config: Record<string, any>
}

interface TestResult {
  success: boolean
  message: string
  details: any
}

interface Props {
  services: Service[]
}

export default function ThirdPartyServices({ services }: Props) {
  const [testResults, setTestResults] = useState<Record<string, TestResult | null>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [emailForTest, setEmailForTest] = useState('')
  const [editingService, setEditingService] = useState<string | null>(null)
  const [editedConfig, setEditedConfig] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  const handleTest = async (serviceId: string, testType?: string) => {
    const testKey = testType ? `${serviceId}-${testType}` : serviceId
    setTesting((prev) => ({ ...prev, [testKey]: true }))
    setTestResults((prev) => ({ ...prev, [testKey]: null }))

    try {
      let response

      if (serviceId === 'supabase' && testType === 'realtime') {
        response = await axios.post('/admin/third-party-services/test-supabase-realtime')
      } else if (serviceId === 'supabase') {
        response = await axios.post('/admin/third-party-services/test-supabase')
      } else if (serviceId === 'mail') {
        if (!emailForTest) {
          setTestResults((prev) => ({
            ...prev,
            [testKey]: {
              success: false,
              message: 'Please enter an email address',
              details: {},
            },
          }))
          setTesting((prev) => ({ ...prev, [testKey]: false }))
          return
        }
        response = await axios.post('/admin/third-party-services/test-mail', {
          email: emailForTest,
        })
      }

      setTestResults((prev) => ({
        ...prev,
        [testKey]: response?.data || null,
      }))
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        [testKey]: {
          success: false,
          message: error.response?.data?.message || 'Failed to test service',
          details: error.response?.data?.details || { error: error.message },
        },
      }))
    } finally {
      setTesting((prev) => ({ ...prev, [testKey]: false }))
    }
  }

  const handleEdit = async (serviceId: string) => {
    try {
      const response = await axios.get(`/admin/third-party-services/${serviceId}/config`)
      if (response.data.success) {
        setEditedConfig(response.data.config)
        setEditingService(serviceId)
      }
    } catch (error: any) {
      console.error('Failed to fetch configuration:', error)
    }
  }

  const handleSave = async (serviceId: string) => {
    setSaving(true)
    try {
      const response = await axios.post('/admin/third-party-services/update-config', {
        service_id: serviceId,
        config: editedConfig,
      })

      if (response.data.success) {
        setEditingService(null)
        setEditedConfig({})
        // Refresh the page to show updated config
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Failed to update configuration:', error)
      alert('Failed to update configuration: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingService(null)
    setEditedConfig({})
  }

  const handleConfigChange = (key: string, value: string) => {
    setEditedConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <AdminLayout title="Third Party Services">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Third Party Services</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and test integrations with external services
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={service.configured ? 'default' : 'secondary'}>
                    {service.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                {/* Configuration Info */}
                <div className="rounded-lg bg-muted p-4 space-y-2 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Configuration</p>
                    {editingService === service.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSave(service.id)}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(service.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {editingService === service.id ? (
                    // Edit mode - show input fields
                    <div className="space-y-3">
                      {Object.entries(service.config).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <Label htmlFor={`${service.id}-${key}`} className="text-xs capitalize">
                            {key.replace(/_/g, ' ')}
                          </Label>
                          <Input
                            id={`${service.id}-${key}`}
                            type="text"
                            value={editedConfig[key] || ''}
                            onChange={(e) => handleConfigChange(key, e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // View mode - show read-only values
                    Object.entries(service.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Email Input for Mail Service */}
                {service.id === 'mail' && (
                  <div className="space-y-2 flex-shrink-0">
                    <Label htmlFor={`email-${service.id}`}>Test Email Address</Label>
                    <Input
                      id={`email-${service.id}`}
                      type="email"
                      placeholder="your@email.com"
                      value={emailForTest}
                      onChange={(e) => setEmailForTest(e.target.value)}
                    />
                  </div>
                )}

                {/* Spacer to push buttons to bottom */}
                <div className="flex-1" />

                {/* Test Buttons - Always at bottom */}
                <div className="space-y-4 flex-shrink-0">
                {service.id === 'supabase' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleTest(service.id)}
                      disabled={testing[service.id] || !service.configured}
                      className="w-full"
                    >
                      {testing[service.id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Test REST API
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleTest(service.id, 'realtime')}
                      disabled={testing[`${service.id}-realtime`] || !service.configured}
                      className="w-full"
                      variant="secondary"
                    >
                      {testing[`${service.id}-realtime`] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Test Realtime
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleTest(service.id)}
                    disabled={testing[service.id] || !service.configured}
                    className="w-full"
                  >
                    {testing[service.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                )}

                {/* Test Results - REST API */}
                {testResults[service.id] && (
                  <div
                    className={`rounded-lg border p-4 ${
                      testResults[service.id]?.success
                        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {testResults[service.id]?.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p
                          className={`font-medium ${
                            testResults[service.id]?.success
                              ? 'text-green-900 dark:text-green-100'
                              : 'text-red-900 dark:text-red-100'
                          }`}
                        >
                          {testResults[service.id]?.message}
                        </p>

                        {/* Details */}
                        {testResults[service.id]?.details &&
                          Object.keys(testResults[service.id]?.details || {}).length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                Details
                              </p>
                              <div className="rounded bg-black/5 dark:bg-white/5 p-3 font-mono text-xs overflow-x-auto">
                                <pre>
                                  {JSON.stringify(testResults[service.id]?.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Results - Realtime (Supabase only) */}
                {testResults[`${service.id}-realtime`] && (
                  <div
                    className={`rounded-lg border p-4 ${
                      testResults[`${service.id}-realtime`]?.success
                        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {testResults[`${service.id}-realtime`]?.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p
                          className={`font-medium ${
                            testResults[`${service.id}-realtime`]?.success
                              ? 'text-green-900 dark:text-green-100'
                              : 'text-red-900 dark:text-red-100'
                          }`}
                        >
                          {testResults[`${service.id}-realtime`]?.message}
                        </p>

                        {/* Details */}
                        {testResults[`${service.id}-realtime`]?.details &&
                          Object.keys(testResults[`${service.id}-realtime`]?.details || {}).length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                Details
                              </p>
                              <div className="rounded bg-black/5 dark:bg-white/5 p-3 font-mono text-xs overflow-x-auto">
                                <pre>
                                  {JSON.stringify(testResults[`${service.id}-realtime`]?.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
