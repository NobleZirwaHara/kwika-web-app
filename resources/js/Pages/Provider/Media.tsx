import { useState, ChangeEvent } from 'react'
import { useForm } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resizeImage, resizeImages, createImagePreview, processCroppedImage } from '@/lib/imageUtils'
import { ImageCropperDialog } from '@/Components/ImageCropperDialog'

interface Props {
  provider: {
    id: number
    business_name: string
    logo?: string | null
    cover_image?: string | null
    verification_status: 'pending' | 'approved' | 'rejected'
  }
  portfolio_images: Array<{
    id: number
    file_name: string
    file_path: string
    caption: string | null
    sort_order: number
  }>
}

export default function Media({ provider, portfolio_images }: Props) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    provider.logo ? `/storage/${provider.logo}` : null
  )
  const [coverPreview, setCoverPreview] = useState<string | null>(
    provider.cover_image ? `/storage/${provider.cover_image}` : null
  )

  // Cropper state
  const [logoCropperOpen, setLogoCropperOpen] = useState(false)
  const [coverCropperOpen, setCoverCropperOpen] = useState(false)
  const [logoImageSrc, setLogoImageSrc] = useState<string>('')
  const [coverImageSrc, setCoverImageSrc] = useState<string>('')
  const [logoFileName, setLogoFileName] = useState<string>('')
  const [coverFileName, setCoverFileName] = useState<string>('')

  const logoForm = useForm({
    logo: null as File | null,
  })

  const coverForm = useForm({
    cover_image: null as File | null,
  })

  const portfolioForm = useForm({
    portfolio_images: [] as File[],
  })

  const deleteForm = useForm({})

  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageSrc = await createImagePreview(file)
        setLogoImageSrc(imageSrc)
        setLogoFileName(file.name)
        setLogoCropperOpen(true)
      } catch (error) {
        console.error('Error loading logo:', error)
      }
    }
  }

  async function handleLogoCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, logoFileName, 'logo', 2)
      logoForm.setData('logo', processedFile)

      const preview = await createImagePreview(processedFile)
      setLogoPreview(preview)
    } catch (error) {
      console.error('Error processing cropped logo:', error)
    }
  }

  async function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageSrc = await createImagePreview(file)
        setCoverImageSrc(imageSrc)
        setCoverFileName(file.name)
        setCoverCropperOpen(true)
      } catch (error) {
        console.error('Error loading cover image:', error)
      }
    }
  }

  async function handleCoverCropComplete(croppedBlob: Blob) {
    try {
      const processedFile = await processCroppedImage(croppedBlob, coverFileName, 'cover', 5)
      coverForm.setData('cover_image', processedFile)

      const preview = await createImagePreview(processedFile)
      setCoverPreview(preview)
    } catch (error) {
      console.error('Error processing cropped cover:', error)
    }
  }

  async function handlePortfolioChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      try {
        const resizedFiles = await resizeImages(files, 'portfolio', 5)
        portfolioForm.setData('portfolio_images', resizedFiles)
      } catch (error) {
        console.error('Error resizing portfolio images:', error)
        portfolioForm.setData('portfolio_images', files)
      }
    }
  }

  function uploadLogo() {
    const formData = new FormData()
    if (logoForm.data.logo) {
      formData.append('logo', logoForm.data.logo)
    }

    logoForm.post('/provider/media/logo', {
      data: formData as any,
      forceFormData: true,
      onSuccess: () => {
        logoForm.reset()
      },
    })
  }

  function uploadCover() {
    const formData = new FormData()
    if (coverForm.data.cover_image) {
      formData.append('cover_image', coverForm.data.cover_image)
    }

    coverForm.post('/provider/media/cover', {
      data: formData as any,
      forceFormData: true,
      onSuccess: () => {
        coverForm.reset()
      },
    })
  }

  function uploadPortfolio() {
    const formData = new FormData()
    portfolioForm.data.portfolio_images.forEach((file, index) => {
      formData.append(`portfolio_images[${index}]`, file)
    })

    portfolioForm.post('/provider/media/portfolio', {
      data: formData as any,
      forceFormData: true,
      onSuccess: () => {
        portfolioForm.reset()
      },
    })
  }

  function deleteImage() {
    if (selectedImage) {
      deleteForm.delete(`/provider/media/${selectedImage}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedImage(null)
        },
      })
    }
  }

  return (
    <ProviderLayout title="Media Gallery" provider={provider}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Gallery</h2>
          <p className="text-muted-foreground mt-1">
            Manage your business logo, cover image, and portfolio gallery
          </p>
        </div>

        {/* Tabs for different media types */}
        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Gallery</TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Business Logo</CardTitle>
                <CardDescription>
                  Upload your business logo. Recommended: Square image, max 2MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-6">
                  {/* Logo Preview */}
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <div className="relative h-32 w-32 rounded-lg border-2 border-border overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview(provider.logo ? `/storage/${provider.logo}` : null)
                            logoForm.reset()
                          }}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground text-center px-2">
                          Upload Logo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload Instructions */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>Choose a clear, professional image that represents your brand</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Recommended size: 400x400 pixels (square)</li>
                          <li>Maximum file size: 2MB</li>
                          <li>Accepted formats: JPG, PNG, WebP</li>
                        </ul>
                      </div>
                    </div>

                    {logoForm.data.logo && (
                      <Button
                        onClick={uploadLogo}
                        disabled={logoForm.processing}
                      >
                        {logoForm.processing ? 'Uploading...' : 'Save Logo'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>
                  Upload a cover image for your profile. Recommended: 1920x600px, max 5MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Preview */}
                {coverPreview ? (
                  <div className="relative w-full aspect-[3/1] rounded-lg border-2 border-border overflow-hidden">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPreview(provider.cover_image ? `/storage/${provider.cover_image}` : null)
                        coverForm.reset()
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

                {coverForm.data.cover_image && (
                  <Button
                    onClick={uploadCover}
                    disabled={coverForm.processing}
                  >
                    {coverForm.processing ? 'Uploading...' : 'Save Cover Image'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Upload New Images */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Portfolio Images</CardTitle>
                <CardDescription>
                  Add images to showcase your work. Up to 10 images, max 5MB each
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Select multiple images at once
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioChange}
                    className="hidden"
                  />
                </label>

                {portfolioForm.data.portfolio_images.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {portfolioForm.data.portfolio_images.length} image(s) selected
                    </p>
                    <Button
                      onClick={uploadPortfolio}
                      disabled={portfolioForm.processing}
                    >
                      {portfolioForm.processing ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Your Portfolio ({portfolio_images.length})</CardTitle>
                <CardDescription>
                  Click on an image to delete it
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio_images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolio_images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square rounded-lg border-2 border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
                        onClick={() => {
                          setSelectedImage(image.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <img
                          src={`/storage/${image.file_path}`}
                          alt={image.caption || 'Portfolio image'}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <X className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No portfolio images yet</p>
                    <p className="text-sm mt-1">Upload images to showcase your work</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteImage}
              disabled={deleteForm.processing}
            >
              {deleteForm.processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logo Cropper Dialog */}
      <ImageCropperDialog
        open={logoCropperOpen}
        onOpenChange={setLogoCropperOpen}
        imageSrc={logoImageSrc}
        onCropComplete={handleLogoCropComplete}
        imageType="logo"
        title="Crop Logo"
      />

      {/* Cover Image Cropper Dialog */}
      <ImageCropperDialog
        open={coverCropperOpen}
        onOpenChange={setCoverCropperOpen}
        imageSrc={coverImageSrc}
        onCropComplete={handleCoverCropComplete}
        imageType="cover"
        title="Crop Cover Image"
      />
    </ProviderLayout>
  )
}
