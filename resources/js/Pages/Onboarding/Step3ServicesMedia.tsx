import { useForm } from '@inertiajs/react'
import { FormEvent, useState, ChangeEvent } from 'react'
import WizardLayout from '@/Components/WizardLayout'
import { Button } from '@/Components/ui/button'
import { Label } from '@/Components/ui/label'
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  provider: {
    id: number
    logo: string | null
    cover_image: string | null
  }
  categories: Array<{
    id: number
    name: string
    slug: string
    icon: string | null
  }>
}

export default function Step3ServicesMedia({ provider, categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    category_ids: [] as number[],
    logo: null as File | null,
    cover_image: null as File | null,
    portfolio_images: [] as File[],
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(
    provider.logo ? `/storage/${provider.logo}` : null
  )
  const [coverPreview, setCoverPreview] = useState<string | null>(
    provider.cover_image ? `/storage/${provider.cover_image}` : null
  )
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([])

  function handleCategoryToggle(categoryId: number) {
    if (data.category_ids.includes(categoryId)) {
      setData('category_ids', data.category_ids.filter(id => id !== categoryId))
    } else {
      setData('category_ids', [...data.category_ids, categoryId])
    }
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setData('logo', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

  function handlePortfolioChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setData('portfolio_images', [...data.portfolio_images, ...files].slice(0, 10))

      // Create previews
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPortfolioPreviews(prev => [...prev, reader.result as string].slice(0, 10))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  function removePortfolioImage(index: number) {
    const newImages = data.portfolio_images.filter((_, i) => i !== index)
    const newPreviews = portfolioPreviews.filter((_, i) => i !== index)
    setData('portfolio_images', newImages)
    setPortfolioPreviews(newPreviews)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Create FormData to handle file uploads
    const formData = new FormData()

    data.category_ids.forEach(id => {
      formData.append('category_ids[]', id.toString())
    })

    if (data.logo) {
      formData.append('logo', data.logo)
    }

    if (data.cover_image) {
      formData.append('cover_image', data.cover_image)
    }

    data.portfolio_images.forEach((file, index) => {
      formData.append(`portfolio_images[${index}]`, file)
    })

    post('/onboarding/step3', {
      data: formData as any,
      forceFormData: true,
    })
  }

  return (
    <WizardLayout
      currentStep={3}
      title="Services & Media"
      description="Showcase your services and upload images"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Categories */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">
              Select Service Categories <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Choose the categories that best describe your services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => {
              const isChecked = data.category_ids.includes(category.id)
              return (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all",
                    isChecked
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div
                    className={cn(
                      "h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-all",
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
                    )}
                  >
                    {isChecked && <Check className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {errors.category_ids && <p className="text-sm text-destructive">{errors.category_ids}</p>}
        </div>

        {/* Logo Upload */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Business Logo</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your business logo (recommended: square, max 2MB)
            </p>
          </div>

          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative h-32 w-32 rounded-lg border-2 border-border overflow-hidden">
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview(null)
                    setData('logo', null)
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Cover Image</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a cover image for your profile (recommended: 1920x600px, max 5MB)
            </p>
          </div>

          <div>
            {coverPreview ? (
              <div className="relative w-full aspect-[3/1] rounded-lg border-2 border-border overflow-hidden">
                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview(null)
                    setData('cover_image', null)
                  }}
                  className="absolute top-4 right-4 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[3/1] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image}</p>}
        </div>

        {/* Portfolio Images */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Portfolio Images</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload up to 10 images showcasing your work (max 5MB each)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolioPreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg border-2 border-border overflow-hidden">
                <img src={preview} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePortfolioImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {portfolioPreviews.length < 10 && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">
                  Add Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePortfolioChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.portfolio_images && (
            <p className="text-sm text-destructive">{errors.portfolio_images}</p>
          )}
        </div>

        {/* General Errors */}
        {errors.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errors.error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={processing || data.category_ids.length === 0}
          >
            {processing ? 'Uploading...' : 'Continue to Review'}
          </Button>
        </div>
      </form>
    </WizardLayout>
  )
}
