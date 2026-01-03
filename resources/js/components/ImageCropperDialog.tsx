import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Label } from '@/Components/ui/label'
import { Slider } from '@/Components/ui/slider'
import { ImageType } from '@/lib/imageUtils'

interface ImageCropperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
  aspectRatio?: number
  imageType?: ImageType
  title?: string
}

/**
 * Get recommended aspect ratio for different image types
 */
function getAspectRatio(type?: ImageType): number {
  switch (type) {
    case 'logo':
      return 1 // Square
    case 'cover':
      return 16 / 5 // Wide banner
    case 'gallery':
    case 'portfolio':
    case 'product':
    case 'service':
      return 1 // Square
    default:
      return 1 // Square by default
  }
}

/**
 * Reusable Image Cropper Dialog Component
 * Allows users to crop images before uploading
 */
export function ImageCropperDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio,
  imageType,
  title = 'Crop Image',
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const finalAspectRatio = aspectRatio || getAspectRatio(imageType)

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  async function handleCrop() {
    if (!croppedAreaPixels) return

    try {
      setIsCropping(true)
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
      onOpenChange(false)

      // Reset state
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsCropping(false)
    }
  }

  function handleCancel() {
    // Reset state
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Adjust the crop area and zoom level to select the portion of the image you want to use.
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Area */}
        <div className="relative h-96 w-full bg-muted rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={finalAspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        {/* Zoom Control */}
        <div className="space-y-2">
          <Label>Zoom</Label>
          <Slider
            value={[zoom]}
            onValueChange={(values) => setZoom(values[0])}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isCropping}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCrop} disabled={isCropping || !croppedAreaPixels}>
            {isCropping ? 'Cropping...' : 'Crop & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Create a cropped image from the source image and crop area
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  // Set canvas size to match the cropped area
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Canvas is empty'))
      }
    }, 'image/jpeg', 0.95)
  })
}

/**
 * Create an image element from a source
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })
}
