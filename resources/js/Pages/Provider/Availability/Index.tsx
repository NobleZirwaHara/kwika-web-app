import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Badge } from '@/Components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Checkbox } from '@/Components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Textarea } from '@/Components/ui/textarea'
import { Calendar, Plus, Trash2, Edit, Clock, Filter } from 'lucide-react'

interface AvailabilitySlot {
  id: number
  service_id: number | null
  service_name: string
  date: string
  start_time: string | null
  end_time: string | null
  is_available: boolean
  availability_type: 'available' | 'blocked' | 'booked'
  notes: string | null
}

interface Service {
  id: number
  name: string
}

interface Filters {
  start_date: string
  end_date: string
  service_id?: string
  type?: string
}

interface Props {
  availabilities: AvailabilitySlot[]
  services: Service[]
  filters: Filters
}

export default function AvailabilityIndex({ availabilities, services, filters }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])

  // Filter states
  const [startDate, setStartDate] = useState(filters.start_date)
  const [endDate, setEndDate] = useState(filters.end_date)
  const [serviceFilter, setServiceFilter] = useState(filters.service_id || 'all')
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all')

  // Form states
  const [formData, setFormData] = useState({
    service_id: 'none',
    date: '',
    start_time: '',
    end_time: '',
    availability_type: 'available',
    notes: '',
    recurring: false,
    recurrence_frequency: 'weekly',
    end_recurrence: '',
    days_of_week: [] as number[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleFilterChange() {
    router.get('/provider/availability', {
      start_date: startDate,
      end_date: endDate,
      service_id: serviceFilter !== 'all' ? serviceFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  function handleChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  function toggleDayOfWeek(day: number) {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day]
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const submitData: any = {
      date: formData.date,
      availability_type: formData.availability_type,
    }

    if (formData.service_id && formData.service_id !== 'none') submitData.service_id = formData.service_id
    if (formData.start_time) submitData.start_time = formData.start_time
    if (formData.end_time) submitData.end_time = formData.end_time
    if (formData.notes) submitData.notes = formData.notes

    if (formData.recurring) {
      submitData.recurring = true
      submitData.recurrence_frequency = formData.recurrence_frequency
      submitData.end_recurrence = formData.end_recurrence
      if (formData.recurrence_frequency === 'weekly') {
        submitData.days_of_week = formData.days_of_week
      }
    }

    if (editingSlot) {
      router.put(`/provider/availability/${editingSlot.id}`, submitData, {
        onError: (errors) => setErrors(errors),
        onSuccess: () => {
          setShowCreateDialog(false)
          setEditingSlot(null)
          resetForm()
        }
      })
    } else {
      router.post('/provider/availability', submitData, {
        onError: (errors) => setErrors(errors),
        onSuccess: () => {
          setShowCreateDialog(false)
          resetForm()
        }
      })
    }
  }

  function resetForm() {
    setFormData({
      service_id: '',
      date: '',
      start_time: '',
      end_time: '',
      availability_type: 'available',
      notes: '',
      recurring: false,
      recurrence_frequency: 'weekly',
      end_recurrence: '',
      days_of_week: [],
    })
    setErrors({})
  }

  function handleEdit(slot: AvailabilitySlot) {
    setEditingSlot(slot)
    setFormData({
      service_id: slot.service_id?.toString() || '',
      date: slot.date,
      start_time: slot.start_time || '',
      end_time: slot.end_time || '',
      availability_type: slot.availability_type,
      notes: slot.notes || '',
      recurring: false,
      recurrence_frequency: 'weekly',
      end_recurrence: '',
      days_of_week: [],
    })
    setShowCreateDialog(true)
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      router.delete(`/provider/availability/${id}`)
    }
  }

  function handleBulkDelete() {
    if (selectedSlots.length === 0) return

    if (confirm(`Delete ${selectedSlots.length} selected slot(s)?`)) {
      router.post('/provider/availability/bulk-delete', {
        ids: selectedSlots
      }, {
        onSuccess: () => setSelectedSlots([])
      })
    }
  }

  function toggleSelectSlot(id: number) {
    setSelectedSlots(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'available': return 'default'
      case 'blocked': return 'destructive'
      case 'booked': return 'secondary'
      default: return 'outline'
    }
  }

  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ]

  return (
    <ProviderLayout title="Availability">
      <Head title="Availability" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Availability Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your availability schedule
            </p>
          </div>
          <div className="flex gap-2">
            {selectedSlots.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedSlots.length})
              </Button>
            )}
            <Dialog open={showCreateDialog} onOpenChange={(open) => {
              setShowCreateDialog(open)
              if (!open) {
                setEditingSlot(null)
                resetForm()
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingSlot ? 'Edit' : 'Add'} Availability Slot</DialogTitle>
                  <DialogDescription>
                    Set your available time slots for services
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="service_id">Service (optional)</Label>
                      <Select value={formData.service_id} onValueChange={(value) => handleChange('service_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Services</SelectItem>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability_type">Type *</Label>
                      <Select value={formData.availability_type} onValueChange={(value) => handleChange('availability_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.availability_type && <p className="text-sm text-destructive">{errors.availability_type}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                    {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => handleChange('start_time', e.target.value)}
                      />
                      {errors.start_time && <p className="text-sm text-destructive">{errors.start_time}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => handleChange('end_time', e.target.value)}
                      />
                      {errors.end_time && <p className="text-sm text-destructive">{errors.end_time}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="Any additional notes..."
                      rows={3}
                    />
                  </div>

                  {!editingSlot && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="recurring"
                          checked={formData.recurring}
                          onCheckedChange={(checked) => handleChange('recurring', checked)}
                        />
                        <Label htmlFor="recurring" className="cursor-pointer">
                          Create recurring availability
                        </Label>
                      </div>

                      {formData.recurring && (
                        <div className="space-y-4 pl-6 border-l-2">
                          <div className="space-y-2">
                            <Label>Frequency</Label>
                            <Select value={formData.recurrence_frequency} onValueChange={(value) => handleChange('recurrence_frequency', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {formData.recurrence_frequency === 'weekly' && (
                            <div className="space-y-2">
                              <Label>Days of Week</Label>
                              <div className="flex gap-2">
                                {daysOfWeek.map((day) => (
                                  <Button
                                    key={day.value}
                                    type="button"
                                    variant={formData.days_of_week.includes(day.value) ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleDayOfWeek(day.value)}
                                  >
                                    {day.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="end_recurrence">End Recurrence Date</Label>
                            <Input
                              id="end_recurrence"
                              type="date"
                              value={formData.end_recurrence}
                              onChange={(e) => handleChange('end_recurrence', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSlot ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleFilterChange} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Slots */}
        {availabilities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availabilities.map((slot) => (
              <Card key={slot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedSlots.includes(slot.id)}
                          onCheckedChange={() => toggleSelectSlot(slot.id)}
                          disabled={slot.availability_type === 'booked'}
                        />
                        <CardTitle className="text-lg">
                          {new Date(slot.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getTypeColor(slot.availability_type)}>
                          {slot.availability_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="ml-2 font-medium">{slot.service_name}</span>
                    </div>

                    {(slot.start_time || slot.end_time) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {slot.start_time || '–'} - {slot.end_time || '–'}
                        </span>
                      </div>
                    )}

                    {slot.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {slot.notes}
                      </p>
                    )}

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(slot)}
                        disabled={slot.availability_type === 'booked'}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(slot.id)}
                        disabled={slot.availability_type === 'booked'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Availability Slots</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add your availability slots to let customers know when you're available for bookings.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
