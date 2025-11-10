import { Head, Link, useForm } from '@inertiajs/react'
import { FormEvent, ChangeEvent, useState } from 'react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Checkbox } from '@/Components/ui/checkbox'
import { FolderOpen, Upload, X, ArrowLeft, Building2 } from 'lucide-react'

interface Company {
  id: number
  name: string
  logo: string | null
}

interface ServiceCatalogue {
  id: number
  company_id: number
  name: string
  description: string | null
  cover_image: string | null
  display_order: number
  is_active: boolean
  is_featured: boolean
}

interface Props {
  catalogue: ServiceCatalogue
  companies: Company[]
}

export default function EditServiceCatalogue({ catalogue, companies }: Props) {
  const [coverPreview, setCoverPreview] = useState<string | null>(catalogue.cover_image)

  const { data, setData, post, processing, errors } = useForm({
    company_id: catalogue.company_id.toString(),
    name: catalogue.name,
    description: catalogue.description || '',
    cover_image: null as File | null,
    display_order: catalogue.display_order,
    is_active: catalogue.is_active,
    is_featured: catalogue.is_featured,
    _method: 'PUT',
  })

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('cover_image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeCover() {
    setData('cover_image', null)
    setCoverPreview(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post(`/provider/service-catalogues/${catalogue.id}`)
  }

  return (
    <ProviderLayout title="Edit Service Catalogue">
      <Head title="Edit Service Catalogue" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/provider/service-catalogues">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Service Catalogue</h1>
            <p className="text-muted-foreground mt-1">
              Update your service catalogue details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your service catalogue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company_id">Company *</Label>
                <Select
                  value={data.company_id}
                  onValueChange={(value) => setData('company_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        <div className="flex items-center gap-2">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-5 w-5 rounded object-cover" />
                          ) : (
                            <Building2 className="h-4 w-4" />
                          )}
                          <span>{company.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company_id && (
                  <p className="text-sm text-destructive">{errors.company_id}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Catalogue Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Wedding Packages, Corporate Events"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Brief description of this catalogue..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={data.display_order}
                  onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first
                </p>
                {errors.display_order && (
                  <p className="text-sm text-destructive">{errors.display_order}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Update the cover image for your catalogue (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeCover}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="cover_image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <Input
                      id="cover_image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                  </label>
                </div>
              )}
              {errors.cover_image && (
                <p className="text-sm text-destructive">{errors.cover_image}</p>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure catalogue visibility and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Is Active */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
                <p className="text-sm text-muted-foreground">
                  (Make this catalogue visible to customers)
                </p>
              </div>

              {/* Is Featured */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                />
                <label
                  htmlFor="is_featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Featured
                </label>
                <p className="text-sm text-muted-foreground">
                  (Highlight this catalogue on your profile)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={processing}>
              Update Service Catalogue
            </Button>
            <Button variant="outline" asChild>
              <Link href="/provider/service-catalogues">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  )
}
